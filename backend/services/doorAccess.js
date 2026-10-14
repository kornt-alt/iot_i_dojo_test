// backend/services/doorAccess.js — ตรวจบัตร (pure) ⚠️ ส่วนนี้จะย้ายไป I_DOJO_PORTAL ตอนรวม
'use strict';

const { MOCK_CARDS } = require('../db/mockData');

// กฎเดียวกับ normalizeRfid ของ portal (server/src/domain/auth/normalize.ts)
// ต้อง 10 หลักเป๊ะ ไม่ pad — เลข 0 นำหน้ามีความหมาย
function normalizeCard(raw) {
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  const v = String(raw).trim();
  return /^\d{10}$/.test(v) ? v : null;
}

function normalizeName(raw) {
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  const v = String(raw).trim();
  return v && v.length <= 64 ? v : null;
}

const byCard = new Map(MOCK_CARDS.map((c) => [c.card, c]));

// คืน { result: 'OK' | 'NOT_FOUND' | 'INVALID', employee? }
function checkCard(rawName, rawCard) {
  const name = normalizeName(rawName);
  const card = normalizeCard(rawCard);
  if (!name || !card) return { result: 'INVALID', name, card };
  const employee = byCard.get(card);
  return employee ? { result: 'OK', name, card, employee } : { result: 'NOT_FOUND', name, card };
}

module.exports = { normalizeCard, normalizeName, checkCard };
