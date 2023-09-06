import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "../HomePage";
import NavBar from "../NavBar";
import Login from "../Login";
import PostPage from "../Post/PostPage";
import NewPost from "../Post/NewPost";
import Posts from "../Post/Posts";
import SignUp from "../SignUp";
import Logout from "../Logout";
import ContactMe from "../ContactMe";
import AboutTheBlog from "../AboutTheBlog";
import EditPost from "../Post/EditPost";
import SearchResults from "../SearchResults.js";
function App() {
  const posts = [
    {
      post_num: "1",
      post_text:
        "My first blog post is all about my blog post and how to write a new post in my blog, you can find it here",
      post_date: "Published 1 day ago by Israel",
    },
    {
      post_num: "2",
      post_text: "My second blog post is all about my blog post",
      post_date: "Published 2 day ago by Joe",
    },
    {
      post_num: "3",
      post_text: "My third blog post is all about my blog post",
      post_date: "Published 3 day ago by Israel",
    },
  ];
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/AboutTheBlog" element={<AboutTheBlog />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/NewPost" element={<NewPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostPage posts={posts} />} />
        <Route path="/post/:id" element={<PostPage posts={posts} />} />
        <Route path="/" element={<HomePage posts={posts} />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ContactMe" element={<ContactMe />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
