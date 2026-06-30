#!/usr/bin/env node
/* eslint-disable */
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const handler = require('serve-handler');

const DEFAULT_PORT = 4747;
const MAX_PORT_ATTEMPTS = 20;

const outDir = path.join(__dirname, '..', 'out');

if (!fs.existsSync(outDir)) {
  console.error('shadow-clone: static export not found at ' + outDir);
  console.error('If you installed from source, run `npm run build` first.');
  process.exit(1);
}

const args = process.argv.slice(2);
const noOpen = args.includes('--no-open');
const portArg = args.find((a) => a.startsWith('--port='));
const requestedPort = portArg ? Number(portArg.split('=')[1]) : DEFAULT_PORT;

if (Number.isNaN(requestedPort) || requestedPort <= 0) {
  console.error('shadow-clone: --port must be a positive integer');
  process.exit(1);
}

const server = http.createServer((req, res) =>
  handler(req, res, {
    public: outDir,
    directoryListing: false,
  })
);

const tryListen = (port, attemptsLeft) => {
  server.once('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      tryListen(port + 1, attemptsLeft - 1);
      return;
    }
    console.error('shadow-clone: failed to start server:', err.message);
    process.exit(1);
  });
  server.listen(port, '127.0.0.1', async () => {
    const url = 'http://localhost:' + port;
    console.log('Shadow Clone is running at ' + url);
    console.log('Press Ctrl+C to stop.');
    if (!noOpen) {
      try {
        const mod = await import('open');
        await mod.default(url);
      } catch (e) {
        console.warn('shadow-clone: could not open browser automatically. Open ' + url + ' manually.');
      }
    }
  });
};

tryListen(requestedPort, MAX_PORT_ATTEMPTS);

const shutdown = () => {
  console.log('\nShutting down...');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
