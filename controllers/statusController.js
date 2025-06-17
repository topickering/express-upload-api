import { getProgressById } from '../lib/uploadDB.js';


function getStatus(req, res) {
    const { id } = req.params;

    if(!id) return res.status(400).send('Must provide an id');

    const progress = getProgressById(id);

    if (!progress) return res.status(404).send(`No upload with upload id: ${id}`);

    const responseJson = {
        uploadId: id,
        progress: progress + '%'
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(responseJson);
} 

export { getStatus };