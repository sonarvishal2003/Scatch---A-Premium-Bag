const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads")); // correct path relative to your project
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // eg. 1745236480030.png
    }
});

module.exports = multer({ storage: storage });
