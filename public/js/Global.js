let treasury = 1000000;
let researchEffects = {
    tourismChanceBonus: 0,
    summerFoodBonus: 0,
    happinessBonus: 0,
    factoryCostReduction: 0,
    transportCrisisReduction: 0,
    monthlyHappinessIncrease: 0,
    shopIncomeBonus: 0,
    factoryIncomeBonus: 0,
    taxIncomeBonus: 0,
    disasterReduction: {
        earthquake: 0,
        flood: 0,
        environment: 0,
        majorDisaster: 0,
        epidemic: 0
    }
};

let happiness = 80;
let damagedStructures = [];
let infrastructureImpact = {
  home: 1,
  shop: 1,
  factory: 1
};
let homes = [];
let businesses = [];
let citizens = [];
let factories = []; 
let latestGrossIncome = 0;  
let latestNetIncome = 0;    
let monthCount = 1;
let yearCount = 1;
let monthsSinceLastBirth = 0;
let foodStock = 200000;
let foodPurchasePerMonth = 20000;
let foodUnitCost = 20;
let foodPriceIncrement = 0.05;  
let foodConsumedLastMonth = 0;  
let deadCitizens = []; 
let civilServants = {
    park: 0,
  health: 0,
  police: 0,
  infrastructure: 0,
  education: 0,
  military: 0,
  transport: 0,
  scholarship: 0,
  environment: 0,
  disaster: 0,
  tourism: 0,
  technology: 0,
  
};
let cityLevel = 1;
// ปรับให้เป็นเส้นโค้งที่สมูทขึ้น (เดิมมีเลขมุกตลก 555555 / 987654321 ทำให้บาลานซ์กระโดดไม่สม่ำเสมอ
// และเดิมเลเวลสูงแทบไม่มีเพดานเลย ทำให้ท้าทายน้อยเกินไปช่วงปลายเกม)
// เพดานภาษีเพิ่มขึ้นสม่ำเสมอทุกเลเวล โดยไม่ต่ำกว่าค่าดั้งเดิมที่เลเวลต้นๆ
let cityTaxCap = {
  1: 300000,
  2: 620000,
  3: 1500000,
  4: 2600000,
  5: 3800000,
  6: 5200000,
  7: 6800000,
  8: 8600000,
  9: 10600000,
  10: 14000000,
};

// 🍚 ระบบติดตามภาวะขาดแคลนอาหารต่อเนื่อง (ใช้แทนกฎเดิมที่จบเกมทันทีถ้าอาหารติดลบแม้แค่ 1 หน่วย)
let monthsInFamine = 0;

let monthsSinceLastEpidemic =999;
let monthsSinceLastRiot = 999;
let monthsSinceLastInfrastructureFailure = 999;
let monthsSinceLastWar = 999;
let monthsSinceLastTransportCrisis = 999;
let monthsSinceLastEnvDisaster = 999;
let monthsSinceLastMajorDisaster = 999;
let monthsSinceLastTourismBoom = 999;
let monthsSinceLastTechBreakdown = 999;

// 📈 ประวัติค่าคลัง/ความสุข/อาหาร/ประชากรย้อนหลัง สำหรับกราฟแดชบอร์ด
// เก็บไว้สูงสุด HISTORY_LOG_MAX เดือนล่าสุด (ตัดของเก่าออกเมื่อเกิน)
let historyLog = [];
const HISTORY_LOG_MAX = 36;

// 🛂 นโยบายตรวจคนเข้าเมือง: open = เปิดรับทุกคน, selective = รับเฉพาะมีความรู้ขั้นต่ำ, closed = ปิดรับชั่วคราว
let immigrationPolicy = "open";