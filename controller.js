const fs = require('fs');
const csv = require('csv-parser');
const pLimit = require('p-limit');
const mockValidateEmail = require('./mock-validate-email');

const limit = pLimit(5);

async function getUpload(req, res) {
    res.send('POST a csv file to this endpoint, for example with Postman or cURL')
}

async function postUpload(req, res) {
    
    if(!req.file) {
        return res.status(400).send('No file uploaded');
    }

    res.setHeader('Content-Type', 'application/json');

    res.write(JSON.stringify({
        uploadId: '123',
        message: 'File uploaded successfully. Processing started.'
    }))

    const results = []

    const stream = fs
        .createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data)
        })
        .on('end', async () => {
            const totalRecords = results.length;

            const details = [];

            await Promise.all(results.map((result) => limit(async () => {
                const validationResult = await mockValidateEmail(result.email)
                if(!validationResult.valid) {
                    details.push({
                        ...result,
                        error: 'Invalid email format'
                    })
                } 
            })))

            const failedRecords = details.length;

            responseJson = {
                totalRecords,
                processedRecords: totalRecords - failedRecords,
                failedRecords,
                details
            }

            res.status(200).end(JSON.stringify(responseJson))
        })
    
   stream.on('error', (err) => {
    console.error('Stream error:', err)
    fs.unlink(req.file.path, () => {
      res.status(500).send('Error reading file stream.')
    })
  })    
}

module.exports = {
    getUpload,
    postUpload
}