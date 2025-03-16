import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  Typography,
  Container,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Popular = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularPosts = async () => {
      const response = await axios.get("/popular_posts");
      setPopularPosts(response.data);
    };
    fetchPopularPosts();
  }, []);

  return (
    <Container style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Popular
      </Typography>
      <List>
        {popularPosts.map((post) => (
          <ListItem key={post.id}>
            <Typography variant="body1">
              {post.title}{" "}
              <IconButton
                onClick={() => {
                  navigate("post/" + post.id);
                }}
              >
                go to page
              </IconButton>
            </Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Popular;
