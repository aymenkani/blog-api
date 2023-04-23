const express = require("express");
const jwt = require("jsonwebtoken");
const NotAuthorizedError = require("../../common/errors/not-authorized-error");
const Ebook = require("../../models/ebook");
const path = require("path");
const fs = require("fs");

const route = express.Router();

route.get("/download/:token", async (req, res, next) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || decodedToken.userId !== req.currentUser.userId) {
      throw new NotAuthorizedError();
    }

    const ebook = await Ebook.findById(decodedToken.ebookId);

    const filepath = path.join("private", "ebooks", ebook.filename);

    // Stream ebook to client
    const stream = fs.createReadStream(filepath);
    stream.on("open", () => {
      res.setHeader("Content-Type", "application/pdf");
      stream.pipe(res);
    });

    stream.on("error", (err) => {
      throw err;
    });
  } catch (err) {
    next(err);
  }
});

module.exports = route;
