import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Modal,
  TextField,
  Button,
  Container,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { styled } from "@mui/material/styles";

const StyleModal = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #ddd", // Matching border style
  borderRadius: "8px", // Border radius similar to Card component
  boxShadow: theme.shadows[3], // Subtle box-shadow similar to Card component
  p: 4,
}));

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState(""); // To store the text from the comment input field

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCommentTextChange = (event) => setCommentText(event.target.value);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/posts/${postId}/comments`);
      setComments(res.data);
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (commentText !== "") {
      try {
        const loginStatusResponse = await axios.get("/login_status");
        const loginStatus = loginStatusResponse.data;

        if (loginStatus.status === "error") {
          setCommentText("");
          handleClose();
          alert("You need to log in to add a comment."); // Display an alert message
          return; // Stop the execution of the function//
        }

        const commentData = {
          content: commentText,
          author: "Anonymous",
        };
        //eslint-disable-next-line no-unused-vars
        const addCommentResponse = await axios.post(
          `/posts/${postId}/comments`,
          commentData
        );

        // Always close the modal and clear the comment text if the POST operation succeeds
        setCommentText("");
        handleClose();

        // Immediately fetch and update the comments
        const fetchRes = await axios.get(`/posts/${postId}/comments`);
        setComments(fetchRes.data);
      } catch (error) {
        console.error("Failed to post comment:", error);
      }
    }
  };

  return (
    <Container>
      <Card style={{ marginTop: "1em" }}>
        <CardContent>
          <Typography variant="h5">
            Comments
            <IconButton
              aria-label="add-comment"
              size="large"
              onClick={handleOpen}
              style={{ float: "right" }}
            >
              <AddCommentIcon />
            </IconButton>
          </Typography>
          {comments.map((comment) => (
            <Card key={comment.id} style={{ marginTop: "1em" }}>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {comment.content}
                </Typography>
                <Typography color="textSecondary">
                  Commented by: {comment.author}
                </Typography>
                <Typography color="textSecondary">
                  Created at: {comment.created_at}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-comment-modal-title"
        aria-describedby="add-comment-modal-description"
      >
        <StyleModal>
          <CardContent>
            <Typography variant="h6" id="add-comment-modal-title">
              Add Comment
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="comment"
              label="Comment"
              type="text"
              fullWidth
              value={commentText}
              onChange={handleCommentTextChange}
            />
            <Button
              onClick={handleAddComment}
              color="inherit"
              style={{ marginTop: "1em" }}
            >
              Add Comment
            </Button>
          </CardContent>
        </StyleModal>
      </Modal>
    </Container>
  );
};

export default Comments;
