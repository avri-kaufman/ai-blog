import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Post = (props) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await axios.get("/check_login_status");
      if (res.data.status === "success") {
        setUserId(res.data.user_id);
      }
    };

    checkLoginStatus();
  }, []);

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
