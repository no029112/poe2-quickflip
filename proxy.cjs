// CommonJS Local CORS proxy for poe2scout.com/api
// Run: npm install && node proxy.cjs (default: http://localhost:8787/api)

const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

// poe2scout.com itself is now a React Router site with no API behind /api;
// the real API lives on the api.* subdomain and takes paths with no /api prefix.
const TARGET = 'https://api.poe2scout.com';
const PORT = process.env.PORT || 8787;

const app = express();
app.use(morgan('dev'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy /api/* -> api.poe2scout.com/*
app.use('/api', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// Proxy the official PoE trade API separately from the poe2scout API.
// The frontend uses /trade-api/api/... so the two upstreams cannot collide.
app.use('/trade-api', createProxyMiddleware({
  target: 'https://www.pathofexile.com',
  changeOrigin: true,
  headers: {
    'user-agent': 'poe2-quickflip-vscode/0.1 (local dashboard)'
  },
  onProxyRes: function (proxyRes) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

app.listen(PORT, () => console.log(`Local CORS proxy on http://localhost:${PORT}/ (API at /api)`));
