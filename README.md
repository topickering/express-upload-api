# Express Upload API

A file upload API using Express.js.

The application can handle POST requests uploading a .csv file.  The file is then parsed and processed using a mocked external call.  The status of the processing can be checked.

## Endpoints

`/upload` 
- handles POST requests uploading a .csv file in the following format:

```
name,email
Example name,example@email.com
```

An example.csv file can be found in [the resources folder](./resources/)

POST requests initiate async processing of the parsed csv records.

`/upload/{uploadId}`
- handles GET requests and, if processing is complete, returns data regarding processing.

`status/{uploadId}` 
- handles GET requests and will respond with the progress of an upload's processing.

## Running locally

__Requirements__

- Node 20 (recommended to install via nvm)

__Dependencies__

Clone the repository and install dependencies by running `npm install`

- Express.js
- express-rate-limit (to limit requests from one source)
- Multer (for handling uploaded files)
- csv-parser
- p-queue (to limit concurrent requests on email validation call)
- nodemon (to allow hot reloads when developing)
- winston (for logging)
- supertest (for integration tests)

Run the application from the command line with `npm run start`

### Concurrency

The application uses p-queue to manage concurrent calls to the mock email validation service.  This sets a concurrency limit across the application.  If a limit per upload / request were preferred then an alternative concurrency manager such as p-limit could be used.

### Rate limit

Calls to the `/upload` endpoints are limited to 10 calls per minute per IP address.

### Upload

The application uses Multer to manage uploads.  The destination, naming of uploads and file size limits can be configured in [`/routes/uploadRoutes.js`](./routes/uploadRoutes.js).  Multer is currently configured to upload files to the `/uploads` directory.

## Testing

The project uses Vitest for testing.

Run unit tests from the command line with `npm run test`

### Integration tests

Integration tests use Supertest and are found in [`/routes/routes.spec.js`](./routes/routes.spec.js). Test uploads are saved in the [`/routes/uploads`](./routes/uploads) directory and deleted following the tests being run.  In production a separate test configuration might be used, with the destination for uploads being an environment variable.  

These tests can be run in the command line by calling `npm run test:integration`.

### Manual testing

In addition the application can be tested using cURL or Postman

Start running the server `npm run start`

For cURL, enter the following in the command line:
```
curl -X POST -F "file=@path-to-application/express-upload-api/resources/testData.csv;type=text/csv" http://localhost:3000/upload
```

The response will include an uploadId. This can be used to check the progress of the file processing (to simulate manually either use a large csv file or increase the timeout in the [mock email validator](`/lib/mock-validate-email.js`)):
```
cURL -X GET http://localhost:3000/status/{uploadId}
```

To see upload details once processing is complete:
```
cURL -X GET http://localhost:3000/upload/{uploadId}
```

If using Postman, start the server and make a POST request, making sure to select the form-data option then set the key as 'file' (selecting 'File' not 'Text' from the drop down menu) and uploading a .csv file as the Value.

