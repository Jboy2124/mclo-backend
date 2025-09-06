const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "docs/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

module.exports = upload;
