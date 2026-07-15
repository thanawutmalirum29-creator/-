applyResearchEffects();

// 🧾 อัตราภาษีพื้นฐาน (คำนวณอัตโนมัติตามจำนวนประชากร/งานวิจัย เหมือนเดิม)
let baseTaxRate = {
  home: {
    get small() {
      return 12000 + Math.floor(citizens.length / 100) * 500 ;
    },
    get large() {
      return 18000 + Math.floor(citizens.length / 120) * 700;
    }
  },
  shop: {
    get small() {
      return 15000 + Math.floor(citizens.length / 120) * 500*(1+researchEffects.shopIncomeBonus)*(1+researchEffects.shopIncomeBonus2);
    },
    get medium() {
      return 20000 + Math.floor(citizens.length / 160) * 600*(1+researchEffects.shopIncomeBonus)*(1+researchEffects.shopIncomeBonus2);
    },
    get large() {
      return 28000 + Math.floor(citizens.length / 200) * 800*(1+researchEffects.shopIncomeBonus)*(1+researchEffects.shopIncomeBonus2);
    }
  },
  factory: {
    get small() {
      return 30000 + Math.floor(citizens.length / 180) * 800*(1+researchEffects.factoryIncomeBonus);
    },
    get medium() {
      return 35000 + Math.floor(citizens.length / 220) * 1000*(1+researchEffects.factoryIncomeBonus);
    },
    get large() {
      return 42000 + Math.floor(citizens.length / 300) * 1500*(1+researchEffects.factoryIncomeBonus);
    }
  }
};

// 🎚️ ตัวคูณภาษีที่ผู้เล่นปรับเองได้ (1.0 = 100% มาตรฐาน, ปรับได้ 50%-150%)
// แยกออกจาก baseTaxRate เพื่อให้ยังคงขยายตามประชากร/งานวิจัยอัตโนมัติ โดยผู้เล่นแค่ปรับ "ทิศทางนโยบาย" ทับไปอีกชั้น
let taxMultiplier = {
  home:    { small: 1, large: 1 },
  shop:    { small: 1, medium: 1, large: 1 },
  factory: { small: 1, medium: 1, large: 1 }
};
const TAX_MULTIPLIER_MIN = 0.5;
const TAX_MULTIPLIER_MAX = 1.5;

// อัตราภาษีจริงที่ใช้เก็บเงิน = พื้นฐาน × ตัวคูณของผู้เล่น (อินเตอร์เฟซหน้าตาเหมือนเดิมทุกจุดที่เรียกใช้)
let taxRate = {
  home: {
    get small() { return Math.round(baseTaxRate.home.small * taxMultiplier.home.small); },
    get large() { return Math.round(baseTaxRate.home.large * taxMultiplier.home.large); }
  },
  shop: {
    get small()  { return Math.round(baseTaxRate.shop.small  * taxMultiplier.shop.small); },
    get medium() { return Math.round(baseTaxRate.shop.medium * taxMultiplier.shop.medium); },
    get large()  { return Math.round(baseTaxRate.shop.large  * taxMultiplier.shop.large); }
  },
  factory: {
    get small()  { return Math.round(baseTaxRate.factory.small  * taxMultiplier.factory.small); },
    get medium() { return Math.round(baseTaxRate.factory.medium * taxMultiplier.factory.medium); },
    get large()  { return Math.round(baseTaxRate.factory.large  * taxMultiplier.factory.large); }
  }
};

// ค่าเบี่ยงเบนเฉลี่ยของนโยบายภาษีทั้งหมด เทียบกับ 100% มาตรฐาน (ใช้คำนวณผลกระทบความสุขรายเดือน)
function getTaxPolicyDeviation() {
  const all = [
    taxMultiplier.home.small, taxMultiplier.home.large,
    taxMultiplier.shop.small, taxMultiplier.shop.medium, taxMultiplier.shop.large,
    taxMultiplier.factory.small, taxMultiplier.factory.medium, taxMultiplier.factory.large
  ];
  const avg = all.reduce((a, b) => a + b, 0) / all.length;
  return avg - 1; // ค่าบวก = ภาษีสูงกว่ามาตรฐานโดยรวม, ค่าลบ = ต่ำกว่ามาตรฐาน
}

// 💡 หมายเหตุบาลานซ์: เดิมตัวหารรวมของทั้ง 12 กระทรวงคิดเป็นราว 70% ของรายได้ภาษีรวมต่อเดือน
// ทำให้แม้ผู้เล่นที่จ่ายงบครบทุกเดือนก็ยังล้มละลายภายใน 3-4 ปีเพราะเหลืองบดูแล/เงินเดือน/อาหารไม่พอ
// ปรับตัวหารขึ้นราว 1.6 เท่า (คงสัดส่วนความสำคัญระหว่างกระทรวงเดิมไว้) ให้รวมกันเหลือราว 44% ของรายได้
let services = {
    park: { name: "สวนสาธารณะ", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/32) + civilServants.park * 15000 + (yearCount * 600), requiredServants: 1, maxServants: 5 },
  health: { name: "สาธารณสุข", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/19) + civilServants.health * 15000 + (yearCount * 600), requiredServants: 1, maxServants: 5 },
  police: { name: "ตำรวจ", funded: false, impact: -3, getCost: () => Math.ceil(latestGrossIncome/29) + civilServants.police * 12000 + (yearCount * 450), requiredServants: 1, maxServants: 5 },
  infrastructure: { name: "โครงสร้าง", funded: false, impact: -3, getCost: () => Math.ceil(latestGrossIncome/22) + civilServants.infrastructure * 15000 + (yearCount * 520), requiredServants: 1, maxServants: 5 },
  education: { name: "การศึกษา", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/22) + civilServants.education * 15000 + (yearCount * 650), requiredServants: 1, maxServants: 5 },
  military: { name: "กลาโหม", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/35) + civilServants.military * 12000 + (yearCount * 380), requiredServants: 1, maxServants: 5 },
  transport: { name: "การขนส่ง", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/26) + civilServants.transport * 12000 + (yearCount * 480), requiredServants: 1, maxServants: 5 },
  scholarship: { name: "ทุนการศึกษา", funded: false, impact: -3, getCost: () => Math.ceil(latestGrossIncome/32) + civilServants.scholarship * 12000 + (yearCount * 440), requiredServants: 1, maxServants: 5 },
  environment: { name: "สิ่งแวดล้อม", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/32) + civilServants.environment * 12000 + (yearCount * 440), requiredServants: 1, maxServants: 5 },
  disaster: { name: "สาธารณภัย", funded: false, impact: -4, getCost: () => Math.ceil(latestGrossIncome/29) + civilServants.disaster * 12000 + (yearCount * 520), requiredServants: 1, maxServants: 5 },
  tourism: { name: "การท่องเที่ยว", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/38) + civilServants.tourism * 10000 + (yearCount * 360), requiredServants: 1, maxServants: 5 },
  technology: { name: "เทคโนโลยี", funded: false, impact: -2, getCost: () => Math.ceil(latestGrossIncome/26) + civilServants.technology * 15000 + (yearCount * 650), requiredServants: 1, maxServants: 5 }
};

let servantSalary = 450;

let loan = {
  totalBorrowed: 0,
  remainingDebt: 0,
  monthlyPayment: 0,
  isPaying: false
};
let openEconomyBoost = 1;

function calculateMaintenanceCost() {

  let homeCost = homes.length *1 ;
  let shopCost = businesses.filter(b => b.type === "shop").length * 2;
  let factoryCost = Math.max(1,Math.floor(factories.length * 5 * (1+researchEffects.factoryCostReduction)));
  let total = homeCost + shopCost + factoryCost;
  return { homeCost, shopCost, factoryCost, total };
}

// 💸 ค่าดูแลรายเดือนจริง (บาท) — ใช้ร่วมกันทั้งใน updateInfo() และ nextMonth()
// เดิมตัวคูณโต "1000 * cityLevel" แบบเชิงเส้นตรง รวมกับจำนวนอาคารที่โตตามประชากรอยู่แล้ว
// ทำให้ปลายเกม (เลเวลสูง) ค่าดูแลระเบิดเร็วกว่ารายได้มาก ปรับเป็นเส้นโค้งที่ชะลอตัวลง (sqrt)
// เพื่อให้เมืองใหญ่ยังคงบริหารได้โดยไม่ล้มละลายอัตโนมัติ
function getMaintenanceScale(level) {
  return 900 * Math.sqrt(Math.max(1, level));
}

function getMonthlyMaintenance() {
  const maintenance = calculateMaintenanceCost();
  const scale = getMaintenanceScale(cityLevel);
  const homeCost = Math.ceil(maintenance.homeCost * scale);
  const shopCost = Math.ceil(maintenance.shopCost * scale * 2.6);
  const factoryCost = Math.ceil(maintenance.factoryCost * scale * 6.4 * (1 - (researchEffects.factoryCostReduction || 0)));
  return {
    homeCost, shopCost, factoryCost,
    total: homeCost + shopCost + factoryCost
  };
}

// 🍛 อาหารที่ต้องการต่อคนต่อเดือน (ใช้ร่วมกันทุกจุดที่คำนวณ)
function getPerPersonFood() {
  let perPersonFood = 80 + Math.floor((happiness - 50) * 0.3);
  if (typeof currentSeasonName !== 'undefined' && currentSeasonName === "Summer" && researchEffects.summerFoodBonus) {
    perPersonFood = Math.floor(perPersonFood * (1 - researchEffects.summerFoodBonus));
  }
  return Math.max(60, perPersonFood);
}

function getFoodNeeded() {
  return Math.ceil(citizens.length * getPerPersonFood());
}

function hireCivilServant(dept) {
  let max = services[dept].maxServants || services[dept].requiredServants;

  if (civilServants[dept] >= max) {
    return toast(`🚫 แผนก ${services[dept].name} จ้างเต็มแล้ว (${max} คน)`);
  }

  let index = citizens.findIndex(c => c.knowledge >= 260);
  if (index === -1) return toast("❌ ต้องการคนเรียนปริญญาโท");

  citizens.splice(index, 1);
  civilServants[dept]++;
  toast(`✅ จ้างข้าราชการเพิ่มในแผนก ${services[dept].name}`);
  updateInfo();
}

function payCivilServants(days = 30, yearCount = 1) {
  let totalServants = Object.values(civilServants).reduce((a, b) => a + b, 0);
  // เดิม: เงินเดือนขึ้นทั้งจากปี (flat +5000/ปี) แล้วยังคูณซ้ำด้วย popFactor อีกชั้น ทำให้ปลายเกมพุ่งเร็วเกินไป
  // ปรับใหม่: ให้ค่าครองชีพต่อปีโตช้าลง (2500/ปี) และให้ popFactor เป็นตัวขับหลักแทน (สะท้อนเมืองใหญ่ = ครองชีพแพงขึ้นจริง)
  let currentSalary = servantSalary * days + (yearCount - 1) * 2500;
  let popFactor = Math.pow(Math.max(1, citizens.length / 100), 0.15);
  currentSalary = Math.ceil(currentSalary * popFactor);
  let totalCost = totalServants * currentSalary;

  if (treasury >= totalCost) {
    subtractTreasury(totalCost);
  } else {
    // จ่ายเท่าที่มี แทนที่จะไม่จ่ายเลย ลดผลกระทบให้สมเหตุสมผลกว่าเดิม
    subtractTreasury(Math.max(0, treasury));
    happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - 5);
    toast("⚠️ ขาดเงินเดือนข้าราชการ ความสุขลดลง!");
    updateInfo();
  }
}
function fund(key) {
  let s = services[key];
  if (s.funded) {
    toast(`✅ งบของ ${s.name} ถูกจ่ายไปแล้ว!`);
    return;
  }

  let cost = Math.ceil(Number(s.getCost()) || 0);

  // 💸 หักเงินได้เสมอ แม้จะติดลบ
  subtractTreasury(cost);

  s.funded = true;

  let btn = document.getElementById("btn_" + key);
  if (btn) btn.classList.add("funded");

  updateInfo();
}

function fundAll() {
  let paid = [];

  for (let key in services) {
    let s = services[key];
    if (s.funded) continue; // ข้ามอันที่จ่ายแล้ว

    let cost = Math.ceil(Number(s.getCost()) || 0);

    // 💸 หักเงินได้เสมอ
    subtractTreasury(cost);
    s.funded = true;
    paid.push(s.name);

    let btn = document.getElementById("btn_" + key);
    if (btn) btn.classList.add("funded");
  }

  let fundAllBtn = document.getElementById("fundAllBtn");
  if (fundAllBtn) fundAllBtn.classList.add("funded");

  // 🔁 ซิงก์สถานะ "ติ๊กแล้ว" ไปยังปุ่มลัดจ่ายงบทั้งหมดบนแถบเร่งด่วนด้วย ให้ตรงกับปุ่มปกติเสมอ
  let fundAllDockBtn = document.getElementById("fundAllDockBtn");
  if (fundAllDockBtn) fundAllDockBtn.classList.add("funded");

  if (paid.length > 0) {
    toast(`✅ จ่ายงบให้ทั้งหมด: ${paid.join(", ")}`);
  }

  updateInfo();
}

function setTreasury(value) {
  treasury = Math.ceil(value);
}
function addTreasury(amount) {
  treasury = Math.ceil(treasury + amount);
}
function subtractTreasury(amount) {
  treasury = Math.ceil(treasury - amount);
}

function collectTaxes() {
  let total = 0;
  
  homes.forEach(h => {
    total += (taxRate.home[h.size] || 0) * infrastructureImpact.home;
  });
  
  businesses.forEach(b => {
    if (b.type === "shop") {
      total += (taxRate.shop[b.size] || 0) * infrastructureImpact.shop * (openEconomyBoost || 1) ;
    }
  });
  
  factories.forEach(f => {
    total += (taxRate.factory[f.size] || 0) * infrastructureImpact.factory ;
  });
  
  total = Math.ceil(total);
  let taxCap = cityTaxCap[cityLevel] || Infinity;
  return Math.min(total, taxCap);
}

function setTax(type, size) {
  const input = document.getElementById(`tax_${type}_${size}`);
  if (!input) return;
  let percent = parseInt(input.value);
  if (isNaN(percent)) return;

  percent = Math.min(TAX_MULTIPLIER_MAX * 100, Math.max(TAX_MULTIPLIER_MIN * 100, percent));
  taxMultiplier[type][size] = percent / 100;

  const label = document.getElementById(`taxval_${type}_${size}`);
  if (label) label.textContent = `${percent}% (${Math.round(baseTaxRate[type][size] * taxMultiplier[type][size]).toLocaleString()} บาท)`;

  updateInfo();
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🔘 ปรับภาษีทีละ 5% ผ่านปุ่ม － / ＋ แม่นยำกว่าการลากแถบเลื่อนบนจอสัมผัส
function adjustTax(type, size, delta) {
  const input = document.getElementById(`tax_${type}_${size}`);
  if (!input) return;
  const min = parseInt(input.min, 10);
  const max = parseInt(input.max, 10);
  let next = parseInt(input.value, 10) + delta;
  next = Math.min(max, Math.max(min, next));
  input.value = next;
  setTax(type, size);
}

// 🔄 ซิงก์ตำแหน่งสไลเดอร์ภาษีและป้ายตัวเลขให้ตรงกับ taxMultiplier ปัจจุบัน (เรียกตอนโหลดหน้า/โหลดเซฟ)
function refreshTaxSliders() {
  Object.keys(taxMultiplier).forEach(type => {
    Object.keys(taxMultiplier[type]).forEach(size => {
      const percent = Math.round(taxMultiplier[type][size] * 100);
      const input = document.getElementById(`tax_${type}_${size}`);
      const label = document.getElementById(`taxval_${type}_${size}`);
      if (input) input.value = percent;
      if (label) label.textContent = `${percent}% (${Math.round(baseTaxRate[type][size] * taxMultiplier[type][size]).toLocaleString()} บาท)`;
    });
  });
}


function improveKnowledge() {
  let totalEducationServants = civilServants.education + civilServants.scholarship;
  let bonus = Math.floor(totalEducationServants * 0.5);
  citizens.forEach(c => {
    if (!c.employed) {
      c.knowledge += 2 + bonus;
    }
  });
}


function endGame(reason) {
  toast(`🎮 เกมจบแล้ว! สาเหตุ: ${reason}`);
  location.reload();
}

function checkGameOver() {
  if (citizens.length === 0) {
    endGame("ไม่มีประชากรเหลืออยู่");
  } else if (treasury < -1000000) {
    endGame("หนี้สินล้นพ้นตัว");
  } else if (happiness <= 0) {
    endGame("ความสุขตกถึงศูนย์");
  } else if (monthsInFamine >= 3) {
    // เดิม: อาหารติดลบแม้แค่ 1 หน่วยเดือนเดียวก็จบเกมทันที ซึ่งโหดเกินไปและมักรู้สึกไม่แฟร์
    // ใหม่: ต้องขาดแคลนอาหารต่อเนื่อง 3 เดือนติดถึงจะแพ้ ทำให้ผู้เล่นมีโอกาสแก้ไข (ซื้ออาหารเพิ่ม/ลดประชากร)
    endGame("ผู้คนอดอยากต่อเนื่องหลายเดือน");
  }
}

function buyFood() {
  // เผื่อ modalLevel ค้างจากศูนย์วิจัยหน้าอื่น ให้รีเซ็ตก่อนเปิดป๊อปอัปเสมอ
  if (typeof modalLevel !== "undefined") modalLevel = null;

  const defaultAmount = 20000;
  const html = `
    <h2>🍛 ซื้ออาหาร</h2>
    <p>ปรับจำนวนอาหารที่ต้องการซื้อ แล้วกดยืนยัน:</p>

    <div class="buyfood-qty-row">
      <button type="button" class="tax-step" onclick="adjustFoodPurchase(-5000)" aria-label="ลดจำนวน 5,000 มื้อ">－</button>
      <input type="number" id="foodPurchaseInput" value="${defaultAmount}" min="1000" step="1000" oninput="updateFoodPurchaseDisplay()">
      <button type="button" class="tax-step" onclick="adjustFoodPurchase(5000)" aria-label="เพิ่มจำนวน 5,000 มื้อ">＋</button>
    </div>

    <div class="buyfood-preset-row">
      <button type="button" onclick="setFoodPurchasePreset(10000)">10,000 มื้อ</button>
      <button type="button" onclick="setFoodPurchasePreset(20000)">20,000 มื้อ</button>
      <button type="button" onclick="setFoodPurchasePreset(50000)">50,000 มื้อ</button>
      <button type="button" onclick="setFoodPurchasePreset(100000)">100,000 มื้อ</button>
    </div>

    <div class="confirm-cost-grid">
      <div class="confirm-cost-row"><span>💵 ราคาต่อหน่วย</span><span id="foodUnitPriceText">-</span></div>
      <div class="confirm-cost-row"><span>🧾 ราคารวม</span><span id="foodTotalPriceText">-</span></div>
      <div class="confirm-cost-row"><span>💰 เงินคงคลังหลังซื้อ</span><span id="foodTreasuryAfterText">-</span></div>
      <div class="confirm-cost-row"><span>🍽️ อาหารคงคลังหลังซื้อ</span><span id="foodStockAfterText">-</span></div>
    </div>
    <p class="confirm-warn" id="foodWarnText" style="display:none;"></p>

    <div class="confirm-btn-row">
      <button type="button" class="confirm-proceed-btn" onclick="confirmBuyFood()">✅ ยืนยันซื้ออาหาร</button>
    </div>
  `;

  showModal(html);
  updateFoodPurchaseDisplay();
}

// ปุ่ม － / ＋ ปรับจำนวนซื้อทีละ 5,000 มื้อ
function adjustFoodPurchase(delta) {
  const input = document.getElementById("foodPurchaseInput");
  if (!input) return;
  let next = (parseInt(input.value, 10) || 0) + delta;
  if (next < 1000) next = 1000;
  input.value = next;
  updateFoodPurchaseDisplay();
}

// ปุ่มลัดจำนวนที่ซื้อบ่อย
function setFoodPurchasePreset(amount) {
  const input = document.getElementById("foodPurchaseInput");
  if (!input) return;
  input.value = amount;
  updateFoodPurchaseDisplay();
}

// อัปเดตราคาต่อหน่วย/ราคารวม/ยอดคงเหลือแบบเรียลไทม์ตามจำนวนที่พิมพ์หรือกดปรับ
function updateFoodPurchaseDisplay() {
  const input = document.getElementById("foodPurchaseInput");
  if (!input) return;

  let amount = parseInt(input.value, 10);
  if (isNaN(amount) || amount < 1000) amount = 1000;

  const unitCost = foodUnitCost;
  const total = Math.ceil(amount * unitCost);
  const treasuryAfter = Math.ceil(treasury - total);
  const foodAfter = Math.ceil(foodStock + amount);

  const unitEl = document.getElementById("foodUnitPriceText");
  const totalEl = document.getElementById("foodTotalPriceText");
  const treasuryEl = document.getElementById("foodTreasuryAfterText");
  const stockEl = document.getElementById("foodStockAfterText");
  const warnEl = document.getElementById("foodWarnText");

  if (unitEl) unitEl.textContent = `${unitCost.toLocaleString()} บาท/มื้อ`;
  if (totalEl) totalEl.innerHTML = `<b>${total.toLocaleString()}</b> บาท`;
  if (treasuryEl) treasuryEl.innerHTML = `${treasury.toLocaleString()} → <b>${treasuryAfter.toLocaleString()}</b> บาท`;
  if (stockEl) stockEl.innerHTML = `${foodStock.toLocaleString()} → <b>${foodAfter.toLocaleString()}</b> มื้อ`;

  if (warnEl) {
    if (treasuryAfter < 0) {
      warnEl.style.display = "";
      warnEl.textContent = `⚠️ เงินคงคลังจะติดลบเหลือ ${treasuryAfter.toLocaleString()} บาท`;
    } else {
      warnEl.style.display = "none";
    }
  }
}

// กดยืนยันในป๊อปอัปแล้วค่อยหักเงิน/เพิ่มอาหารจริง
function confirmBuyFood() {
  const input = document.getElementById("foodPurchaseInput");
  let amount = input ? parseInt(input.value, 10) : 20000;
  if (isNaN(amount) || amount < 1000) amount = 1000;

  const cost = Math.ceil(amount * foodUnitCost);

  // 💸 หักเงินได้เสมอ แม้ติดลบ
  subtractTreasury(cost);

  // 🍚 เพิ่มอาหาร
  foodStock += amount;

  closeModal();
  toast(`✅ ซื้ออาหาร ${amount.toLocaleString()} มื้อ สำเร็จ! ใช้เงิน ${cost.toLocaleString()} บาท`);
  updateInfo();
}
// 🛂 ประชากรเริ่มต้นตอนสร้างเมือง ไม่ใช่ผู้อพยพระหว่างเล่นเกม จึงไม่ผ่านการตรวจนโยบายตรวจคนเข้าเมือง
for (let i = 0; i < 60; i++) spawnCitizen({ bypassPolicy: true });
buildHomesIfNeeded();
refreshTaxSliders();
updateInfo();
setInterval(updateInfo, 1000);