import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
	Autocomplete,
	AutocompleteRenderOptionState,
	CircularProgress,
	debounce,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import * as React from "react";
import {Fragment, HTMLAttributes, ReactNode, SyntheticEvent, useEffect, useMemo, useState} from "react";
import {useAsync} from "react-async-hook";
import {ErrorAlert} from "../ErrorAlert";
import {CloseIcon, SearchIcon} from "../icons";
import {TextField} from "../Input";
import {tokenize, tokensEqual} from "./tokens";

export interface GlobalSearchDialogProps<T> {
	/** Whether the dialog is open. */
	open: boolean;

	/** Called when the dialog wants to close (Escape, backdrop click, close/back button). */
	onClose: () => void;

	/**
	 * Performs the search for the given whitespace-separated tokens. Invoked debounced and only when the
	 * input has at least `minQueryLength` characters.
	 */
	search: (tokens: string[]) => Promise<T[]>;

	/** Called when the user selects a search result. The component clears its input and closes itself. */
	onSelect: (option: T) => void;

	/** Returns the text label of an option (used by the Autocomplete for keyboard selection). */
	getOptionLabel: (option: T) => string;

	/** Renders a result option. `state.inputValue` can be passed to `Highlight` to emphasize matches. */
	renderOption: (props: HTMLAttributes<HTMLLIElement>, option: T, state: AutocompleteRenderOptionState) => ReactNode;

	/** Groups options under the returned heading. */
	groupBy?: (option: T) => string;

	/** The dialog title. */
	title: ReactNode;

	/** The label of the search input field. */
	placeholder: string;

	/** Helper text shown below the search input field. */
	helperText?: ReactNode;

	/** Text shown when a search returned no results. */
	noOptionsText?: ReactNode;

	/** Text shown while a search is in progress. */
	loadingText?: ReactNode;

	/** aria-label of the close button. */
	closeLabel?: string;

	/** aria-label of the back button (fullscreen mode). */
	backLabel?: string;

	/** aria-label of the clear button in the search input field. */
	clearLabel?: string;

	/** Minimum input length before a search fires. Defaults to 2. */
	minQueryLength?: number;

	/** Debounce delay in milliseconds before a search fires. Defaults to 500. */
	debounceMs?: number;
}

/**
 * A global search dialog around a MUI Autocomplete with server-side filtering.
 *
 * The component owns the app-agnostic plumbing: responsive dialog shell, input tokenization, debouncing,
 * minimum query length and a stale-result guard. The actual search, result rendering and selection handling
 * are provided via props.
 */
export function GlobalSearchDialog<T>(props: Readonly<GlobalSearchDialogProps<T>>) {
	const {
		open,
		onClose,
		search,
		onSelect,
		getOptionLabel,
		renderOption,
		groupBy,
		title,
		placeholder,
		helperText,
		noOptionsText,
		loadingText,
		closeLabel,
		backLabel,
		clearLabel,
		minQueryLength = 2,
		debounceMs = 500,
	} = props;

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const [inputValue, setInputValue] = useState("");
	const [filter, setFilter] = useState<string[]>();

	// Debounce only the search trigger; the input text updates immediately so typing stays responsive. Queries
	// shorter than minQueryLength clear the filter instead of firing.
	const debouncedSetFilter = useMemo(
		() =>
			debounce(
				(value: string) => setFilter(value.trim().length >= minQueryLength ? tokenize(value) : undefined),
				debounceMs,
			),
		[minQueryLength, debounceMs],
	);

	// Cancel a pending debounced call when the component unmounts (or when a changed minQueryLength/debounceMs
	// recreates the debouncer), so a late timer never updates state on an unmounted component.
	useEffect(() => () => debouncedSetFilter.clear(), [debouncedSetFilter]);

	const handleInputChange = (event: SyntheticEvent, value: string, reason: string) => {
		// Ignore the input reset MUI fires when an option is selected — we close anyway.
		if (reason === "reset") {
			return;
		}
		setInputValue(value);
		debouncedSetFilter(value);
	};

	const handleClear = () => {
		debouncedSetFilter.clear();
		setInputValue("");
		setFilter(undefined);
	};

	const hasQuery = Boolean(filter && filter.length > 0);

	// The result carries the filter that produced it: useAsync keeps the previous result (and only flips
	// loading in an effect, after a render) when the filter changes, so without the identity check below the
	// previous query's results would flash for a render after the debounce commits.
	const {loading, error, result: searchResult} = useAsync(async () => {
		if (filter && filter.length > 0) {
			return {filter, results: await search(filter)};
		}
	}, [filter]);

	// Only expose options once the committed filter matches the current input and the settled result belongs
	// to that filter. Otherwise, because open stays true and filterOptions/autoHighlight are on, a quick Enter
	// within the debounce window could select a stale, previous-query result — or stale options could flash.
	const filterIsCurrent = Boolean(filter) && tokensEqual(filter!, tokenize(inputValue));
	const resultIsCurrent = searchResult !== undefined && searchResult.filter === filter;
	const options = filterIsCurrent && !loading && resultIsCurrent ? searchResult.results : [];

	// Report "searching" through the whole debounce + fetch window — not just while the request is in
	// flight — so the popup never shows a premature "no results" (or stale options) between keystrokes.
	const searching = inputValue.trim().length >= minQueryLength
		&& (!filterIsCurrent || loading || (!resultIsCurrent && !error));

	const handleClose = () => {
		debouncedSetFilter.clear();
		setInputValue("");
		setFilter(undefined);
		onClose();
	};

	const handleValueChange = (event: SyntheticEvent, value: T | null) => {
		if (value) {
			handleClose();
			onSelect(value);
		}
	};

	// The results popup is force-open whenever there's a query, which makes the Autocomplete swallow Escape;
	// react to its close-on-escape ourselves and close the whole dialog.
	const handleAutocompleteClose = (event: SyntheticEvent, reason: string) => {
		if (reason === "escape") {
			handleClose();
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
			<DialogTitle
				component="div"
				sx={{display: "flex", alignItems: "center", gap: 1}}
			>
				{fullScreen && (
					<IconButton edge="start" onClick={handleClose} aria-label={backLabel}>
						<ArrowBackIcon />
					</IconButton>
				)}
				<Typography variant="h6" sx={{flex: 1}}>
					{title}
				</Typography>
				{!fullScreen && (
					<IconButton edge="end" onClick={handleClose} aria-label={closeLabel}>
						<CloseIcon />
					</IconButton>
				)}
			</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{pt: 1}}>
					<Autocomplete
						fullWidth
						open={hasQuery}
						disablePortal
						inputValue={inputValue}
						onInputChange={handleInputChange}
						onChange={handleValueChange}
						onClose={handleAutocompleteClose}
						options={options}
						groupBy={groupBy}
						getOptionLabel={getOptionLabel}
						filterOptions={options => options}
						noOptionsText={noOptionsText}
						loadingText={loadingText}
						loading={searching}
						handleHomeEndKeys={false}
						autoHighlight
						slotProps={{
							// Render the results inline inside the dialog (full content width) instead of MUI's
							// floating portal popper, which otherwise looks like a detached, narrower card.
							popper: {
								sx: {
									position: "static !important",
									width: "100% !important",
									transform: "none !important",
								},
							},
							paper: {
								elevation: 0,
							},
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label={placeholder}
								helperText={helperText}
								autoFocus
								variant="outlined"
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
									endAdornment: (
										<Fragment>
											{searching ? <CircularProgress color="inherit" size={20} /> : null}
											{inputValue && (
												<IconButton
													size="small"
													onClick={handleClear}
													aria-label={clearLabel}
												>
													<CloseIcon fontSize="small" />
												</IconButton>
											)}
										</Fragment>
									),
								}}
								fullWidth
							/>
						)}
						renderOption={renderOption}
					/>
					<ErrorAlert error={error} />
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
