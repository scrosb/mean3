const express = require("express");
const bodyParser = require("body-parser");

const app = express();

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

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);

  res.status(201).json({
    message: "Post Added Successfully",
  });
});
app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "asdasdfasdf",
      title: "first server-side post",
      content: "this is coming from the server.",
    },
    {
      id: "asdasdfasdf1234543215",
      title: "second server-side post",
      content: "this is second coming from the server.",
    },
  ];
  return res.status(200).json({
    message: "Posts fetched Successfully",
    posts: posts,
  });
});

module.exports = app;
