import React from "react";
import { Button } from "@mui/material";
import axios from "axios";

class Logout extends React.Component {
  handleLogout = () => {
    axios
      .post("/Logout")
      .then(() => {
        // Handle successful logout
        // Redirect the user to the login page
        window.location.href = "/Login";
      })
      .catch((error) => {
        // Handle logout error
        console.error(error);
      });
  };

  render() {
    return (
      <Button variant="contained" color="primary" onClick={this.handleLogout}>
        Logout
      </Button>
    );
  }
}

export default Logout;
