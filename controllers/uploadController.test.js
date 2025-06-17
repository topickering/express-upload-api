import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import { getUpload, postUpload } from './uploadController.js';
import { addToUploadDB, getProgressById, getUploadDataById } from '../lib/uploadDB.js';
import parseCSV from '../lib/parse-csv.js';

vi.mock('../lib/uploadDB.js')
vi.mock('../lib/parse-csv.js')

const mockRes = () => ({
    send: vi.fn(),
    status: vi.fn(),
    setHeader: vi.fn()
});

describe('upload controller', () => {
    let req;
    let res;
    
    beforeEach(() => {
        req = {};
        res = mockRes()
    })
    
    afterEach(() => {
        vi.resetAllMocks();
    })
    
    describe('postUpload', () => {
        it('sends a 400 if no file is posted', async () => {
            let req = {};
            let res = mockRes();

            res.status.mockImplementation(() => res);

            await postUpload(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('No file uploaded')
        });

        it('sends a 200 and uploads results to DB if file parsed successfully', async () => {
            const file = {
                    filename: 'testFile',
                }
            
            let req = {
                file
            };
            let res = mockRes();

            res.status.mockImplementation(() => res);
            res.setHeader.mockImplementation(() => res);
            parseCSV.mockResolvedValue([{test: 'record'}]);
            addToUploadDB.mockImplementation(() => 'testId')

            await postUpload(req, res);

            expect(parseCSV).toHaveBeenCalledWith(file);
            expect(addToUploadDB).toHaveBeenCalledWith([{test: 'record'}])
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                uploadId: 'testId',
                message: 'File uploaded successfully. Processing started.'
            })
        });

        it('sends a 500 if file parsed is unsuccessful', async () => {
            const file = {
                    filename: 'testFile',
                }
            
            let req = {
                file
            };
            let res = mockRes();

            res.status.mockImplementation(() => res);
            res.setHeader.mockImplementation(() => res);
            parseCSV.mockRejectedValue({msg: 'error'});

            await postUpload(req, res);

            expect(parseCSV).toHaveBeenCalledWith(file);
            expect(addToUploadDB).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error processing file upload: error')
        });
    })

    describe('getUpload', () => {
        it('sends a 400 if no id is present', () => {
            let req = {
                params: {}
            };
            let res = mockRes();

            res.status.mockImplementation(() => res);

            getUpload(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Must provide an id')
        });

        it('sends a 400 if the upload is still being processed', () => {
            let req = {
                params: {
                    id: 'testId'
                }
            };
            let res = mockRes();

            res.status.mockImplementation(() => res);
            getProgressById.mockImplementation(() => 50);

            getUpload(req, res);

            expect(getProgressById).toHaveBeenCalledWith('testId');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Upload still being processed. Visit '/status/{uploadId}")
        });

        it('sends a 404 if no record matches id', () => {
            let req = {
                params: {
                    id: 'testId'
                }
            };
            let res = mockRes();

            res.status.mockImplementation(() => res);
            res.setHeader.mockImplementation(() => res);
            getProgressById.mockImplementation(() => null);

            getUpload(req, res);

            expect(getProgressById).toHaveBeenCalledWith('testId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('No upload with upload id: testId')
        });

        it('sends a 200 and upload processed data if processing complete', () => {
            let req = {
                params: {
                    id: 'testId'
                }
            };
            let res = mockRes();
            const uploadData = {
                results: [{value: 'test'}],
                processedRecords: 1,
                failedRecords: 0,
                details: []
            };

            res.status.mockImplementation(() => res);
            res.setHeader.mockImplementation(() => res);
            getProgressById.mockImplementation(() => 100);
            getUploadDataById.mockImplementation(() => uploadData)

            getUpload(req, res);

            expect(getProgressById).toHaveBeenCalledWith('testId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                totalRecords: 1,
                processedRecords: 1,
                failedRecords: 0,
                details: []
            })
        });
    })
})