const mongoose = require('mongoose');

const niftiResultSchema = new mongoose.Schema({
    niftiId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nifti', required: true },
    volumes: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
});

const NiftiResult = mongoose.model('NiftiResult', niftiResultSchema);

module.exports = NiftiResult;
