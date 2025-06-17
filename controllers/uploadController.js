import fs from 'fs';
import csv from 'csv-parser';
import { addToUploadDB, getProgressById, getUploadDataById } from '../lib/uploadDB.js';
import logger from '../lib/logger.js';

async function postUpload(req, res) {    
    const  { file } = req
    
    if(!file) {
        return res.status(400).send('No file uploaded');
    }
   
    const results = [];

    logger.info('Commencing parsing of file ' + file.filename);
    
    const stream = fs
        .createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data)
        })
        .on('end', () => {

            logger.info('Completed parsing of file ' + file.filename);
            const uploadId = addToUploadDB(results);

            res.setHeader('Content-Type', 'application/json')
                .status(200)
                .send(JSON.stringify({
                    uploadId,
                    message: 'File uploaded successfully. Processing started.'
                }))
        });

    stream.on('error', (err) => {
        console.error('Stream error:', err)
        res.status(500).send('Error reading file stream.')
    })    
}

function getUpload(req, res) {
    const { id } = req.params;

    if(!id) return res.status(400).send('Must provide an id');

    const progress = getProgressById(id)

    if(progress != 100) return res.status(400).send("Upload still being processed. Visit '/status/{uploadId}");

    const { results, processedRecords, failedRecords, details } = getUploadDataById(id)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({
        totalRecords: results.length,
        processedRecords, 
        failedRecords,
        details
    });
} 

export { getUpload, postUpload };