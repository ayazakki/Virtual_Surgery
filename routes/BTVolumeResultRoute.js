const express = require('express');
const router = express.Router();
const { BTVolumeResult } = require('../models/BTVolumeResult');
const BTSegmentationResult = require('../models/BTSegmentationResult');
const calculateVolume = require('../utils/calculateVolume');
const axios =require('axios');
const zlib = require('zlib');
const  {verifyToken} = require("../middlewares/verifyToken");

router.post('/', verifyToken ,async (req, res) => {
    try {
        const segmentationResult = await BTSegmentationResult.findOne({_id:req.body.id}) 
        if (!segmentationResult) {
            return res.status(404).json({ message: 'Segmentation result not found' });
        }

        const { displayedNII } = segmentationResult;
        const bufferResponse = await axios.get(displayedNII.secure_url, {
            responseType: "arraybuffer",
          });
        //const buffer = bufferResponse.data;
        //new
        const buffer = bufferResponse.data
        const volume = await calculateVolume(buffer,req.body.threshold);

        const volumeResult = new BTVolumeResult({
            threshold: req.body.threshold,
            volume,
            niiFile: displayedNII,
            btSegmentationId: segmentationResult._id
        });

        const savedVolumeResult = await volumeResult.save();
        res.json(savedVolumeResult);
    } catch (error) {
        console.error('Error calculating volume:', error);
        res.status(500).json({ message: 'Failed to calculate volume', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const allVolumeResults = await BTVolumeResult.find({btSegmentationId:req.body.btSegmentationId});
        res.json(allVolumeResults);
    } catch (error) {
        console.error('Error fetching volume results:', error);
        res.status(500).json({ message: 'Failed to fetch volume results', error: error.message });
    }
});

module.exports = router;

