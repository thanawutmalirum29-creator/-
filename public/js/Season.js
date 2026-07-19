const seasons = ["Spring", "Summer", "Rainy", "Winter"];
let currentSeasonName = "Spring"; // เก็บชื่อฤดูกาลปัจจุบัน
let seasonMultiplier = 1;
function updateSeason(monthCount) {
  if (typeof monthCount !== "number" || isNaN(monthCount)) monthCount = 0;
  
  let currentSeasonIndex = Math.floor((monthCount % 12) / 3) % seasons.length;
  currentSeasonName = seasons[currentSeasonIndex];
  let seasonEffect = {
    happinessChange: 0,
    foodChangeRatio: 0
  };

// ปรับตามฤดูกาล
switch(currentSeasonName) {
    case "Summer":
        seasonMultiplier = 0.8; // ปกติลด 20%
        if (researchEffects.summerFoodBonus) {
            seasonMultiplier *= (1 + researchEffects.summerFoodBonus); 
            // +10% ถ้างานวิจัย irrigation เสร็จ
        }
        break;
    case "Rainy":
        seasonMultiplier = 1.12; // เพิ่มผลผลิต 12%
        break;
    case "Winter":
        seasonMultiplier = 0.95; // ลดผลผลิตเล็กน้อย
        break;
    case "Spring":
        seasonMultiplier = 1; // ไม่มีผล
        break;
}

  // ปรับค่า happiness
  if (seasonEffect.happinessChange !== 0) {
    happiness = Math.max(0, happiness + seasonEffect.happinessChange);
  }
  
  // ปรับสต็อกอาหาร
  if (seasonEffect.foodChangeRatio !== 0 && typeof foodStock === 'number') {
    let change = Math.floor(foodStock * seasonEffect.foodChangeRatio);
    if (currentSeasonName === "Summer" && researchEffects.summerFoodBonus) {
      change = Math.floor(change * (1 - researchEffects.summerFoodBonus));
    }
    foodStock = Math.max(0, foodStock + change);
  }
  
  console.log(`📅 ฤดูกาลปัจจุบัน: ${currentSeasonName}`);
}