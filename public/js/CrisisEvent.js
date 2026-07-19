/* ===============================
   🎭 เหตุการณ์ทางเลือกเชิงนโยบาย (Crisis / Policy Events)
   ต่างจากเหตุการณ์อื่นๆ ใน EventCheck.js ตรงที่ระบบนี้ "ไม่ resolve เองอัตโนมัติ" —
   จะหยุดรอให้ผู้เล่นเลือกทางออกเอง (2-3 ทาง) แต่ละทางแลกเปลี่ยนกันคนละแบบ
   (เงินสด vs ความสุข vs หนี้สิน vs ชื่อเสียง) ไม่มีคำตอบที่ "ถูกต้องที่สุด" ตายตัว
   ทำให้ผู้เล่นต้องคิดตามสถานการณ์จริงของเมืองตัวเอง แทนที่จะกดไปตามสูตรเดียวได้ตลอดเกม
   =============================== */

const CRISIS_SCENARIOS = [
  {
    id: "factory_tax_break",
    minCityLevel: 1,
    icon: "🏭",
    title: "โรงงานใหญ่ขอสิทธิพิเศษทางภาษี",
    getDescription: () => "นักลงทุนรายใหญ่ต้องการขยายโรงงานในเมือง แต่ขอให้รัฐสนับสนุนงบเริ่มต้นเป็นการแลกเปลี่ยน หากตกลง จะได้โรงงานใหม่ทันที",
    choices: [
      {
        label: "✅ อนุมัติงบสนับสนุน รับโรงงานใหม่",
        apply: () => {
          const cost = Math.round((cityTaxCap[cityLevel] || 300000) * 0.12);
          subtractTreasury(cost);
          factories.push({ type: "factory", size: "medium", owner: "INVESTOR" });
          happiness = Math.min(100, happiness + 2);
          crisisEventReputation -= 1;
          return `อนุมัติงบสนับสนุน ${cost.toLocaleString()} บาท โรงงานใหม่เปิดตัวแล้ว ประชาชนบางส่วนพอใจเรื่องงาน`;
        }
      },
      {
        label: "❌ ปฏิเสธ รักษาสิทธิ์ภาษีเดิมไว้",
        isDefault: true,
        apply: () => {
          happiness = Math.max(0, happiness - 2);
          crisisEventReputation += 1;
          return "ปฏิเสธข้อเสนอ นักลงทุนผิดหวังเล็กน้อย แต่งบประมาณเมืองไม่กระทบ";
        }
      }
    ]
  },
  {
    id: "tax_protest",
    minCityLevel: 1,
    icon: "📢",
    title: "ประชาชนรวมตัวประท้วงเรื่องภาษี",
    getDescription: () => {
      const dev = typeof getTaxPolicyDeviation === "function" ? getTaxPolicyDeviation() : 0;
      return dev > 0.1
        ? "อัตราภาษีปัจจุบันสูงกว่ามาตรฐานพอสมควร ประชาชนกลุ่มหนึ่งรวมตัวประท้วงหน้าศาลากลาง เรียกร้องให้ทบทวน"
        : "มีกลุ่มผู้ไม่พอใจนโยบายภาษีออกมาเรียกร้องหน้าศาลากลาง แม้อัตราภาษีจะไม่ได้สูงมากนักก็ตาม";
    },
    choices: [
      {
        label: "🔉 ลดภาษีลงชั่วคราวเพื่อเอาใจประชาชน",
        apply: () => {
          Object.keys(taxMultiplier).forEach(type => {
            Object.keys(taxMultiplier[type]).forEach(size => {
              taxMultiplier[type][size] = taxMultiplier[type][size] + (1 - taxMultiplier[type][size]) * 0.4;
            });
          });
          happiness = Math.min(100, happiness + 6);
          crisisEventReputation += 1;
          return "ประกาศลดภาษีลงชั่วคราว ผู้ชุมนุมพอใจและสลายตัว";
        }
      },
      {
        label: "👮 ส่งตำรวจดูแลความสงบเรียบร้อย",
        apply: () => {
          const cost = Math.round((cityTaxCap[cityLevel] || 300000) * 0.06);
          subtractTreasury(cost);
          happiness = Math.max(0, happiness - 3);
          crisisEventReputation -= 2;
          return `ส่งตำรวจดูแลสถานการณ์ (-${cost.toLocaleString()} บาท) การชุมนุมยุติแต่ภาพลักษณ์รัฐบาลเสียหายเล็กน้อย`;
        }
      },
      {
        label: "🤷 ไม่ตอบสนองอะไรเป็นพิเศษ",
        isDefault: true,
        apply: () => {
          happiness = Math.max(0, happiness - 9);
          crisisEventReputation -= 1;
          return "เพิกเฉยต่อข้อเรียกร้อง ความไม่พอใจสะสมมากขึ้น";
        }
      }
    ]
  },
  {
    id: "drought_aid",
    minCityLevel: 1,
    icon: "🌵",
    title: "ภัยแล้งกระทบเกษตรกรรอบเมือง",
    getDescription: () => "ภัยแล้งรุนแรงกว่าปกติทำให้ผลผลิตทางการเกษตรลดลง เกษตรกรร้องขอเงินอุดหนุนฉุกเฉินจากรัฐ",
    choices: [
      {
        label: "💰 อนุมัติเงินอุดหนุนเกษตรกร",
        apply: () => {
          const cost = Math.round((cityTaxCap[cityLevel] || 300000) * 0.09);
          subtractTreasury(cost);
          foodUnitCost = Math.max(1, +(foodUnitCost * 0.94).toFixed(2));
          happiness = Math.min(100, happiness + 3);
          crisisEventReputation += 1;
          return `จ่ายเงินอุดหนุน ${cost.toLocaleString()} บาท ราคาอาหารทรงตัวได้ดีกว่าที่ควรจะเป็น`;
        }
      },
      {
        label: "🚫 ปล่อยให้เป็นไปตามกลไกตลาด",
        isDefault: true,
        apply: () => {
          foodUnitCost = +(foodUnitCost * 1.18).toFixed(2);
          happiness = Math.max(0, happiness - 2);
          return "ไม่เข้าแทรกแซง ราคาอาหารในตลาดพุ่งขึ้นจากภาวะขาดแคลน";
        }
      }
    ]
  },
  {
    id: "foreign_loan_offer",
    minCityLevel: 1,
    icon: "🌐",
    title: "นักลงทุนต่างชาติเสนอเงินกู้ก้อนใหญ่",
    getDescription: () => "กลุ่มทุนต่างชาติเสนอเงินกู้ก้อนใหญ่ให้ทันที เงื่อนไขเร็วกว่าขั้นตอนกู้เงินปกติมาก แต่ดอกเบี้ยสูงกว่าและนับรวมในเครดิตเมืองเช่นเดียวกับเงินกู้ทั่วไป",
    choices: [
      {
        label: "🤝 รับข้อเสนอ (ได้เงินก้อนใหญ่ทันที ดอกเบี้ย 22%)",
        apply: () => {
          const amount = Math.floor(collectTaxes() * 4);
          const interest = Math.floor(amount * 0.22);
          const totalDebt = amount + interest;
          addTreasury(amount);
          loan.totalBorrowed += amount;
          loan.remainingDebt += totalDebt;
          loan.monthlyPayment = Math.ceil((loan.remainingDebt) / 12);
          loan.isPaying = true;
          loanHistory.push((yearCount - 1) * 12 + monthCount);
          crisisEventReputation -= 1;
          return `รับเงินกู้ ${amount.toLocaleString()} บาท ดอกเบี้ย 22% (รวมหนี้ ${totalDebt.toLocaleString()} บาท) เข้านับรวมในเครดิตเมืองด้วย`;
        }
      },
      {
        label: "🙅 ปฏิเสธ รักษาวินัยทางการคลัง",
        isDefault: true,
        apply: () => {
          crisisEventReputation += 1;
          return "ปฏิเสธข้อเสนอ เลือกรักษาวินัยทางการเงินของเมืองไว้";
        }
      }
    ]
  },
  {
    id: "corruption_scandal",
    minCityLevel: 1,
    icon: "🕵️",
    title: "ข่าวหลุดเรื่องทุจริตงบประมาณ",
    getDescription: () => "มีข่าวหลุดเกี่ยวกับความไม่โปร่งใสในการใช้งบประมาณของเทศบาล สื่อและประชาชนกำลังจับตามองท่าทีของผู้บริหารเมือง",
    choices: [
      {
        label: "🔍 ตั้งกรรมการสอบสวนอย่างโปร่งใส",
        apply: () => {
          const cost = Math.round((cityTaxCap[cityLevel] || 300000) * 0.07);
          subtractTreasury(cost);
          happiness = Math.min(100, happiness + 5);
          crisisEventReputation += 2;
          return `ตั้งกรรมการสอบสวนอิสระ (-${cost.toLocaleString()} บาท) ประชาชนพอใจกับความโปร่งใส`;
        }
      },
      {
        label: "🤫 ปิดข่าวเงียบไว้ก่อน",
        isDefault: true,
        apply: () => {
          happiness = Math.max(0, happiness - 7);
          crisisEventReputation -= 2;
          return "เลือกปิดข่าว แต่ความจริงรั่วไหลออกมาอยู่ดี ความเชื่อมั่นของประชาชนลดลง";
        }
      }
    ]
  },
  {
    id: "tech_company_relocation",
    minCityLevel: 3,
    icon: "💻",
    title: "บริษัทเทคโนโลยีสนใจย้ายสำนักงานใหญ่มาที่เมือง",
    getDescription: () => "บริษัทเทคโนโลยีระดับภูมิภาคกำลังมองหาเมืองใหม่สำหรับตั้งสำนักงานใหญ่ และเมืองของเราติดอยู่ในลิสต์ตัวเลือก หากเสนอสิทธิประโยชน์ที่น่าสนใจพอ อาจตัดสินใจย้ายมาจริง",
    choices: [
      {
        label: "🎁 เสนอสิทธิประโยชน์ดึงดูดการลงทุน",
        apply: () => {
          const cost = Math.round((cityTaxCap[cityLevel] || 300000) * 0.16);
          subtractTreasury(cost);
          businesses.push({ type: "shop", size: "medium", owner: "INVESTOR" });
          businesses.push({ type: "shop", size: "medium", owner: "INVESTOR" });
          happiness = Math.min(100, happiness + 4);
          crisisEventReputation -= 1;
          return `เสนอสิทธิประโยชน์ (-${cost.toLocaleString()} บาท) บริษัทตัดสินใจย้ายมาจริง ร้านค้า/ธุรกิจเกี่ยวเนื่องเปิดใหม่ 2 แห่ง`;
        }
      },
      {
        label: "🙅 ไม่เสนออะไรเป็นพิเศษ",
        isDefault: true,
        apply: () => {
          return "ไม่ได้เสนอสิทธิประโยชน์ใดๆ บริษัทเลือกเมืองอื่นแทน";
        }
      }
    ]
  },
  {
    id: "neighbor_epidemic_aid",
    minCityLevel: 1,
    icon: "🚑",
    title: "เมืองใกล้เคียงขอความช่วยเหลือด้านสาธารณสุข",
    getDescription: () => "เมืองข้างเคียงเกิดการระบาดของโรคและขาดแคลนบุคลากร/งบประมาณทางการแพทย์ จึงส่งหนังสือขอความช่วยเหลือมายังเรา",
    choices: [
      {
        label: "🚑 ส่งความช่วยเหลือด้านการแพทย์และงบประมาณ",
        apply: () => {
          const cost = Math.round((cityTaxCap[cityLevel] || 300000) * 0.08);
          subtractTreasury(cost);
          monthsSinceLastEpidemic += 6;
          happiness = Math.min(100, happiness + 3);
          crisisEventReputation += 2;
          return `ส่งความช่วยเหลือ (-${cost.toLocaleString()} บาท) ความสัมพันธ์ระหว่างเมืองดีขึ้น และทีมแพทย์ที่ได้แลกเปลี่ยนความรู้มาช่วยลดความเสี่ยงโรคระบาดในเมืองเราด้วย`;
        }
      },
      {
        label: "🙅 ปฏิเสธ เก็บทรัพยากรไว้ใช้เอง",
        isDefault: true,
        apply: () => {
          crisisEventReputation -= 1;
          return "ปฏิเสธการร้องขอ เก็บงบประมาณไว้ใช้ภายในเมือง";
        }
      }
    ]
  },
  {
    id: "host_international_event",
    minCityLevel: 1,
    icon: "🌟",
    title: "ได้รับเชิญเป็นเจ้าภาพงานระดับนานาชาติ",
    getDescription: () => "องค์กรระหว่างประเทศเสนอให้เมืองของเราเป็นเจ้าภาพจัดงานระดับนานาชาติ ซึ่งจะช่วยสร้างชื่อเสียงและดึงดูดนักท่องเที่ยว แต่ต้องใช้งบประมาณเตรียมงานไม่น้อย",
    choices: [
      {
        label: "🌟 ตอบรับเป็นเจ้าภาพ",
        apply: () => {
          const cost = Math.round((cityTaxCap[cityLevel] || 300000) * 0.14);
          subtractTreasury(cost);
          happiness = Math.min(100, happiness + 9);
          monthsSinceLastTourismBoom = Math.min(monthsSinceLastTourismBoom, 2);
          crisisEventReputation += 1;
          return `ตอบรับเป็นเจ้าภาพ (-${cost.toLocaleString()} บาท) เมืองได้หน้าตาบนเวทีนานาชาติ ประชาชนภูมิใจ และมีโอกาสสูงที่การท่องเที่ยวจะบูมเร็วๆ นี้`;
        }
      },
      {
        label: "🙅 ปฏิเสธ ประหยัดงบประมาณไว้ก่อน",
        isDefault: true,
        apply: () => {
          return "ปฏิเสธข้อเสนอ ประหยัดงบประมาณไว้ใช้ในด้านอื่น";
        }
      }
    ]
  }
];

function getEligibleCrisisScenarios() {
  return CRISIS_SCENARIOS.filter(s => cityLevel >= (s.minCityLevel || 1));
}

// 🎲 เรียกทุกเดือนจาก nextMonth() — คืนค่า true ถ้ามีเหตุการณ์ใหม่เกิดขึ้น (ให้ผู้เรียกเปิด modal ต่อ)
function checkCrisisEvent() {
  // ถ้ามีเหตุการณ์ค้างจากเดือนก่อน (ผู้เล่นไม่ทันได้เลือก เช่น กดเดือนถัดไปรัวๆ ผ่าน API/ระบบอื่น)
  // จะ auto-resolve ด้วยตัวเลือก "ปลอดภัยที่สุด" (isDefault) ให้อัตโนมัติ กันเกมค้าง
  if (activeCrisisEvent) {
    const def = activeCrisisEvent.choices.find(c => c.isDefault) || activeCrisisEvent.choices[activeCrisisEvent.choices.length - 1];
    const resultText = def.apply();
    toast(`⌛ ไม่ได้ตัดสินใจเรื่อง "${activeCrisisEvent.title}" ทันเวลา จึงเลือกทางเลือกปลอดภัยให้อัตโนมัติ: ${resultText}`, "warning");
    activeCrisisEvent = null;
    if (typeof updateInfo === "function") updateInfo();
  }

  monthsSinceLastCrisisEvent++;

  if (typeof isGracePeriod === "function" && isGracePeriod()) return false;

  const COOLDOWN = 5;
  if (monthsSinceLastCrisisEvent < COOLDOWN) return false;

  if (Math.random() < 0.35) {
    const pool = getEligibleCrisisScenarios();
    if (pool.length === 0) return false;
    activeCrisisEvent = pool[Math.floor(Math.random() * pool.length)];
    monthsSinceLastCrisisEvent = 0;
    return true;
  }

  return false;
}

function resolveCrisisChoice(index) {
  if (!activeCrisisEvent) return;
  const choice = activeCrisisEvent.choices[index];
  if (!choice) return;

  const resultText = choice.apply();
  toast(`🎭 ${activeCrisisEvent.title}: ${resultText}`, "success");
  activeCrisisEvent = null;

  let overlay = document.getElementById("crisis-modal-overlay");
  if (overlay) overlay.remove();
  document.body.style.overflow = "";

  if (typeof updateInfo === "function") updateInfo();
}

// 🖼️ Modal เฉพาะของเหตุการณ์ทางเลือก — ตั้งใจไม่มีปุ่ม "ปิด" แบบทั่วไป (ต้องเลือกทางใดทางหนึ่งเท่านั้น)
// ใช้คลาส CSS ชุดเดียวกับ modal อื่นๆ ในเกม (.modal-overlay/.modal-box) เพื่อความสม่ำเสมอของดีไซน์
function showCrisisModal() {
  if (!activeCrisisEvent) return;

  let existingOverlay = document.getElementById("crisis-modal-overlay");
  if (existingOverlay) existingOverlay.remove();

  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.id = "crisis-modal-overlay";
  overlay.className = "modal-overlay";

  const choicesHtml = activeCrisisEvent.choices.map((c, i) =>
    `<button type="button" class="crisis-choice-btn" onclick="resolveCrisisChoice(${i})">${c.label}</button>`
  ).join("");

  const modal = document.createElement("div");
  modal.className = "modal-box crisis-modal-box";
  modal.innerHTML = `
    <div class="modal-body">
      <h2>${activeCrisisEvent.icon} ${activeCrisisEvent.title}</h2>
      <p class="crisis-desc">${activeCrisisEvent.getDescription()}</p>
      <div class="crisis-choice-list">${choicesHtml}</div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
