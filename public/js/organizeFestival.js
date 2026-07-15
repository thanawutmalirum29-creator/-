/* ===============================
   จัดเทศกาล — เดิมกดปุ่มแล้วหักเงิน/อาหารทันที
   ตอนนี้เปลี่ยนเป็นเปิดป๊อปอัปยืนยันก่อนเสมอ โชว์ว่าจะเสียอะไรเท่าไหร่
   เทียบกับที่มีอยู่ในคลัง ผู้เล่นกด "ยืนยัน" ถึงจะหักจริง
   =============================== */

const FESTIVAL_COST_MONEY = 500000;
const FESTIVAL_COST_FOOD = 30000;

function confirmFestival() {
  // เผื่อ modalLevel ค้างจากศูนย์วิจัยหน้าอื่น ให้รีเซ็ตก่อนเปิดป๊อปอัปเสมอ
  if (typeof modalLevel !== "undefined") modalLevel = null;

  const treasuryAfter = Math.ceil(treasury - FESTIVAL_COST_MONEY);
  const foodAfter = Math.ceil(foodStock - FESTIVAL_COST_FOOD);

  let warnHtml = "";
  if (treasuryAfter < 0 || foodAfter < 0) {
    const lines = [];
    if (treasuryAfter < 0) lines.push(`เงินคงคลังจะติดลบเหลือ ${treasuryAfter.toLocaleString()} บาท`);
    if (foodAfter < 0) lines.push(`อาหารคงคลังจะติดลบเหลือ ${foodAfter.toLocaleString()} มื้อ`);
    warnHtml = `<p class="confirm-warn">⚠️ ${lines.join(" และ ")}</p>`;
  }

  const html = `
    <h2>🎉 ยืนยันจัดเทศกาล</h2>
    <p>การจัดเทศกาลจะใช้ทรัพยากรดังนี้ ต้องการดำเนินการต่อหรือไม่?</p>

    <div class="confirm-cost-grid">
      <div class="confirm-cost-row">
        <span>💰 เงินคงคลัง</span>
        <span>${treasury.toLocaleString()} → <b>${treasuryAfter.toLocaleString()}</b> บาท (-${FESTIVAL_COST_MONEY.toLocaleString()})</span>
      </div>
      <div class="confirm-cost-row">
        <span>🍛 อาหารคงคลัง</span>
        <span>${foodStock.toLocaleString()} → <b>${foodAfter.toLocaleString()}</b> มื้อ (-${FESTIVAL_COST_FOOD.toLocaleString()})</span>
      </div>
    </div>

    ${warnHtml}

    <p class="confirm-benefit">✅ แลกกับความสุขประชาชน +30 ถึง +50 (มีโอกาส 25% ที่นักท่องเที่ยวจะแวะมาเพิ่มเงิน 200,000 บาท)</p>

    <div class="confirm-btn-row">
      <button type="button" class="confirm-proceed-btn" onclick="runFestival()">✅ ยืนยันจัดเทศกาล</button>
    </div>
  `;

  showModal(html);
}

function runFestival() {
  // 💸 หักเงินและอาหารได้เลย แม้ติดลบ
  subtractTreasury(FESTIVAL_COST_MONEY);
  foodStock -= FESTIVAL_COST_FOOD;

  // เพิ่มความสุขแบบสุ่ม 30-50
  const happinessGain = Math.floor(Math.random() * 21) + 30;
  happiness = Math.min(100, happiness + happinessGain);

  closeModal();

  // บางครั้งเทศกาลดึงนักท่องเที่ยวมาเล็กน้อย
  if (Math.random() < 0.25) {
    addTreasury(200000);
    toast(`🎊 จัดเทศกาลสำเร็จ! ใช้เงิน ${FESTIVAL_COST_MONEY.toLocaleString()} บาท และอาหาร ${FESTIVAL_COST_FOOD.toLocaleString()} มื้อ\n😊 ความสุขเพิ่มขึ้น +${happinessGain}\n🏖️ นักท่องเที่ยวทำให้ได้เงินเพิ่ม 200,000 บาท`);
  } else {
    toast(`🎊 จัดเทศกาลสำเร็จ! ใช้เงิน ${FESTIVAL_COST_MONEY.toLocaleString()} บาท และอาหาร ${FESTIVAL_COST_FOOD.toLocaleString()} มื้อ\n😊 ความสุขเพิ่มขึ้น +${happinessGain}`);
  }

  updateInfo();
}

document.getElementById("festivalBtn").addEventListener("click", confirmFestival);
