require('dotenv').config(); 

const cloudinary = require('cloudinary').v2; 

cloudinary.config({ 
    cloud_name:dkzwhfcm6,
    //cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:773799126653356,
    //api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:q8yXa7B6yOhrPuCVCDOYhJ036iI,
    //api_secret: process.env.CLOUDINARY_API_SECRET
});

//cloudinary upload image
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


module.exports={
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage
}