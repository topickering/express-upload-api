import { getProgressById } from '../lib/uploadDB.js';


function getStatus(req, res) {
    const { id } = req.params;

    if(!id) return res.status(400).send('Must provide an id');

    const progress = getProgressById(id)

    const responseJson = {
        uploadId: id,
        progress
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(responseJson);
} 

export { getStatus };