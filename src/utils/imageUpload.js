import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const fieldName = file.fieldname;
    const filename = `${timestamp}_${fieldName}${extension}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    const extName = allowedImageTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowedImageTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images are allowed!"));
    }
  },
});

export default upload;
