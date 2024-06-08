const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Patient } = require("../models/Patient");

const SegmentationResultSchema = new Schema({
    name: { type: Date, default: Date.now, required: true },
    displayedNII: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true }, 
    results: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
  });
  
  const BTSegmentationResult = mongoose.model('BTSegmentationResult', SegmentationResultSchema);
  module.exports = BTSegmentationResult;