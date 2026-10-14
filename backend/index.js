// backend/index.js — bootstrap เท่านั้น: body parser, cors, /health, mount routes, notFoundApi, errorHandler, listen
// โปรเจกต์นี้เป็น API อย่างเดียว ไม่มี frontend
'use strict';

const express = require('express');
const cors = require('cors');
const { PORT, LOG_DIR } = require('./config/env');
const { notFoundApi, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/door', require('./routes/door'));

app.use('/api', notFoundApi);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`I-Dojo door API listening on :${PORT} (logs → ${LOG_DIR})`);
});
