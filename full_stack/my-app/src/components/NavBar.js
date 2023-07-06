import React from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Input } from "@mui/material";
import axios from "axios";

class NavBar extends React.Component {
  state = { query: "", results: [] };

  search = async () => {
    const res = await axios.get("/search", {
      params: { q: this.state.query },
    });
    this.setState({ results: res.data });
  };

  render() {
    return (
      <AppBar position="static" style={{ backgroundColor: "#34515e" }}>
        <Toolbar>
          <Box display={{ xs: "block", md: "flex" }} width="100%">
            <Box flexGrow={1}>
              <Typography>
                <NavLink
                  to="/"
                  className="active"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "15px",
                  }}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/AboutTheBlog"
                  className="active"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "15px",
                  }}
                >
                  About
                </NavLink>

                <NavLink
                  to="/NewPost"
                  className="active"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "15px",
                  }}
                >
                  New Post
                </NavLink>

                <NavLink
                  to="/ContactMe"
                  className="active"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "15px",
                  }}
                >
                  Contact Me
                </NavLink>
              </Typography>
            </Box>
            <Box textAlign={{ xs: "left", md: "right" }}>
              <Button color="inherit">
                <NavLink
                  to="/Login"
                  className="active"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Login
                </NavLink>
              </Button>
              <Button color="inherit">
                <NavLink
                  to="/Logout"
                  className="active"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Logout
                </NavLink>
              </Button>
              <Button color="inherit">
                <NavLink
                  to="/SignUp"
                  className="active"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Sign up
                </NavLink>
              </Button>
              <Input
                type="search"
                value={this.state.query}
                onChange={(e) => this.setState({ query: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === "Enter") this.search();
                }}
                placeholder="Search posts..."
                style={{ color: "white" }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavBar;
