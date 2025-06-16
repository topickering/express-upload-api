# Express Upload API

A file upload API using Express.js

## Endpoints

`/upload` - handles POST requests uploading a .csv file in the following format:

```
name,email
Example name, example@email.com
```

An example.csv file can be found in [the resources folder](./resources/testData.csv.)

Uploaded files are processed to confirm the validity of emails provided.

The response includes an uploadId.

`upload/{uploadId}` - receives GET requests and will respond with the progress of an upload's processing.

## Running locally

__Requirements__

- Node 20 (recommended to install via nvm)

__Dependencies__

Install dependencies by running `npm install`

- Express.js
- express-rate-limit (to limit requests from one source)
- Multer (for handling uploaded files)
- csv-parser
- pLimit (to limit concurrency on function calls)
- nodemon (to allow hot reloads when developing)

Before running the application create a folder called `/uploads` - multer is configured to upload files to this location. This can be configured in [`/routes/uploadRoutes.js`](./routes/uploadRoutes.js).

Run the application from the command line with `npm run start`

## Testing

The project uses Vitest for testing.

Run tests from the command line with `npm run test`

### Manual testing

In addition the application can be tested using cURL or Postman

Start running the server `npm run start`

For cURL, enter the following in the command line:

```
curl -X POST -F "file=@path-to-application/express-upload-api/resources/testData.csv;type=text/csv" http://localhost:3000/upload
```

The response will include an uploadId. This can be used to check the progress of the file processing.

```
cURL -X GET http://localhost:3000/upload/{uploadId}
```

If using Postman, start the server and make a POST request, making sure to select the form-data option then set the key as 'file' (selecting 'File' not 'Text' from the drop down menu) and uploading a .csv file as the Value.