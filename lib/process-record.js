import { updateUploadRecordById } from "./uploadDB.js";
import mockValidateEmail from "./mock-validate-email.js";
import logger from "./logger.js";

async function processRecord(result, uploadId) {
    const validationResult = await mockValidateEmail(result.email);
            logger.info(`Validated email: ${result.email}. Is valid: ${validationResult.valid}`)
            if (validationResult.valid) {
                updateUploadRecordById(uploadId, true)
            } else {
                const failedDetails = {
                    ...result,
                    error: 'Invalid email format'
                }
                updateUploadRecordById(uploadId, false, failedDetails)
            }
}

export default processRecord
