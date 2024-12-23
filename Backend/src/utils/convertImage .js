import sharp from "sharp";

const convertImage = async (imageBuffer) => {
    return await sharp(imageBuffer).jpeg().toBuffer();
};

export default convertImage;