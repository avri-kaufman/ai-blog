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
import axios from "axios";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSignup(event) {
    event.preventDefault();

    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("http://127.0.0.1:5000/SignUp", data)
      .then(() => {
        // Handle successful sign-up
        // Redirect the user to the home page
        window.location.replace("http://127.0.0.1:3000/Login");
      })
      .catch((error) => {
        // Handle sign-up error
        console.error(error);
      });
  }

  render() {
    return (
      <Box
        id="signup"
        display="flex"
        justifyContent="center"
        style={{ margin: "16px" }}
      >
        <Card>
          <CardContent>
            <Box width="100%">
              <Typography variant="h6" gutterBottom textAlign="center">
                Sign Up
              </Typography>
              <form onSubmit={this.handleSignup}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      name="username"
                      fullWidth
                      helperText="Please enter your name"
                      id="username"
                      label="Name"
                      value={this.state.username}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      fullWidth
                      helperText="Please enter your email"
                      id="email"
                      label="Email"
                      type="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="password"
                      fullWidth
                      id="password"
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Sign up
                    </Button>
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

export default SignUp;
