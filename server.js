import http from 'http';
import app from './app.js';

const port = 3000; 

app.set('port, port');

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});