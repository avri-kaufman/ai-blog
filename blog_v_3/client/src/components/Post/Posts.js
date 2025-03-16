import React from "react";
import axios from "axios";
import Post from "./Post.js";
import { Container } from "@mui/material";

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      resp: null,
    };
  }

  componentDidMount() {
    this.getAllPosts();
  }

  getAllPosts = () => {
    const url = "/posts";
    axios.get(url, { withCredentials: true }).then((res) => {
      console.log(res);
      this.setState({
        data: res.data,
        resp: null,
      });
    });
  };

  handlePostDelete = () => {
    this.getAllPosts();
  };

  render() {
    const { data } = this.state;
    return (
      <Container>
        {data.map((item) => (
          <Post
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            category_id={item.category_id}
            created_at={item.created_at}
            updated_at={item.updated_at}
            user_id={item.user_id}
            onDelete={this.handlePostDelete}
          />
        ))}
      </Container>
    );
  }
}

export default Posts;
