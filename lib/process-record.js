import { updateUploadRecordById } from "./uploadDB.js";
import mockValidateEmail from "./mock-validate-email.js";
import logger from "./logger.js";

async function processRecord(result, uploadId) {
    try {
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
    } catch(err) {
            logger.error(`Error processing result for upload ${uploadId}: ${result.email}`);
            const failedDetails = {
                ...result,
                error: err.msg
            }
            updateUploadRecordById(uploadId, false, failedDetails)
    }
}

export default processRecord
