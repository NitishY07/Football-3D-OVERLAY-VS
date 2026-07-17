const http = require('http');
const fs = require('fs');
const path = require('path');

const clients = new Set();
let latestState = {}; // Cache the latest text state per match

const server = http.createServer((req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // 1. Server-Sent Events (SSE) Endpoint - No websockets needed!
  if (req.url.startsWith('/events')) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    // Parse matchId from URL ?match=xxx
    const url = new URL(req.url, `http://${req.headers.host}`);
    const matchId = url.searchParams.get('match') || 'default';
    
    const client = { id: Date.now(), res, matchId };
    clients.add(client);
    
    // Push the cached state to new clients instantly
    if (latestState[matchId]) {
      res.write(`data: ${JSON.stringify(latestState[matchId])}\n\n`);
    }

    req.on('close', () => {
      clients.delete(client);
    });
    return;
  }

  // 2. Action Endpoint - Controller POSTs commands here
  if (req.method === 'POST' && req.url === '/action') {
    let body = '';
    // Handle very large payloads for Base64 images
    req.on('data', chunk => { body += chunk.toString(); });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const matchId = data.matchId || 'default';
        
        if (data.type === 'UPDATE_TEXT') {
          latestState[matchId] = data; // Cache state
        }
        
        // Broadcast to all clients in the same match room
        for (const client of clients) {
          if (client.matchId === matchId) {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`);
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  // 3. Static File Server
  let reqPath = req.url.split('?')[0];
  // Strip leading slashes to prevent Linux path.join from treating it as an absolute root path
  let safePath = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
  let filePath = path.join(__dirname, 'public', safePath);
  
  console.log(`[HTTP GET] ${req.url} -> ${filePath}`);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`[ERROR 404] File missing: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`CUSTOM 404: Cannot find ${safePath} inside the public folder.`);
    } else {
      let extname = path.extname(filePath);
      let contentType = 'text/html';
      switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': 
        case '.jpeg': contentType = 'image/jpeg'; break;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`No-Dependency SSE Server running on http://0.0.0.0:${PORT}`);
});
