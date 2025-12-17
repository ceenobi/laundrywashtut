import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: "laundrywash",
      resource_type: "auto",
      quality_auto: "auto",
      fetch_format: "webp",
      //delivery optimization
      eager: [
        {
          width: 800,
          height: 600,
          crop: "limit",
        },
        {
          width: 400,
          height: 300,
          crop: "limit",
        },
      ],
      //performance optimization
      responsive_breakpoints: {
        create_derived: true,
        transformation: {
          quality: "auto:good",
          fetch_format: "auto",
        },
      },
      secure: true,
      optimize: true,
      ...options,
    };
    const uploadResponse = await cloudinary.uploader.upload(
      file,
      defaultOptions
    );
    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Upload failed: ${error.errror.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Deletion failed: ${error.error.message}`);
  }
};
