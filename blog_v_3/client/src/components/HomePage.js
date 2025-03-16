import React from "react";
import Header from "./Header.js";
//import Latest from "./Post/Latest.js";
import Popular from "./Post/Popular.js";
import "./App/App.css";
import Grid from "@mui/material/Grid";
import Posts from "./Post/Posts.js";

class HomePage extends React.Component {
  render() {
    return (
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Header />
        </Grid>
        <Grid item md={8}>
          <Posts />
        </Grid>
        <Grid item md={4}>
          {/* <Latest /> */}
          <Popular />
        </Grid>
      </Grid>
    );
  }
}

export default HomePage;
