import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory, withRouter } from "react-router-dom";
import { GetBackendURL } from "./Helpers";
var history;

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = () => {
  var userid = document.getElementById("username");
  var pwd = document.getElementById("password");

  const requestData = {
    username: userid.value,
    password: pwd.value
  };

  fetch(GetBackendURL() + "/api/wfm/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(requestData)
  })
    .then(response => response.text())
    .then(response => {
      console.log(response);
      if (response != "fail") {
        localStorage.setItem("LoggedIn", "true");
        history.push("/calendar");
      } else {
        window.alert(response);
      }
    });
};

const SignIn = props => {
  const { classes } = props;
  history = useHistory();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={Login}
        >
          Sign In
        </Button>
      </div>
    </Container>
  );
};

export default withRouter(withStyles(useStyles)(SignIn));
