const express = require('express');
const router = express.Router();
const { getUpload, postUpload } = require('./controller')
const multer = require('multer');
const path = require('path');

const csvFileFilter = (req, file, cb) => {
        if (file.mimetype !== 'text/csv' || path.extname(file.originalname).toLowerCase() !== '.csv') {
             return cb(new Error('Only CSV files are allowed'), false)
        }
        cb(null, true)
    };

const upload = multer({
    dest: 'uploads/',
    fileFilter: csvFileFilter
});

router.get('/', (req, res) => {
    res.send("Post a csv file with name and email details to '/upload'");
});

router.get('/upload', getUpload)
router.post('/upload', upload.single('file'), postUpload)

module.exports = router