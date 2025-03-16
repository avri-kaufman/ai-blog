import React, { Component } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

class ContactMe extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      message: "",
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Here I would send the form data to the server
    console.log(this.state);
    this.setState({
      name: "",
      email: "",
      message: "",
    });
  };

  render() {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Box
          component="form"
          onSubmit={this.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          width="50%"
          md={{ width: "30%" }} 
          xs={{ width: "80%" }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Contact Me
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            value={this.state.name}
            onChange={this.handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="message"
            label="Message"
            name="message"
            multiline
            rows={4}
            value={this.state.message}
            onChange={this.handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    );
  }
}

export default ContactMe;
