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
// 🏚️ infrastructureImpact = ผลกระทบ "ถาวร" ต่อรายได้ จากโครงสร้างที่เสียหายค้างอยู่ (damagedStructures)
// เท่านั้น ค่านี้ถูกคำนวณใหม่ทุกครั้งด้วย recomputeInfrastructureDamage() (ใน EventCheck.js)
// จากรายการ damagedStructures ทั้งหมด (ไม่ใช่การคูณสะสมแบบเดิม) จึงซ่อมได้ถูกต้องแม้มีของเสียหายซ้อนกันหลายจุด
let infrastructureImpact = {
  home: 1,
  shop: 1,
  factory: 1
};
// 🌦️ weatherImpact = ผลจากสภาพอากาศเดือนนี้เท่านั้น คำนวณใหม่ทุกเดือนใน monthlyWeatherEvent()
// แยกออกจาก infrastructureImpact โดยเฉพาะ เพื่อไม่ให้สภาพอากาศไปเขียนทับความเสียหายถาวรทิ้ง
// (บั๊กเดิม: monthlyWeatherEvent() เคยรีเซ็ต infrastructureImpact ทั้งก้อนทุกเดือน ทำให้ความเสียหาย
// จากภัยพิบัติ/ค่าซ่อม ไม่มีผลอะไรต่อรายได้จริงเลยแม้แต่เดือนเดียว)
let weatherImpact = { home: 1, shop: 1, factory: 1 };
// ⏱️ temporaryImpact = ผลกระทบ "ชั่วคราว 1 เดือน" จากเหตุการณ์ที่ตั้งใจให้เป็นแค่สะดุดชั่วคราว
// (ระบบขนส่งล่ม / คอมล่ม / อีเวนต์สุ่มบางอัน) ถูกรีเซ็ตกลับเป็น 1 ทุกเดือนใน nextMonth()
// หลังใช้ค่าของเดือนก่อนหน้าไปคำนวณภาษีแล้ว จึงมีผล "จริง" 1 เดือนเต็มก่อนหาย ต่างจากเดิมที่ไม่มีผลเลย
let temporaryImpact = { home: 1, shop: 1, factory: 1 };
// 🛍️ ค่าบูสต์ร้านค้าจากจำนวนพ่อค้า คำนวณใหม่ทุกเดือนจากยอดพ่อค้าปัจจุบัน (ไม่ใช่การคูณสะสมไปเรื่อยๆ
// แบบเดิมที่ทำให้ตัวเลขพุ่งไม่มีเพดานถ้าเดือนไหนสภาพอากาศไม่รีเซ็ตให้ "บังเอิญ")
let merchantShopBoost = 1;

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
// 🔧 ลดจาก 0.05 เหลือ 0.035 ต่อเดือน — ราคาเดิมสะสมเร็วเกินไปข้ามเกมยาวๆ (ดูคำอธิบายเพิ่มเติมที่จุดใช้งานจริงใน nextmonth.js)
let foodPriceIncrement = 0.035;
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

// 💸 ระบบติดตามภาวะหนี้สินต่อเนื่อง (ใช้แทนกฎเดิมที่จบเกมทันทีถ้าคลังติดลบเกิน 1,000,000 แม้แค่เดือนเดียว
// — ปัญหาเดิม: ถ้าผู้เล่นซื้ออาหารทีเดียวเป็นก้อนใหญ่ตอนคลังใกล้หมด อาจดันคลังติดลบหนักชั่วขณะได้ทั้งที่
// แนวโน้มรายเดือนจริงยังเป็นบวก/แข็งแรงอยู่ ทำให้จบเกมแบบไม่ยุติธรรม ตอนนี้ต้องติดลบเกินเพดานต่อเนื่อง
// 3 เดือนจริงๆ ถึงจะถือว่าล้มละลาย ให้เวลาฟื้นตัวได้ถ้าแนวโน้มยังดีอยู่ สอดคล้องกับดีไซน์ของระบบอดอยากด้านบน)
let monthsInDebt = 0;

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

// 🛂 นโยบายตรวจคนเข้าเมือง: open / selective / closed / quota / skilled / humanitarian (ดูรายละเอียดเต็มใน immigration.js)
let immigrationPolicy = "open";

// ⚙️ พารามิเตอร์ปรับแต่งของแต่ละนโยบาย เก็บแยกจาก immigrationPolicy เพื่อให้สลับนโยบายไปมา
// ได้โดยไม่ลืมค่าที่ผู้เล่นตั้งไว้ก่อนหน้า (เช่นสลับไปดู "ปิดรับ" ชั่วคราวแล้วกลับมา "รับเฉพาะมีความรู้ขั้นต่ำ"
// เกณฑ์ที่เคยตั้งไว้ยังอยู่เหมือนเดิม)
let immigrationSettings = {
  minKnowledge: 55,   // ใช้กับนโยบาย "selective" และ "skilled" — เกณฑ์ความรู้ขั้นต่ำที่ยอมรับให้เข้าเมือง
  quotaPerMonth: 8,    // ใช้กับนโยบาย "quota" — จำนวนผู้อพยพสูงสุดที่รับได้ต่อเดือน
  skilledMinAge: 19    // ใช้กับนโยบาย "skilled" — อายุขั้นต่ำที่นับเป็น "แรงงานมีทักษะ" ที่รับเข้ามาได้
};

// นับจำนวนผู้อพยพที่รับเข้ามาแล้วในเดือนนี้ภายใต้นโยบาย "quota" — รีเซ็ตเป็น 0 ทุกครั้งที่ขึ้นเดือนใหม่ (ดู nextmonth.js)
let immigrationQuotaUsedThisMonth = 0;

// 🎪 ประวัติเดือนที่เคยจัดเทศกาล (เก็บ "เลขเดือนสะสม" เช่น (ปี-1)*12+เดือน) ใช้ทำ 2 อย่าง:
// 1) คูลดาวน์ขั้นต่ำระหว่างครั้ง กันสแปมกดรัวๆ ทุกเดือน
// 2) ผลตอบแทนลดลงถ้าจัดถี่เกินไปในรอบ 12 เดือนล่าสุด (จัดครั้งแรกในรอบปีได้เต็ม ครั้งต่อๆ ไปลดลง)
let festivalHistory = [];

// 🏦 ประวัติเดือนที่เคยกู้เงิน ใช้คำนวณ "เครดิต" ของเมือง — กู้ถี่ในช่วงเวลาสั้นๆ ดอกเบี้ยจะขยับสูงขึ้น
// และวงเงินกู้สูงสุดจะลดลงชั่วคราว จำลองความน่าเชื่อถือทางการเงินที่ลดลงเมื่อเป็นหนี้ซ้ำซาก
let loanHistory = [];

// 🎭 ระบบ "เหตุการณ์ทางเลือกเชิงนโยบาย" — บางเดือนจะมีสถานการณ์ให้เลือกตัดสินใจ 2-3 ทาง
// แทนที่จะเป็นแค่สูตรคำนวณอัตโนมัติทั้งหมด activeCrisisEvent เก็บสถานการณ์ที่รอการตัดสินใจอยู่ตอนนี้
// (null = ไม่มีสถานการณ์ค้าง) monthsSinceLastCrisisEvent ใช้ทำคูลดาวน์ระหว่างเหตุการณ์แต่ละครั้ง
let activeCrisisEvent = null;
let monthsSinceLastCrisisEvent = 3; // เริ่มเกมใหม่ไม่ต้องรอนานเกินไปกว่าจะเจอเหตุการณ์แรก แต่ก็ไม่ทันที
let crisisEventReputation = 0; // ผลสะสมจากการเลือกตัดสินใจที่ผ่านมา (บวก = มักเลือกทางที่ดูแลประชาชน, ลบ = มักเลือกทางที่เอาเงินเข้าเมือง)

// 🌍 พยากรณ์เศรษฐกิจปีถัดไป — ประกาศล่วงหน้าก่อนเปลี่ยนจริง ให้ผู้เล่นมีเวลาเตรียมตัว/วางแผนงบ
// (แก้จากเดิมที่เศรษฐกิจเปลี่ยนแบบไม่มีสัญญาณเตือนใดๆ ล่วงหน้าเลย)
let upcomingEconomy = null;

// 💾 ชื่อเซฟที่กำลังเล่นอยู่ตอนนี้ (ตั้งค่าตอนโหลดเซฟ หรือตอนกดบันทึกครั้งแรก)
// ถ้ามีค่านี้ กดเดือนถัดไปจะออโต้เซฟทับเซฟช่องนี้ให้อัตโนมัติ ถ้าเป็น null แปลว่ายังไม่เคยเซฟ/โหลด
// เกมนี้เลย (เช่นเพิ่งเริ่มเกมใหม่) จะไม่ออโต้เซฟจนกว่าผู้เล่นจะกดบันทึกหรือโหลดเซฟครั้งแรกเอง
let currentSaveSlot = null;