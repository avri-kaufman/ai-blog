import React, { Component } from "react";
import { Card, CardContent, Typography } from "@mui/material";

class Header extends Component {
  render() {
    return (
      <Card style={{ margin: "16px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Simplifying AI and Machine Learning: From Concepts to Applications
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default Header;
