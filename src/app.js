require("dotenv").config();

const express = require("express");

const cookieSession = require("cookie-session");

const createPostRoute = require("./routes/post/create");
const readPostRoute = require("./routes/post/read");
const updatePostRoute = require("./routes/post/update");
const deletePostRoute = require("./routes/post/delete");

const createCommentRoute = require("./routes/comment/create");
const readCommentRoute = require("./routes/comment/read");
const updateCommentRoute = require("./routes/comment/update");
const deleteCommentRoute = require("./routes/comment/delete");

const createEbookRoute = require("./routes/ebook/create");
const updateEbookRoute = require("./routes/ebook/update");
const deleteEbookRoute = require("./routes/ebook/delete");
const readEbookRoute = require("./routes/ebook/read");
const purchaseEbookRoute = require("./routes/ebook/purchase");
const downloadEbookRoute = require("./routes/ebook/download");

const signupRoute = require("./routes/auth/signup");
const signinRoute = require("./routes/auth/signin");
const signoutRoute = require("./routes/auth/signout");
const currentUserRoute = require("./routes/auth/current-user");

const currentUser = require("./common/middleware/current-user");

const CustomError = require("./common/errors/custom-error");
const NotFoundError = require("./common/errors/not-found-error");

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");

const fs = require("fs");

const ORIGIN_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.PRODUCTION_URL;

const app = express();

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(__dirname + "/../access.log", {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(
  cors({
    origin: ORIGIN_URL,
    credentials: true,
    //methods: ['POST', 'GET']
  })
);

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use("/upload", currentUser, express.static("upload"));
app.use("/public", express.static("public"));

app.use(
  "/auth/",
  signupRoute,
  signinRoute,
  signoutRoute,
  currentUser,
  currentUserRoute
);

app.use(
  "/posts/",
  readPostRoute,
  currentUser,
  createPostRoute,
  updatePostRoute,
  deletePostRoute
);

app.use(
  "/comment/",
  readCommentRoute,
  currentUser,
  createCommentRoute,
  updateCommentRoute,
  deleteCommentRoute
);

app.use(
  "/ebook/",
  readEbookRoute,
  currentUser,
  createEbookRoute,
  updateEbookRoute,
  deleteEbookRoute,
  purchaseEbookRoute,
  downloadEbookRoute
);

// not found
app.all("*", (req, res, next) => {
  next(new NotFoundError());
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.generateErrors() });
    return;
  }

  res.status(500).json({ errors: [{ message: "something went wrong" }] });
});

module.exports = app;
