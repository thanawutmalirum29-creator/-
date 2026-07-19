/* ===============================
   จัดเทศกาล — เดิมกดปุ่มแล้วหักเงิน/อาหารทันที ไม่มีคูลดาวน์และไม่มีผลตอบแทนลดลง
   ทำให้กดสแปมทุกเดือนแก้ปัญหาความสุขได้แบบไม่มีต้นทุนกลยุทธ์ใดๆ (แค่มีเงินพอก็จบ)
   ตอนนี้: มีคูลดาวน์ขั้นต่ำ 3 เดือน + ผลตอบแทนลดลงถ้าจัดถี่เกินไปในรอบ 12 เดือนล่าสุด
   + ค่าใช้จ่ายขยับตามเพดานรายได้ของเลเวลเมือง (ไม่ใช่ 500,000 ตายตัวที่จิ๊บจ๊อยตอนปลายเกม)
   =============================== */

function getFestivalStatus() {
  const nowAbs = (yearCount - 1) * 12 + monthCount;
  const lastUse = festivalHistory.length > 0 ? festivalHistory[festivalHistory.length - 1] : -999;
  const monthsSinceLast = nowAbs - lastUse;
  const COOLDOWN = 3;
  const usesInLast12mo = festivalHistory.filter(m => nowAbs - m < 12).length;

  // ผลตอบแทนลดลงตามจำนวนครั้งที่จัดไปแล้วในรอบ 12 เดือนล่าสุด (ครั้งแรกเต็ม ครั้งต่อไปลดลงเรื่อยๆ)
  const effectMultiplier = usesInLast12mo === 0 ? 1 : usesInLast12mo === 1 ? 0.65 : usesInLast12mo === 2 ? 0.4 : 0.25;

  const cost = Math.round(Math.max(500000, (cityTaxCap[cityLevel] || 300000) * 0.28));
  const foodCost = Math.round(cost * 0.06);

  return {
    onCooldown: monthsSinceLast < COOLDOWN,
    monthsRemaining: Math.max(0, COOLDOWN - monthsSinceLast),
    usesInLast12mo, effectMultiplier, cost, foodCost
  };
}

function confirmFestival() {
  // เผื่อ modalLevel ค้างจากศูนย์วิจัยหน้าอื่น ให้รีเซ็ตก่อนเปิดป๊อปอัปเสมอ
  if (typeof modalLevel !== "undefined") modalLevel = null;

  const status = getFestivalStatus();

  if (status.onCooldown) {
    showModal(`
      <h2>🎉 จัดเทศกาล</h2>
      <p>เพิ่งจัดเทศกาลไปไม่นาน ประชาชนยังต้องพักฟื้นก่อน — จัดครั้งถัดไปได้อีก <strong>${status.monthsRemaining} เดือน</strong></p>
    `);
    return;
  }

  const treasuryAfter = Math.ceil(treasury - status.cost);
  const foodAfter = Math.ceil(foodStock - status.foodCost);

  let warnHtml = "";
  if (treasuryAfter < 0 || foodAfter < 0) {
    const lines = [];
    if (treasuryAfter < 0) lines.push(`เงินคงคลังจะติดลบเหลือ ${treasuryAfter.toLocaleString()} บาท`);
    if (foodAfter < 0) lines.push(`อาหารคงคลังจะติดลบเหลือ ${foodAfter.toLocaleString()} มื้อ`);
    warnHtml = `<p class="confirm-warn">⚠️ ${lines.join(" และ ")}</p>`;
  }

  const diminishedNote = status.effectMultiplier < 1
    ? `<p class="confirm-warn">📉 จัดมาแล้ว ${status.usesInLast12mo} ครั้งในรอบ 12 เดือนล่าสุด ผลตอบแทนครั้งนี้เหลือ ${Math.round(status.effectMultiplier * 100)}% ของปกติ (จัดถี่เกินไป ประชาชนเริ่มเฉยชา)</p>`
    : "";

  const baseMin = Math.floor(30 * status.effectMultiplier);
  const baseMax = Math.floor(50 * status.effectMultiplier);

  const html = `
    <h2>🎉 ยืนยันจัดเทศกาล</h2>
    <p>การจัดเทศกาลจะใช้ทรัพยากรดังนี้ ต้องการดำเนินการต่อหรือไม่?</p>

    <div class="confirm-cost-grid">
      <div class="confirm-cost-row">
        <span>💰 เงินคงคลัง</span>
        <span>${treasury.toLocaleString()} → <b>${treasuryAfter.toLocaleString()}</b> บาท (-${status.cost.toLocaleString()})</span>
      </div>
      <div class="confirm-cost-row">
        <span>🍛 อาหารคงคลัง</span>
        <span>${foodStock.toLocaleString()} → <b>${foodAfter.toLocaleString()}</b> มื้อ (-${status.foodCost.toLocaleString()})</span>
      </div>
    </div>

    ${warnHtml}
    ${diminishedNote}

    <p class="confirm-benefit">✅ แลกกับความสุขประชาชน +${baseMin} ถึง +${baseMax} (มีโอกาส 25% ที่นักท่องเที่ยวจะแวะมาเพิ่มเงิน 200,000 บาท) — จัดครั้งถัดไปได้อีกอย่างน้อย 3 เดือน</p>

    <div class="confirm-btn-row">
      <button type="button" class="confirm-proceed-btn" onclick="runFestival()">✅ ยืนยันจัดเทศกาล</button>
    </div>
  `;

  showModal(html);
}

function runFestival() {
  const status = getFestivalStatus();
  if (status.onCooldown) {
    toast(`⏳ ยังจัดเทศกาลไม่ได้ อีก ${status.monthsRemaining} เดือน`);
    closeModal();
    return;
  }

  // 💸 หักเงินและอาหารได้เลย แม้ติดลบ
  subtractTreasury(status.cost);
  foodStock -= status.foodCost;

  // เพิ่มความสุขแบบสุ่ม 30-50 คูณด้วยตัวลดผลตอบแทนถ้าจัดถี่เกินไป
  const happinessGain = Math.floor((Math.floor(Math.random() * 21) + 30) * status.effectMultiplier);
  happiness = Math.min(100, happiness + happinessGain);

  festivalHistory.push((yearCount - 1) * 12 + monthCount);
  // เก็บประวัติแค่ 24 เดือนล่าสุดพอ (เกินกว่านี้ไม่มีผลต่อการคำนวณคูลดาวน์/ผลตอบแทนแล้ว)
  const nowAbs = (yearCount - 1) * 12 + monthCount;
  festivalHistory = festivalHistory.filter(m => nowAbs - m <= 24);

  closeModal();

  // บางครั้งเทศกาลดึงนักท่องเที่ยวมาเล็กน้อย
  if (Math.random() < 0.25) {
    addTreasury(200000);
    toast(`🎊 จัดเทศกาลสำเร็จ! ใช้เงิน ${status.cost.toLocaleString()} บาท และอาหาร ${status.foodCost.toLocaleString()} มื้อ\n😊 ความสุขเพิ่มขึ้น +${happinessGain}\n🏖️ นักท่องเที่ยวทำให้ได้เงินเพิ่ม 200,000 บาท`, "success");
  } else {
    toast(`🎊 จัดเทศกาลสำเร็จ! ใช้เงิน ${status.cost.toLocaleString()} บาท และอาหาร ${status.foodCost.toLocaleString()} มื้อ\n😊 ความสุขเพิ่มขึ้น +${happinessGain}`, "success");
  }

  updateInfo();
}

document.getElementById("festivalBtn").addEventListener("click", confirmFestival);
