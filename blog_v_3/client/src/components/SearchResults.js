import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, Container, Typography } from "@mui/material";

import Post from "./Post/Post.js";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <Container>
      <Card style={{ margin: "16px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Search Results
          </Typography>
        </CardContent>
      </Card>
      {results.length === 0 && <p>No posts found for your search.</p>}
      {results.map((item) => (
        <Container key={item.id} onClick={() => handlePostClick(item.id)}>
          <Post
            id={item.id}
            title={item.title}
            content={item.content}
            category_id={item.category_id}
            created_at={item.created_at}
            updated_at={item.updated_at}
            user_id={item.user_id}
          />
        </Container>
      ))}
    </Container>
  );
}

export default SearchResults;
