import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const Comment = ({ comment }) => {
  return (
    <Card style={{ margin: "16px", padding: "8px" }}>
      <CardContent>
        <Typography variant="body1">{comment.content}</Typography>
        <Typography color="textSecondary">
          Commented by: {comment.author}
        </Typography>
        <Typography color="textSecondary">
          Created at: {comment.created_at}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Comment;
