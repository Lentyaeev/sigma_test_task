const hostname = '127.0.0.1';
const port = 3000;


const http = require('http');
const server = http.createServer();

server.on('request', (request, response) => {
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
	  console.log(body);
        response.end();
    });
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});