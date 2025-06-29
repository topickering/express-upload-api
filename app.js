import express from 'express';
import uploadRoutes from './routes/uploadRoutes.js';
import statusRoutes from './routes/statusRoutes.js'
import multer from 'multer';
import rateLimit from 'express-rate-limit';

const app = express();

const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Post a csv file with name and email details to '/upload'");
});

// Rate limiter applied to both POST and GET requests on /upload routes. Can be configured further as required
app.use('/upload', uploadLimiter, uploadRoutes);
app.use('/status', statusRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).send(error.message)
  }
  res.status(500).send(error.message)
})

export default app;