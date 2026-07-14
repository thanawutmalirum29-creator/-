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
    currentSeasonName,            // ฤดูกาล
    currentEconomy,                // เศรษฐกิจโลก
    loan,                          // เงินกู้ทั้งหมด
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
    taxMultiplier,
    historyLog,
    immigrationPolicy,
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
  currentSeasonName = state.currentSeasonName || "Spring";
  currentEconomy = state.currentEconomy || "Stable";
  loan = state.loan || { totalBorrowed: 0, remainingDebt: 0, monthlyPayment: 0, isPaying: false };
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
  taxMultiplier = state.taxMultiplier || {
    home:    { small: 1, large: 1 },
    shop:    { small: 1, medium: 1, large: 1 },
    factory: { small: 1, medium: 1, large: 1 }
  };
  // เซฟเก่าก่อนมีฟีเจอร์กราฟย้อนหลังจะไม่มี field นี้ ให้เริ่มเป็น array ว่างแทน
  historyLog = Array.isArray(state.historyLog) ? state.historyLog : [];
  // เซฟเก่าก่อนมีฟีเจอร์นโยบายตรวจคนเข้าเมืองจะไม่มี field นี้ ให้ใช้ "เปิดรับทุกคน" เป็นค่าเริ่มต้น (พฤติกรรมเดิม)
  immigrationPolicy = state.immigrationPolicy || "open";
}

// เซฟเกม
function saveGame(slotName) {
  const state = getGameState();
  state.timestamp = new Date().toLocaleString("th-TH");
  localStorage.setItem(`citySave_${slotName}`, JSON.stringify(state));
  refreshSaveList();
}

// โหลดเกม
function loadGame(slotName) {
  const data = localStorage.getItem(`citySave_${slotName}`);
  if (!data) return toast(`❌ ไม่พบเซฟ "${slotName}"`);

  // 1. คืนค่าทุกตัวแปร
  const state = JSON.parse(data);
  setGameState(state);

  // 2. รีเฟรช UI
  updateInfo();
  if (typeof refreshTaxSliders === "function") refreshTaxSliders();
  if (typeof refreshImmigrationUI === "function") refreshImmigrationUI();

  // หมายเหตุ: เกมนี้เดินเดือนด้วยปุ่ม "เดือนถัดไป" ไม่มี auto-loop
  // (ของเดิมพยายามตั้ง setInterval(nextMonth, gameSpeed) แต่ gameSpeed
  // ไม่เคยถูกกำหนดค่าไว้เลย ทำให้เกิด error และหน้าต่างเซฟไม่ปิดหลังโหลดสำเร็จ)

  closeSaveManager();
  toast(`✅ โหลดเกมจาก "${slotName}" สำเร็จ`);
}

// ลบเซฟ
function deleteSave(slotName) {
  if (confirm(`ลบเซฟ "${slotName}" ?`)) {
    localStorage.removeItem(`citySave_${slotName}`);
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