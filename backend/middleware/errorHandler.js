// backend/middleware/errorHandler.js — AppError, wrap, errorHandler, notFoundApi
'use strict';

class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// ส่ง error ของ async handler เข้า next — ไม่ได้ส่ง response ให้
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notFoundApi = (req, res) => res.status(404).json({ error: 'ไม่พบ API นี้' });

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // อุปกรณ์ประตูอ่านได้แค่ "1"/"0" — error ใด ๆ บนเส้นนี้ (รวม body พัง) ต้องตอบ "0" ไม่ใช่ JSON
  if (req.originalUrl.startsWith('/api/door')) {
    if (err.type !== 'entity.parse.failed') console.error(err);
    return res.status(200).type('text/plain').send('0');
  }
  if (err instanceof AppError) return res.status(err.status).json({ error: err.message });
  // body JSON พัง (express.json parse ไม่ผ่าน)
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' });
  console.error(err);
  res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในระบบ' });
}

module.exports = { AppError, wrap, notFoundApi, errorHandler };
