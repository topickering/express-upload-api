import express from 'express';
import uploadRoutes from './upload.js';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

const app = express();
const port = 3000; 
const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10
});

app.use(express.json());
app.use(uploadLimiter);
app.use('/', uploadRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).send(error.message)
  }
  res.status(500).send(error.message)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});