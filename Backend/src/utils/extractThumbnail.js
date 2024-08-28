import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Set the FFmpeg path explicitly
ffmpeg.setFfmpegPath(
  "D:\\ffmpeg-7.0.2-essentials_build\\ffmpeg-7.0.2-essentials_build\\bin\\ffmpeg.exe",
);

const formatTimeWithinMinute = (isoTimestamp) => {
  const date = new Date(isoTimestamp);
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${minutes}:${seconds}.${milliseconds}`;
};

const getThumbnail = async (videoPath, timestamp) => {
  const dateTimestamp = new Date(timestamp);

  const timeCode = formatTimeWithinMinute(dateTimestamp);
  console.log("Relative Timecode:", timeCode);

  const outputDir = path.resolve(__dirname, "../../../../suspectThumbnails");

  const uniqueId = crypto.randomBytes(8).toString("hex");
  const highlightedImagePath = path.join(
    outputDir,
    `thumbnail-${dateTimestamp
      .toISOString()
      .replace(/:/g, "-")}-${uniqueId}.jpg`,
  );

  ensureDirectoryExists(outputDir);

  try {
    console.log("Starting ffmpeg process..."); // Log before starting
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on("start", () => {
          console.log(
            `Spawned ffmpeg with command for ${highlightedImagePath}`,
          );
        })
        .on("end", () => {
          console.log("Highlighted image created at:", highlightedImagePath);
          resolve();
        })
        .on("error", (err) => {
          console.error("Error:", err.message);
          resolve(null);
        })
        .seekInput(timeCode)
        .frames(1)
        .output(highlightedImagePath)
        .run();
    });
    console.log("Finished ffmpeg process"); // Log after completion
    return highlightedImagePath || null;
  } catch (err) {
    console.error("Error processing image:", err.message);
    throw err;
  }
};

export { getThumbnail };
