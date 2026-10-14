// backend/config/env.js — ที่เดียวที่อ่าน process.env
'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const PORT = Number(process.env.PORT) || 4001;

// path สัมพัทธ์นับจาก backend/ ไม่ใช่ cwd — pm2/docker อาจสั่งรันจากโฟลเดอร์อื่น
const LOG_DIR = path.resolve(__dirname, '..', process.env.LOG_DIR || './logs');

module.exports = { PORT, LOG_DIR };
