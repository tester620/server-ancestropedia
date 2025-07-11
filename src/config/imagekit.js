import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

export const imagekit = new ImageKit({
    publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint : "https://ik.imagekit.io/ancestor"
})