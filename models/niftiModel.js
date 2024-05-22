const mongoose = require('mongoose');

const niftiSchema = new mongoose.Schema({
    filePath: { type: String, required: true },
    sliceThickness: { type: Number, required: true },
    imageResolution: { type: Number, required: true },
    threshold: { type: Number, required: true },
    processed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Nifti = mongoose.model('Nifti', niftiSchema);

module.exports = Nifti;
