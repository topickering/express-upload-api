import fs from 'fs';
import csv from 'csv-parser';
import logger from './logger.js';

async function parseCSV(file) {
    const results = [];
    
    return new Promise((resolve, reject) => {
        const stream = fs
        .createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data)
        })
        .on('end', () => {
            logger.info('Completed parsing of file ' + file.filename);
            resolve(results)
        })
        .on('error', (err) => {
            logger.error('Stream error:', err),
            reject(err)
        });    
    })
}

export default parseCSV