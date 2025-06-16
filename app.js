import express from 'express';
import uploadRoutes from './routes/uploadRoutes.js';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

const app = express();

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

export default app;