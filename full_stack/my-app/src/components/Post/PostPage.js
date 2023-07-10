import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${id}`);
      setPost(res.data);
    };

    fetchPost();
  }, [id]); // Depend on id to refetch data when id changes

  if (!post) return null; // Render nothing if post data is not yet fetched

  const postContent = post.content.split("\n\n").map((paragraph, i) => (
    <Typography
      variant="body1"
      gutterBottom
      key={i}
      style={{ marginBottom: "1em" }}
    >
      {paragraph.replace(/\n/g, " ")}
    </Typography>
  ));

  const handleDelete = async () => {
    // Add your delete logic here
    // Example: await axios.delete(`/posts/${id}`);
  };

  const handleEdit = () => {
    // Add your edit logic here
    // For example, you might want to redirect to an edit page for the post
  };

  return (
    <Card style={{ marginTop: "3%", marginLeft: "7%", marginRight: "7%" }}>
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
          {post.title}
        </Typography>
        {postContent}
        <Typography color="textSecondary">
          Category: {post.category_id}
        </Typography>
        <Typography color="textSecondary">
          Created at: {post.created_at}
        </Typography>
        <Typography color="textSecondary">
          Updated at: {post.updated_at}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostPage;
