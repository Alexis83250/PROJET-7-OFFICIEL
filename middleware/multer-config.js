const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = path.extname(name);

    callback(null, name.replace(extension, "") + Date.now() + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
