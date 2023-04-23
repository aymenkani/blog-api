const jwt = require("jsonwebtoken");
const NotAuthorizedError = require("../errors/not-authorized-error");

const currentUser = (req, res, next) => {
  try {
    const token = req.session?.token;
    if (!token) throw new Error();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) throw new Error();

    req.currentUser = payload;
    return next();
  } catch (err) {
    return next(new NotAuthorizedError());
  }
};

module.exports = currentUser;
