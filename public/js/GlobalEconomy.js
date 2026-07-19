const economies = ["Boom", "Stable", "Recession"];
let currentEconomy = "Stable";

function _economyLabel(e) {
  return e === "Boom" ? "🚀 เฟื่องฟู (รายได้ +25%)"
       : e === "Recession" ? "📉 ถดถอย (รายได้ -22%)"
       : "➖ ทรงตัว";
}

// 🔮 พยากรณ์เศรษฐกิจปีถัดไปล่วงหน้า 2 เดือน (เรียกตอนเดือนที่ 10) ให้ผู้เล่นมีเวลาเตรียมงบ/ตัดสินใจ
// ก่อนของจริงจะมาถึงตอนขึ้นปีใหม่ — เดิมเศรษฐกิจเปลี่ยนแบบไม่มีสัญญาณเตือนล่วงหน้าใดๆ เลย
function announceEconomyForecast() {
  if (upcomingEconomy) return; // พยากรณ์ไปแล้วในปีนี้ ไม่ต้องสุ่มซ้ำ
  upcomingEconomy = economies[Math.floor(Math.random() * economies.length)];
  toast(`🌍 พยากรณ์เศรษฐกิจปีหน้า: ${_economyLabel(upcomingEconomy)}`, upcomingEconomy === "Recession" ? "warning" : "success");
}

// ใช้ผลพยากรณ์จริงตอนขึ้นปีใหม่ ถ้าไม่เคยพยากรณ์ไว้ก่อน (เช่นเซฟเก่าก่อนอัปเดต หรือปีแรกสุดของเกม
// ที่ยังไม่ทันถึงเดือนที่ 10) จะสุ่มสดตอนนั้นเลยแทนเพื่อไม่ให้ระบบค้าง
function updateGlobalEconomy(year) {
  currentEconomy = upcomingEconomy || economies[Math.floor(Math.random() * economies.length)];
  upcomingEconomy = null;
  toast(`🌍 สถานะเศรษฐกิจโลกปีนี้: ${_economyLabel(currentEconomy)}`, currentEconomy === "Recession" ? "warning" : "success");
}

function applyEconomyEffect(income) {
  switch (currentEconomy) {
    case "Boom": return Math.floor(income * 1.25);
    case "Recession": return Math.floor(income * 0.78);
    default: return income;
  }
}
