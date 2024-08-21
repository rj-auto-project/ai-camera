import fs from "fs";
import { faceDetection } from "../services/operations.service";

const faceDetection = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "No images uploaded" });
    }

    const result = await Promise.all(
      files.map(async (file) => {
        try {
          const matchingImage = await faceDetection(file.path);
          fs.unlinkSync(file.path);
          return {
            file: file.originalname,
            matchingImage,
          };
        } catch (error) {
          console.error("Error detecting face:", error);
          return {
            status: "fail",
            message: "Face detection failed",
            error: error.message,
          };
        }
      })
    );

    res.json({
      status: "ok",
      message: "Face detection completed successfully",
      result,
    });
  } catch (error) {
    console.error("Error performing operation:", error);
    res.status(500).json({
      status: "fail",
      message: "Face detection failed",
      error: error.message,
    });
  }
};
