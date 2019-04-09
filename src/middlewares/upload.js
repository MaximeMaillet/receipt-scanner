const path = require('path');
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'web/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const authorizedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = path.extname(file.originalname);
    if (authorizedExtensions.indexOf(fileExtension) === -1) {
      return cb(new Error(`Extension invalid. PNG, JPG, JPEG are accepted : ${path.extname(file.originalname)} founded`))
    }

    cb(null, true)
  }
});

module.exports = upload.single('receipt');