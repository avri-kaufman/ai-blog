import React from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    axios
      .post(
        "http://127.0.0.1:5000/Login",
        { user: username, password },
        { withCredentials: true }
      )
      .then((response) => {
        // Handle successful login
        console.log(response.data);
        window.location.replace("http://127.0.0.1:3000/");
      })
      .catch((error) => {
        // Handle login error
        console.error(error);
      });
  };

  render() {
    return (
      <Box
        id="login"
        display="flex"
        justifyContent="center"
        style={{ margin: "16px" }}
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
                    <TextField
                      fullWidth
                      helperText="Please enter your name"
                      id="username"
                      label="Name"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
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
