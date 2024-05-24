const fs = require('fs');
const NiiFile = require('../models/NiiFile');
const { cloudinaryUploadImage,cloudinaryUploadniiImage} = require('../utils/cloudinary');
const calculateVolume = require('../utils/calculateVolume');
const validateCreateNiiFile = require('../validation/niiFileValidation');

// Create new NiiFile
module.exports.createNewNiiFile = async (req, res) => {
    try {
        // Validate image
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Validate data
        const { error } = validateCreateNiiFile(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Upload to Cloudinary
        const result = await cloudinaryUploadImage(req.file.path);

         // Ensure the Cloudinary response contains publicId and url
         if (!result || !result.public_id || !result.url) {
            throw new Error('Cloudinary upload failed: missing publicId or url');
        }

        // Calculate tumor volume
        const niiFilePath = req.file.path;
        const { threshold, sliceThickness, imageResolution } = req.body;

        console.log('Calculating volume with params:', {
            //niiFilePath,
            threshold,
            sliceThickness,
            imageResolution
        });

        const volume = await calculateVolume(
            //new
            //fileBuffer, // Pass buffer instead of URL
            niiFilePath,
            threshold || 0.2,
            sliceThickness || 2.5,
            imageResolution || 0.001
        );

        if (isNaN(volume)) {
            throw new Error('Volume calculation resulted in NaN');
        }

        // Create new NiiFile
        const niiFile = await NiiFile.create({
            Surgeon: req.user.id,
            Patient: req.body.Patient,
            ScanDetails: req.body.ScanDetails,
            Volume: volume,
            Opacity: req.body.opacity,
            Threshold: req.body.threshold,
            SliceX: req.body.sliceX,
            SliceY: req.body.sliceY,
            SliceZ: req.body.sliceZ,
            SliceThickness: req.body.sliceThickness,
            ImageResolution: req.body.imageResolution,
            // Save Cloudinary URL and public ID
            Image: {
                url: result.secure_url,
                publicId: result.public_id,
            }
        });

        // Send response to the client in the desired format
        res.status(201).json({ message: `Volume = ${volume}`, niiFile });

        // Remove the .nii file from the server
        fs.unlinkSync(req.file.path);

    } catch (error) {
        console.error('Error creating Nii file:', error);
        res.status(500).send(`Internal server error: ${error.message}`);
    }
};