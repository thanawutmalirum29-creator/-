const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// gzip compression สำหรับไฟล์ static ทั้งหมด (ช่วยลดเวลาโหลดหน้าแรกที่มี JS ~20 ไฟล์)
app.use(compression());

// Health check endpoint สำหรับ Railway ใช้เช็คว่า service พร้อมรับ traffic
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// เสิร์ฟไฟล์เกมทั้งหมด (HTML, CSS, JS) จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// เส้นทางสำรอง: ถ้า path มีนามสกุลไฟล์ (เช่น .js, .css, .png) แสดงว่าเป็น asset request
// ที่ static middleware หาไม่เจอ -> ส่ง 404 จริง เพื่อให้ debug ง่าย
// ถ้าไม่มีนามสกุลไฟล์ ถือว่าเป็นการ navigate หน้าเว็บ (SPA) -> ส่ง index.html
app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🏛️  City Government Sim server running on port ${PORT}`);
});
