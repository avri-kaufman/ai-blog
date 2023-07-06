import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://127.0.0.1:5000/posts/${id}`);
      setPost(res.data);
    };

    fetchPost();
  }, [id]); // Depend on id to refetch data when id changes

  if (!post) return null; // Render nothing if post data is not yet fetched

  const postContent = post.content.split('\n\n').map((paragraph, i) => 
    <Typography variant="body1" gutterBottom key={i} style={{ marginBottom: '1em' }}>
      {paragraph.replace(/\n/g, ' ')}
    </Typography>
  );

  return (
    <Card style={{ margin: "16px" }}>
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
