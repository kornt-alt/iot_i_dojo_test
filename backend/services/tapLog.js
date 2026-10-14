// backend/services/tapLog.js — บันทึกการแตะบัตรเป็น JSONL วันละไฟล์ (logs/door-YYYY-MM-DD.jsonl)
'use strict';

const fs = require('fs');
const path = require('path');
const { LOG_DIR } = require('../config/env');

// เวลาไทย 'YYYY-MM-DD HH:mm:ss' — sv-SE ให้รูปแบบนี้พอดี
const bangkokFmt = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false,
});

let dirReady = null;
function ensureDir() {
  if (!dirReady) dirReady = fs.promises.mkdir(LOG_DIR, { recursive: true }).catch((e) => { dirReady = null; throw e; });
  return dirReady;
}

// ใช้เวลาฝั่ง server เสมอ ไม่เชื่อนาฬิกาอุปกรณ์
// ⚠️ ห้าม throw — log พังต้องไม่ทำให้ประตูไม่ตอบ
async function appendTap({ name, card, result, empNo, at = new Date() }) {
  const localTime = bangkokFmt.format(at);
  const entry = { time: at.toISOString(), localTime, name, card, result };
  if (empNo) entry.empNo = empNo;
  // แยกไฟล์ตามวันที่ไทย ไม่ใช่ UTC — ไม่งั้นช่วง 00:00–07:00 จะไปลงไฟล์เมื่อวาน
  const file = path.join(LOG_DIR, `door-${localTime.slice(0, 10)}.jsonl`);
  try {
    await ensureDir();
    await fs.promises.appendFile(file, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    console.error('[tapLog] write failed:', err.message, entry);
  }
  return entry;
}

module.exports = { appendTap };
