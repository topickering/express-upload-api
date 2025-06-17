import { describe, it, expect, vi, afterEach } from 'vitest';
import processRecord from './process-record.js';
import mockValidateEmail from './mock-validate-email.js';
import { updateUploadRecordById } from './uploadDB';

vi.mock('./mock-validate-email.js');
vi.mock('./uploadDB.js')

describe('processRecord', () => {
    afterEach(() => {
        vi.resetAllMocks();
    })
    
    it('calls mockValidateEmail and updates the DB if email is valid', async () => {
        mockValidateEmail.mockResolvedValue({valid: true})
        await processRecord({email: 'valid@email.com'}, 'testId1')
        expect(mockValidateEmail).toHaveBeenCalledWith('valid@email.com')
        expect(updateUploadRecordById).toHaveBeenCalledWith('testId1', true)
    }
    )

    it('calls mockValidateEmail and updates the DB if email is invalid', async () => {
        mockValidateEmail.mockResolvedValue({valid: false})
        const result = {
            email: 'invalidemail'
        }
        const failedDetails = {
            ...result,
            error: 'Invalid email format'
        }
        await processRecord(result, 'testId2')
        expect(mockValidateEmail).toHaveBeenCalledWith('invalidemail')
        expect(updateUploadRecordById).toHaveBeenCalledWith('testId2', false, failedDetails)
    }
    )
})