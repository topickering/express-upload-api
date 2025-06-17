import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import { getUpload, postUpload } from './uploadController.js';

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
            expect(res.send).toHaveBeenCalled('No file uploaded')
        });

        


    })
})