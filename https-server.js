const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.crt')),
};

const PORT = 3000;
const HOST = '0.0.0.0'; // Allows connections from other devices on the network

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, HOST, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${PORT}`);
    console.log(`> Ready on https://${require('os').networkInterfaces()['Ethernet']?.[1]?.address || '192.168.66.96'}:${PORT}`);
  });
});
