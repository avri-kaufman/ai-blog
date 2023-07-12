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
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSignup = (event) => {
    event.preventDefault();

    axios
      .post("/SignUp", formData)
      .then(() => {
        // Handle successful sign-up
        // Redirect the user to the login page
        navigate("/Login");
      })
      .catch((error) => {
        // Handle sign-up error
        console.error(error);
      });
  };

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
            <form onSubmit={handleSignup}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="username"
                    fullWidth
                    helperText="Please enter your name"
                    id="username"
                    label="Name"
                    value={formData.username}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
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
};

export default SignUp;
