import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //fs is file system that you don't need to install it is inbuilt module of node js

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteFromCloudinary = async (
  publicId,
  options = { resource_type: "image" }
) => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, options);
    return result;
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    throw new ApiError(500, "Failed to delete file from Cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
    
    

//TODO : DELETE OLD IMAGE  (UTILITY FUNCTION TO DELETE IMAGE FROM CLOUDINARY)

// const deleteOnCloudinary = async (url) => {
//   try {
//     if (!url) return null;
//     const publicId = url.split("/").pop().split(".")[0];
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     console.log("Error while deleting file on cloudinary", error);
//     return null;
//   }
// };

// export { uploadOnCloudinary, deleteOnCloudinary };

//with better error handling

// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     // Validate file path
//     if (!localFilePath) {
//       throw new Error("File path is required");
//     }

//     // Check if file exists
//     if (!fs.existsSync(localFilePath)) {
//       throw new Error("File does not exist");
//     }

//     // Upload the file to Cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto"
//     });

//     // Delete local file after successful upload
//     fs.unlinkSync(localFilePath);

//     return response;

//   } catch (error) {
//     // Safely delete the local file if it exists
//     if (localFilePath && fs.existsSync(localFilePath)) {
//       try {
//         fs.unlinkSync(localFilePath);
//       } catch (unlinkError) {
//         console.error("Error deleting file:", unlinkError.message);
//       }
//     }

//     // Re-throw the error for proper error handling
//     throw error;
//   }
// };

// export { uploadOnCloudinary };
