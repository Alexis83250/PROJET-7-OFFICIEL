const sharp = require("sharp");
const fs = require("fs");

function webPFormat(req, res, next) {
  if (req.file) {
    const originalFilePath = `images/${req.file.filename}`;

    const baseFileName = req.file.filename.replace(/\d+\.[^.]+$/, "");

    const newImg = `images/${baseFileName}.webp`;

    sharp(originalFilePath)
      .webp({ quality: 80 })
      .toFile(newImg, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Erreur lors de la conversion en WebP" });
        }

        fs.unlinkSync(originalFilePath);

        req.file.filename = newImg.split("/").pop();
        req.file.destination = "";

        next();
      });
  } else {
    next();
  }
}

module.exports = webPFormat;
