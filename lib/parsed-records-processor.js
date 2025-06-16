import mockValidateEmail from "./mock-validate-email.js";
import PQueue from "p-queue";
import { updateUploadRecordById } from "./uploadDB.js";

const processingQueue = new PQueue({concurrency: 5})

function initiateProcessing(uploadId, results) {
    results.map((result) => {
        processingQueue.add(async () => {
            const validationResult = await mockValidateEmail(result.email);
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
