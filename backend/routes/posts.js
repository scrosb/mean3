const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    console.log(isValid);
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post("", multer({ storage: storage }).single("image"), (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  });

  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post Added Successfully",
      post: {
        ...createdPost,
        id: createdPost._id,

        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath,
      },
    });
  });
});

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.get("", (req, res) => {
  Post.find().then((documents) => {
    return res.status(200).json({
      message: "Posts fetched Successfully",
      posts: documents,
    });
  });
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
