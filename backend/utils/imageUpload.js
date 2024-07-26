const { cloudinary } = require('../config/cloudinary');

async function uploadFileToCloudinary(file, folder, quality) {
    const options = {
        folder: folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
    };

    if (quality) {
        options.quality = quality;
    }

    try {
        return await cloudinary.uploader.upload(file.tempFilePath, options); // main code for uploading
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
}

module.exports = uploadFileToCloudinary;
