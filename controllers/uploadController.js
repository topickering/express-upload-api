import fs from 'fs';
import csv from 'csv-parser';
import pLimit from 'p-limit';
import mockValidateEmail from '../lib/mock-validate-email.js';

const limit = pLimit(5);

const uploadStatusMap = new Map();

async function getUpload(req, res) {
    res.status(200).send('POST a csv file to this endpoint, for example with Postman or cURL')
}

async function postUpload(req, res) {
    
    if(!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // NOTE - Multer creates a random filename.  As an extension the Multer implementation could
    // be configured, or a different id could be generate / used here.
    const uploadId = req.file.filename;

    res.setHeader('Content-Type', 'application/json');

    res.write(JSON.stringify({
        uploadId,
        message: 'File uploaded successfully. Processing started.'
    }))

    uploadStatusMap.set(uploadId, 0);

    const results = []

    const stream = fs
        .createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data)
        })
        .on('end', async () => {
            const totalRecords = results.length;
            var progressedCounter = 0;

            const details = [];

            await Promise.all(results.map((result) => limit(async () => {
                const validationResult = await mockValidateEmail(result.email);
                progressedCounter ++;
                const progress = (Math.floor(progressedCounter / totalRecords * 100));
                uploadStatusMap.set(uploadId, progress);
                if(!validationResult.valid) {
                    details.push({
                        ...result,
                        error: 'Invalid email format'
                    })
                } 
            })))

            const failedRecords = details.length;

            const responseJson = {
                totalRecords,
                processedRecords: totalRecords - failedRecords,
                failedRecords,
                details
            }

            res.status(200).end(JSON.stringify(responseJson))
        })
    
   stream.on('error', (err) => {
    console.error('Stream error:', err)
    fs.unlink(req.file.path, () => {
      res.status(500).send('Error reading file stream.')
    })
  })    
}

function getStatus(req, res) {
    const { id } = req.params;

    if(!id) return res.status(400).send('Must provide an id');

    if(!uploadStatusMap.has(id)) return res.status(400).send('Invalid upload id');

    const responseJson = {
        uploadId: id,
        progress: uploadStatusMap.get(id)
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(responseJson);
} 

export { getUpload, postUpload, getStatus };