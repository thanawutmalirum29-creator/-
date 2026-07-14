/* ===============================
   กราฟย้อนหลัง (Historical Dashboard Charts)
   วาดแนวโน้มคลัง/ความสุข/อาหาร/ประชากรย้อนหลังด้วย <canvas> ธรรมดา
   ไม่ใช้ไลบรารีภายนอก เพื่อลด dependency
   =============================== */

// นิยามมาตรวัดที่กราฟรองรับ: label ที่แสดง, สี, และฟังก์ชัน format ตัวเลข
const HISTORY_METRICS = {
  treasury:   { label: "💰 คลังเมือง",   color: "#f5a623", format: v => Math.round(v).toLocaleString() + " บาท" },
  happiness:  { label: "😊 ความสุข",     color: "#4caf7d", format: v => Math.round(v) + "%" },
  foodStock:  { label: "🍽️ อาหาร",       color: "#3b82c4", format: v => Math.round(v).toLocaleString() + " มื้อ" },
  population: { label: "👨‍👩‍👧‍👦 ประชากร", color: "#a86bd6", format: v => Math.round(v).toLocaleString() + " คน" }
};

let currentChartMetric = "treasury";

// เรียกทุกเดือนจาก nextMonth() เพื่อบันทึกค่าสำคัญของเดือนนั้นลงประวัติ
function recordHistorySnapshot() {
  if (typeof historyLog === "undefined") return;

  historyLog.push({
    month: monthCount,
    year: yearCount,
    treasury: treasury,
    happiness: happiness,
    foodStock: foodStock,
    population: citizens.length
  });

  // จำกัดความยาว เก็บแค่ HISTORY_LOG_MAX เดือนล่าสุด
  const maxLen = (typeof HISTORY_LOG_MAX !== "undefined") ? HISTORY_LOG_MAX : 36;
  while (historyLog.length > maxLen) {
    historyLog.shift();
  }
}

// เปิด modal แสดงกราฟย้อนหลัง พร้อมปุ่มสลับดูแต่ละมาตรวัด
function openHistoryChart(metric) {
  if (typeof modalLevel !== "undefined") modalLevel = null;
  currentChartMetric = metric || currentChartMetric || "treasury";

  const buttonsHtml = Object.keys(HISTORY_METRICS).map(key => {
    const m = HISTORY_METRICS[key];
    const activeClass = key === currentChartMetric ? "chart-metric-active" : "";
    return `<button class="chart-metric-btn ${activeClass}" onclick="openHistoryChart('${key}')">${m.label}</button>`;
  }).join("");

  const html = `
    <h2>📈 กราฟย้อนหลัง</h2>
    <p class="chart-sub-desc">แนวโน้มค่าสำคัญของเมือง ย้อนหลังสูงสุด ${(typeof HISTORY_LOG_MAX !== "undefined" ? HISTORY_LOG_MAX : 36)} เดือนล่าสุด</p>
    <div class="chart-metric-row">${buttonsHtml}</div>
    <canvas id="historyChartCanvas" width="380" height="220"></canvas>
    <div id="historyChartInfo" class="chart-info-text"></div>
  `;

  showModal(html);
  // ต้องรอให้ canvas ถูกแนบเข้า DOM ก่อนจึงวาดได้ (showModal เป็น sync แต่กันไว้ด้วย rAF ให้ชัวร์)
  requestAnimationFrame(() => drawHistoryChart(currentChartMetric));
}

// วาดกราฟเส้นด้วย canvas 2D context
function drawHistoryChart(metricKey) {
  const canvas = document.getElementById("historyChartCanvas");
  const infoEl = document.getElementById("historyChartInfo");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const metric = HISTORY_METRICS[metricKey];
  const data = (typeof historyLog !== "undefined") ? historyLog : [];

  // ยังไม่มีข้อมูลพอ (ต้องกดเดือนถัดไปอย่างน้อย 2 ครั้งถึงจะลากเส้นได้)
  if (data.length < 2) {
    if (infoEl) infoEl.textContent = "⏳ ข้อมูลยังไม่พอสำหรับวาดกราฟ (ต้องกด \"เดือนถัดไป\" อย่างน้อย 2 ครั้ง)";
    ctx.fillStyle = "#8892a6";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ยังไม่มีข้อมูลย้อนหลังเพียงพอ", w / 2, h / 2);
    return;
  }

  const padding = { top: 16, right: 16, bottom: 26, left: 50 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const values = data.map(d => d[metricKey]);
  let minV = Math.min(...values);
  let maxV = Math.max(...values);
  if (minV === maxV) { minV -= 1; maxV += 1; }
  const rangePad = (maxV - minV) * 0.12;
  minV -= rangePad;
  maxV += rangePad;

  // เส้นกริดแนวนอน + ป้ายตัวเลขด้านซ้าย
  const gridCount = 4;
  ctx.strokeStyle = "rgba(140,150,170,0.25)";
  ctx.fillStyle = "#8892a6";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "right";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridCount; i++) {
    const y = padding.top + (plotH * i) / gridCount;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    const val = maxV - ((maxV - minV) * i) / gridCount;
    ctx.fillText(formatShortNumber(val), padding.left - 6, y + 3);
  }

  const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;
  const xOf = i => padding.left + i * stepX;
  const yOf = v => padding.top + plotH - ((v - minV) / (maxV - minV)) * plotH;

  // พื้นที่ใต้เส้น (area fill) โทนสีจางๆ ตามมาตรวัด
  ctx.beginPath();
  data.forEach((d, i) => {
    const x = xOf(i), y = yOf(d[metricKey]);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.lineTo(xOf(data.length - 1), padding.top + plotH);
  ctx.lineTo(xOf(0), padding.top + plotH);
  ctx.closePath();
  ctx.fillStyle = metric.color + "26"; // ~15% opacity
  ctx.fill();

  // เส้นกราฟหลัก
  ctx.beginPath();
  ctx.strokeStyle = metric.color;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  data.forEach((d, i) => {
    const x = xOf(i), y = yOf(d[metricKey]);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // จุดข้อมูลแต่ละเดือน (จุดสุดท้ายใหญ่กว่าเพื่อเน้นค่าปัจจุบัน)
  ctx.fillStyle = metric.color;
  data.forEach((d, i) => {
    const x = xOf(i), y = yOf(d[metricKey]);
    ctx.beginPath();
    ctx.arc(x, y, i === data.length - 1 ? 3.5 : 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  // ป้ายแกน X: เดือน/ปี ของจุดแรก กลาง และล่าสุด
  ctx.fillStyle = "#8892a6";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  const labelIdxs = Array.from(new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]));
  labelIdxs.forEach(i => {
    const d = data[i];
    ctx.fillText(`${d.month}/${d.year}`, xOf(i), h - 8);
  });

  // สรุปผลด้านล่างกราฟ: ค่าล่าสุด + เปลี่ยนแปลงตลอดช่วงที่แสดง
  const first = data[0];
  const last = data[data.length - 1];
  const diff = last[metricKey] - first[metricKey];
  const trendIcon = diff > 0 ? "📈 เพิ่มขึ้น" : diff < 0 ? "📉 ลดลง" : "➖ คงที่";
  if (infoEl) {
    infoEl.innerHTML = `มาตรวัด: <b>${metric.label}</b> | ค่าล่าสุด: <b>${metric.format(last[metricKey])}</b><br>${trendIcon} ${metric.format(Math.abs(diff))} จากเมื่อ ${data.length} เดือนก่อน`;
  }
}

// ย่อตัวเลขให้อ่านง่ายบนแกนกราฟ เช่น 1200000 -> 1.2M, 4500 -> 5K
function formatShortNumber(v) {
  const abs = Math.abs(v);
  if (abs >= 1000000) return (v / 1000000).toFixed(1) + "M";
  if (abs >= 1000) return (v / 1000).toFixed(0) + "K";
  return Math.round(v).toString();
}
