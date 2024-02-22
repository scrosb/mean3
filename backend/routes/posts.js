const express = require("express");

const Post = require("../models/post");

const router = express.Router();

router.post("", (req, res) => {
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

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Update Successful!" });
  });
});

router.get("", (req, res) => {
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

//get post by id to recycle post when we refresh on the edit form.
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    console.log(post);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params.id;
  const result = await Post.deleteOne(id);
  console.log(result);
  res.status(200).send({});

  // Post.deleteOne({ _id: req.params.id }).then((result) => {
  //   console.log(result);

  // });
});

module.exports = router;
