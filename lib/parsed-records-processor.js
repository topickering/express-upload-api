import mockValidateEmail from "./mock-validate-email.js";
import PQueue from "p-queue";
import { updateUploadRecordById } from "./uploadDB.js";
import logger from "./logger.js";

const processingQueue = new PQueue({concurrency: 5})

function initiateProcessing(uploadId, results) {
    logger.info(`Initiating processing for uploadId: ${uploadId}`)
    
    results.map((result) => {
        processingQueue.add(async () => {
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
        })
    })
}

export default initiateProcessing;
