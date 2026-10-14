// backend/routes/door.js — อุปกรณ์ประตูส่ง Name + CARD มา → ตอบ text ล้วน "1" (เจอบัตร) / "0" (ไม่เจอ)
//   GET  /api/door?name=DOOR-01&card=0012345678
//   POST /api/door  { "name": "DOOR-01", "card": "0012345678" }  (JSON หรือ form)
// ตอบ HTTP 200 เสมอแม้ข้อมูลผิด — firmware แค่อ่าน body ตัวเดียว
'use strict';

const express = require('express');
const { wrap } = require('../middleware/errorHandler');
const { checkCard } = require('../services/doorAccess');
const { appendTap } = require('../services/tapLog');

const router = express.Router();

// firmware อาจส่งชื่อ key ตัวเล็ก/ตัวใหญ่ไม่ตรงกัน (name/Name/NAME, card/CARD)
function pick(src, key) {
  if (!src) return undefined;
  const hit = Object.keys(src).find((k) => k.toLowerCase() === key);
  return hit === undefined ? undefined : src[hit];
}

const handleTap = wrap(async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const rawName = pick(body, 'name') ?? pick(req.query, 'name');
  const rawCard = pick(body, 'card') ?? pick(req.query, 'card');

  const { result, name, card, employee } = checkCard(rawName, rawCard);
  await appendTap({
    name: name ?? (rawName == null ? null : String(rawName).slice(0, 64)),
    card: card ?? (rawCard == null ? null : String(rawCard).slice(0, 32)),
    result,
    empNo: employee && employee.empNo,
  });

  res.type('text/plain').send(result === 'OK' ? '1' : '0');
});

router.get('/', handleTap);
router.post('/', handleTap);

module.exports = router;
