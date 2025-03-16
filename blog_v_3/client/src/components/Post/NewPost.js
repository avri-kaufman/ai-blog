import React, { useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resp, setResp] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    addPost();
  };

  const addPost = () => {
    if (!title.trim() || !content.trim()) {
      setResp("Invalid post, please insert title and text.");
      setTimeout(() => {
        setResp(null);
      }, 4000); // Clear the message after 4 seconds
      return; // Early return
    }

    const url = "/posts";
    const data = { title, content };
    axios
      .post(url, data)
      .then((res) => {
        setResp("Success, new post added!");
        setTimeout(() => {
          setResp(null);
          navigate("/");
        }, 4000); // Clear the message after 4 seconds and navigate to home page
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setResp("You need to log in to add a new post.");
          setTimeout(() => {
            setResp(null);
            navigate("/Login");
          }, 4000); // Clear the message and navigate to login page after 4 seconds
        } else {
          setResp("Error: something went wrong, try again.");
          setTimeout(() => {
            setResp(null);
          }, 4000); // Clear the message after 4 seconds
        }
      });
  };

  return (
    <Box id="newPost" display="flex" justifyContent="center">
      <Box width="50%">
        <Box textAlign="center">
          <Typography variant="h3">New Post</Typography>
        </Box>
        <FormControl component="form" onSubmit={handleSubmit} fullWidth>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                helperText="Enter post title"
                id="title"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="content"
                label="Content"
                helperText="Enter post content"
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
              <Box textAlign="center">
                <Typography variant="body1">{resp}</Typography>
              </Box>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
    </Box>
  );
};

export default NewPost;
