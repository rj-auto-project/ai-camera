import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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

  // Calculate relative time within the current minute
  const seconds = date.getSeconds();
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${seconds}.${milliseconds}`;
};

const getThumbnail = async (videoPath, timestamp, boxCoords) => {
  const dateTimestamp = new Date(timestamp); // Convert to Date object

  // Get the relative timecode within the 1-minute video segment
  const timeCode = formatTimeWithinMinute(dateTimestamp);
  console.log("Relative Timecode:", timeCode);

  const highlightedImagePath = path.join(
    __dirname,
    "../../../../ai-camera/suspectThumbnails",
    `highlighted-${dateTimestamp.toISOString().replace(/:/g, "-")}.jpg`,
  );

  // Ensure the output directory exists
  ensureDirectoryExists(
    path.join(__dirname, "../../../../ai-camera/suspectThumbnails"),
  );

  try {
    // Scaling factors for the original image resolution (1920x1080) to 480x640
    const originalWidth = 1920;
    const originalHeight = 1080;
    const videoWidth = 640;
    const videoHeight = 480;

    const scaleX = videoWidth / originalWidth;
    const scaleY = videoHeight / originalHeight;

    const [left, top, width, height] = JSON.parse(boxCoords);
    const scaledLeft = Math.round(left * scaleX);
    const scaledTop = Math.round(top * scaleY);
    const scaledWidth = Math.round(width * scaleX);
    const scaledHeight = Math.round(height * scaleY);

    // Extract frame and add a red border directly, saving the highlighted image
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on("start", (commandLine) => {
          console.log("Spawned ffmpeg with command!");
        })
        .on("stderr", (stderrLine) => {
          console.log("stderr output:", stderrLine);
        })
        .on("end", () => {
          console.log("Highlighted image created at:", highlightedImagePath);
          resolve();
        })
        .on("error", (err) => {
          console.error("Error:", err.message);
          reject(err);
        })
        .seekInput(timeCode) // Go to the correct frame
        .outputOptions([
          `-vf drawbox=x=${scaledLeft - 5}:y=${scaledTop - 5}:w=${
            scaledWidth + 10
          }:h=${scaledHeight + 10}:color=red@1.0:t=5`, // Red border
        ])
        .output(highlightedImagePath)
        .run(); // Run the command
    });

    return highlightedImagePath;
  } catch (err) {
    console.error("Error processing image:", err.message);
    throw err;
  }
};

export { getThumbnail };
