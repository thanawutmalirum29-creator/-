function updateInfo() {
  let population = citizens.length; 
  let avgKnowledge = population > 0 ? Math.floor(citizens.reduce((sum, c) => sum + c.knowledge, 0) / population) : 0;

  let smallHomes = homes.filter(h => h.size === "small").length;
  let largeHomes = homes.filter(h => h.size === "large").length;

  let smallShops = businesses.filter(b => b.type === "shop" && b.size === "small").length;
  let mediumShops = businesses.filter(b => b.type === "shop" && b.size === "medium").length;
  let largeShops = businesses.filter(b => b.type === "shop" && b.size === "large").length;

  let smallFactories = factories.filter(f => f.size === "small").length;
  let mediumFactories = factories.filter(f => f.size === "medium").length;
  let largeFactories = factories.filter(f => f.size === "large").length;

  let serviceStatus = Object.entries(services).map(([key, s]) =>
    `${s.funded ? "✅" : "❌"} ${s.name} (งบ: ${Math.ceil(Number(s.getCost()) || 0).toLocaleString()} บาท/เดือน)`
  ).join("<br>");

  let eduStats = getEducationStats();
  let totalServants = Object.values(civilServants).reduce((a, b) => a + b, 0);
  let servantCost = Math.ceil(totalServants * (servantSalary * 30 + (yearCount - 1) * 5000));

  let servantText = Object.entries(civilServants).map(([key, val]) => services[key] ? `👨‍💼 ${services[key].name}: ${val} คน` : "").join("<br>");

  const monthlyMaintenance = getMonthlyMaintenance();

  let maintenanceText = `
    🏠 ดูแลบ้าน: ${monthlyMaintenance.homeCost.toLocaleString()} บาท<br>
    🏬 ร้านค้า: ${monthlyMaintenance.shopCost.toLocaleString()} บาท<br>
    🏭 โรงงาน: ${monthlyMaintenance.factoryCost.toLocaleString()} บาท<br>
    💸 รวมค่าดูแล: ${monthlyMaintenance.total.toLocaleString()} บาท/เดือน<br><br>
  `;

  const ageGroups = getAgeGroupStats();
  let foodNeededThisMonth = getFoodNeeded();

  document.getElementById("info").innerHTML = `
    📅 เดือนที่: ${monthCount} | ปีที่: ${yearCount} | ฤดูกาล: ${currentSeasonName}<br>
<br>
    👨‍👩‍👧‍👦 คนเป็น: ${citizens.length}<br>
    ☠️ คนตายสะสม: ${deadCitizens.length}<br>
    📊 รวมทั้งหมด: ${citizens.length + deadCitizens.length}<br>
    👶 อายุประชากร:<br>
    - 1-10 ปี: ${ageGroups["1-10"]} คน<br>
    - 11-20 ปี : ${ageGroups["11-20"]} คน<br>
    - 21-65 ปี : ${ageGroups["21-65"]} คน<br>
    - 66-80 ปี : ${ageGroups["66-80"]} คน<br>
    - 81-99 ปี : ${ageGroups["81-99"]} คน<br><br>

    📘 ระดับการศึกษา:<br>
    - ประถม: ${eduStats.primary} คน<br>
    - มัธยม: ${eduStats.secondary} คน<br>
    - ปริญญาตรี: ${eduStats.bachelor} คน<br>
    - ปริญญาโท: ${eduStats.master} คน<br>
    - ปริญญาเอก: ${eduStats.phd} คน<br>
    - ผู้ชำนาญการพิเศษ: ${eduStats.expert} คน<br>
    🎓 ค่าเฉลี่ยความรู้: ${avgKnowledge} <br><br>
    💼 ข้าราชการชั้นสูง:<br>${servantText}<br>
    💸 เงินเดือนข้าราชการ: ${servantCost.toLocaleString()} บาท/เดือน<br><br>
    <br>🏙️ เลเวลเมือง: ${cityLevel} (เพดานภาษีรวม: ${cityTaxCap[cityLevel].toLocaleString()} บาท/เดือน)<br>
    💰 เงินรัฐ: ${treasury.toLocaleString()}<br>
    😊 ความสุข: ${happiness}%<br>
    💵 รายได้เดือนนี้:<br>
    🧾 รายได้ภาษี(เต็ม): ${collectTaxes().toLocaleString()} บาท<br>
    🍛 ความต้องการอาหารเดือนนี้: ${foodNeededThisMonth.toLocaleString()} มื้อ<br>
    🍽️ อาหารคงเหลือ: ${foodStock.toLocaleString()} มื้อ${monthsInFamine > 0 ? ` <span class="tag" style="color:var(--danger)">⚠️ ขาดแคลนต่อเนื่อง ${monthsInFamine}/3 เดือน</span>` : ""}<br>
    🛒 ซื้ออาหาร ${foodPurchasePerMonth.toLocaleString()} มื้อ (รวม ${Math.ceil(foodPurchasePerMonth * foodUnitCost).toLocaleString()} บาท)<br>
    🎪 จัดเทศกาล: ใช้เงิน ${(500000).toLocaleString()} บาท และอาหาร ${(30000).toLocaleString()} มื้อ (ความสุข +30~50)<br><br>
    🏠 บ้าน: ${homes.length} หลัง (เล็ก: ${smallHomes}, ใหญ่: ${largeHomes})<br>
    🏪 ร้านค้า: ${smallShops + mediumShops + largeShops} แห่ง (เล็ก: ${smallShops}, กลาง: ${mediumShops}, ใหญ่: ${largeShops})<br>
    🏭 โรงงาน: ${smallFactories + mediumFactories + largeFactories} แห่ง (เล็ก: ${smallFactories}, กลาง: ${mediumFactories}, ใหญ่: ${largeFactories})<br><br>
    💵 อัตราภาษี:<br>  
    - บ้าน: เล็ก ${taxRate.home.small} | ใหญ่ ${taxRate.home.large} บาท<br>  
    - ร้านค้า: เล็ก ${taxRate.shop.small} | กลาง ${taxRate.shop.medium} | ใหญ่ ${taxRate.shop.large} บาท<br>  
    - โรงงาน: เล็ก ${taxRate.factory.small} | กลาง ${taxRate.factory.medium} | ใหญ่ ${taxRate.factory.large} บาท (ต่อเดือน)<br><br>
    🛠️ สถานะบริการรัฐ:<br>${maintenanceText}
    ${serviceStatus}
  `;
}

function nextMonth() {
  checkGameOver();
  updateCityLevel();
  updateSeason(monthCount);
  updateResearch(); 
  applyResearchEffects();
  
  monthCount++;
  monthsSinceLastBirth++;

  if (monthCount > 12) {
    yearCount++;
    monthCount = 1;
    updateGlobalEconomy(yearCount);

  }

  if (monthsSinceLastBirth >= 4) {
    monthsSinceLastBirth = 0;
    spawnChildren();
  }

let income = collectTaxes();

// 🧪 คูณโบนัสจากผลวิจัยก่อน
income *= (1 + researchEffects.taxIncomeBonus);

income = applyEconomyEffect(income);

latestGrossIncome = income;
let net = payLoanFromIncome(latestGrossIncome);
latestNetIncome = net;
addTreasury(net);

  let monthlyMaintenanceCost = getMonthlyMaintenance().total;
  subtractTreasury(monthlyMaintenanceCost);

  payCivilServants(30, yearCount);

  let welfare = Math.ceil((Math.max(0, 100 - happiness) / 100) * 40000); // ถ้าความสุขต่ำ ต้องจ่ายสวัสดิการสูงขึ้น (ลดเพดานจาก 50,000 ให้สมดุลกับรายจ่ายอื่นที่เพิ่มขึ้น)
  subtractTreasury(welfare);

  // 🧾 ผลกระทบความสุขจากนโยบายภาษี: ขึ้นภาษีเกินมาตรฐานกระทบความสุขแรงกว่าลดภาษีที่ให้โบนัสเล็กน้อย (ไม่จูงใจให้ตั้งภาษีสูงสุดตลอด)
  const taxDeviation = getTaxPolicyDeviation();
  if (taxDeviation > 0) {
    happiness = Math.max(0, happiness - Math.round(taxDeviation * 12));
  } else if (taxDeviation < 0) {
    happiness = Math.min(100, happiness + Math.round(-taxDeviation * 6));
  }

  // พัฒนา (education)
  if (services.education.funded || civilServants.education >= services.education.requiredServants) {
    improveKnowledge(civilServants.education);
  }

  // คำนวณอาหารเดือนนี้
const foodNeeded = getFoodNeeded();

// ปรับราคาตามเศรษฐกิจ
let economyFactor = (currentEconomy === 'Recession' ? 1.5 : (currentEconomy === 'Boom' ? 0.8 : 1));
let scarcityRatio = (foodStock < foodNeeded) ? (foodNeeded - foodStock) / Math.max(1, foodNeeded) : 0;
let dynamicIncrement = foodPriceIncrement * economyFactor * (1 + scarcityRatio);
foodUnitCost = Math.max(1, +(foodUnitCost + dynamicIncrement).toFixed(3));

// หักอาหารและลดความสุขตามสัดส่วน
foodStock -= foodNeeded;
foodConsumedLastMonth = foodNeeded;

if (foodStock < 0) {
  // จำกัดไม่ให้ติดลบลึกเกินไปจนกู้คืนไม่ไหว (เดิมติดลบได้ไม่จำกัด ยิ่งเดือนถัดไปยิ่งขาดหนักเป็นทวีคูณ)
  const famineFloor = -Math.max(2000, foodNeeded * 1.5);
  if (foodStock < famineFloor) foodStock = famineFloor;

  const lacking = -foodStock; // จำนวนอาหารขาด
  const shortageRate = lacking / Math.max(1, foodNeeded);
  const happinessPenalty = Math.ceil(shortageRate * 20);

  // ลดความสุข
  happiness = Math.min(100, happiness + researchEffects.happinessBonus + researchEffects.monthlyHappinessIncrease);
  happiness = Math.max(0, happiness - happinessPenalty);

  monthsInFamine++;
  if (monthsInFamine === 2) {
    toast(`🚨 ขาดแคลนอาหารต่อเนื่อง 2 เดือนแล้ว! หากไม่แก้ไขเดือนหน้าอาจถึงขั้นวิกฤต (ซื้ออาหารเพิ่มด่วน)`);
  }
} else {
  monthsInFamine = 0;
}

  updateLoanStatus();

  Object.entries(services).forEach(([key, s]) => {
    if (!s.funded) {
      happiness += s.impact;
      toast(`⚠️ แผนก ${s.name} ไม่ได้รับงบ ความสุขลดลง ${-s.impact}%`);
    } else {
      let servants = civilServants[key] || 0;
      happiness += (servants >= s.requiredServants) ? 3 : 1;
    }
    s.funded = false;

    // รีเซ็ตสถานะปุ่มแผนก
    let btn = document.getElementById("btn_" + key);
    if (btn) {
      btn.classList.remove("funded");
    }
});

// รีเซ็ตสถานะปุ่มจ่ายทั้งหมด
let fundAllBtn = document.getElementById("fundAllBtn");
if (fundAllBtn) {
  fundAllBtn.classList.remove("funded");
}

// รีเซ็ตสถานะปุ่มลัดจ่ายงบทั้งหมดบนแถบเร่งด่วนด้วย ให้ตรงกับปุ่มปกติเสมอ
let fundAllDockBtn = document.getElementById("fundAllDockBtn");
if (fundAllDockBtn) {
  fundAllDockBtn.classList.remove("funded");
}

  if (happiness >= 60) {
    let base = Math.floor((happiness - 60) / 6);
    let randomBonus = Math.floor(Math.random() * 2);
    let newcomersCap = Math.max(1, Math.floor(Math.pow(cityLevel, 1.2) * 3));
    let newcomers = Math.min(newcomersCap, Math.max(0, base + randomBonus));
    for (let i = 1; i < newcomers; i++) spawnCitizen();
    if (newcomers > 0) {
      toast(`🎉 มีประชาชนใหม่ย้ายเข้า ${newcomers} คนในเดือนนี้`);
    }
  }

  // Events
  // 🛡️ ระบบป้องกันความสุข/ประชากรดิ่งพร้อมกันหลายเหตุการณ์ในเดือนเดียว (เดิมแต่ละเหตุการณ์เช็คแยกกันอิสระ
  // ถ้าโชคร้ายเกิดพร้อมกันหลายอย่าง ทั้งความสุขและจำนวนประชากรอาจร่วง/หายไปเกือบหมดในเดือนเดียว
  // โดยผู้เล่นแทบไม่มีทางป้องกัน)
  const happinessBeforeEvents = happiness;
  const citizensBeforeEvents = citizens.length;
  const MONTHLY_EVENT_LOSS_CAP = 35;
  const MONTHLY_MIGRANT_LOSS_CAP = Math.max(3, Math.ceil(citizensBeforeEvents * 0.15));

  epidemicCheck();
  riotCheck();
  infrastructureFailureCheck();
  warEventCheck();  
  transportCrisisCheck();
  environmentEventCheck();
  majorDisasterEventCheck();
  tourismEventCheck();
  technologyEventCheck();
  monthlyWeatherEvent();
  positiveEventCheck();

  {
    const totalDrop = happinessBeforeEvents - happiness;
    if (totalDrop > MONTHLY_EVENT_LOSS_CAP) {
      const restored = totalDrop - MONTHLY_EVENT_LOSS_CAP;
      happiness = Math.min(100, happiness + restored);
      toast(`🛡️ มาตรการฉุกเฉินช่วยลดผลกระทบจากเหตุการณ์ซ้ำซ้อนในเดือนนี้ (คืนความสุข +${restored})`);
    }

    const migrantLoss = citizensBeforeEvents - citizens.length;
    if (migrantLoss > MONTHLY_MIGRANT_LOSS_CAP) {
      const toRestore = migrantLoss - MONTHLY_MIGRANT_LOSS_CAP;
      // 🛂 นี่คือ "คนเดิมที่ตัดสินใจไม่ย้ายออก" ไม่ใช่ผู้อพยพใหม่ จึงไม่ผ่านการตรวจนโยบายตรวจคนเข้าเมือง
      for (let i = 0; i < toRestore; i++) spawnCitizen({ bypassPolicy: true });
      toast(`🛡️ ประชาชนบางส่วนตัดสินใจไม่ย้ายออกในนาทีสุดท้าย (${toRestore} คนกลับเข้าเมือง)`);
    }
  }

  showCitizensData();
  randomBuildMonthly();
  buildHomesIfNeeded();
  monthlyRumorEvent();
  ageCitizens();
  preprocessDeaths();
  updateEducation();
  updateEducationStatus();

  if (happiness < 50 && citizens.length > 0) {
    let baseLeavers = Math.floor((100 - happiness) / 12);
    let randomBonus = Math.floor(Math.random() * 2);
    let leavers = Math.max(0, baseLeavers + randomBonus);
    for (let i = 0; i < leavers && citizens.length > 0; i++) {
      citizens.pop();
    }
    if (leavers > 0) toast(`😢 ความสุขต่ำ! มีประชาชนย้ายออก ${leavers} คนในเดือนนี้`);
  }

  let baseCap = 100;
let bonusFromResearch = baseCap * (researchEffects.maxHappinessBonus || 0);
let bonusFromPark = baseCap * (civilServants.park * 0.05 || 0);
let happinessCap = baseCap + bonusFromResearch + bonusFromPark;

// จำกัดให้อยู่ในช่วง 0 ถึง happinessCap
happiness = Math.max(0, Math.min(happiness, happinessCap));

if (researchEffects.happinessBonus) {
    happiness = Math.min(happinessCap, happiness + researchEffects.happinessBonus);
}
if (researchEffects.monthlyHappinessIncrease) {
    happiness = Math.min(happinessCap, happiness + researchEffects.monthlyHappinessIncrease);
}
applyResearchEffects();

  // 📈 บันทึกค่าสำคัญของเดือนนี้ลงประวัติ สำหรับกราฟย้อนหลังในแดชบอร์ด
  recordHistorySnapshot();

  updateInfo();
}