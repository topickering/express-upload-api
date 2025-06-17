import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import { getStatus } from './statusController.js';
import { getProgressById } from '../lib/uploadDB.js';

vi.mock('../lib/uploadDB.js')

const mockRes = () => ({
    send: vi.fn(),
    status: vi.fn(),
    setHeader: vi.fn()
});

describe('status controller', () => {
    let req;
    let res;
    
    beforeEach(() => {
        req = {};
        res = mockRes()
    })
    
    afterEach(() => {
        vi.resetAllMocks();
    })
    
    describe('getUpload', () => {
        it('sends a 400 if no id is present', () => {
            let req = {
                params: {}
            };
            let res = mockRes();

            res.status.mockImplementation(() => res);

            getStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Must provide an id')
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

            getStatus(req, res);

            expect(getProgressById).toHaveBeenCalledWith('testId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('No upload with upload id: testId')
        });

        it('sends a 200 and process status', () => {
            let req = {
                params: {
                    id: 'testId'
                }
            };
            let res = mockRes();

            res.status.mockImplementation(() => res);
            res.setHeader.mockImplementation(() => res);
            getProgressById.mockImplementation(() => 75);

            getStatus(req, res);

            expect(getProgressById).toHaveBeenCalledWith('testId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                uploadId: 'testId',
                progress: '75%'
            })
        });
    })
})