const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/mean3")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

//cors setup

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// app.use((req, res, next) => {
//   console.log("first Middleware");
//   next();
// });

app.post("/api/posts", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post Added Successfully",
      postId: createdPost._id,
    });
  });
});

app.put("/api/posts/:id", (req, res) => {});

app.get("/api/posts", (req, res) => {
  Post.find().then((documents) => {
    console.log(documents);

    return res.status(200).json({
      message: "Posts fetched Successfully",
      posts: documents,
    });
  });
  // const posts = [
  //   {
  //     id: "asdasdfasdf",
  //     title: "first server-side post",
  //     content: "this is coming from the server.",
  //   },
  //   {
  //     id: "asdasdfasdf1234543215",
  //     title: "second server-side post",
  //     content: "this is second coming from the server.",
  //   },
  // ];
});

app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params.id;
  const result = await Post.deleteOne(id);
  console.log(result);
  res.status(200).send({});

  // Post.deleteOne({ _id: req.params.id }).then((result) => {
  //   console.log(result);

  // });
});

module.exports = app;
