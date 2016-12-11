const path = require('path');
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  // Handle GET requests to /
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'client', 'index.html'), (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 504;
        res.end();
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  }

  // Handle GET requests for app.js
  else if (req.url === '/app.js' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'client', 'app.js'), (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 504;
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(data);
      }
    });
  }

  // Handle GET requests for styles.css
  else if (req.url === '/styles.css' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'client', 'styles.css'), (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 504;
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  }

  // Handle GET and POST requests to /messages
  else if (req.url === '/messages') {
    if (req.method === 'GET') {
      fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
        if (err) {
          console.error(err);
          res.statusCode = 504;
          res.end();
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        }
      });
    }

    else if (req.method === 'POST') {
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        // TODO: Write to file
        console.log('post', JSON.parse(body));
        res.statusCode = 200;
        res.end();
      }).on('error', (err) => {
        console.log(err);
        res.statusCode = 504;
        res.end();
      });
    }
  }

  else {
    res.end(404);
  }
});

server.listen(3000, () => console.log('listening on port 3000.'));
