import { describe, it, expect, vi } from 'vitest';
import parseCSV from "./parse-csv.js";
import fs from 'fs';
import { PassThrough } from 'stream';

vi.mock('fs');
const pipe = vi.fn()

describe('parseCSV', () => {
    it('resolves with parsed results if successful', async () => {
        const mockReadable = new PassThrough();
        fs.createReadStream.mockReturnValue({ pipe });
        pipe.mockReturnValue(mockReadable);

        const success = parseCSV({filename: 'testfile'})

        mockReadable.emit('data', {test: 'test'})
        mockReadable.emit('end')

        await expect(success).resolves.toEqual([{test: 'test'}])
    })

    it('rejects with an error if parsing not successful', async () => {
        const mockReadable = new PassThrough();
        fs.createReadStream.mockReturnValue({ pipe });
        pipe.mockReturnValue(mockReadable);

        const failure = parseCSV({filename: 'testfile'})

        const mockError = new Error('test error')

        mockReadable.emit('error', mockError)

        await expect(failure).rejects.toEqual(mockError)
    })
})