
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../app/errorHelpers/AppError";




cloudinary.config({
    cloud_name:envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key:envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret:envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})


export const deleteImageFromCloudinary = async (url:string) => {
    try {

    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);

    if(match && match[1]) {
        const public_id = match[1]
        await cloudinary.uploader.destroy(public_id)
        console.log(`file ${public_id} is deleted`);
    }
    
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error:any) {
    throw new AppError(401,"cloudinary image deletion failed",error.message)
}

}

export const cloudinaryUpload = cloudinary;

// https://res.cloudinary.com/do8woqwpf/image/upload/v1772025200/qkah8wk3y8l-1772025198418-screenshot43-png.png.png