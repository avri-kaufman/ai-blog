import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

const Post = (props) => {
  const navigate = useNavigate();

  // Split the content into sentences
  let sentences = props.content.split(". ");

  // Abbreviate the content to the first two sentences
  let abbreviatedContent = sentences.slice(0, 2).join(". ");
  if (sentences.length > 2) {
    abbreviatedContent += "...";
  }

  return (
    <Card
      onClick={() => {
        navigate("post/" + props.id);
      }}
      style={{ margin: "16px", cursor: "pointer" }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {abbreviatedContent}
        </Typography>
        <Typography color="textSecondary">
          Category: {props.category_id}
        </Typography>
        <Typography color="textSecondary">
          Created at: {props.created_at}
        </Typography>
        <Typography color="textSecondary">
          Updated at: {props.updated_at}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
