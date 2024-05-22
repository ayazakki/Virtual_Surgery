const fs = require('fs');
const path = require('path');
const nifti = require('nifti-reader-js');
const NiftiModel = require('../models/niftiModel');
const NiftiResult = require('../models/niftiResult');

exports.uploadNiftiFile = async (req, res) => {
    const { sliceThickness, imageResolution, threshold } = req.body;
    const filePath = req.file.path;

    try {
        const niftiDoc = new NiftiModel({
            filePath,
            sliceThickness,
            imageResolution,
            threshold,
        });
        await niftiDoc.save();

        const niftiModel = new NiftiModel(filePath, sliceThickness, imageResolution, threshold);
        niftiModel.processNiftiData(nifti, fs);
        niftiModel.normalizeData();
        niftiModel.applyThreshold();
        niftiModel.calculateVolume();

        const niftiResult = new NiftiResult({
            niftiId: niftiDoc._id,
            volumes: niftiModel.volumes,
        });
        await niftiResult.save();

        niftiDoc.processed = true;
        await niftiDoc.save();

        res.json({ success: true, volumes: niftiModel.volumes });
    } catch (error) {
        console.error('Error processing NIfTI file:', error);
        res.status(500).json({ success: false, message: 'Error processing NIfTI file' });
    } finally {
        fs.unlinkSync(filePath); // Clean up the uploaded file
    }
};
