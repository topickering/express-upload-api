import express from 'express';
import { getStatus } from '../controllers/statusController.js';

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
    res.send("Check the progress of upload processing at '/status/{id}'");
});

router.get('/:id', getStatus)

export default router;