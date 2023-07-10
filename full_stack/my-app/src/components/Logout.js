import React from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";

class Logout extends React.Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    this.handleLogout();
  }

  handleLogout = () => {
    axios
      .post("/Logout")
      .then(() => {
        // Handle successful logout
        setTimeout(() => {
          this.setState({ loading: false }, () => {
            window.location.href = "/";
          });
        }, 1300); 
      })
      .catch((error) => {
        // Handle logout error
        console.error(error);
        setTimeout(() => {
          this.setState({ loading: false });
        }, 1500); 
      });
  };

  render() {
    const { loading } = this.state;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {loading && <CircularProgress />}
      </div>
    );
  }
}

export default Logout;
