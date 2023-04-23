const express = require("express");
const BadRequestError = require("../../common/errors/bad-request-error");
const NotFoundError = require("../../common/errors/not-found-error");
const Post = require("../../models/post");
const { query } = require("express-validator");
const validationRequest = require("../../common/middleware/validation-request");

const router = express.Router();

const validators = [
  query("page")
    .notEmpty()
    .withMessage("Page must not be empty")
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("postsPerPage")
    .isInt({ min: 1, max: 2 })
    .withMessage("Posts per page must be a positve integer greater than 2"),
];

router.get("/all", validators, validationRequest, async (req, res, next) => {
  const { page, postsPerPage } = req.query;
  //console.log(req.query)

  try {
    const totalPosts = await Post.countDocuments();

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const posts = await Post.find()
      .sort("-created_at")
      .skip((page - 1) * postsPerPage)
      .limit(postsPerPage);

    return res.status(200).json({ totalPosts, totalPages, page, posts });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new BadRequestError("post id is required"));
  }

  try {
    const post = await Post.findById(id);

    if (!post) throw new NotFoundError("Document not found");

    return res.status(200).json({ post });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
