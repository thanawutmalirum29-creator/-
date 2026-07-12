# 🏛️ City Government Sim — Server Edition

เกมจำลองการบริหารเมือง แปลงจากเว็บไฟล์ static ให้กลายเป็นระบบเซิร์ฟเวอร์ (Node.js + Express)
พร้อมสำหรับอัปโหลดขึ้น **GitHub** และดีพลอยขึ้น **Railway**

## 📁 โครงสร้างโปรเจกต์

```
.
├── public/              ← ไฟล์เกมทั้งหมด (HTML/CSS/JS เดิม)
│   ├── index.html
│   ├── style-city-light.css
│   ├── style-city-dark.css
│   └── js/...
├── server.js            ← เว็บเซิร์ฟเวอร์ Express
├── package.json
├── railway.json         ← ตั้งค่าการดีพลอยของ Railway
├── Procfile
└── .gitignore
```

เกมยังทำงานแบบเดิมทุกอย่าง (เซฟเกมใช้ `localStorage` ในเบราว์เซอร์ผู้เล่นเหมือนเดิม) เพียงแต่ตอนนี้ไฟล์ถูกเสิร์ฟผ่านเซิร์ฟเวอร์ Node.js แทนการเปิดไฟล์ตรง ๆ ทำให้นำไปรันบน Railway ได้

## 🚀 ทดสอบรันในเครื่องตัวเอง

ต้องมี Node.js ติดตั้งไว้ก่อน (เวอร์ชัน 18 ขึ้นไป)

```bash
npm install
npm start
```

จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## 📤 ขั้นตอนที่ 1: อัปโหลดขึ้น GitHub

1. สร้าง repository ใหม่บน GitHub (เช่น `city-government-sim`)
2. รัน `npm install` ในโฟลเดอร์นี้ก่อน (ยังไม่เคยรัน จะได้ `package-lock.json` และโฟลเดอร์ `node_modules` — ตัวหลังถูก ignore ไว้แล้วใน `.gitignore` ไม่ต้องกังวล)
3. รันคำสั่ง:

```bash
git init
git add .
git commit -m "Initial commit: city government sim server"
git branch -M main
git remote add origin https://github.com/<ชื่อผู้ใช้ของคุณ>/city-government-sim.git
git push -u origin main
```

## 🚂 ขั้นตอนที่ 2: ดีพลอยบน Railway

**วิธีที่ง่ายที่สุด (แนะนำ):**

1. ไปที่ [railway.app](https://railway.app) แล้วล็อกอินด้วย GitHub
2. กด **New Project** → **Deploy from GitHub repo**
3. เลือก repository `city-government-sim` ที่เพิ่ง push ไป
4. Railway จะตรวจพบ `package.json` และ build ให้อัตโนมัติ (ใช้ Nixpacks)
5. รอสักครู่ Railway จะรัน `npm install` และ `npm start` ให้เอง
6. เมื่อ deploy เสร็จ ไปที่แท็บ **Settings → Networking → Generate Domain** เพื่อรับลิงก์สาธารณะ

ไม่ต้องตั้งค่า Environment Variable ใด ๆ เพิ่มเติม — เซิร์ฟเวอร์อ่านค่าพอร์ตจาก `process.env.PORT` ที่ Railway กำหนดให้อัตโนมัติอยู่แล้ว

**หมายเหตุ:** ทุกครั้งที่ push โค้ดใหม่ขึ้น branch `main` บน GitHub, Railway จะดีพลอยเวอร์ชันใหม่ให้อัตโนมัติ (auto-deploy)

## 🛠️ หมายเหตุทางเทคนิค

- `/health` endpoint คืน `200 { status: 'ok' }` — ใช้ให้ Railway เช็คว่า service พร้อมรับ traffic
- เปิดใช้ `compression` middleware (gzip) สำหรับไฟล์ static ทั้งหมด
- Catch-all route ตอนนี้แยกแยะ asset request (มีนามสกุลไฟล์) กับการ navigate หน้าเว็บ — asset ที่หาไม่เจอจะได้ `404` จริง ส่วน path อื่นจะ fallback ไป `index.html` ตามปกติของ SPA
- ไฟล์ `taxRate.js` (0 bytes, ไม่ถูกอ้างอิงที่ไหน) ถูกลบออกแล้ว
- ไฟล์ CSS/JS ที่เคยตั้งชื่อเป็นภาษาไทยมีช่องว่าง เปลี่ยนเป็น `style-city-light.css`, `style-city-dark.css`, `scriptCity.js` แล้ว เพื่อความเข้ากันได้กับทุกระบบ
