import axios from "axios"

/**
 * Fetches an image from a given URL and returns its buffer.
 * @param {string} url - The URL of the image.
 * @returns {Promise<Buffer>} - A promise that resolves to the image buffer.
 */
const fetchImageBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary'); // Convert the response data to a buffer
  } catch (error) {
    console.error("Error fetching image:", error.message);
    throw new Error("Unable to fetch image");
  }
};

export default fetchImageBuffer;