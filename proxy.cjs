// CommonJS Local CORS proxy for poe2scout.com/api
// Run: npm install && node proxy.cjs (default: http://localhost:8787/api)

const express = require('express');
const morgan = require('morgan');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const TARGET = 'https://poe2scout.com/api';
const PORT = process.env.PORT || 8787;

const app = express();
app.use(morgan('dev'));

// Basic CORS for local dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Proxy /api/* -> poe2scout.com/api/*
app.use('/api', async (req, res) => {
  const url = TARGET + req.url;
  const init = {
    method: req.method,
    headers: Object.fromEntries(Object.entries(req.headers).filter(([k]) => !/^host$|^origin$|^referer$|^connection$|^accept-encoding$/i.test(k)))
  };
  try {
    const r = await fetch(url, init);
    res.status(r.status);
    for (const [k, v] of r.headers.entries()) {
      if (!/^content-encoding$|^transfer-encoding$|^connection$/i.test(k)) res.setHeader(k, v);
    }
    const buf = await r.arrayBuffer();
    res.end(Buffer.from(buf));
  } catch (err) {
    res.status(502).json({ error: 'Bad gateway', detail: String(err) });
  }
});

app.listen(PORT, () => console.log(`Local CORS proxy on http://localhost:${PORT}/api -> ${TARGET}`));
