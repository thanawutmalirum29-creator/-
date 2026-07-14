function requestLoan() {
  const maxBorrow = Math.floor(collectTaxes() * 6);
  let input = prompt(`💬 ต้องการกู้เงินเท่าไหร่? (กู้ได้สูงสุด ${maxBorrow.toLocaleString()} บาท):`);
  let amount = parseInt(input);

  if (isNaN(amount) || amount <= 0) {
    toast("❌ ใส่จำนวนที่ถูกต้อง!");
    return;
  }

  borrowMoney(amount);
  updateLoanStatus();
}

function borrowMoney(amount) {
  // ปรับเพดานกู้ยืมขึ้นเล็กน้อย (5x -> 6x รายได้) ให้เป็นเครื่องมือขยายเมืองที่ใช้ได้จริงมากขึ้น
  const maxBorrow = Math.floor(collectTaxes() * 6);
  if (amount > maxBorrow) {
    toast(`⚠️ กู้ได้สูงสุด ${maxBorrow.toLocaleString()} บาท ตามความสามารถรัฐ.`);
    return;
  }

  // ลดดอกเบี้ยจาก 20% -> 14% ให้การกู้เป็นทางเลือกที่คุ้มค่ากว่าเดิม แต่ยังมีต้นทุนจริง
  const interest = Math.floor(amount * 0.14);
  const totalDebt = amount + interest;

  addTreasury(amount);
  loan.totalBorrowed += amount;
  loan.remainingDebt += totalDebt;
  loan.monthlyPayment = Math.ceil(totalDebt / 12);
  loan.isPaying = true;

  toast(`💰 กู้เงินสำเร็จ ${amount.toLocaleString()} บาท พร้อมดอกเบี้ย 14% รวม ${totalDebt.toLocaleString()} บาท (ผ่อนเดือนละ ${loan.monthlyPayment.toLocaleString()} บาท)`);
}

function payLoanFromIncome(monthlyIncome) {
  if (!loan.isPaying || loan.remainingDebt <= 0) return monthlyIncome;

  let payment = Math.min(loan.monthlyPayment, loan.remainingDebt, monthlyIncome);
  loan.remainingDebt -= payment;

  if (loan.remainingDebt <= 0) {
    loan.isPaying = false;
    toast("✅ ชำระหนี้สินครบแล้ว!");
  }

  return monthlyIncome - payment;
}

function updateLoanStatus() {
  const loanText = loan.remainingDebt > 0
    ? `💳 หนี้สินคงเหลือ: ${loan.remainingDebt.toLocaleString()} บาท (จ่ายเดือนละ ${loan.monthlyPayment.toLocaleString()} บาท)`
    : "✅ ไม่มีหนี้สิน";
  document.getElementById("loanStatus").innerHTML = loanText;
}
