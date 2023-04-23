const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + "_" + file.originalname.replace(/\//g, "_"); // only for windows
    cb(null, fileName);
  },
});

// const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const type = file.mimetype;

  if (type === "image/png" || type === "image/jpeg") {
    return cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage, fileFilter }).single("image"); // middleware
