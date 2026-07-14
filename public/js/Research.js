let researchProjects = [
    // 🏙️ พัฒนาเมือง
    { id: "irrigation", category: "city", name: "ระบบชลประทาน", cost: 500000, time: 8, effect: "อาหารฤดูร้อน +10%", researched: false },
    { id: "advanced_housing", category: "city", name: "ที่อยู่อาศัยทันสมัย", cost: 800000, time: 10, effect: "เพิ่มความสุขคน +3", researched: false },
    { id: "smart_grid", category: "city", name: "ระบบไฟฟ้าอัจฉริยะ", cost: 700000, time: 12, effect: "ลดค่าใช้จ่ายโรงงาน -10%", researched: false },
    { id: "public_transport", category: "city", name: "ขนส่งมวลชนทันสมัย", cost: 600000, time: 6, effect: "ลดโอกาสปัญหาขนส่ง 50%", researched: false },
    { id: "urban_park", category: "city", name: "สวนสาธารณะขนาดใหญ่", cost: 400000, time: 5, effect: "ความสุขเพิ่มทุกเดือน +1", researched: false },

    // 💰 เศรษฐกิจ
    { id: "tourism_center", category: "economy", name: "ศูนย์ท่องเที่ยว", cost: 600000, time: 6, effect: "เพิ่มโอกาส Tourism Event +30%", researched: false },
    { id: "free_trade", category: "economy", name: "เขตการค้าเสรี", cost: 900000, time: 8, effect: "รายได้จากร้าน +8%", researched: false },
    { id: "industrial_upgrade", category: "economy", name: "อัพเกรดอุตสาหกรรม", cost: 1200000, time: 10, effect: "รายได้โรงงาน 7%", researched: false },
    { id: "tax_system", category: "economy", name: "ระบบจัดเก็บภาษีอัจฉริยะ", cost: 850000, time: 8, effect: "รายได้ภาษีรวม +5%", researched: false },
    { id: "digital_market", category: "economy", name: "ตลาดออนไลน์", cost: 500000, time: 12, effect: "รายได้ร้าน +3%", researched: false },

    // 🛡️ ป้องกันภัย
    { id: "Disaster_response", category: "defense", name: "ป้องกันภัยพิบัติ", cost: 800000, time: 10, effect: "ลดโอกาสเกิดทุกภัยพิบัติ 5%", researched: false },
    { id: "flood_barrier", category: "defense", name: "เขื่อนกันน้ำท่วม", cost: 700000, time: 10, effect: "ลดโอกาสน้ำท่วม 50%", researched: false },
    { id: "green_energy", category: "defense", name: "พลังงานสะอาด", cost: 1000000, time: 10, effect: "ลดผลเสียสิ่งแวดล้อม 50%", researched: false },
    { id: "emergency_drill", category: "defense", name: "ซ้อมรับมือภัยพิบัติ", cost: 500000, time: 5, effect: "ลดผลเสียภัยพิบัติใหญ่ 30%", researched: false },
    { id: "disease_research", category: "defense", name: "ศูนย์วิจัยโรค", cost: 950000, time: 15, effect: "ลดโอกาสโรคระบาด 40%", researched: false }
];

let activeResearch = null;
let researchMonthsLeft = 0;
function startResearch(projectId) {
    let project = researchProjects.find(p => p.id === projectId && !p.researched);
    if (!project) {
        toast("❌ ไม่พบโครงการวิจัยหรือวิจัยแล้ว");
        return;
    }
    if (treasury < project.cost) {
        toast("❌ เงินไม่พอทำการวิจัย");
        return;
    }
    if (activeResearch) {
        toast("❌ กำลังมีงานวิจัยอยู่แล้ว");
        return;
    }

    treasury -= project.cost;
    activeResearch = project;

    let techServants = civilServants.technology || 0;
    let speedBonus = techServants * 0.5; // ลดเวลา 0.5 เดือนต่อข้าราชการ 1 คน
    researchMonthsLeft = Math.max(1, project.time - speedBonus);

    toast(`🔬 เริ่มวิจัย "${project.name}" ใช้เวลา ${researchMonthsLeft} เดือน (ลดจาก ${project.time} เดือน ด้วยข้าราชการเทคโน ${techServants} คน)`);
    updateInfo();
}

// อัปเดตงานวิจัย (เรียกใน nextMonth)
function updateResearch() {
    if (activeResearch) {
        researchMonthsLeft--;
        if (researchMonthsLeft <= 0) {
            completeResearch(activeResearch);
            activeResearch = null;
        }
    }
}

// จบงานวิจัย
function completeResearch(project) {
    project.researched = true;
    toast(`✅ งานวิจัย "${project.name}" เสร็จสิ้น! (${project.effect})`);
}

function applyResearchEffects() {
    // รีเซ็ตค่าทุกครั้งก่อนคำนวณ
    researchEffects = {
        summerFoodBonus: 0,
        happinessBonus: 0,
        factoryCostReduction: 0,
        transportCrisisReduction: 0,
        monthlyHappinessIncrease: 0,
        tourismChanceBonus: 0,
        shopIncomeBonus: 0,
        shopIncomeBonus2: 0,
        factoryIncomeBonus: 0,
        taxIncomeBonus: 0,
        maxHappinessBonus: 0,
        disasterReduction: {
            earthquake: 0,
            flood: 0,
            environment: 0,
            majorDisaster: 0,
            epidemic: 0
        }
    };

    researchProjects.forEach(p => {
        if (!p.researched) return;
        switch (p.id) {
            case "irrigation":
                researchEffects.summerFoodBonus = 0.10;
                break;
            case "advanced_housing":
                researchEffects.happinessBonus = 3;
                break;
            case "smart_grid":
                researchEffects.factoryCostReduction = 0.10; // แก้บั๊ก: เดิมใส่ 0.90 (ลด 90%) ทั้งที่คำอธิบายบอก -10% ทำให้โอพีเกินจริง
                break;
            case "public_transport":
                researchEffects.transportCrisisReduction = 0.5;
                break;
            case "urban_park":
                researchEffects.monthlyHappinessIncrease = 1;
                break;
            
            case "tourism_center":
                researchEffects.tourismChanceBonus = 0.30;
                break;
            case "free_trade":
                researchEffects.shopIncomeBonus = 0.08;
                break;
            case "industrial_upgrade":
                researchEffects.factoryIncomeBonus = 0.07;
                break;
            case "tax_system":
                researchEffects.taxIncomeBonus = 0.05;
                break;
            case "digital_market":
                researchEffects.shopIncomeBonus2 = 0.04;
                break;
            case "Disaster_response":
                researchEffects.disasterReduction.earthquake = 0.05;
                break;
            case "flood_barrier":
                researchEffects.disasterReduction.flood = 0.50;
                break;
            case "green_energy":
                researchEffects.disasterReduction.environment = 0.50;
                break;
            case "emergency_drill":
                researchEffects.disasterReduction.majorDisaster = 0.30;
                break;
            case "disease_research":
                researchEffects.disasterReduction.epidemic = 0.40;
                break;
        }
    });
}

// เก็บ "ระดับ" ของ modal ปัจจุบัน เพื่อให้ปุ่ม "ปิด" รู้ว่าควรย้อนกลับไปหน้าเลือกหมวดหมู่
// หรือปิด popup ทั้งหมด (root = หน้าเลือกหมวดหมู่, category = หน้ารายการโครงการในหมวด)
let modalLevel = null;

function openResearchCenter() {
    modalLevel = "root";
    let html = `<h2>🏛️ ศูนย์วิจัย</h2>
    <p>เลือกหมวดหมู่เพื่อดูโครงการวิจัย:</p>
    <button onclick="showResearchCategory('city')">🏙️ พัฒนาเมือง</button>
    <button onclick="showResearchCategory('economy')">💰 เศรษฐกิจ</button>
    <button onclick="showResearchCategory('defense')">🛡️ ป้องกันภัย</button>`;

    showModal(html); // ฟังก์ชันนี้ไว้แสดง popup
}
function showResearchCategory(category) {
    modalLevel = "category";
    let projects = researchProjects.filter(p => p.category === category && !p.researched);

    if (projects.length === 0) {
        showModal(`<p>✅ ไม่มีโครงการในหมวดนี้ที่รอวิจัย</p>`);
        return;
    }

    let html = `<h3>โครงการวิจัยในหมวดนี้</h3>`;
    projects.forEach(p => {
        html += `<p>${p.name} - ${p.effect} | ราคา ${p.cost.toLocaleString()} | <button onclick="startResearch('${p.id}')">วิจัย</button></p>`;
    });

    showModal(html);
}
function showModal(content) {
    // ลบ overlay เก่าทิ้งก่อนเสมอ (ถ้ามีค้างอยู่) ป้องกันปัญหา modal ซ้อนกัน
    // ที่ทำให้ต้องกด "ปิด" สองครั้งกว่าจะปิดจริง
    let existingOverlay = document.getElementById("modal-overlay");
    if (existingOverlay) existingOverlay.remove();

    // ล็อกไม่ให้หน้าเว็บด้านหลังเลื่อนได้ขณะ popup เปิดอยู่
    // (ไม่งั้นตอนลากนิ้วเลื่อนดูรายชื่อยาว ๆ ในกล่อง จะลากพื้นหลังเลื่อนตามไปด้วย
    // ทำให้ popup ดูเหมือนหลุดจากกลางจอ)
    document.body.style.overflow = "hidden";

    // สร้าง div overlay (ใช้คลาส CSS แทน inline style ขาวล้วน
    // เพื่อให้รองรับธีมมืดด้วย)
    let overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    overlay.className = "modal-overlay";

    // สร้างกล่อง modal
    let modal = document.createElement("div");
    modal.className = "modal-box";
    modal.innerHTML = `
        <div class="modal-body">${content}</div>
        <div class="modal-footer"><button onclick="closeModal()">ปิด</button></div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function closeModal() {
    // ถ้าอยู่หน้ารายการโครงการในหมวด (category) ให้ย้อนกลับไปหน้าเลือกหมวดหมู่ (root) ก่อน
    // ต้องกด "ปิด" อีกครั้งตอนอยู่หน้าเลือกหมวดหมู่ถึงจะปิด popup ทั้งหมดจริง ๆ
    if (modalLevel === "category") {
        openResearchCenter();
        return;
    }
    modalLevel = null;
    document.body.style.overflow = ""; // คืนค่าให้หน้าเว็บเลื่อนได้ตามปกติ
    let overlay = document.getElementById("modal-overlay");
    if (overlay) overlay.remove();
}
function finishResearch(id) {
    let proj = researchProjects.find(r => r.id === id);
    if (!proj) return;
    
    proj.researched = true;
    
    switch (id) {
        // 🏙️ พัฒนาเมือง
        case "irrigation":
            researchEffects.summerFoodBonus = 0.10;
            break;
        case "advanced_housing":
            researchEffects.happinessBonus = 3;
            break;
        case "smart_grid":
            researchEffects.factoryCostReduction = 0.10;
            break;
        case "public_transport":
            researchEffects.transportCrisisReduction = 0.50;
            break;
        case "urban_park":
            researchEffects.monthlyHappinessIncrease = 1;
            break;
            
            // 💰 เศรษฐกิจ
        case "tourism_center":
            researchEffects.tourismChanceBonus = 0.30;
            break;
        case "free_trade":
            researchEffects.shopIncomeBonus = 0.08;
            break;
        case "industrial_upgrade":
            researchEffects.factoryIncomeBonus = 0.07;
            break;
        case "tax_system":
            researchEffects.taxIncomeBonus = 0.05;
            break;
        case "digital_market":
            researchEffects.shopIncomeBonus2 = 0.04;
            break;
            
            // 🛡️ ป้องกันภัย
        case "Disaster_response":
            researchEffects.disasterReduction.earthquake = 0.05;
            break;
        case "flood_barrier":
            researchEffects.disasterReduction.flood = 0.50;
            break;
        case "green_energy":
            researchEffects.disasterReduction.environment = 0.50;
            break;
        case "emergency_drill":
            researchEffects.disasterReduction.majorDisaster = 0.30;
            break;
        case "disease_research":
            researchEffects.disasterReduction.epidemic = 0.40;
            break;
    }
    
    toast(`✅ งานวิจัย "${proj.name}" เสร็จสิ้น!`);
    applyResearchEffects();
    updateInfo();
}