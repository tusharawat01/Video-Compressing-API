import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

dotenv.config({
    path: "./.env"
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("localFilePath: ", localFilePath);
        if (!localFilePath) return null;

        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'video',
            quality: 'auto:good', // Use automatic quality settings
            bitrate: 'auto',      // Automatic bitrate adjustment
            fetch_format: 'auto' // Automatically choose the format
        })
        // console.log("Response: ", response);

        //File has been uploaded successfully
        console.log("File uploaded on cloudinary successfully", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        
        //remove the locally saved temporary file as the file upload on cloudinary failed
        fs.unlinkSync(localFilePath);
        return null;

    }
}

export { uploadOnCloudinary}

