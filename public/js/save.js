function getGameState() {
  return {
    treasury,
    happiness,
    homes,
    businesses,
    factories,
    citizens,
    deadCitizens,
    monthCount,
    yearCount,
    foodStock,
    foodPurchasePerMonth,
    foodUnitCost,
    foodConsumedLastMonth,
    monthsSinceLastBirth,
    citizenIDCounter,
    cityLevel,
    civilServants,
    services,
    researchEffects,
    researchProjects,
    activeResearch,
    researchMonthsLeft,
    damagedStructures,
    infrastructureImpact,
    weatherImpact,
    temporaryImpact,
    merchantShopBoost,
    currentSeasonName,            // ฤดูกาล
    currentEconomy,                // เศรษฐกิจโลก
    upcomingEconomy,               // พยากรณ์เศรษฐกิจปีหน้า
    loan,                          // เงินกู้ทั้งหมด
    loanHistory,
    festivalHistory,
    activeCrisisEvent,
    monthsSinceLastCrisisEvent,
    crisisEventReputation,
    monthsSinceLastEpidemic,
    monthsSinceLastRiot,
    monthsSinceLastInfrastructureFailure,
    monthsSinceLastWar,
    monthsSinceLastTransportCrisis,
    monthsSinceLastEnvDisaster,
    monthsSinceLastMajorDisaster,
    monthsSinceLastTourismBoom,
    monthsSinceLastTechBreakdown,
    monthsInFamine,
    monthsInDebt,
    taxMultiplier,
    historyLog,
    immigrationPolicy,
    immigrationSettings,
    immigrationQuotaUsedThisMonth,
    // ถ้ามีตัวแปรอื่น ๆ ในไฟล์คุณ เพิ่มตรงนี้
  };
}

// ฟังก์ชันคืนค่าทุกตัวแปรจากเซฟ
function setGameState(state) {
  treasury = state.treasury;
  happiness = state.happiness;
  homes = state.homes;
  businesses = state.businesses;
  factories = state.factories;
  citizens = state.citizens;
  deadCitizens = state.deadCitizens;
  monthCount = state.monthCount;
  yearCount = state.yearCount;
  foodStock = state.foodStock;
  foodPurchasePerMonth = state.foodPurchasePerMonth;
  foodUnitCost = state.foodUnitCost;
  foodConsumedLastMonth = state.foodConsumedLastMonth || 0;
  monthsSinceLastBirth = state.monthsSinceLastBirth || 0;
  citizenIDCounter = state.citizenIDCounter || 1;
  cityLevel = state.cityLevel;
  civilServants = state.civilServants;
  if (state.services) {
    Object.keys(state.services).forEach(key => {
      if (services[key]) services[key].funded = state.services[key].funded;
    });
  }
  researchEffects = state.researchEffects || {};
  if (state.researchProjects) {
    state.researchProjects.forEach(saved => {
      let p = researchProjects.find(rp => rp.id === saved.id);
      if (p) p.researched = saved.researched;
    });
  }
  activeResearch = state.activeResearch || null;
  researchMonthsLeft = state.researchMonthsLeft || 0;
  damagedStructures = state.damagedStructures || [];
  infrastructureImpact = state.infrastructureImpact || { home: 1, shop: 1, factory: 1 };
  // เซฟเก่าก่อนแยกชั้น weather/temporary/merchant ออกจาก infrastructureImpact จะไม่มี 3 field นี้
  // ให้เริ่มที่ค่ากลาง (ไม่มีผลกระทบ) ไปก่อน ระบบจะคำนวณใหม่ให้เองตั้งแต่เดือนถัดไป
  weatherImpact = state.weatherImpact || { home: 1, shop: 1, factory: 1 };
  temporaryImpact = state.temporaryImpact || { home: 1, shop: 1, factory: 1 };
  merchantShopBoost = state.merchantShopBoost || 1;
  currentSeasonName = state.currentSeasonName || "Spring";
  currentEconomy = state.currentEconomy || "Stable";
  upcomingEconomy = state.upcomingEconomy || null;
  loan = state.loan || { totalBorrowed: 0, remainingDebt: 0, monthlyPayment: 0, isPaying: false };
  loanHistory = Array.isArray(state.loanHistory) ? state.loanHistory : [];
  festivalHistory = Array.isArray(state.festivalHistory) ? state.festivalHistory : [];
  activeCrisisEvent = state.activeCrisisEvent || null;
  // เซฟเก่าอาจเก็บ activeCrisisEvent ไว้ตอนที่ยังไม่ได้เลือก แต่ choices มี function (apply) อยู่ข้างใน
  // ซึ่ง JSON.stringify ไม่เก็บ function ไว้ (จะหายไปตอนเซฟ) ต้อง map กลับไปหาสถานการณ์ตัวจริงจาก id แทน
  if (activeCrisisEvent && activeCrisisEvent.id && typeof CRISIS_SCENARIOS !== "undefined") {
    const real = CRISIS_SCENARIOS.find(s => s.id === activeCrisisEvent.id);
    activeCrisisEvent = real || null;
  }
  monthsSinceLastCrisisEvent = state.monthsSinceLastCrisisEvent ?? 3;
  crisisEventReputation = state.crisisEventReputation || 0;
  monthsSinceLastEpidemic = state.monthsSinceLastEpidemic ?? 999;
  monthsSinceLastRiot = state.monthsSinceLastRiot ?? 999;
  monthsSinceLastInfrastructureFailure = state.monthsSinceLastInfrastructureFailure ?? 999;
  monthsSinceLastWar = state.monthsSinceLastWar ?? 999;
  monthsSinceLastTransportCrisis = state.monthsSinceLastTransportCrisis ?? 999;
  monthsSinceLastEnvDisaster = state.monthsSinceLastEnvDisaster ?? 999;
  monthsSinceLastMajorDisaster = state.monthsSinceLastMajorDisaster ?? 999;
  monthsSinceLastTourismBoom = state.monthsSinceLastTourismBoom ?? 999;
  monthsSinceLastTechBreakdown = state.monthsSinceLastTechBreakdown ?? 999;
  monthsInFamine = state.monthsInFamine ?? 0;
  monthsInDebt = state.monthsInDebt ?? 0;
  taxMultiplier = state.taxMultiplier || {
    home:    { small: 1, large: 1 },
    shop:    { small: 1, medium: 1, large: 1 },
    factory: { small: 1, medium: 1, large: 1 }
  };
  // เซฟเก่าก่อนมีฟีเจอร์กราฟย้อนหลังจะไม่มี field นี้ ให้เริ่มเป็น array ว่างแทน
  historyLog = Array.isArray(state.historyLog) ? state.historyLog : [];
  // เซฟเก่าก่อนมีฟีเจอร์นโยบายตรวจคนเข้าเมืองจะไม่มี field นี้ ให้ใช้ "เปิดรับทุกคน" เป็นค่าเริ่มต้น (พฤติกรรมเดิม)
  immigrationPolicy = state.immigrationPolicy || "open";
  // เซฟเก่าก่อนมีการปรับเกณฑ์ได้ (แค่ selective/closed/open ตายตัว) จะไม่มี field นี้ ให้ใช้ค่าเริ่มต้นกลางๆ แทน
  immigrationSettings = Object.assign(
    { minKnowledge: 55, quotaPerMonth: 8, skilledMinAge: 19 },
    state.immigrationSettings || {}
  );
  immigrationQuotaUsedThisMonth = state.immigrationQuotaUsedThisMonth || 0;
}

// เซฟเกม
function saveGame(slotName) {
  const state = getGameState();
  state.timestamp = new Date().toLocaleString("th-TH");
  localStorage.setItem(`citySave_${slotName}`, JSON.stringify(state));
  // เซฟช่องนี้กลายเป็น "เซฟที่กำลังเล่นอยู่" ตั้งแต่ตอนนี้ ทำให้กดเดือนถัดไปครั้งต่อๆ ไป
  // จะออโต้เซฟทับช่องนี้ให้เองอัตโนมัติ
  currentSaveSlot = slotName;
  refreshSaveList();
}

// ออโต้เซฟทับเซฟช่องที่กำลังเล่นอยู่ (currentSaveSlot) แบบเงียบๆ ไม่รบกวนผู้เล่นด้วยการรีเฟรช
// รายการเซฟ/ป๊อปอัปใดๆ เรียกจากท้าย nextMonth() ทุกครั้งที่ขึ้นเดือนใหม่
// ถ้ายังไม่เคยเซฟ/โหลดเกมนี้เลย (currentSaveSlot เป็น null) จะไม่ทำอะไร
function autoSaveCurrentSlot() {
  if (!currentSaveSlot) return;
  try {
    const state = getGameState();
    state.timestamp = new Date().toLocaleString("th-TH");
    localStorage.setItem(`citySave_${currentSaveSlot}`, JSON.stringify(state));
  } catch (e) {
    // เงียบไว้ (เช่น localStorage เต็ม) ไม่ให้กระทบการเล่นเกมหลัก
  }
}

// โหลดเกม
function loadGame(slotName) {
  const data = localStorage.getItem(`citySave_${slotName}`);
  if (!data) return toast(`❌ ไม่พบเซฟ "${slotName}"`);

  // 1. คืนค่าทุกตัวแปร
  const state = JSON.parse(data);
  setGameState(state);

  // เซฟช่องที่เพิ่งโหลดมา กลายเป็น "เซฟที่กำลังเล่นอยู่" ตั้งแต่ตอนนี้ กดเดือนถัดไป
  // ครั้งต่อๆ ไปจะออโต้เซฟทับช่องนี้ให้เองอัตโนมัติ
  currentSaveSlot = slotName;

  // 2. รีเฟรช UI
  updateInfo();
  if (typeof refreshTaxSliders === "function") refreshTaxSliders();
  if (typeof refreshImmigrationUI === "function") refreshImmigrationUI();
  if (typeof updateFiscalPanel === "function") updateFiscalPanel();
  if (typeof updateRepairPanel === "function") updateRepairPanel();
  if (typeof updateLoanStatus === "function") updateLoanStatus();

  // หมายเหตุ: เกมนี้เดินเดือนด้วยปุ่ม "เดือนถัดไป" ไม่มี auto-loop
  // (ของเดิมพยายามตั้ง setInterval(nextMonth, gameSpeed) แต่ gameSpeed
  // ไม่เคยถูกกำหนดค่าไว้เลย ทำให้เกิด error และหน้าต่างเซฟไม่ปิดหลังโหลดสำเร็จ)

  closeSaveManager();
  toast(`✅ โหลดเกมจาก "${slotName}" สำเร็จ`);

  // 🎭 ถ้าเซฟนี้บันทึกไว้ตอนมีเหตุการณ์ทางเลือกค้างอยู่พอดี (ยังไม่ทันเลือก) เปิด modal ให้เลือกต่อทันที
  if (activeCrisisEvent && typeof showCrisisModal === "function") {
    showCrisisModal();
  }
}

// ลบเซฟ
function deleteSave(slotName) {
  if (confirm(`ลบเซฟ "${slotName}" ?`)) {
    localStorage.removeItem(`citySave_${slotName}`);
    // ถ้าลบเซฟช่องที่กำลังเล่นอยู่ ให้เลิกออโต้เซฟทับช่องนี้ (ไม่งั้นเดือนถัดไปจะสร้างเซฟ
    // ช่องเดิมขึ้นมาใหม่โดยที่ผู้เล่นเพิ่งตั้งใจลบทิ้งไป)
    if (currentSaveSlot === slotName) currentSaveSlot = null;
    refreshSaveList();
  }
}

// ดึงรายชื่อเซฟ
function listSaves() {
  return Object.keys(localStorage)
    .filter(k => k.startsWith("citySave_"))
    .map(k => {
      const state = JSON.parse(localStorage.getItem(k));
      return {
        name: k.replace("citySave_", ""),
        timestamp: state.timestamp || "-"
      };
    });
}
function openSaveManager() {
  refreshSaveList();
  document.getElementById("saveManager").style.display = "flex";
}

function closeSaveManager() {
  document.getElementById("saveManager").style.display = "none";
}

function refreshSaveList() {
  const saves = listSaves();
  const listDiv = document.getElementById("saveList");
  listDiv.innerHTML = "";
  if (saves.length === 0) {
    listDiv.innerHTML = "<p>ไม่มีเซฟ</p>";
    return;
  }
  saves.forEach(slot => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${slot.name}</b> <small>(${slot.timestamp})</small>
      <button onclick="loadGame('${slot.name}')">โหลด</button>
      <button onclick="deleteSave('${slot.name}')">ลบ</button>
    `;
    listDiv.appendChild(div);
  });
}

function createNewSave() {
  const name = document.getElementById("newSaveName").value.trim();
  if (!name) return toast("ใส่ชื่อเซฟก่อน");
  saveGame(name);
  document.getElementById("newSaveName").value = "";
  refreshSaveList();
}