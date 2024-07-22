import { compressVideo } from '../utils/ffmpeg.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Upload } from '../models/upload.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const handleVideoUpload = async (req, res) => {
    const files = req.files;
    console.log('Request Files:', files);

    if (!files || files.length === 0) {
        throw new ApiError(400, "No files were uploaded");
    }

    try {
        const uploadedFiles = [];

        for (const file of files) {
            const outputFilePath = `${file.path}-compressed.mp4`;

            await compressVideo(file.path, outputFilePath);

            const cloudinaryResponse = await uploadOnCloudinary(outputFilePath);

            if (!cloudinaryResponse || !cloudinaryResponse.url) {
                throw new ApiError(400, "Failed to upload video to Cloudinary or Cloudinary URL is missing");
            }

            const newFile = await Upload.create({
                originalName: file.originalname,
                compressedName: `compressed-${file.originalname}`,
                fileUrl: cloudinaryResponse.secure_url
            });

            if (!newFile) {
                throw new ApiError(500, "Error occurred while creating file document");
            }

            uploadedFiles.push(newFile);
            console.log(`Successfully compressed ${file.originalname} and saved to cloud and URL to MongoDB`);
        }

        return res.status(200).json(
            new ApiResponse(200, uploadedFiles, 'Files Uploaded Successfully')
        );
    } catch (error) {
        console.error('Error during video upload process:', error);
        throw new ApiError(500, "Something went wrong while uploading the files");
    }
};

const getAllVideos = async (req, res) => {
    try {
        // Destructure and parse query parameters
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { [sort]: order === 'asc' ? 1 : -1 }
        };

        // Create an aggregate query
        const aggregateQuery = Upload.aggregate().sort(options.sort);

        if(!aggregateQuery){
            throw new ApiError(400, "aggregateQuery not getted");
        }

        // Perform aggregation and pagination
        const result = await Upload.aggregatePaginate(aggregateQuery, options);
        console.log(result)

        // Handle case where result is empty or null
        if (!result || result.totalDocs === 0) {
            throw new ApiError(400, "Cannot find any videos");
        }

        // Prepare the response data
        const data = {
            success: true,
            data: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
            totalDocs: result.totalDocs
        };

        // Send successful response
        return res.status(200).json(new ApiResponse(200, data, "All video files fetched successfully"));

    } catch (error) {
        console.error('Error fetching videos from MongoDB:', error);
        return res.status(500).json(new ApiResponse(500, 'Failed to fetch videos', error.message));
    }
};
export { handleVideoUpload, getAllVideos };
