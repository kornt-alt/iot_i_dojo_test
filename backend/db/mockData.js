// backend/db/mockData.js — บัตรตัวอย่างช่วง mockup (ยังไม่ต่อ DB)
// ⚠️ ตอนรวมเข้า I_DOJO_PORTAL ให้เปลี่ยนไปเช็คกับ Employee.rfid แทนไฟล์นี้
// เลขบัตร 10 หลักเป๊ะ เลข 0 นำหน้ามีความหมาย (BR-20)
'use strict';

const MOCK_CARDS = [
  { card: '0012345678', empNo: 'A1234', empName: 'Mock Employee 1' },
  { card: '0098765432', empNo: '123B4', empName: 'Mock Employee 2' },
  { card: '1234567890', empNo: 'B5678', empName: 'Mock Employee 3' },
  { card: '9900000001', empNo: 'C0001', empName: 'Mock Employee 4' },
  { card: '9900000002', empNo: 'C0002', empName: 'Mock Employee 5' },
];

module.exports = { MOCK_CARDS };
