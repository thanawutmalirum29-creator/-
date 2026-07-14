/* ===============================
   คู่มือเริ่มเกม (Tutorial Modal)
   เดิมใช้ alert() บล็อกหน้าจอทั้งหมด เปลี่ยนมาใช้ showModal() แบบเดียวกับศูนย์วิจัย
   แบ่งเนื้อหาเป็นการ์ดย่อยหลายหน้า เลื่อนดูทีละหน้าได้ (step-by-step)
   =============================== */

const gameGuidePages = [
  {
    title: "📜 ยินดีต้อนรับสู่เกมบริหารเมือง!",
    body: `
      <p>คุณคือผู้บริหารเมือง หน้าที่ของคุณคือดูแลสมดุลระหว่างรายได้ ความสุขของประชาชน และความมั่นคงของเมือง มาเริ่มดูระบบหลักกันก่อน:</p>
      <p><b>💰 ภาษี</b> — รายได้หลักจากบ้าน ร้านค้า โรงงาน (มีเพดานตามเลเวลเมือง) ปรับอัตราภาษีเองได้ในส่วน "นโยบายภาษี"</p>
      <p><b>🏢 การสร้าง</b> — บ้านเพิ่มประชากร ร้านค้า/โรงงานเพิ่มรายได้ให้เมือง</p>
      <p><b>😊 ความสุข</b> — ส่งผลต่อการย้ายเข้า/ย้ายออกของประชาชนโดยตรง</p>
      <p><b>🍛 อาหาร</b> — ต้องมีให้เพียงพอทุกเดือน ไม่งั้นความสุขจะลดลง</p>
    `
  },
  {
    title: "🛠 บริการรัฐ เหตุการณ์ และเวลา",
    body: `
      <p><b>🛠 บริการรัฐ</b> — เช่น การศึกษา สาธารณสุข ตำรวจ ฯลฯ ช่วยเพิ่มความสุขและลดผลกระทบจากเหตุการณ์ร้าย</p>
      <p><b>⚠️ เหตุการณ์</b> — โรคระบาด จลาจล ภัยธรรมชาติ มีทั้งด้านบวกและลบ เกิดขึ้นแบบสุ่มได้ทุกเดือน</p>
      <p><b>🎓 ความรู้</b> — ส่งผลให้ประชาชนสร้าง/อัปเกรดธุรกิจได้ดีขึ้น</p>
      <p><b>📅 เวลา</b> — เกมดำเนินเป็นรายเดือน/ปี พร้อมฤดูกาลที่ส่งผลต่อการบริโภคอาหารและเหตุการณ์ต่างๆ</p>
    `
  },
  {
    title: "🔬 วิจัย ข้าราชการ และการเงิน",
    body: `
      <p><b>🔬 ระบบวิจัย</b> — ปลดล็อกโบนัส เช่น ลดต้นทุนโรงงาน เพิ่มรายได้ภาษี ลดความเสียหายจากภัยพิบัติ</p>
      <p><b>👨‍💼 ข้าราชการ</b> — จ้างเพื่อเพิ่มประสิทธิภาพบริการรัฐ ลดโอกาสเกิดเหตุร้าย และเสริมความสุข</p>
      <p><b>🗣 ข่าวลือ</b> — อาจเพิ่มหรือลดความสุขชั่วคราว บางครั้งก็ไม่มีผลอะไรเลย</p>
      <p><b>💳 ระบบกู้เงิน</b> — ยืมเงินพร้อมดอกเบี้ยเพื่อขยายเมือง แต่ต้องชำระหนี้คืนรายเดือน</p>
    `
  },
  {
    title: "💡 เคล็ดลับสำหรับผู้บริหารมือใหม่",
    body: `
      <p>✅ จัดสมดุลระหว่างรายได้ ค่าใช้จ่าย และความสุขของประชาชน</p>
      <p>✅ ลงทุนในงานวิจัยและบริการรัฐเพื่อลดความเสี่ยงในระยะยาว</p>
      <p>✅ คุมปริมาณอาหารให้เพียงพอ และใช้ประโยชน์จากฤดูกาลให้ดี</p>
      <p>✅ ระวังข่าวลือที่อาจทำให้ความสุขลดลงโดยไม่ทันตั้งตัว</p>
      <p style="margin-top:14px;">พร้อมแล้ว? ไปบริหารเมืองของคุณกันเลย! 🏙️</p>
    `
  }
];

let guidePageIndex = 0;

function showGameGuide() {
  guidePageIndex = 0;
  // เผื่อ modalLevel ค้างจากศูนย์วิจัยหน้าอื่น ให้รีเซ็ตก่อนเปิดคู่มือเสมอ
  if (typeof modalLevel !== "undefined") modalLevel = null;
  renderGuidePage();
}

function renderGuidePage() {
  const total = gameGuidePages.length;
  const page = gameGuidePages[guidePageIndex];
  const isFirst = guidePageIndex === 0;
  const isLast = guidePageIndex === total - 1;

  const dots = gameGuidePages
    .map((_, i) => `<span class="guide-dot${i === guidePageIndex ? " guide-dot-active" : ""}"></span>`)
    .join("");

  const html = `
    <h2>${page.title}</h2>
    <div class="guide-body">${page.body}</div>
    <div class="guide-dots">${dots}</div>
    <div class="guide-nav-row">
      <button ${isFirst ? "disabled" : ""} onclick="prevGuidePage()">◀ ย้อนกลับ</button>
      <span class="guide-page-count">${guidePageIndex + 1} / ${total}</span>
      ${isLast
        ? `<button onclick="closeModal()">เริ่มบริหารเมือง ✅</button>`
        : `<button onclick="nextGuidePage()">ถัดไป ▶</button>`}
    </div>
  `;
  showModal(html);
}

function nextGuidePage() {
  if (guidePageIndex < gameGuidePages.length - 1) {
    guidePageIndex++;
    renderGuidePage();
  }
}

function prevGuidePage() {
  if (guidePageIndex > 0) {
    guidePageIndex--;
    renderGuidePage();
  }
}

// ต้องรอให้สคริปต์อื่นโหลดครบก่อน (showModal อยู่ใน Research.js ซึ่งโหลดทีหลังไฟล์นี้)
// จึงเรียกตอน DOMContentLoaded แทนการเรียกทันทีตอนพาร์สไฟล์แบบเดิม
document.addEventListener("DOMContentLoaded", () => {
  showGameGuide();
});
