import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Post = (props) => {
  const navigate = useNavigate();

  // Split the content into sentences
  let sentences = props.content.split(". ");

  // Abbreviate the content to the first two sentences
  let abbreviatedContent = sentences.slice(0, 2).join(". ");
  if (sentences.length > 2) {
    abbreviatedContent += "...";
  }

  const handleDelete = async () => {
    // Add your delete logic here
    // Example: await axios.delete(`/posts/${id}`);
  };

  const handleEdit = () => {
    // Add your edit logic here
    // For example, you might want to redirect to an edit page for the post
  };

  return (
    <Card
      onClick={() => {
        navigate("post/" + props.id);
      }}
      style={{ margin: "16px", cursor: "pointer" }}
    >
      <IconButton
        aria-label="delete"
        size="large"
        onClick={handleDelete}
        style={{ float: "right" }}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        aria-label="edit"
        size="large"
        onClick={handleEdit}
        style={{ float: "right" }}
      >
        <EditIcon />
      </IconButton>
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
