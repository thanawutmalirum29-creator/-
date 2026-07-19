// 🏦 ระบบเครดิตเมือง — กู้ถี่ในช่วงเวลาสั้นๆ ดอกเบี้ยจะขยับสูงขึ้นและวงเงินกู้สูงสุดจะลดลงชั่วคราว
// (เดิม: กู้เท่าไหร่ก็ได้ ดอกเบี้ยคงที่ 14% ตลอดกาล ไม่มีผลเสียระยะยาวใดๆ นอกจากยอดหนี้ที่ต้องผ่อน
// ทำให้กู้ซ้ำๆ ทุกครั้งที่เงินตึงมือได้แบบไม่มีต้นทุนเพิ่มเติม — ตอนนี้กู้ถี่ = แพงขึ้นและกู้ได้น้อยลง
// นับเฉพาะการกู้ในช่วง 24 เดือนล่าสุด ผ่อนดี ไม่กู้ซ้ำสักพัก เครดิตจะค่อยๆ ฟื้นกลับมาเอง)
function getLoanCreditStatus() {
  const nowAbs = (yearCount - 1) * 12 + monthCount;
  const recentLoans = loanHistory.filter(m => nowAbs - m <= 24).length;
  const interestRate = Math.min(0.32, 0.14 + recentLoans * 0.04);
  const maxMultiplier = Math.max(3, 6 - recentLoans * 0.6);
  return { recentLoans, interestRate, maxMultiplier };
}

function requestLoan() {
  const credit = getLoanCreditStatus();
  const maxBorrow = Math.floor(collectTaxes() * credit.maxMultiplier);

  // ป้องกัน closeModal() หลงเข้าใจว่ากำลังอยู่ในหน้าหมวดหมู่ของศูนย์วิจัย (modalLevel ค้างมาจากที่อื่น)
  modalLevel = null;

  const creditNote = credit.recentLoans > 0
    ? `<p class="loan-modal-hint">⚠️ เมืองกู้เงินมาแล้ว ${credit.recentLoans} ครั้งในช่วง 2 ปีล่าสุด ดอกเบี้ยตอนนี้จึงขยับเป็น <strong>${(credit.interestRate * 100).toFixed(0)}%</strong> และวงเงินกู้ลดลงเหลือ ${credit.maxMultiplier.toFixed(1)}x ของรายได้ (ไม่กู้ซ้ำสักพักเครดิตจะฟื้นกลับมาเอง)</p>`
    : `<p class="loan-modal-hint">เครดิตเมืองยังดี ดอกเบี้ยมาตรฐาน <strong>${(credit.interestRate * 100).toFixed(0)}%</strong></p>`;

  const html = `
    <h2>📥 กู้เงิน</h2>
    ${creditNote}
    <p class="loan-modal-hint">ต้องการกู้เงินเท่าไหร่? (กู้ได้สูงสุด <strong>${maxBorrow.toLocaleString()} บาท</strong>)</p>
    <input
      type="number"
      id="loanAmountInput"
      class="loan-modal-input"
      placeholder="ใส่จำนวนเงิน (บาท)"
      min="1"
      max="${maxBorrow}"
      inputmode="numeric"
      onkeydown="if(event.key==='Enter'){confirmLoanRequest(${maxBorrow});}"
    >
    <div class="loan-modal-actions">
      <button class="loan-modal-confirm" onclick="confirmLoanRequest(${maxBorrow})">✅ ยืนยันกู้เงิน</button>
    </div>
  `;

  showModal(html);

  // โฟกัสช่องกรอกให้อัตโนมัติ พิมพ์ตัวเลขได้ทันทีโดยไม่ต้องแตะก่อน
  setTimeout(() => {
    const input = document.getElementById("loanAmountInput");
    if (input) input.focus();
  }, 60);
}

function confirmLoanRequest(maxBorrow) {
  const input = document.getElementById("loanAmountInput");
  const amount = parseInt(input && input.value, 10);

  if (isNaN(amount) || amount <= 0) {
    toast("❌ ใส่จำนวนที่ถูกต้อง!");
    return;
  }
  if (amount > maxBorrow) {
    toast(`⚠️ กู้ได้สูงสุด ${maxBorrow.toLocaleString()} บาท ตามความสามารถรัฐ.`);
    return;
  }

  borrowMoney(amount);
  updateLoanStatus();
  closeModal();
}

function borrowMoney(amount) {
  const credit = getLoanCreditStatus();
  const maxBorrow = Math.floor(collectTaxes() * credit.maxMultiplier);
  if (amount > maxBorrow) {
    toast(`⚠️ กู้ได้สูงสุด ${maxBorrow.toLocaleString()} บาท ตามเครดิตปัจจุบันของเมือง (${credit.recentLoans} ครั้งใน 2 ปีล่าสุด)`);
    return;
  }

  const interest = Math.floor(amount * credit.interestRate);
  const totalDebt = amount + interest;

  addTreasury(amount);
  loan.totalBorrowed += amount;
  loan.remainingDebt += totalDebt;
  loan.monthlyPayment = Math.ceil(totalDebt / 12);
  loan.isPaying = true;
  loanHistory.push((yearCount - 1) * 12 + monthCount);

  toast(`💰 กู้เงินสำเร็จ ${amount.toLocaleString()} บาท พร้อมดอกเบี้ย ${(credit.interestRate * 100).toFixed(0)}% รวม ${totalDebt.toLocaleString()} บาท (ผ่อนเดือนละ ${loan.monthlyPayment.toLocaleString()} บาท)`);
}

function payLoanFromIncome(monthlyIncome) {
  if (!loan.isPaying || loan.remainingDebt <= 0) return monthlyIncome;

  let payment = Math.min(loan.monthlyPayment, loan.remainingDebt, monthlyIncome);
  loan.remainingDebt -= payment;

  if (loan.remainingDebt <= 0) {
    loan.isPaying = false;
    toast("✅ ชำระหนี้สินครบแล้ว!", "success");
  }

  return monthlyIncome - payment;
}

// สร้างโครง DOM ของแถบสถานะหนี้สินครั้งเดียว (สลับได้ 2 สถานะ: มีหนี้ / ไม่มีหนี้ ด้วย display toggle
// แทนการเขียน innerHTML ทับทั้งประโยคทุกครั้งที่ยอดหนี้เปลี่ยนแค่ตัวเลขเดียว)
function _ensureLoanSkeleton() {
  const el = document.getElementById("loanStatus");
  if (!el || el.dataset.skeletonBuilt === "1") return;
  el.innerHTML = `<span id="loanStatus_debt" style="display:none">💳 หนี้สินคงเหลือ: <span id="loanStatus_remaining"></span> บาท (จ่ายเดือนละ <span id="loanStatus_payment"></span> บาท)</span><span id="loanStatus_none" style="display:none">✅ ไม่มีหนี้สิน</span>`;
  el.dataset.skeletonBuilt = "1";
}

let _lastLoanHasDebt = null;
let _lastLoanRemaining = null;
let _lastLoanPayment = null;
function updateLoanStatus() {
  _ensureLoanSkeleton();
  const hasDebt = loan.remainingDebt > 0;

  if (hasDebt !== _lastLoanHasDebt) {
    _lastLoanHasDebt = hasDebt;
    const debtEl = document.getElementById("loanStatus_debt");
    const noneEl = document.getElementById("loanStatus_none");
    if (debtEl) debtEl.style.display = hasDebt ? "" : "none";
    if (noneEl) noneEl.style.display = hasDebt ? "none" : "";
  }

  if (hasDebt) {
    if (loan.remainingDebt !== _lastLoanRemaining) {
      _lastLoanRemaining = loan.remainingDebt;
      const remEl = document.getElementById("loanStatus_remaining");
      if (remEl) remEl.textContent = loan.remainingDebt.toLocaleString();
    }
    if (loan.monthlyPayment !== _lastLoanPayment) {
      _lastLoanPayment = loan.monthlyPayment;
      const payEl = document.getElementById("loanStatus_payment");
      if (payEl) payEl.textContent = loan.monthlyPayment.toLocaleString();
    }
  }
}
