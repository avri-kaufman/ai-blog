import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Comments from "../comment/Comments";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [author, setAuthor] = useState(null);
  const [categoryName, setCategoryName] = useState(""); // Added
  const [views, setViews] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const views = await axios.post(`/increment_view/${id}`);
      console.log(views);
      setViews(views.data); // Set the views count from the response
      const res = await axios.get(`/posts/${id}`);
      setPost(res.data);
      setAuthor(res.data.author);
      setCategoryName(res.data.category_name); // Set the category name
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await axios.get("/login_status");
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
    navigate(`/edit-post/${id}`);
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
        <Typography color="textSecondary">Written by: {author}</Typography>
        {postContent}
        <Typography color="textSecondary">Category: {categoryName}</Typography>
        <Typography color="textSecondary">
          Created at: {post.created_at}
        </Typography>
        <Typography color="textSecondary">
          Updated at: {post.updated_at}
        </Typography>
        <Typography color="textSecondary">Views: {views}</Typography>
        <Comments postId={id} />
      </CardContent>
    </Card>
  );
};

export default PostPage;
