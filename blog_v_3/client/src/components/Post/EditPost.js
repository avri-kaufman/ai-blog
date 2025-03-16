import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resp, setResp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
    };

    fetchPost();
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    editPost();
  };

  const editPost = () => {
    if (!title.trim() || !content.trim()) {
      setResp("Invalid post, please insert title and text.");
      setTimeout(() => {
        setResp(null);
      }, 4000); // Clear the message after 4 seconds
      return; // Early return
    }

    const url = `/posts/${id}`;
    const data = { title, content };
    axios
      .put(url, data)
      .then((res) => {
        setResp("Success, post updated!");
        setTimeout(() => {
          setResp(null);
          navigate(`/post/${id}`);
        }, 4000); // Clear the message after 4 seconds and navigate to post page
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setResp("You need to log in to edit a post.");
          setTimeout(() => {
            setResp(null);
            navigate("/Login");
          }, 4000); // Clear the message and navigate to login page after 4 seconds
        } else if (err.response && err.response.status === 403) {
          setResp("You are not authorized to edit this post.");
          setTimeout(() => {
            setResp(null);
          }, 4000); // Clear the message after 4 seconds
        } else {
          setResp("Error: something went wrong, try again.");
          setTimeout(() => {
            setResp(null);
          }, 4000); // Clear the message after 4 seconds
        }
      });
  };
  return (
    <Box id="editPost" display="flex" justifyContent="center">
      <Box width="50%">
        <Box textAlign="center">
          <Typography variant="h3">Edit Post</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="title">Title</InputLabel>
                <OutlinedInput
                  id="title"
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="content">Content</InputLabel>
                <OutlinedInput
                  id="content"
                  label="Content"
                  multiline
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Update
              </Button>
              <Box textAlign="center">
                {resp && <Typography variant="body1">{resp}</Typography>}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default EditPost;
