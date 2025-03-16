import React from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  FormControl,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.setState({ loading: true }, () => {
      axios
        .post("/Login", { user: username, password })
        .then((response) => {
          this.setState({ loading: false }, () => {
            window.location.replace("/");
          });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ loading: false });
        });
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <Box
        id="login"
        display="flex"
        justifyContent="center"
        style={{ margin: '16px' }}
      >
        <Card>
          <CardContent>
            <Box width="100%">
              <Typography variant="h6" gutterBottom textAlign="center">
                Login
              </Typography>
              <form onSubmit={this.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        helperText="Please enter your name"
                        id="username"
                        label="Name"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <NavLink to="/forgot" activeClassName="active">
                        Forgot Username / Password
                      </NavLink>
                    </Box>
                  </Grid>
                  {loading && (
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                        <CircularProgress />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

export default Login;
