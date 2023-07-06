import React from "react";
import axios from "axios";
import Post from "./Post.js";

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

  render() {
    const { data } = this.state;
    return (
      <div>
        {data.map((item) => (
          <Post
            id={item.id}
            title={item.title}
            content={item.content}
            category_id={item.category_id}
            created_at={item.created_at}
            updated_at={item.updated_at}
          />
        ))}
      </div>
    );
  }
}

export default Posts;
