const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadNiftiFile } = require('../controllers/niftiController');

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.nii');
    }
});
const upload = multer({ storage: storage });

// Routes
router.post('/upload', upload.single('niftiFile'), uploadNiftiFile);

module.exports = router;
