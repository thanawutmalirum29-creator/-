// ฟังก์ชันช่วยลดผลกระทบตามความสุข
function adjustImpactByHappiness(value) {
    return (happiness < 30) ? Math.floor(value / 2) : value;
}

// 🕊️ ช่วงเวลาปลอดภัยตอนเริ่มเกม: 4 เดือนแรก (หรือประชากรยังน้อยกว่า 25 คน) จะไม่มีเหตุการณ์ร้ายแรงเกิดขึ้น
// ให้ผู้เล่นใหม่มีเวลาทำความเข้าใจระบบก่อนเจอวิกฤต (เหตุการณ์บวก/ข่าวลือ/สภาพอากาศยังทำงานตามปกติ)
function isGracePeriod() {
    const totalMonths = (yearCount - 1) * 12 + monthCount;
    return totalMonths <= 4 || citizens.length < 25;
}

// ฟังก์ชันช่วยลดผลกระทบตามจำนวนข้าราชการ
function adjustImpactByServants(value, count, max) {
    if (count >= Math.floor(max * 0.7)) {
        return Math.floor(value * 0.6); // ลด 40%
    }
    return value;
}

function epidemicCheck() {
    monthsSinceLastEpidemic++;

    if (isGracePeriod()) return;

    let doctorCount = civilServants.health || 0;
    let baseChance = 14; 
    let actualChance = Math.max(1, baseChance - (doctorCount * 2))*(1-researchEffects.disasterReduction.epidemic); 
    let cooldown = 8;

    if (monthsSinceLastEpidemic < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let baseHappinessLoss = 10 + cityLevel * 3;
        let baseMigrants = Math.floor(Math.random() * (5 + cityLevel * 2)) + 1;

        baseHappinessLoss = adjustImpactByHappiness(baseHappinessLoss);
        baseHappinessLoss = Math.floor(baseHappinessLoss * (1 - researchEffects.disasterReduction.epidemic));
        baseHappinessLoss = adjustImpactByServants(baseHappinessLoss, doctorCount, services.health.maxServants);

        let migrants = Math.max(1, baseMigrants - (doctorCount * 2));

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - baseHappinessLoss);
        for (let i = 0; i < migrants && citizens.length > 0; i++) citizens.pop();

        monthsSinceLastEpidemic = 0;
        toast(`🦠 โรคระบาด! ความสุขลด ${baseHappinessLoss}, คนย้ายออก ${migrants}`);
    }
}

function riotCheck() {
    monthsSinceLastRiot++;

    if (isGracePeriod()) return;

    let policeCount = civilServants.police || 0;
    let militaryCount = civilServants.military || 0; 

    let baseChance = 12; // increased for balance
    let actualChance = Math.max(1, baseChance - (policeCount * 2) - militaryCount);
    let cooldown = 7;

    if (monthsSinceLastRiot < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let baseHappinessLoss = 8 + cityLevel * 2;
        let baseMigrants = Math.floor(Math.random() * (5 + cityLevel * 2)) + 1;

        baseHappinessLoss = adjustImpactByHappiness(baseHappinessLoss);
        baseHappinessLoss = adjustImpactByServants(baseHappinessLoss, policeCount + militaryCount, services.police.maxServants + services.military.maxServants);

        let migrants = Math.max(1, baseMigrants - (policeCount + militaryCount));

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - baseHappinessLoss);
        for (let i = 0; i < migrants && citizens.length > 0; i++) citizens.pop();

        monthsSinceLastRiot = 0;
        toast(`🔥 จลกรรม! ความสุขลด ${baseHappinessLoss}, คนย้ายออก ${migrants}`);
    }
}

function infrastructureFailureCheck() {
    monthsSinceLastInfrastructureFailure++;

    if (isGracePeriod()) return;

    let engineerCount = civilServants.infrastructure || 0;
    let transportCount = civilServants.transport || 0;

    let baseChance = 8;
    let actualChance = Math.max(1, baseChance - (engineerCount * 1.5) - (transportCount * 0.5));
    let cooldown = 7;

    if (monthsSinceLastInfrastructureFailure < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let possibleStructures = ["ถนน", "สะพาน", "โรงไฟฟ้า", "ระบบน้ำประปา", "ท่าเรือ"];
        let broken = possibleStructures[Math.floor(Math.random() * possibleStructures.length)];

        damagedStructures.push(broken);
        applyInfrastructureDamageEffect(broken);

        let happinessLoss = 5 + cityLevel * 2;
        happinessLoss = adjustImpactByHappiness(happinessLoss);
        happinessLoss = adjustImpactByServants(happinessLoss, engineerCount + transportCount, services.infrastructure.maxServants + services.transport.maxServants);

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - happinessLoss);

        monthsSinceLastInfrastructureFailure = 0;
        toast(`⚠️ โครงสร้าง "${broken}" เสียหาย! ความสุขลด ${happinessLoss}`);
    }
}

function applyInfrastructureDamageEffect(structure) {
  if (structure === "โรงไฟฟ้า") {
    infrastructureImpact.factory *= 0.7;
  }
  if (structure === "ถนน") {
    infrastructureImpact.shop *= 0.85;
    infrastructureImpact.home *= 0.9;
  }
  if (structure === "ระบบน้ำประปา") {
    infrastructureImpact.home *= 0.85;
    infrastructureImpact.shop *= 0.85;
    infrastructureImpact.factory *= 0.85;
  }
  if (structure === "สะพาน" || structure === "ท่าเรือ") {
    infrastructureImpact.factory *= 0.8;
    infrastructureImpact.shop *= 0.85;
  }
}
  
function repairStructure(name) {
  let index = damagedStructures.indexOf(name);
  if (index === -1) return toast("❌ ไม่มีโครงสร้างนี้เสียหาย");

  let repairCost = 5000000-(500000*researchEffects.factoryCostReduction);
  if (treasury < repairCost) return toast("❌ เงินไม่พอซ่อม");

  subtractTreasury(repairCost);
  damagedStructures.splice(index, 1);

  if (name === "โรงไฟฟ้า") infrastructureImpact.factory = 1;
  if (name === "ถนน") { infrastructureImpact.shop = 1; infrastructureImpact.home = 1; }
  if (name === "ระบบน้ำประปา") { infrastructureImpact.home = 1; infrastructureImpact.shop = 1; infrastructureImpact.factory = 1; }
  if (name === "สะพาน" || name === "ท่าเรือ") { infrastructureImpact.factory = 1; infrastructureImpact.shop = 1; }

  toast(`🔧 ซ่อม "${name}" เสร็จแล้ว!`);
}
  
function warEventCheck() {
    monthsSinceLastWar++;

    if (isGracePeriod()) return;

    let militaryCount = civilServants.military || 0;
    let baseChance = 6; // increased for balance
    let actualChance = Math.max(1, baseChance - (militaryCount * 1.5));
    let cooldown = 20;

    if (monthsSinceLastWar < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let baseHappinessLoss = 15 + cityLevel * 5;
        let baseMigrants = Math.floor(Math.random() * (5 + cityLevel * 3)) + 2;

        baseHappinessLoss = adjustImpactByHappiness(baseHappinessLoss);
        baseHappinessLoss = adjustImpactByServants(baseHappinessLoss, militaryCount, services.military.maxServants);

        let migrants = Math.max(1, baseMigrants - militaryCount);

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - baseHappinessLoss);
        for (let i = 0; i < migrants && citizens.length > 0; i++) citizens.pop();

        monthsSinceLastWar = 0;
        toast(`⚔️ สงครามชายแดน! ความสุขลด ${baseHappinessLoss}, คนย้ายออก ${migrants}`);
    }
}

function transportCrisisCheck() {
    monthsSinceLastTransportCrisis++;

    if (isGracePeriod()) return;

    let transportCount = civilServants.transport || 0;
    let baseChance = 8;
    let actualChance = Math.max(1, (baseChance - (transportCount * 1.2))*(1-researchEffects.transportCrisisReduction));
    let cooldown = 6;

    if (monthsSinceLastTransportCrisis < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let happinessLoss = 6 + cityLevel * 2;
        happinessLoss = adjustImpactByHappiness(happinessLoss);
        happinessLoss = adjustImpactByServants(happinessLoss, transportCount, services.transport.maxServants);

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - happinessLoss);

        let penalty = 0.1 + cityLevel * 0.05;
        infrastructureImpact.home *= (1 - penalty);
        infrastructureImpact.shop *= (1 - penalty);
        infrastructureImpact.factory *= (1 - penalty);

        monthsSinceLastTransportCrisis = 0;
        toast(`🚧 ระบบขนส่งล่ม! ความสุขลด ${happinessLoss}, รายได้ลดลงชั่วคราว`);
    }
}

function environmentEventCheck() {
    monthsSinceLastEnvDisaster++;

    if (isGracePeriod()) return;

    let envCount = civilServants.environment || 0;
    let baseChance = 8; // ลดโอกาสพื้นฐาน
    let actualChance = Math.max(1, baseChance - (envCount * 1.5));
    let cooldown = 12; // เพิ่ม cooldown

    if (monthsSinceLastEnvDisaster < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let types = ["น้ำท่วมใหญ่", "มลพิษทางอากาศ", "ไฟป่า"];
        let disaster = types[Math.floor(Math.random() * types.length)];

        let happinessLoss = 10 + cityLevel * 3;
        happinessLoss = adjustImpactByHappiness(happinessLoss);
        happinessLoss = Math.floor(happinessLoss * (1 - researchEffects.disasterReduction.environment));
        happinessLoss = adjustImpactByServants(happinessLoss, envCount, services.environment.maxServants);

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - happinessLoss);
        monthsSinceLastEnvDisaster = 0;

        toast(`🌱 เหตุการณ์สิ่งแวดล้อม: ${disaster}! ความสุขลด ${happinessLoss}`);
    }
}

function majorDisasterEventCheck() {
    monthsSinceLastMajorDisaster++;

    if (isGracePeriod()) return;

    let reliefCount = civilServants.disaster || 0;
    let baseChance = 6; 
    let actualChance = Math.max(1, baseChance - (reliefCount * 1));
    let cooldown = 20;

    if (monthsSinceLastMajorDisaster < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let types = ["แผ่นดินไหว", "สึนามิ", "ภูเขาไฟระเบิด"];
        let disaster = types[Math.floor(Math.random() * types.length)];

        let happinessLoss = 30 + cityLevel * 5;
        happinessLoss = adjustImpactByHappiness(happinessLoss);
        happinessLoss = Math.floor(happinessLoss * (1 - researchEffects.disasterReduction.majorDisaster));
        happinessLoss = adjustImpactByServants(happinessLoss, reliefCount, services.disaster.maxServants);

        let baseMigrants = Math.floor(Math.random() * (5 + cityLevel * 5)) + 5;
        let migrants = Math.max(5, baseMigrants - (reliefCount * 3));

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - happinessLoss);
        for (let i = 0; i < migrants && citizens.length > 0; i++) citizens.pop();

        monthsSinceLastMajorDisaster = 0;
        toast(`🌋 ภัยพิบัติใหญ่: ${disaster}! ความสุขลด ${happinessLoss}, คนย้ายออก ${migrants}`);
    }
}

function tourismEventCheck() {
    monthsSinceLastTourismBoom++;

    let tourismCount = civilServants.tourism || 0;
    let baseChance = 10; 
    let actualChance = Math.max(1, (baseChance + (tourismCount * 1)) * (1+researchEffects.tourismChanceBonus)); 
    let cooldown = 8;

    if (monthsSinceLastTourismBoom < cooldown) return;

    let minPopForTourism = Math.max(20, cityLevel * 20);
    if (Math.random() * 100 < actualChance && citizens.length >= minPopForTourism) {
        let bonus = Math.floor((120000 + (tourismCount * 32000)) * Math.pow(cityLevel, 0.9));
        let handlingCost = Math.floor(bonus * 0.25);
        subtractTreasury(handlingCost);
        treasury += Math.floor(bonus - handlingCost);

        monthsSinceLastTourismBoom = 0;
        toast(`🏖️ การท่องเที่ยวบูม! ได้รายได้เพิ่ม ${bonus.toLocaleString()} บาท`);
    }
}

function technologyEventCheck() {
    monthsSinceLastTechBreakdown++;

    if (isGracePeriod()) return;

    let techCount = civilServants.technology || 0;
    let baseChance = 6;
    let actualChance = Math.max(1, baseChance - (techCount * 1.2));
    let cooldown = 10;

    if (monthsSinceLastTechBreakdown < cooldown) return;

    if (Math.random() * 100 < actualChance) {
        let penalty = 0.15 + (cityLevel * 0.03); // เมืองใหญ่โดนหนักขึ้น
        infrastructureImpact.factory *= (1 - penalty);
        infrastructureImpact.shop *= (1 - penalty);

        let happinessLoss = 5 + cityLevel * 2;
        happinessLoss = adjustImpactByHappiness(happinessLoss);
        happinessLoss = adjustImpactByServants(happinessLoss, techCount, services.technology.maxServants);

        happiness = Math.min(100, happiness + researchEffects.monthlyHappinessIncrease);
    happiness = Math.max(0, happiness - happinessLoss);
        monthsSinceLastTechBreakdown = 0;

        toast(`💻 ระบบคอมล่ม! ความสุขลด ${happinessLoss}, รายได้ร้าน/โรงงานลดลง`);
    }
}

function positiveEventCheck() {
  if (Math.random() < 0.28) {
    const events = [
      { text: "📦 งานจัดแสดงใหญ่ ดึงคนเที่ยวแต่ใช้งบจัด", action: () => { addTreasury(300000); subtractTreasury(200000); } },
      { text: "🚧 โครงการชุมชนดี แต่รบกวนการจราจร", action: () => { happiness = Math.min(100, happiness + 5); infrastructureImpact.shop *= 0.95; } },
      { text: "🏗️ นักลงทุนสร้างโรงงานขนาดกลาง", action: () => { factories.push({ type: "factory", size: "medium", owner: "INVESTOR" }); } },
      { text: "💰 ได้รับเงินสนับสนุนเล็กน้อยจากองค์กร", action: () => { if (citizens.length >= 30) addTreasury(250000); } },
      { text: "🎉 ชาวเมืองจัดงานปรับภูมิทัศน์ ความสุขเพิ่ม!", action: () => { happiness = Math.min(100, happiness + 8); } },
      { text: "🛍️ ตลาดขายดี มีรายได้เพิ่ม", action: () => { if (citizens.length >= 20) addTreasury(150000); } },
      { text: "🏡 ครอบครัวหนึ่งย้ายเข้าเมือง", action: () => { let cap = homes.reduce((s,h)=>s + (h.size==='large'?8:5),0); if (citizens.length < cap) spawnCitizen(); } },
      { text: "🌳 ปลูกต้นไม้เป็นโครงการชุมชน ความสุขขึ้นเล็กน้อย", action: () => { happiness = Math.min(100, happiness + 3); } }
    ];

    const e = events[Math.floor(Math.random() * events.length)];
    e.action();
    toast(`💡 เหตุการณ์ดีเกิดขึ้น: ${e.text}`);
  }
}
