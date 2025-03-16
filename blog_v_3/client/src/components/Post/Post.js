import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Post = (props) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(""); // added

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await axios.get("/login_status");
      if (res.data.status === "success") {
        setUserId(res.data.user_id);
      }
    };

    const getUserById = async () => {
      try {
        const res = await axios.get(`/user/${props.user_id}`);
        if (res.status === 200) {
          setUserName(res.data.username); // Update username state
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkLoginStatus();
    getUserById(); // call this function
  }, [props.user_id]); // added props.user_id to the dependency array

  let sentences = props.content.split(". ");
  let abbreviatedContent = sentences.slice(0, 2).join(". ");
  if (sentences.length > 2) {
    abbreviatedContent += "...";
  }

  const handleDelete = async (event) => {
    event.stopPropagation();

    try {
      await axios.delete(`/posts/${props.id}`);
      props.onDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    navigate(`/edit-post/${props.id}`);
  };

  return (
    <Card
      onClick={() => {
        navigate("post/" + props.id);
      }}
      style={{ margin: "16px", cursor: "pointer" }}
    >
      <CardContent>
        {userId === props.user_id && (
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
        <Typography variant="h6" gutterBottom>
          {props.title}
        </Typography>
        <Typography color="textSecondary">Written by: {userName}</Typography>
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
