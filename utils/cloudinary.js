require('dotenv').config(); 

const cloudinary = require('cloudinary'); 
const streamifier = require('streamifier');
const { Readable } = require('stream');
const zlib = require('zlib');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//cloudinary upload image  (the old function)

const cloudinaryUploadImage= async (fileToUpload)=>{
    try {
        const data = await cloudinary.uploader.upload(fileToUpload,{
            resource_type:'auto',
            
        });
        return data;
    } catch (error) {
        return error;
        
    }
}


//cloudinary remove image
const cloudinaryRemoveImage= async (imagePublicId)=>{
    try {
        const result =await cloudinary.uploader.destroy(imagePublicId);
        return result;
    } catch (error) {
        return error;
        
    }
}
//cloudinary remove Multiple image
const cloudinaryRemoveMultipleImage= async (PublicIds)=>{
    try {
        const result =await cloudinary.v2.api.delete_resources(PublicIds);
            
        return result;
    } catch (error) {
        return error;
        
    }
}

/* 
const cloudinaryUploadniiImage = async (fileBuffer) => {
    try {
        // Create a readable stream from the file buffer
        const stream = streamifier.createReadStream(fileBuffer);

        // Upload the file stream to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw', // Set resource_type to 'raw' for non-image files
                    format: 'nii', // Set format to 'nii' to specify file format
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            // Pipe the file stream to the Cloudinary upload stream
            stream.pipe(uploadStream);
        });

        return result;
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};
*/

const cloudinaryUploadniiImage = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        // Compress the file buffer
        zlib.gzip(fileBuffer, (error, compressedBuffer) => {
            if (error) {
                return reject(new Error('File compression failed'));
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    public_id: fileName,
                },
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            const bufferStream = new Readable();
            bufferStream.push(compressedBuffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
        });
    });
};


module.exports={
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage,
    cloudinaryUploadniiImage
}