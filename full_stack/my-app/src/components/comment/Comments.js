import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import Comment from "./Comment";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/posts/${postId}/comments`);
      setComments(res.data);
    };

    fetchComments();
  }, [postId]);

  return (
    <Card style={{ margin: "16px", padding: "8px" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Comments;
