import http from 'http';
import app from './app.js';
import logger from './lib/logger.js';

const port = 3000; 

app.set('port, port');

const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});