/* ===============================
   นโยบายตรวจคนเข้าเมือง (Immigration Policy)
   ย้ายมาเป็นป๊อปอัป เปิดจากปุ่ม "🛂 คนเข้าเมือง" บนแถบการกระทำหลัก/แถบด่วนมุมขวาล่าง
   แทนที่จะเป็นการ์ดโชว์ตลอดเวลาในหน้าเกม (เพื่อประหยัดพื้นที่หน้าจอ)

   ให้ผู้เล่นเลือกเกณฑ์รับผู้อพยพเข้าเมือง 6 แบบ ตั้งแต่หลวมสุดถึงเข้มสุด แถมบางแบบยังปรับ
   พารามิเตอร์ละเอียดได้เอง (เกณฑ์ความรู้ขั้นต่ำ / อายุขั้นต่ำ / โควตาต่อเดือน) ผ่าน immigrationSettings
   (ประกาศไว้ใน Global.js):
   - open         เปิดรับทุกคน                  → ประชากรโตเร็วที่สุด    ความรู้เฉลี่ยต่ำสุด
   - selective    รับเฉพาะมีความรู้ขั้นต่ำ         → โตช้าลง               คุณภาพสูงขึ้น (ปรับเกณฑ์ได้)
   - skilled      รับเฉพาะแรงงานมีทักษะ           → โตช้าสุด (ไม่มีเด็ก)   คุณภาพสูงสุด (ปรับเกณฑ์อายุ+ความรู้ได้)
   - quota        กำหนดโควตาต่อเดือน             → คุมจำนวนแบบแม่นยำ คาดเดาได้ (ปรับโควตาได้)
   - humanitarian รับทุกคนแบบมนุษยธรรม           → ความสุข +เล็กน้อยต่อคน แลกกับค่าดูแลตั้งถิ่นฐาน
   - closed       ปิดรับชั่วคราว                  → ไม่มีผู้อพยพใหม่เข้าเมืองเลย

   ตรรกะการคัดกรองจริงของแต่ละนโยบายอยู่ใน spawnCitizen() (spawnpeople.js)
   modal ใช้ showModal()/closeModal() ที่ประกาศไว้ใน Research.js (โหลดก่อนไฟล์นี้)
   =============================== */

const IMMIGRATION_POLICIES = {
  open: {
    icon: "🌍",
    label: "เปิดรับทุกคน",
    desc: "รับผู้อพยพทุกคนโดยไม่มีเงื่อนไข ประชากรเติบโตเร็วที่สุด แต่ความรู้เฉลี่ยของผู้อพยพจะต่ำกว่านโยบายอื่น"
  },
  selective: {
    icon: "🎓",
    label: "รับเฉพาะมีความรู้ขั้นต่ำ",
    desc: "ผู้อพยพต้องผ่านเกณฑ์ความรู้ขั้นต่ำที่ตั้งไว้ก่อนเข้าเมืองได้ ยิ่งตั้งเกณฑ์สูง จำนวนผู้อพยพยิ่งลดลง แต่คุณภาพยิ่งสูงขึ้น (ปรับเกณฑ์ได้ด้านล่าง)"
  },
  skilled: {
    icon: "🧑‍💼",
    label: "แรงงานมีทักษะ",
    desc: "เข้มกว่า \"รับเฉพาะมีความรู้ขั้นต่ำ\" อีกขั้น: ต้องเป็นวัยทำงานขึ้นไป และมีความรู้ผ่านเกณฑ์ด้วย จึงไม่มีเด็กติดตามครอบครัวเข้ามาเลย เติบโตช้าที่สุดแต่ได้กำลังแรงงานคุณภาพสูงทันที"
  },
  quota: {
    icon: "🎫",
    label: "กำหนดโควตารายเดือน",
    desc: "รับผู้อพยพได้ไม่เกินจำนวนที่กำหนดในแต่ละเดือน ไม่มีเงื่อนไขความรู้ เหมาะกับการคุมอัตราการเติบโตให้แม่นยำ คาดเดาได้ล่วงหน้า"
  },
  humanitarian: {
    icon: "🤝",
    label: "มนุษยธรรม",
    desc: "รับทุกคนโดยไม่มีเงื่อนไขเหมือน \"เปิดรับทุกคน\" และเพิ่มความสุขประชาชนเล็กน้อยทุกครั้งที่มีผู้อพยพใหม่ แต่ต้องจ่ายงบดูแล/ตั้งถิ่นฐานจากคลังเมืองต่อคน"
  },
  closed: {
    icon: "🚫",
    label: "ปิดรับชั่วคราว",
    desc: "ไม่มีผู้อพยพใหม่เข้าเมืองเลย ใช้คุมจำนวนประชากรตอนเมืองแออัดหรือทรัพยากรตึงมือ (เด็กที่เกิดจากประชาชนเดิมยังเกิดได้ตามปกติ)"
  }
};

// ขอบเขตที่ปรับได้ของแต่ละพารามิเตอร์ (ใช้ทั้งกับปุ่ม－/＋ และแถบเลื่อน)
const IMMIGRATION_SETTING_BOUNDS = {
  minKnowledge: [20, 130],
  skilledMinAge: [16, 40],
  quotaPerMonth: [1, 30]
};

// เรียกตอนผู้เล่นกดปุ่มเลือกนโยบายใหม่ในป๊อปอัป
function setImmigrationPolicy(policy) {
  if (!IMMIGRATION_POLICIES[policy]) return;

  if (immigrationPolicy !== policy) {
    immigrationPolicy = policy;
    const p = IMMIGRATION_POLICIES[policy];
    toast(`🛂 ปรับนโยบายตรวจคนเข้าเมืองเป็น "${p.icon} ${p.label}"`);
  }

  refreshImmigrationUI();
  updateInfo();
}

// ปรับค่าพารามิเตอร์ผ่านแถบเลื่อน (input range)
function setImmigrationSetting(key, value) {
  if (!(key in immigrationSettings)) return;
  const bounds = IMMIGRATION_SETTING_BOUNDS[key] || [0, 999999];
  const n = Math.max(bounds[0], Math.min(bounds[1], parseInt(value, 10) || 0));
  immigrationSettings[key] = n;
  refreshImmigrationUI();
}

// ปรับค่าพารามิเตอร์ผ่านปุ่ม － / ＋ (ทีละสเต็ป)
function adjustImmigrationSetting(key, delta) {
  if (!(key in immigrationSettings)) return;
  setImmigrationSetting(key, immigrationSettings[key] + delta);
}

// เปิดป๊อปอัปนโยบายตรวจคนเข้าเมือง (เรียกจากปุ่มบนแถบการกระทำหลัก/แถบด่วน)
function openImmigrationCenter() {
  modalLevel = null; // popup นี้เป็นหน้าเดียวจบ ไม่มีชั้นหมวดหมู่แบบศูนย์วิจัย
  showModal(renderImmigrationModalHTML());
}

function renderImmigrationModalHTML() {
  const current = IMMIGRATION_POLICIES[immigrationPolicy] || IMMIGRATION_POLICIES.open;

  const cards = Object.keys(IMMIGRATION_POLICIES).map(key => {
    const p = IMMIGRATION_POLICIES[key];
    const active = key === immigrationPolicy;
    return `
      <div class="immig-policy-card ${active ? "immig-policy-active" : ""}">
        <div class="immig-policy-head">
          <span class="immig-policy-icon">${p.icon}</span>
          <span class="immig-policy-name">${p.label}</span>
          ${active ? `<span class="immig-policy-badge">ใช้อยู่</span>` : ""}
        </div>
        <p class="immig-policy-desc">${p.desc}</p>
        ${!active ? `<button class="immig-policy-select-btn" onclick="setImmigrationPolicy('${key}')">เลือกนโยบายนี้</button>` : ""}
      </div>`;
  }).join("");

  let advanced = "";

  if (immigrationPolicy === "selective" || immigrationPolicy === "skilled") {
    advanced += `
      <div class="immig-setting-row">
        <div class="immig-setting-label">🎯 เกณฑ์ความรู้ขั้นต่ำ: <b>${immigrationSettings.minKnowledge}</b></div>
        <div class="tax-slider-line">
          <button type="button" class="tax-step" onclick="adjustImmigrationSetting('minKnowledge',-5)" aria-label="ลดเกณฑ์ความรู้ 5">－</button>
          <input type="range" min="${IMMIGRATION_SETTING_BOUNDS.minKnowledge[0]}" max="${IMMIGRATION_SETTING_BOUNDS.minKnowledge[1]}" step="5" value="${immigrationSettings.minKnowledge}" oninput="setImmigrationSetting('minKnowledge', this.value)">
          <button type="button" class="tax-step" onclick="adjustImmigrationSetting('minKnowledge',5)" aria-label="เพิ่มเกณฑ์ความรู้ 5">＋</button>
        </div>
        <p class="immig-setting-hint">ยิ่งตั้งสูง ยิ่งคัดกรองเข้ม จำนวนผู้ผ่านเกณฑ์จะลดลง แต่ผู้ที่ผ่านจะมีความรู้ไม่ต่ำกว่าค่านี้เสมอ — ตั้งสูงแค่ไหนก็ไม่มีทางที่เมืองจะหยุดรับผู้อพยพไปเลย</p>
      </div>`;
  }

  if (immigrationPolicy === "skilled") {
    advanced += `
      <div class="immig-setting-row">
        <div class="immig-setting-label">🎂 อายุขั้นต่ำ (วัยแรงงาน): <b>${immigrationSettings.skilledMinAge} ปี</b></div>
        <div class="tax-slider-line">
          <button type="button" class="tax-step" onclick="adjustImmigrationSetting('skilledMinAge',-1)" aria-label="ลดอายุขั้นต่ำ 1 ปี">－</button>
          <input type="range" min="${IMMIGRATION_SETTING_BOUNDS.skilledMinAge[0]}" max="${IMMIGRATION_SETTING_BOUNDS.skilledMinAge[1]}" step="1" value="${immigrationSettings.skilledMinAge}" oninput="setImmigrationSetting('skilledMinAge', this.value)">
          <button type="button" class="tax-step" onclick="adjustImmigrationSetting('skilledMinAge',1)" aria-label="เพิ่มอายุขั้นต่ำ 1 ปี">＋</button>
        </div>
        <p class="immig-setting-hint">นโยบายนี้รับเฉพาะผู้อพยพวัยทำงานขึ้นไปเท่านั้น ไม่มีเด็กติดตามครอบครัวเข้ามาด้วยเลย</p>
      </div>`;
  }

  if (immigrationPolicy === "quota") {
    const used = typeof immigrationQuotaUsedThisMonth !== "undefined" ? immigrationQuotaUsedThisMonth : 0;
    advanced += `
      <div class="immig-setting-row">
        <div class="immig-setting-label">🎫 โควตาผู้อพยพต่อเดือน: <b>${immigrationSettings.quotaPerMonth} คน</b></div>
        <div class="tax-slider-line">
          <button type="button" class="tax-step" onclick="adjustImmigrationSetting('quotaPerMonth',-1)" aria-label="ลดโควตา 1 คน">－</button>
          <input type="range" min="${IMMIGRATION_SETTING_BOUNDS.quotaPerMonth[0]}" max="${IMMIGRATION_SETTING_BOUNDS.quotaPerMonth[1]}" step="1" value="${immigrationSettings.quotaPerMonth}" oninput="setImmigrationSetting('quotaPerMonth', this.value)">
          <button type="button" class="tax-step" onclick="adjustImmigrationSetting('quotaPerMonth',1)" aria-label="เพิ่มโควตา 1 คน">＋</button>
        </div>
        <p class="immig-setting-hint">เดือนนี้รับไปแล้ว ${used}/${immigrationSettings.quotaPerMonth} คน (ตัวนับนี้จะรีเซ็ตเป็น 0 ทุกครั้งที่ขึ้นเดือนใหม่)</p>
      </div>`;
  }

  if (immigrationPolicy === "humanitarian") {
    advanced += `<p class="immig-setting-hint">🤝 รับทุกคนโดยไม่มีเงื่อนไข และเก็บงบดูแล/ตั้งถิ่นฐานจากคลังเมืองราว 800 บาทต่อผู้อพยพ 1 คน แลกกับความสุขประชาชนที่เพิ่มขึ้นเล็กน้อยทุกครั้งที่มีคนใหม่เข้ามา</p>`;
  }

  return `
    <div id="immigrationModalRoot">
      <h2>🛂 นโยบายตรวจคนเข้าเมือง</h2>
      <p class="tax-hint">นโยบายปัจจุบัน: <b>${current.icon} ${current.label}</b> — เลือกนโยบายใหม่หรือปรับเกณฑ์ด้านล่างได้ทุกเมื่อ ไม่มีค่าใช้จ่ายในการเปลี่ยน</p>
      <div class="immig-policy-grid">${cards}</div>
      ${advanced ? `<div class="immig-settings-box">${advanced}</div>` : ""}
    </div>`;
}

// ซิงก์ป๊อปอัป (ถ้าเปิดอยู่พอดี) และปุ่มลัดบนแถบการกระทำหลัก/แถบด่วน ให้ตรงกับ immigrationPolicy ปัจจุบันเสมอ
// เรียกตอนโหลดหน้า/โหลดเซฟ/หลังผู้เล่นเปลี่ยนนโยบายหรือปรับพารามิเตอร์
function refreshImmigrationUI() {
  const current = IMMIGRATION_POLICIES[immigrationPolicy] || IMMIGRATION_POLICIES.open;

  document.querySelectorAll(".immig-quick-btn").forEach(btn => {
    btn.title = `นโยบายตรวจคนเข้าเมืองปัจจุบัน: ${current.icon} ${current.label} (แตะเพื่อเปลี่ยน)`;
  });

  // ถ้าป๊อปอัปนโยบายคนเข้าเมืองเปิดอยู่พอดี ให้วาดเนื้อหาใหม่ทับของเดิม (เช่นตอนปรับแถบเลื่อน)
  // เช็คด้วย id ของ root ข้างในเพื่อไม่ไปยุ่งกับ modal อื่นที่อาจเปิดอยู่ (เซฟเกม/ศูนย์วิจัย/เหตุการณ์วิกฤต)
  const overlay = document.getElementById("modal-overlay");
  if (overlay && overlay.querySelector("#immigrationModalRoot")) {
    const body = overlay.querySelector(".modal-body");
    if (body) body.innerHTML = renderImmigrationModalHTML();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  refreshImmigrationUI();
});
