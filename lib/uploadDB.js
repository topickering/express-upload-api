import { v4 as uuid } from 'uuid';
import initiateProcessing from './parsed-records-processor.js';

// In production a proper DB would be used
const uploadDB = new Map();

function addToUploadDB(results) {
    const uploadId = uuid();
    const uploadData = {
        results,
        processedRecords: 0,
        failedRecords: 0,
        details: []
    };
    uploadDB.set(uploadId, uploadData);
    initiateProcessing(uploadId, results);
    return uploadId;
}

function updateUploadRecordById(uploadId, processed, failedDetails = null) {
    const currentData = uploadDB.get(uploadId) ?? null
    if (!currentData) throw new Error(`No upload with upload id: ${uploadId}`)
    
    var { results, processedRecords, failedRecords, details } = currentData;
    const updatedDetails = processed ? details : [...details, failedDetails]
    const updatedData = {
        results,
        processedRecords: processed ? processedRecords + 1 : processedRecords,
        failedRecords: processed ? failedRecords : failedRecords + 1,
        details: updatedDetails
    }
    uploadDB.set(uploadId, updatedData);
}

function getUploadDataById(uploadId) {
    return uploadDB.get(uploadId) ?? null;
}

function getProgressById(uploadId) {
    const details = uploadDB.get(uploadId) ?? null
    if (!details) return null
    const { results, processedRecords, failedRecords } = details;
    return (Math.floor((processedRecords + failedRecords) / results.length * 100));
}

export { addToUploadDB, updateUploadRecordById, getUploadDataById, getProgressById }  