import fs from 'fs';
import csv from 'csv-parser';
import { addToUploadDB, getProgressById, getUploadDataById } from '../lib/uploadDB.js';
import logger from '../lib/logger.js';
import parseCSV from '../lib/parse-csv.js';

async function postUpload(req, res) {    
    const  { file } = req;
    
    if(!file) {
        return res.status(400).send('No file uploaded');
    }
   
    logger.info(`Commencing parsing of file: ${file.filename}`);
    try {
        const results = await parseCSV(file);
        const uploadId = addToUploadDB(results);

        res.setHeader('Content-Type', 'application/json');
        res.status(200)
            .send({
                uploadId,
                message: 'File uploaded successfully. Processing started.'
            });
    } catch(error) {
        res.status(500).send(`Error processing file upload: ${error.msg}`);
    }  ;
}

function getUpload(req, res) {
    const { id } = req.params;

    if(!id) return res.status(400).send('Must provide an id');

    const progress = getProgressById(id);

    if(progress != 100) return res.status(400).send("Upload still being processed. Visit '/status/{uploadId}");

    const { results, processedRecords, failedRecords, details } = getUploadDataById(id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({
        totalRecords: results.length,
        processedRecords, 
        failedRecords,
        details
    });
} 

export { getUpload, postUpload };