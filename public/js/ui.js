/* ===============================
   UI เสริม: แถบสถานะลอย, ค้นหากระทรวง, ปุ่มลอยด่วน
   ไม่แตะ logic เกมเดิม อ่านค่าตัวแปร global เท่านั้น
   =============================== */

// ---------- แถบสถานะลอยด้านบน ----------
function updateStatusBar() {
  try {
    const dateEl = document.getElementById("stat_date");
    const treasuryEl = document.getElementById("stat_treasury");
    const happinessEl = document.getElementById("stat_happiness");
    const foodEl = document.getElementById("stat_food");
    const popEl = document.getElementById("stat_population");
    const debtEl = document.getElementById("stat_debt");
    if (!dateEl) return;

    if (typeof monthCount !== "undefined") {
      const seasonText = (typeof currentSeasonName !== "undefined" && currentSeasonName) ? ` (${currentSeasonName})` : "";
      dateEl.textContent = `📅 เดือน ${monthCount} ปี ${yearCount}${seasonText}`;
    }
    if (typeof treasury !== "undefined") {
      treasuryEl.textContent = `💰 ${treasury.toLocaleString()} บาท`;
      treasuryEl.classList.toggle("stat-danger", treasury < 0);
    }
    if (typeof happiness !== "undefined") {
      happinessEl.textContent = `😊 ${happiness}%`;
      happinessEl.classList.toggle("stat-danger", happiness < 30);
      happinessEl.classList.toggle("stat-warn", happiness >= 30 && happiness < 50);
    }
    if (typeof foodStock !== "undefined") {
      foodEl.textContent = `🍽️ ${foodStock.toLocaleString()} มื้อ`;
      foodEl.classList.toggle("stat-danger", foodStock < 0);
    }
    if (typeof citizens !== "undefined") {
      popEl.textContent = `👨‍👩‍👧‍👦 ${citizens.length.toLocaleString()} คน`;
    }
    if (typeof loan !== "undefined" && loan.remainingDebt > 0) {
      debtEl.textContent = `💳 หนี้ ${loan.remainingDebt.toLocaleString()} บาท`;
      debtEl.classList.add("stat-warn");
      debtEl.style.display = "";
    } else if (typeof loan !== "undefined") {
      debtEl.textContent = `💳 ไม่มีหนี้สิน`;
      debtEl.classList.remove("stat-warn");
    }

    // อัปเดตตัวเลขข้าราชการต่อกระทรวง (ให้เห็นทันทีว่ากระทรวงไหนยังไม่มีคน)
    if (typeof civilServants !== "undefined") {
      Object.keys(civilServants).forEach(key => {
        const el = document.getElementById("count_" + key);
        if (el) el.textContent = civilServants[key];
      });
    }
  } catch (e) {
    // เงียบไว้ ไม่ให้กระทบเกมหลัก ถ้ามีตัวแปรยังไม่พร้อม
  }
}

// ---------- ค้นหา/กรองกระทรวง ----------
function filterDepartments() {
  const q = (document.getElementById("deptSearch").value || "").trim().toLowerCase();
  const cards = document.querySelectorAll("#deptGrid .dept-card");
  let visibleCount = 0;
  cards.forEach(card => {
    const name = (card.getAttribute("data-name") || "").toLowerCase();
    const match = q === "" || name.includes(q);
    card.style.display = match ? "" : "none";
    if (match) visibleCount++;
  });
  const noResult = document.getElementById("deptNoResult");
  if (noResult) noResult.style.display = visibleCount === 0 ? "" : "none";
}

// ---------- ปุ่มลอยด่วน (Floating Quick Dock) ----------
function toggleDock() {
  const dock = document.getElementById("quickDock");
  if (dock) dock.classList.toggle("open");
  dismissDockHint();
}

// ซ่อนคำใบ้ "เมนูลัด" ถาวรหลังผู้เล่นกดปุ่มลัดครั้งแรก (จำค่าไว้ใน localStorage
// จะได้ไม่ต้องเห็นคำใบ้นี้ซ้ำอีกในการเข้าเล่นครั้งถัดไป)
function dismissDockHint() {
  const dockHint = document.getElementById("dockHint");
  if (dockHint) dockHint.remove();
  try { localStorage.setItem("dockHintSeen", "1"); } catch (e) { /* เงียบไว้ถ้า localStorage ใช้ไม่ได้ */ }
}

document.addEventListener("DOMContentLoaded", () => {
  // ถ้าเคยกดปุ่มลัดมาแล้วในเครื่องนี้ ไม่ต้องโชว์คำใบ้ "เมนูลัด" อีกตั้งแต่โหลดหน้าแรก
  let alreadySeen = false;
  try { alreadySeen = localStorage.getItem("dockHintSeen") === "1"; } catch (e) { /* เงียบไว้ */ }
  if (alreadySeen) {
    const dockHint = document.getElementById("dockHint");
    if (dockHint) dockHint.remove();
  }
});

// ปิดเมนูลอยเมื่อกดที่อื่นบนหน้าจอ (มือถือใช้งานง่ายขึ้น)
document.addEventListener("click", (e) => {
  const dock = document.getElementById("quickDock");
  if (!dock || !dock.classList.contains("open")) return;
  if (!dock.contains(e.target)) dock.classList.remove("open");
});

document.addEventListener("DOMContentLoaded", () => {
  updateStatusBar();
});

// รีเฟรชแถบสถานะเรื่อยๆ เหมือนที่เกมหลักรีเฟรช #info ทุกวินาที
setInterval(updateStatusBar, 1000);

// ---------- แดชบอร์ดมาตรวัด (การ์ดพร้อมแถบความคืบหน้า) ----------
function setGauge(prefix, valueText, subText, pct, state) {
  const valueEl = document.getElementById(`gauge_${prefix}_value`);
  const subEl = document.getElementById(`gauge_${prefix}_sub`);
  const fillEl = document.getElementById(`gauge_${prefix}_fill`);
  const cardEl = document.getElementById(`gauge_${prefix}`);
  if (!valueEl || !fillEl) return;

  valueEl.textContent = valueText;
  if (subEl) subEl.textContent = subText;
  fillEl.style.width = Math.max(0, Math.min(100, pct)) + "%";

  if (cardEl) {
    cardEl.classList.remove("gauge-ok", "gauge-warn", "gauge-danger");
    cardEl.classList.add(state === "danger" ? "gauge-danger" : state === "warn" ? "gauge-warn" : "gauge-ok");
  }
}

function updateDashboardGauges() {
  try {
    if (typeof treasury === "undefined") return;

    // 💰 คลังเมือง: แสดงเป็น "จำนวนเดือนที่อยู่รอดได้" ตามค่าดูแล/เงินเดือนโดยประมาณ
    let runwayMonths = 0;
    if (typeof getMonthlyMaintenance === "function") {
      const maint = getMonthlyMaintenance().total || 0;
      const servantCount = typeof civilServants !== "undefined" ? Object.values(civilServants).reduce((a, b) => a + b, 0) : 0;
      const roughBurn = maint + servantCount * (typeof servantSalary !== "undefined" ? servantSalary * 30 : 15000) + 1;
      runwayMonths = treasury > 0 ? treasury / roughBurn : 0;
    }
    const runwayPct = Math.min(100, (runwayMonths / 12) * 100);
    setGauge(
      "treasury",
      `${treasury.toLocaleString()} บาท`,
      treasury < 0 ? "⚠️ ติดลบ! เสี่ยงล้มละลาย" : `พอใช้ได้ประมาณ ${runwayMonths.toFixed(1)} เดือน`,
      treasury < 0 ? 100 : runwayPct,
      treasury < 0 ? "danger" : runwayMonths < 2 ? "warn" : "ok"
    );

    // 😊 ความสุข
    setGauge(
      "happiness",
      `${happiness}%`,
      happiness < 30 ? "😟 ต่ำมาก เสี่ยงคนย้ายออก" : happiness < 60 ? "🙂 พอใช้ ควรดูแลเพิ่ม" : "😄 ประชาชนพึงพอใจดี",
      happiness,
      happiness < 30 ? "danger" : happiness < 60 ? "warn" : "ok"
    );

    // 🍽️ อาหาร: เทียบกับการบริโภคเดือนล่าสุด
    const need = (typeof foodConsumedLastMonth !== "undefined" && foodConsumedLastMonth > 0)
      ? foodConsumedLastMonth
      : (typeof getFoodNeeded === "function" ? getFoodNeeded() : 1);
    const foodPct = need > 0 ? (foodStock / need) * 100 : 100;
    setGauge(
      "food",
      `${foodStock.toLocaleString()} มื้อ`,
      foodStock < 0
        ? `⚠️ ขาดแคลน ${(typeof monthsInFamine !== "undefined" ? monthsInFamine : 0)}/3 เดือน`
        : `สำรองได้ ~${(foodPct / 100).toFixed(1)} เดือน`,
      foodPct,
      foodStock < 0 ? "danger" : foodPct < 100 ? "warn" : "ok"
    );

    // 👨‍👩‍👧‍👦 ประชากร เทียบกับความจุที่อยู่อาศัย
    const capacity = typeof homes !== "undefined"
      ? homes.reduce((sum, h) => sum + (h.size === "large" ? 8 : 5), 0)
      : 0;
    const popPct = capacity > 0 ? (citizens.length / capacity) * 100 : 0;
    setGauge(
      "population",
      `${citizens.length.toLocaleString()} คน`,
      capacity > 0 ? `ที่อยู่อาศัยรองรับ ${capacity.toLocaleString()} คน (${popPct.toFixed(0)}%)` : "กำลังสร้างที่อยู่อาศัย...",
      popPct,
      popPct > 95 ? "warn" : "ok"
    );
  } catch (e) {
    // เงียบไว้ ไม่ให้กระทบเกมหลัก ถ้ามีตัวแปรยังไม่พร้อม
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateDashboardGauges();
});
setInterval(updateDashboardGauges, 1000);
