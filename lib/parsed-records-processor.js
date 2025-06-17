import PQueue from "p-queue";
import logger from "./logger.js";
import processRecord from "./process-record.js";

const processingQueue = new PQueue({concurrency: 5})

function initiateProcessing(uploadId, results) {
    logger.info(`Initiating processing for uploadId: ${uploadId}`)
    
    results.map((result) => {
        processingQueue.add(async () => processRecord(result, uploadId));
    })
}

export default initiateProcessing;
