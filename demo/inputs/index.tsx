import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Grid,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {
    ActionMenuItem,
    ActionsMenu,
    Checkbox,
    IntegerNumberFormat,
    NumberField,
    PageTitle,
    Selector,
    TextField
} from "../../src";
import {EmailSenderField} from "../../src/Input/EmailSenderField";


export function Inputs() {
    return (
        <Container maxWidth="md">
            <PageTitle title="Inputs" gutterBottom />

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Text field</Typography>
                <Typography variant="body1" gutterBottom>
                    Wraps a Mui <code>TextField</code> that provides the current value as the first argument
                    to the <code>onChange</code> handler. The event is provided as the second argument.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    It also displays errors from HTML5 form validation and allows for a
                    custom <code>validate</code> function.
                </Typography>
                <TextFieldDemo/>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Checkbox</Typography>
                <Typography variant="body1" gutterBottom>
                    Wraps a Mui <code>Checkbox</code> in a <code>FormControlLabel</code>
                </Typography>
                <CheckboxDemo/>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Selector</Typography>
                <Typography variant="body1" gutterBottom>
                    Special case of Mui <code>TextField</code> that lets the user select from a list of options.
                </Typography>
                <SelectorDemo/>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Action Menu</Typography>
                <Typography variant="body1" gutterBottom>
                    Special case of Mui <code>Button</code> in combination with Mui <code>Menu</code> that lets the user click on a button or select from a list of options.
                </Typography>
                <ActionMenuDemo/>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Number field</Typography>
                <Typography variant="body1" gutterBottom>
                    Special case of Mui <code>TextField</code> that lets the user input a number in a certain
                    <code>Intl.NumberFormat</code>.
                </Typography>
                <NumberFieldDemo/>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>E-Mail fields</Typography>
                <Typography variant="body1" gutterBottom>
                    Special case of Mui <code>TextField</code> that validates aspects around e-mail addresses.
                </Typography>
                <EmailFieldsDemo/>
            </Box>

        </Container>
    );
}

function TextFieldDemo() {
    const [text, setText] = useState("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Text field"
                            value={text}
                            onChange={setText}
                        />
                        <TextField
                            label="E-mail field"
                            type="email"
                        />
                        <TextField
                            label="Required field"
                            required
                        />
                        <TextField
                            label="Pattern field"
                            required
                            inputProps={{
                                pattern: "[a-z][0-9]+"
                            }}
                            helperText={"Enter one lowercase letter followed by one or more digits"}
                        />
                        <TextField
                            label="Min/max length field"
                            required
                            inputProps={{
                                minLength: 3,
                                maxLength: 7
                            }}
                            helperText={"Enter from 3 to 7 chars."}
                        />
                        <TextField
                            label="Custom validation"
                            required
                            helperText="Please enter the value `foo`."
                            validate={value => value != "foo" ? "You have to enter `foo`." : undefined}
                        />
                        <TextField
                            label="Select"
                            select
                            required
                            helperText="Please choose an option"
                            validate={value => value != "option2" ? "You have to select `Option 2`." : undefined}
                        >
                            <MenuItem value="option1">Option 1</MenuItem>
                            <MenuItem value="option2">Option 2</MenuItem>
                            <MenuItem value="option3">Option 3</MenuItem>
                        </TextField>
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button color="primary" type="submit">
                        Submit
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}

function CheckboxDemo() {
    const [value, setValue] = useState(false);
    return (
        <Card>
            <CardContent>
                <Checkbox label="Checkbox" value={value} onChange={setValue}/>
            </CardContent>
        </Card>
    );
}

function SelectorDemo() {
    const [value, setValue] = useState("");
    return (
        <Card>
            <form onSubmit={e => e.preventDefault()}>
                <CardContent>
                    <Stack spacing={2}>
                        <Selector
                            label="Color"
                            value={value}
                            onChange={setValue}
                            options={[
                                {label: "Green", value: "green"},
                                {label: "Red", value: "red"},
                                {label: "Blue", value: "blue"}
                            ]}
                        />
                        <Selector
                            label="Required color"
                            required
                            options={[
                                {label: "Green", value: "green"},
                                {label: "Red", value: "red"},
                                {label: "Blue", value: "blue"}
                            ]}
                        />
                        <Selector
                            label="Validated color"
                            required
                            validate={value => value != "red" ? "You have to select `red`." : undefined}
                            options={[
                                {label: "Green", value: "green"},
                                {label: "Red", value: "red"},
                                {label: "Blue", value: "blue"}
                            ]}
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button type="submit" color="primary">
                        Submit
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}

function ActionMenuDemo(){

  const actions: ActionMenuItem[] = [];

  function computeActions(): ActionMenuItem[]
  {
    const printAction: ActionMenuItem = {
      label: "Print",
      onClick: () => window.print(),
    };
    const checkedOption: ActionMenuItem = {
      label: "Mark Checked",
      onClick: () => console.log("Mark Checked"),
    };
    const triggerNextStateOption: ActionMenuItem = {
      label: "Trigger Next State",
      onClick: () => console.log("Trigger Next State"),
    };
    const deleteOption: ActionMenuItem = {
      label: "Delete",
      onClick: () => console.log("Delete"),
    };
    const manualHandoverOption: ActionMenuItem = {
      label: "Manual Handover",
      onClick: () => console.log("Manual Handover"),
    };

    actions.push(printAction, checkedOption, triggerNextStateOption, deleteOption, manualHandoverOption);

    return actions;
  }


    return(
    <Card>
      <CardContent>
        <ActionsMenu actions={computeActions()} />
      </CardContent>
    </Card>
  );
}

const DefaultNumberFormat = new Intl.NumberFormat();
const EnglishNumberFormat = new Intl.NumberFormat("en-US");
const GermanNumberFormat = new Intl.NumberFormat("de-DE");

function NumberFieldDemo() {
    const [value, setValue] = useState<number | null>(1234.99);

    return (
        <Card>
            <CardHeader title="Number field"/>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <NumberField
                            label="Browser default format"
                            numberFormat={DefaultNumberFormat}
                            numberValue={value}
                            onChangeNumber={setValue}
                        />
                    </Grid>
                    <Grid item>
                        <NumberField
                            label="English format"
                            numberFormat={EnglishNumberFormat}
                            numberValue={value}
                            onChangeNumber={setValue}
                        />
                    </Grid>
                    <Grid item>
                        <NumberField
                            label="German format"
                            numberFormat={GermanNumberFormat}
                            numberValue={value}
                            onChangeNumber={setValue}
                        />
                    </Grid>
                    <Grid item>
                        <NumberField
                            label="Integer format"
                            numberFormat={IntegerNumberFormat}
                            numberValue={value}
                            onChangeNumber={setValue}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

function EmailFieldsDemo() {
    const [email, setEmail] = useState("");
    const [validSender, setValidSender] = useState(false);

    return (
        <Card>
            <CardHeader title="E-Mail fields"/>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <EmailSenderField value={email} onChange={setEmail} updateValidity={setValidSender} fullWidth />
                    </Grid>
                    {!validSender &&
                        <Grid item xs={12} sm={4}>
                            <Alert severity="error">The e-mail address you entered is not a valid sender e-mail address.</Alert>
                        </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    );
}