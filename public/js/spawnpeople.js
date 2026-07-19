const maleNames = [
  "Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas", "Henry", "Theodore",
  "Jack", "Levi", "Alexander", "Jackson", "Mateo", "Daniel", "Michael", "Mason", "Sebastian", "Ethan",
  "Logan", "Owen", "Samuel", "Jacob", "Asher", "Aiden", "John", "Joseph", "Wyatt", "David",
  "Matthew", "Luke", "Julian", "Gabriel", "Carter", "Isaac", "Jayden", "Grayson", "Lincoln", "Anthony",
  "Hudson", "Dylan", "Ezra", "Thomas", "Charles", "Christopher", "Jaxon", "Maverick", "Josiah", "Isaiah",
  "Andrew", "Elias", "Joshua", "Nathan", "Caleb", "Ryan", "Adrian", "Miles", "Eli", "Nolan",
  "Christian", "Aaron", "Cameron", "Ezekiel", "Colton", "Luca", "Landon", "Hunter", "Jonathan", "Santiago",
  "Axel", "Easton", "Cooper", "Jeremiah", "Angel", "Roman", "Connor", "Jameson", "Robert", "Greyson",
  "Jordan", "Ian", "Carson", "Jaxson", "Leonardo", "Nicholas", "Dominic", "Austin", "Everett", "Brooks",
  "Xavier", "Kai", "Jose", "Parker", "Adam", "Jace", "Wesley", "Kayden", "Silas", "Bennett",
  // Polish
  "Jakub", "Kacper", "Antoni", "Szymon", "Jan", "Mikołaj", "Filip", "Wojciech",
  // Swedish
  "William", "Oscar", "Lucas", "Elias", "Hugo", "Alexander", "Liam", "Noah",
  // Brazilian (Portuguese)
  "João", "Lucas", "Gabriel", "Mateus", "Pedro", "Bruno", "Thiago", "Rafael",
  // Vietnamese
  "Minh", "Anh", "Duc", "Khoa", "Quang", "Hung", "Tuan", "Nam",
  // Thai
  "ธีระ", "กิตติ", "ณัฐวุฒิ", "ปกรณ์", "อนุชา", "ชัชวาล", "วีรยุทธ", "นิพนธ์",
  // Indonesian
  "Agus", "Budi", "Dwi", "Eko", "Hadi", "Joko", "Slamet", "Yusuf",
  // Greek
  "Dimitrios", "Georgios", "Nikolaos", "Panagiotis", "Vasileios", "Christos", "Ioannis",
  // Persian
  "Ali", "Reza", "Mohammad", "Hossein", "Amir", "Saeed", "Mehdi", "Kaveh",
  // Nigerian
  "Chinedu", "Emeka", "Tunde", "Ifeanyi", "Ade", "Uche", "Obinna", "Segun"
];
const femaleNames = [
  "Olivia", "Emma", "Charlotte", "Amelia", "Sophia", "Isabella", "Ava", "Mia", "Evelyn", "Luna",
  "Harper", "Camila", "Gianna", "Elizabeth", "Eleanor", "Ella", "Abigail", "Sofia", "Avery", "Scarlett",
  "Emily", "Aria", "Penelope", "Chloe", "Layla", "Mila", "Nora", "Hazel", "Madison", "Ellie",
  "Lily", "Nova", "Isla", "Grace", "Violet", "Aurora", "Riley", "Zoey", "Willow", "Emilia",
  "Stella", "Zoe", "Victoria", "Hannah", "Addison", "Leah", "Lucy", "Eliana", "Ivy", "Everly",
  "Lillian", "Paisley", "Natalie", "Naomi", "Delilah", "Brooklyn", "Elena", "Aubrey", "Claire", "Skylar",
  "Iris", "Aaliyah", "Savannah", "Audrey", "Genesis", "Bella", "Autumn", "Ariana", "Allison", "Hailey",
  "Gabriella", "Alice", "Madelyn", "Cora", "Ruby", "Eva", "Serenity", "Autumn", "Samantha", "Adeline",
  "Quinn", "Nevaeh", "Piper", "Sadie", "Josephine", "Sarah", "Leilani", "Natalia", "Everleigh", "Clara",
  "Vivian", "Raelynn", "Liliana", "Sophie", "Brielle", "Madeline", "Peyton", "Julia", "Rylee", "Melanie",
  // French
  "Louis", "Lucas", "Hugo", "Jules", "Gabriel", "Théo", "Mathis", "Nathan",
  // Spanish
  "Mateo", "Santiago", "Luis", "Carlos", "Diego", "Juan", "Javier", "Andrés",
  // Italian
  "Lorenzo", "Alessandro", "Matteo", "Leonardo", "Gabriele", "Andrea", "Riccardo",
  // German
  "Maximilian", "Paul", "Leon", "Lukas", "Finn", "Elias", "Ben", "Jonas",
  // Russian
  "Ivan", "Dmitry", "Alexei", "Sergey", "Mikhail", "Nikolai", "Vladimir", "Yuri",
  // Japanese
  "Haruto", "Souta", "Ren", "Yuto", "Kaito", "Riku", "Takumi", "Daiki",
  // Chinese
  "Wei", "Jie", "Hao", "Jun", "Ming", "Lei", "Tao", "Yuan",
  // Korean
  "Min-Jun", "Seo-Jun", "Ji-Hoon", "Jung-Hoon", "Hyun-Woo", "Jae-Hyun", "Tae-Hyun",
  // Indian
  "Aarav", "Vivaan", "Aditya", "Krishna", "Rohan", "Arjun", "Rahul", "Karan",
  // Turkish
  "Mehmet", "Mustafa", "Ahmet", "Ali", "Emir", "Yusuf", "Kerem", "Burak",
  // Arabic
  "Mohammed", "Ahmed", "Omar", "Ali", "Hassan", "Youssef", "Khalid", "Tariq",
  // French
  "Camille", "Léa", "Chloé", "Manon", "Inès", "Clara", "Emma", "Lucie",
  // Spanish
  "Sofía", "Valentina", "Camila", "Isabella", "Lucía", "Martina", "Paula", "María",
  // Italian
  "Giulia", "Sofia", "Aurora", "Alice", "Giorgia", "Francesca", "Martina", "Chiara",
  // German
  "Mia", "Emma", "Hannah", "Emilia", "Lina", "Marie", "Lea", "Anna",
  // Russian
  "Anastasia", "Olga", "Natalia", "Tatiana", "Ekaterina", "Irina", "Maria", "Svetlana",
  // Japanese
  "Yui", "Aoi", "Sakura", "Hina", "Riko", "Miyu", "Nanami", "Haruka",
  // Chinese
  "Mei", "Li", "Hua", "Xiu", "Fang", "Lan", "Ying", "Xia",
  // Korean
  "Seo-Yeon", "Ji-Woo", "Ha-Eun", "Min-Ji", "Soo-Min", "Yuna", "Hye-Jin", "Eun-Ji",
  // Indian
  "Ananya", "Aisha", "Saanvi", "Ishita", "Priya", "Kavya", "Lakshmi", "Meera",
  // Turkish
  "Elif", "Zeynep", "Defne", "Naz", "Eylül", "Yasmin", "Meryem", "Aylin",
  // Arabic
  "Fatima", "Aisha", "Zainab", "Layla", "Mariam", "Noor", "Sara", "Huda",


  // Polish
  "Zuzanna", "Julia", "Maja", "Hanna", "Lena", "Amelia", "Oliwia", "Alicja",
  // Swedish
  "Alice", "Maja", "Elsa", "Ella", "Wilma", "Ebba", "Agnes", "Julia",
  // Brazilian
  "Maria", "Ana", "Beatriz", "Clara", "Juliana", "Fernanda", "Larissa", "Camila",
  // Vietnamese
  "Trang", "Linh", "Thao", "Huong", "Mai", "Anh", "Ngoc", "Quyen",
  // Thai
  "สุภัสสร", "ปวีณา", "ณิชา", "อริสา", "พัชราภา", "กัญญา", "ธิดารัตน์", "ชลธิชา",
  // Indonesian
  "Siti", "Dewi", "Ayu", "Putri", "Rina", "Lestari", "Kartika", "Intan",
  // Greek
  "Maria", "Eleni", "Georgia", "Vasiliki", "Dimitra", "Katerina", "Sofia",
  // Persian
  "Fatemeh", "Zahra", "Maryam", "Shirin", "Niloofar", "Roya", "Parisa", "Ladan",
  // Nigerian
  "Chioma", "Ngozi", "Yetunde", "Adesuwa", "Amaka", "Aisha", "Kemi", "Temitope"
];
let citizenIDCounter = 1;
function generateCitizenID(gender) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const month = monthCount;
  const year = yearCount;
  const entryNumber = citizenIDCounter;
  const name = gender === "M" ? maleNames[Math.floor(Math.random() * maleNames.length)]
                              : femaleNames[Math.floor(Math.random() * femaleNames.length)];

  return `${name}-${gender}${randomNum}${month} ${year}${entryNumber}`;
}

function spawnCitizen() {
  const gender = Math.random() < 0.5 ? "M" : "W";
  const age = Math.floor(Math.random() * 35) + 5;

  let knowledge;
  if (age >= 1 && age <= 10) knowledge = Math.floor(Math.random() * 11) + 10;
  else if (age >= 11 && age <= 15) knowledge = Math.floor(Math.random() * 21) + 20;
  else if (age >= 16 && age <= 18) knowledge = Math.floor(Math.random() * 11) + 40;
  else if (age >= 19 && age <= 25) knowledge = Math.floor(Math.random() * 41) + 50;
  else if (age >= 26 && age <= 30) knowledge = Math.floor(Math.random() * 11) + 90;
  else knowledge = Math.floor(Math.random() * 21) + 100;

  const id = generateCitizenID(gender);

  citizens.push({
    id,
    gender,
    knowledge,
    age
  });

  citizenIDCounter++;
  updateInfo();
}

function spawnChildren() {
  let capacity = homes.reduce((sum, h) => sum + (h.size === "large" ? 8 : 5), 0);
  if (citizens.length >= capacity) return; // prevent birth if no housing
  if (happiness < 50) return;

  const numNewChildren = Math.floor(Math.random() * 2) + 1; // น้อยลงเพื่อบาลานซ์

  for (let i = 0; i < numNewChildren; i++) {
    const gender = Math.random() < 0.5 ? "M" : "W";
    const id = generateCitizenID(gender);

    citizens.push({
      id,
      gender,
      knowledge:10,
      age:1
    });

    citizenIDCounter++;
    updateInfo();
  }

  toast(`👶 มีเด็กเกิดใหม่ ${numNewChildren} คนในเดือนนี้!`);
}
const jobs = ["เกษตรกร", "พ่อค้า", "แพทย์", "วิศวกร", "ทหาร", "นักวิจัย"];

function assignRandomJob() {
  return jobs[Math.floor(Math.random() * jobs.length)];
}

const _oldSpawnCitizen = spawnCitizen;
// 🛂 spawnCitizen() คือจุดที่ "ผู้อพยพใหม่" เข้าเมือง (ย้ายเข้าจากนอกเมือง) จึงเป็นจุดที่นโยบาย
// ตรวจคนเข้าเมืองควรบังคับใช้ ต่างจาก spawnChildren() ที่เป็นเด็กเกิดจากประชาชนที่มีอยู่แล้ว
// (การเกิดในเมือง ไม่ใช่การอพยพ) จึงไม่ถูกจำกัดโดยนโยบายนี้
//
// เรียกแบบ spawnCitizen({ bypassPolicy: true }) สำหรับกรณีที่ไม่ใช่การอพยพจริงๆ
// เช่น ตอนตั้งค่าประชากรเริ่มเกม หรือระบบกันประชาชนย้ายออกพร้อมกันเยอะเกินไป (คนที่ตัดสินใจไม่ย้ายออก ไม่ใช่คนอพยพเข้าใหม่)
spawnCitizen = function(options) {
  options = options || {};
  const bypassPolicy = options.bypassPolicy === true;
  const policy = (!bypassPolicy && typeof immigrationPolicy !== "undefined") ? immigrationPolicy : null;
  const settings = (typeof immigrationSettings !== "undefined") ? immigrationSettings : { minKnowledge: 55, quotaPerMonth: 8, skilledMinAge: 19 };

  if (policy === "closed") {
    // 🚫 ปิดรับชั่วคราว: ไม่มีผู้อพยพใหม่เข้าเมืองเลย
    return;
  }

  if (policy === "quota") {
    // 🎫 โควตา: รับได้ไม่เกินจำนวนที่กำหนดต่อเดือน ไม่มีเงื่อนไขความรู้ ควบคุมการเติบโตแบบแม่นยำ/คาดเดาได้
    const quota = settings.quotaPerMonth || 8;
    if (typeof immigrationQuotaUsedThisMonth === "undefined" || immigrationQuotaUsedThisMonth >= quota) {
      return; // เต็มโควตาของเดือนนี้แล้ว
    }
  }

  const gender = Math.random() < 0.5 ? "M" : "W";
  let age = Math.floor(Math.random() * 35) + 1;

  // 🧑‍💼 นโยบาย "แรงงานมีทักษะ": มีแต่ผู้อพยพวัยทำงานขึ้นไปเท่านั้นที่ยื่นสมัครเข้ามา (ไม่มีเด็กติดตามครอบครัว)
  // สุ่มช่วงอายุใหม่ตรงนี้เลยแทนที่จะสุ่มแบบเดิมแล้วค่อยกรองทิ้งทีหลัง เพราะกรองทิ้งทีหลังจะยิ่งทำให้
  // สัดส่วนที่ผ่านเกณฑ์น้อยกว่าที่ควรเป็นซ้ำสอง (โดนกรองทั้งเรื่องอายุและความรู้ซ้อนกัน)
  if (policy === "skilled") {
    const minAge = Math.min(55, settings.skilledMinAge || 19);
    age = minAge + Math.floor(Math.random() * (60 - minAge));
  }

  let knowledge;
  if (age <= 10) knowledge = Math.floor(Math.random() * 11) + 10;
  else if (age <= 15) knowledge = Math.floor(Math.random() * 21) + 20;
  else if (age <= 18) knowledge = Math.floor(Math.random() * 11) + 40;
  else if (age <= 25) knowledge = Math.floor(Math.random() * 41) + 50;
  else if (age <= 30) knowledge = Math.floor(Math.random() * 11) + 90;
  else knowledge = Math.floor(Math.random() * 21) + 100;

  // 🎓 นโยบาย "รับเฉพาะมีความรู้ขั้นต่ำ" และ "แรงงานมีทักษะ" ใช้เกณฑ์ความรู้ขั้นต่ำร่วมกัน (ผู้เล่นปรับได้)
  //
  // ⚠️ แก้บั๊กสำคัญ: ของเดิมเช็คแบบ "สุ่มความรู้แล้วถ้าต่ำกว่าเกณฑ์ก็ปฏิเสธตรงๆ" ถ้าผู้เล่นตั้งเกณฑ์สูงเกินกว่า
  // ที่ระบบสุ่มความรู้จะสุ่มได้จริง (เพดานสุ่มอยู่ราว 120) นโยบายนี้จะปฏิเสธผู้สมัคร "ทุกคนตลอดไป" ไม่มีใครผ่าน
  // เกณฑ์ได้เลยสักคนเดียว เมืองจะหยุดรับผู้อพยพเข้าใหม่ทั้งที่นโยบายที่เลือกไม่ใช่ "ปิดรับ" (เมืองร้างทั้งที่ไม่ตั้งใจ)
  //
  // แก้โดยแยก "โอกาสถูกปฏิเสธ" ออกจาก "ระดับความรู้ที่สุ่มได้จริง": ยิ่งตั้งเกณฑ์สูง โอกาสถูกปฏิเสธยิ่งสูงตาม
  // (สูงสุด 85% เพื่อไม่ให้ถึงขั้น 100% ที่จะปิดกั้นสนิท) ส่วนผู้ที่ผ่านการคัดกรองแล้ว จะถูกยกระดับความรู้ให้ไม่ต่ำ
  // กว่าเกณฑ์เสมอไม่ว่าเกณฑ์จะตั้งไว้สูงแค่ไหน วิธีนี้ทำให้นโยบายยังทำงานได้จริงเสมอ ไม่ใช่กับดักที่ทำให้เมืองหยุดโต
  if (policy === "selective" || policy === "skilled") {
    const minK = Math.max(0, settings.minKnowledge || 55);
    const rejectChance = Math.min(0.85, Math.max(0, (minK - 20) / 150));
    if (Math.random() < rejectChance) return;

    if (knowledge < minK) {
      knowledge = minK + Math.floor(Math.random() * 20);
    }
  }

  const id = generateCitizenID(gender);

  citizens.push({
    id,
    gender,
    knowledge,
    age,
    job: assignRandomJob()
  });

  citizenIDCounter++;

  if (policy === "quota" && typeof immigrationQuotaUsedThisMonth !== "undefined") {
    immigrationQuotaUsedThisMonth++;
  }

  // 🤝 นโยบายมนุษยธรรม: รับทุกคนโดยไม่มีเงื่อนไข (เหมือน "เปิดรับทุกคน") แต่เก็บงบดูแล/ตั้งถิ่นฐานจากคลังเมือง
  // ต่อผู้อพยพ 1 คน แลกกับความสุขประชาชนที่เพิ่มขึ้นเล็กน้อยทุกครั้ง (ประชาชนรู้สึกดีที่เมืองดูแลคนลำบาก)
  if (policy === "humanitarian") {
    if (typeof treasury !== "undefined") treasury -= 800;
    if (typeof happiness !== "undefined") happiness = Math.min(100, happiness + 0.15);
  }

  updateInfo();
};

const _oldAgeCitizens = ageCitizens;
ageCitizens = function() {
  citizens.forEach(c => {
    c.age++;
    if (!c.job && c.age >= 15) {
      c.job = assignRandomJob();
    }
  });
};

function applyJobEffects() {
  let farmerCount = citizens.filter(c => c.job === "เกษตรกร").length;
  let merchantCount = citizens.filter(c => c.job === "พ่อค้า").length;
  let doctorCount = citizens.filter(c => c.job === "แพทย์").length;
  let engineerCount = citizens.filter(c => c.job === "วิศวกร").length;
  let soldierCount = citizens.filter(c => c.job === "ทหาร").length;
  let researcherCount = citizens.filter(c => c.job === "นักวิจัย").length;

  // 🌾 เพิ่มประสิทธิภาพเกษตรกรจาก 0.1 เป็น 0.22 ต่อคน — ทำให้ "มีเกษตรกรเยอะ" เป็นทางเลือกที่ช่วยแบ่งเบา
  // ค่าอาหารได้จริง ไม่ใช่แค่ตัวเลขเล็กจิ๋วที่แทบไม่มีผล (ความต้องการอาหารรวมโตไม่มีเพดานตามประชากร
  // แต่การผลิตของเกษตรกรเดิมช้าเกินจะตามทันแม้แต่เมืองขนาดกลาง)
  foodStock += Math.floor(farmerCount * 0.22 * seasonMultiplier);

  // 🛍️ คำนวณใหม่ทุกเดือนจากยอดพ่อค้าปัจจุบัน (ไม่ใช่คูณสะสม *= ทุกเดือนแบบเดิม ซึ่งถ้าไม่มีอะไรมารีเซ็ต
  // ค่านี้จะพุ่งไม่มีเพดานได้ — เดิมมันไม่พุ่งเพราะบั๊กใน monthlyWeatherEvent() บังเอิญรีเซ็ตให้ทุก ๆ 2 เดือน)
  // มีเพดานกันไม่ให้พ่อค้าล้นเมืองกลายเป็นบูสต์มหาศาลเกินจริง
  merchantShopBoost = Math.min(1.6, 1 + (merchantCount * 0.1));

  if (doctorCount > 0) monthsSinceLastEpidemic += Math.floor(doctorCount / 4);
  if (engineerCount > 0) monthsSinceLastInfrastructureFailure += Math.floor(engineerCount / 5);
  if (soldierCount > 0) monthsSinceLastWar += Math.floor(soldierCount / 5);

  if (researcherCount > 0) {
    citizens.forEach(c => {
      if (!c.employed) c.knowledge += Math.floor((researcherCount ** 0.85) * 0.1); // diminishing returns
    });
  }
}

const _oldNextMonth = nextMonth;
nextMonth = function() {
  applyJobEffects();
  _oldNextMonth();
};

const _oldUpdateInfo = updateInfo;
let _lastJobStatsSnapshot = null;
updateInfo = function() {
  _oldUpdateInfo();

  // 🐛 เดิมโค้ดตรงนี้ใช้ `#info.innerHTML +=` ต่อท้ายไปเรื่อยๆ ทุกครั้งที่ updateInfo() ถูกเรียก
  // (ทุก 1 วิ จาก setInterval) "โดยไม่เคยล้างของเก่าออกเลย" แม้ตอนแผงข้อมูลปิดอยู่ก็ยังต่อท้ายอยู่ดี
  // เพราะ _oldUpdateInfo() (ที่ผ่าน uiPerf.js) จะข้ามการรีเฟรช #info ทั้งก้อนไปเลยตอนแผงปิด
  // ผลคือ #info บวมขึ้นเรื่อยๆ ไม่มีที่สิ้นสุดตลอดเวลาที่เปิดเกมค้างไว้ ยิ่งเล่นนานยิ่งหนักเครื่อง/หน่วงขึ้นเรื่อยๆ
  // แก้โดยรอเฟรมถัดไป (ให้ทันจังหวะที่ uiPerf.js อาจรีเฟรช #info ทั้งก้อนก่อน) แล้วเขียนลงกล่องของ
  // ตัวเองที่แยกออกมาต่างหากด้วยการ "แทนที่" ทุกครั้ง ไม่ใช่ต่อท้ายสะสม และข้ามไปเลยถ้าแผงปิดอยู่
  // เพิ่มเติม: เทียบตัวเลขอาชีพก่อนเขียนด้วย (dirty-check) ถ้าจำนวนแต่ละอาชีพไม่เปลี่ยนเลยจากรอบก่อน
  // (เช่น setInterval ติ๊กแต่ยังไม่ถึงเดือนใหม่) จะไม่แตะ DOM ส่วนนี้เลย
  requestAnimationFrame(() => {
    const details = document.getElementById("overviewDetails");
    if (details && !details.open) return; // แผงปิดอยู่ ไม่ต้องทำอะไร ประหยัดซีพียู

    const infoEl = document.getElementById("info");
    if (!infoEl) return;

    let jobStats = jobs.map(job => {
      let count = citizens.filter(c => c.job === job).length;
      return `${job}: ${count} คน`;
    }).join("<br>");

    let jobBlock = document.getElementById("jobStatsBlock");
    const blockMissing = !jobBlock || jobBlock.parentNode !== infoEl;

    // ถ้าเลขอาชีพเหมือนเดิมทุกตัว และกล่องยังอยู่ครบ ไม่ต้องเขียน DOM ซ้ำ
    if (!blockMissing && jobStats === _lastJobStatsSnapshot) return;
    _lastJobStatsSnapshot = jobStats;

    if (blockMissing) {
      // เผื่อ _oldUpdateInfo() เพิ่งเขียน #info.innerHTML ทับใหม่ทั้งก้อน (ล้าง element เก่าทิ้งไปแล้ว)
      jobBlock = document.createElement("div");
      jobBlock.id = "jobStatsBlock";
      infoEl.appendChild(jobBlock);
    }
    jobBlock.innerHTML = `<br><br>👷‍♂️ อาชีพประชาชน:<br>${jobStats}`;
  });
};