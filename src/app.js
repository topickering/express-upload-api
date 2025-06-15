const express = require('express');
const multer = require('multer');
const routes = require('./routes')
const app = express();
const port = 3000; 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
.use('/', routes);