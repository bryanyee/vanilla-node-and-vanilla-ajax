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
        res.end(data);  // data is a buffer object. data.toString() returns the stringified html content
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

  // Handle GET requests to /messages
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

    // Handle POST requests to /messages
    else if (req.method === 'POST') {
      // 1. Concatenate and stringify buffer data
      const body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        const item = JSON.parse(Buffer.concat(body).toString());
        console.log('POST', item);

        // 2. Read from the data.json file
        fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
          if (err) {
            console.error(err);
            res.statusCode = 504;
            res.end();
          } else {
            // 3. Add the new item to the list
            let list = JSON.parse(data.toString());
            list.push(item);
            list = JSON.stringify(list, null, 2);

            // 4. Write the new list into data.json
            fs.writeFile(path.join(__dirname, 'data.json'), list, (err) => {
              if (err) {
                console.error(err);
                res.statusCode = 504;
                res.end();
              } else {
                console.log('file written.')
                res.statusCode = 200;
                res.end();
              }
            });
          }
        })
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
