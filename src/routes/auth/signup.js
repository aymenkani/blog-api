const express = require("express");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");

const User = require("../../models/user");
const validationRequest = require("../../common/middleware/validation-request");

const route = express.Router();

const validators = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("email field is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user)
        throw new Error("A user with the same email address already exists");

      return true;
    }),
  check("password")
    .not()
    .isEmpty()
    .withMessage("password field is required")
    .isLength({ min: 6, max: 15 })
    .withMessage("The password must be between 6 and 15 characters.")
    .isAlphanumeric()
    .withMessage(
      "The password must be alphanumeric (consisting of both letters and numbers)"
    ),

  check("userName")
    .not()
    .isEmpty()
    .withMessage("userName field is required")
    .not()
    .isUppercase()
    .withMessage("username cannot contain uppercase letters"),
];

route.post("/signup", validators, validationRequest, async (req, res, next) => {
  const { userName, email, password } = req.body;

  try {
    const user = new User({
      userName,
      email,
      password,
    });

    await user.save();

    const token = jwt.sign(
      { email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    req.session = { token };

    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = route;
