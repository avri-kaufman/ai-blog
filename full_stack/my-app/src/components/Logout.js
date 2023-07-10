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
        this.setState({ loading: false }, () => {
          window.location.href = "/";
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
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
