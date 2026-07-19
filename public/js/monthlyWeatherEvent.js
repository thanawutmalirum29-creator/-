// 🌦️ สภาพอากาศรายเดือน — ผลกระทบ "เดือนต่อเดือน" ล้วนๆ เขียนลง weatherImpact เท่านั้น
// (ไม่แตะ infrastructureImpact ซึ่งตอนนี้สงวนไว้สำหรับความเสียหายถาวรจากภัยพิบัติ/ระบบขนส่ง/คอมล่มเท่านั้น
// — เดิมไฟล์นี้เขียนทับ infrastructureImpact ทั้งก้อนทุกเดือน ทำให้ความเสียหายถาวรที่เพิ่งเกิดไม่มีผล
// อะไรต่อรายได้เลยแม้แต่เดือนเดียว เพราะโดนอากาศ "ล้าง" ทิ้งก่อนจะทันมีผลกับ collectTaxes() รอบถัดไป)
function monthlyWeatherEvent() {
  // ความน่าจะเป็นอากาศปกติ (45%)
  if (Math.random() < 0.45) {
    weatherImpact = { home: 1, shop: 1, factory: 1 };
    return { happinessChange: 0, incomeMultiplier: 1, message: "อากาศปกติ" };
  }

  const specialWeathers = [
    { name: "แดดจัด", happiness: 2, incomeMultiplier: 1.02 },
    { name: "ฝนตก", happiness: -1, incomeMultiplier: 0.96 },
    { name: "พายุแรง", happiness: -4, incomeMultiplier: 0.90 },
    { name: "อากาศเย็นสบาย", happiness: 3, incomeMultiplier: 1.06 },
    // 🌵 ภัยแล้ง: ของใหม่ กระทบทั้งรายได้และราคาอาหาร (เกษตรกรผลิตอาหารได้น้อยลงเดือนนั้น) —
    // เชื่อมสภาพอากาศเข้ากับระบบอาหารให้รู้สึกมีผลกระทบจริงมากขึ้น ไม่ใช่แค่ตัวเลขรายได้ลอยๆ
    { name: "ภัยแล้ง", happiness: -3, incomeMultiplier: 0.93, foodPriceBump: 0.08 }
  ];

  let weather = specialWeathers[Math.floor(Math.random() * specialWeathers.length)];

  happiness = Math.max(0, happiness + weather.happiness);

  weatherImpact = {
    home: weather.incomeMultiplier,
    shop: weather.incomeMultiplier,
    factory: weather.incomeMultiplier
  };

  if (weather.foodPriceBump) {
    foodUnitCost = +(foodUnitCost * (1 + weather.foodPriceBump)).toFixed(2);
  }

  let message = `🌦 สภาพอากาศเดือนนี้: ${weather.name} (ความสุข ${weather.happiness >= 0 ? "+" : ""}${weather.happiness}, รายได้เดือนหน้า ${(weather.incomeMultiplier > 1 ? "+" : "") + ((weather.incomeMultiplier - 1) * 100).toFixed(1)}%)`;
  toast(message, weather.incomeMultiplier < 1 ? "warning" : "success");

  return { happinessChange: weather.happiness, incomeMultiplier: weather.incomeMultiplier, message };
}
