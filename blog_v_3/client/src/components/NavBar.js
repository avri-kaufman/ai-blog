import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NavBar() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/login_status");
        if (response.data.status === "success") {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get("/search", {
        params: { q: query },
      });
      navigate("/search-results", { state: { results: res.data } }); // Pass res.data directly
    } catch (error) {
      console.error("Failed to search or navigate.", error);
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#34515e" }}>
      <Toolbar>
        <Box display={{ xs: "block", md: "flex" }} width="100%">
          <Box flexGrow={1}>
            <Typography>
              <NavLink
                to="/"
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
            {!isLoggedIn ? (
              <>
                <Button color="inherit">
                  <NavLink
                    to="/Login"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Login
                  </NavLink>
                </Button>
                <Button color="inherit">
                  <NavLink
                    to="/SignUp"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Sign up
                  </NavLink>
                </Button>
              </>
            ) : (
              <Button color="inherit">
                <NavLink
                  to="/Logout"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Logout
                </NavLink>
              </Button>
            )}
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setQuery(""); // clear the input box
                }
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

export default NavBar;
