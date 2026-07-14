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

  if (!bypassPolicy && typeof immigrationPolicy !== "undefined") {
    if (immigrationPolicy === "closed") {
      // 🚫 ปิดรับชั่วคราว: ไม่มีผู้อพยพใหม่เข้าเมืองเลย
      return;
    }
    if (immigrationPolicy === "selective" && Math.random() < 0.45) {
      // 🎓 รับเฉพาะมีความรู้ขั้นต่ำ: ผู้สมัครส่วนหนึ่งไม่ผ่านเกณฑ์ตรวจสอบ ทำให้โตช้าลง
      return;
    }
  }

  const gender = Math.random() < 0.5 ? "M" : "W";
  const age = Math.floor(Math.random() * 35) + 1;

  let knowledge;
  if (age <= 10) knowledge = Math.floor(Math.random() * 11) + 10;
  else if (age <= 15) knowledge = Math.floor(Math.random() * 21) + 20;
  else if (age <= 18) knowledge = Math.floor(Math.random() * 11) + 40;
  else if (age <= 25) knowledge = Math.floor(Math.random() * 41) + 50;
  else if (age <= 30) knowledge = Math.floor(Math.random() * 11) + 90;
  else knowledge = Math.floor(Math.random() * 21) + 100;

  // 🎓 นโยบาย "รับเฉพาะมีความรู้ขั้นต่ำ": ยกระดับความรู้ผู้อพยพที่ผ่านเกณฑ์ให้ไม่ต่ำกว่ามาตรฐานที่กำหนด
  // (จำลองว่าด่านตรวจคนเข้าเมืองคัดเฉพาะผู้มีวุฒิ/ทักษะสูงพอเข้ามา)
  if (!bypassPolicy && typeof immigrationPolicy !== "undefined" && immigrationPolicy === "selective") {
    const minKnowledgeForSelective = 55;
    if (knowledge < minKnowledgeForSelective) {
      knowledge = minKnowledgeForSelective + Math.floor(Math.random() * 20);
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

  foodStock += Math.floor(farmerCount * 0.1 * seasonMultiplier);

  infrastructureImpact.shop *= (1 + (merchantCount * 0.1));

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
updateInfo = function() {
  _oldUpdateInfo();

  // นับจำนวนอาชีพ
  let jobStats = jobs.map(job => {
    let count = citizens.filter(c => c.job === job).length;
    return `${job}: ${count} คน`;
  }).join("<br>");

  document.getElementById("info").innerHTML += `<br><br>👷‍♂️ อาชีพประชาชน:<br>${jobStats}`;
};