import { describe, it, expect, vi, afterEach} from 'vitest';
import { addToUploadDB, getProgressById, getUploadDataById, updateUploadRecordById } from './uploadDB';
import { v4 as uuid } from 'uuid';
import initiateProcessing from './parsed-records-processor.js';

vi.mock('./parsed-records-processor.js')
vi.mock('uuid')

describe('uploadDB', () => {

    afterEach(() => {
        vi.resetAllMocks();
    })
    describe('addToUploadDB', () => {
        it('creates an uploadDB entry, returns an uploadId and initiates processing', () => {
            uuid.mockImplementation(() => 'testUploadId')
            
            const uploadId = addToUploadDB([{record: 'test'}]);

            expect(uploadId).toBe('testUploadId')
            expect(initiateProcessing).toHaveBeenCalled();
            expect(getUploadDataById(uploadId)).toBeTruthy();
        })
    })

    describe('getUploadDataById', () => {
        it('returns upload data if it exists', () => {
            uuid.mockImplementation(() => 'testUploadId2');
            const results = [{record: 'test'}];
            
            const uploadId = addToUploadDB(results);

            const data = getUploadDataById(uploadId);
            expect(data).toEqual({
                results,
                processedRecords: 0,
                failedRecords: 0,
                details: []
            });
        });

        it('returns undefined if the upload does not exist', () => {
            const data = getUploadDataById('invalidId');
            expect(data).toEqual(undefined);
        })
    })  
    
    describe('updateUploadRecordById', () => {
        it('updates the data for a given updateId if processing is successful', () => {
            uuid.mockImplementation(() => 'testUploadId3');
            const results = [{record: 'test'}];
            
            const uploadId = addToUploadDB(results);

            updateUploadRecordById(uploadId, true);

            const data = getUploadDataById(uploadId);
            expect(data).toEqual({
                results,
                processedRecords: 1,
                failedRecords: 0,
                details: []
            });
        });

        it('updates the data for a given updateId if processing is not successful', () => {
            uuid.mockImplementation(() => 'testUploadId4');
            const results = [{record: 'test'}];
            
            const uploadId = addToUploadDB(results);

            const failedDetails = {details: 'testDetails'}

            updateUploadRecordById(uploadId, false, failedDetails);

            const data = getUploadDataById(uploadId);
            expect(data).toEqual({
                results,
                processedRecords: 0,
                failedRecords: 1,
                details: [failedDetails]
            });
        })
    })

    describe('getProgressById', () => {
        it('returns the percentage of records which have been processed for a given uploadId', () => {
            uuid.mockImplementation(() => 'testUploadId5')
            
            const uploadId = addToUploadDB([{record: 'test'}]);

            const initialProgress = getProgressById(uploadId);
            expect(initialProgress).toEqual(0);

            updateUploadRecordById(uploadId, true);
            const updatedProgress = getProgressById(uploadId)
            expect(updatedProgress).toEqual(100);
        })
    })
})