import { afterEach, describe, it, expect, vi } from 'vitest';
import { getUpload, postUpload } from './controller.js';

const mockRes = () => ({
    send: vi.fn().mockImplementation((x) => x),
    status: vi.fn().mockImplementation((x) => x),
    setHeader: vi.fn().mockImplementation((x) => x)
});

describe('upload controller', () => {
    afterEach(() => {
        vi.resetAllMocks();
    })
    
    // describe('getUpload', () => {
    //     it('sends something back', async () => {
    //         let req = {};
    //         let res = mockRes();
    //         await getUpload(req, res);

    //         expect(res.status).toHaveBeenCalledWith(200);
    //     })
    // })

    describe('postUpload', () => {
        it('sends a 400 if no file is posted', async () => {
            let req = {};
            let res = mockRes();
            await postUpload(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalled('No file uploaded')
        })
    })
})