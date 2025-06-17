import express from 'express';
import { getUpload, postUpload } from '../controllers/uploadController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router({ mergeParams: true });

const csvFileFilter = (req, file, cb) => {
        if (file.mimetype !== 'text/csv' || path.extname(file.originalname).toLowerCase() !== '.csv') {
             return cb(new Error('Only CSV files are allowed'), false)
        }
        cb(null, true)
    };

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({
    storage,
    fileFilter: csvFileFilter
});

router.get('/', (req, res) => {
    res.send("Post a csv file with name and email details to '/upload'");
});

router.post('/', upload.single('file'), postUpload)
router.get('/:id', getUpload)

export default router;