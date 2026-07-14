/* ===============================
   นโยบายตรวจคนเข้าเมือง (Immigration Policy)
   ให้ผู้เล่นเลือกเกณฑ์รับผู้อพยพเข้าเมือง 3 แบบ:
   - open      เปิดรับทุกคน            → ประชากรโตเร็ว   ความรู้เฉลี่ยต่ำ
   - selective รับเฉพาะมีความรู้ขั้นต่ำ  → โตช้าลง         คุณภาพสูงขึ้น
   - closed    ปิดรับชั่วคราว            → คุมประชากรตอนเมืองแออัด
   ตรรกะจริงของแต่ละนโยบายอยู่ใน spawnCitizen() (spawnpeople.js)
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
    desc: "ผู้อพยพต้องผ่านเกณฑ์ความรู้ขั้นต่ำก่อนเข้าเมืองได้ ทำให้จำนวนผู้อพยพลดลงราวครึ่งหนึ่ง แต่ได้ประชากรคุณภาพสูงขึ้น"
  },
  closed: {
    icon: "🚫",
    label: "ปิดรับชั่วคราว",
    desc: "ไม่มีผู้อพยพใหม่เข้าเมืองเลย ใช้คุมจำนวนประชากรตอนเมืองแออัดหรือทรัพยากรตึงมือ (เด็กที่เกิดจากประชาชนเดิมยังเกิดได้ตามปกติ)"
  }
};

// เรียกตอนผู้เล่นกดปุ่มเลือกนโยบายใหม่
function setImmigrationPolicy(policy) {
  if (!IMMIGRATION_POLICIES[policy]) return;
  if (immigrationPolicy === policy) return; // เลือกซ้ำนโยบายเดิม ไม่ต้องแจ้งเตือนซ้ำ

  immigrationPolicy = policy;
  refreshImmigrationUI();

  const p = IMMIGRATION_POLICIES[policy];
  toast(`🛂 ปรับนโยบายตรวจคนเข้าเมืองเป็น "${p.icon} ${p.label}"`);
  updateInfo();
}

// ซิงก์สถานะปุ่ม/คำอธิบายให้ตรงกับ immigrationPolicy ปัจจุบัน (เรียกตอนโหลดหน้า/โหลดเซฟ)
function refreshImmigrationUI() {
  Object.keys(IMMIGRATION_POLICIES).forEach(key => {
    const btn = document.getElementById(`immigBtn_${key}`);
    if (btn) btn.classList.toggle("immig-active", key === immigrationPolicy);
  });

  const descEl = document.getElementById("immigrationDesc");
  const current = IMMIGRATION_POLICIES[immigrationPolicy] || IMMIGRATION_POLICIES.open;
  if (descEl) descEl.textContent = `${current.icon} ${current.desc}`;
}

document.addEventListener("DOMContentLoaded", () => {
  refreshImmigrationUI();
});
