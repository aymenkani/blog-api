const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const BadRequestError = require("../../common/errors/bad-request-error");

const route = express.Router();

route.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new BadRequestError("wrong credentials"));
    }

    const pwdEqual = await bcrypt.compare(password, user.password);

    if (!pwdEqual) {
      return next(new BadRequestError("wrong credentials"));
    }

    const token = jwt.sign(
      { email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    req.session = { token };

    res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = route;
