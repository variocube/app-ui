import {Button, Grid, Stack, Typography} from "@mui/material";
import {ReactElement} from "react";
import {useNavigate} from "react-router";
import {NotFoundSvg} from "./NotFoundSvg";
import {ContainerLayout} from "../container";
import React from "react";

interface NotFoundProps {
  svg?: ReactElement;
  errorMsg?: string;
  pathMsg?: string;
  backToHomeMsg?: string;
}

export function NotFound(props: NotFoundProps) {
  const {svg, errorMsg,pathMsg, backToHomeMsg} = props;

  const navigate = useNavigate();
  const path = window.location.pathname;

  const defaultErrorMsg = "404: Not Found";
  const defaultPathMsg = "We could not find the following path:";
  const defaultBackToHomeMsg = "Back to Home";

  return (
    <ContainerLayout>
      <Stack
        direction="column"
        alignItems="center"
      >
        {!svg &&
            <NotFoundSvg style={{ width: '100%', maxHeight: 300 }} />
        }
        {svg &&
          svg
        }
      </Stack>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">{errorMsg != "" ? errorMsg : defaultErrorMsg}</Typography>
          <Typography variant="body1" align="center">{pathMsg != "" ? pathMsg : defaultPathMsg}</Typography>
          <Typography variant="body1" align="center">{path}</Typography>

        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            <Button onClick={(_e) => navigate("/")}>{backToHomeMsg != "" ? backToHomeMsg : defaultBackToHomeMsg}</Button>
          </Typography>
        </Grid>
      </Grid>
    </ContainerLayout>
  );
}
