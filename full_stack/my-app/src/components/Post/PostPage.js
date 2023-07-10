import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${id}`);
      setPost(res.data);
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await axios.get("/check_login_status");
      if (res.data.status === "success") {
        setUserId(res.data.user_id);
      }
    };
    
    checkLoginStatus();
  }, []);

  if (!post) return null;

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

  const handleDelete = async (event) => {
    event.stopPropagation();
      
    try {
      await axios.delete(`/posts/${id}`);
      navigate("/"); // Navigates to the home page
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    // Add your edit logic here
  };

  return (
    <Card style={{ marginTop: "3%", marginLeft: "7%", marginRight: "7%" }}>
      {userId === post.user_id && (
        <>
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
        </>
      )}

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
