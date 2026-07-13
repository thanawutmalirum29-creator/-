/* ===============================
   ประหยัดโหลดเครื่อง: ข้ามการคำนวณ/วาด #info ก้อนใหญ่
   เมื่อ accordion "รายงานภาพรวมโดยละเอียด" ปิดอยู่ (ค่าเริ่มต้น)
   ไม่แตะ logic เกม แค่ครอบฟังก์ชัน updateInfo เดิมไว้เฉยๆ
   =============================== */
(function () {
  const originalUpdateInfo = window.updateInfo;
  if (typeof originalUpdateInfo !== "function") return; // กันพัง ถ้าลำดับสคริปต์เปลี่ยนไป

  window.updateInfo = function (...args) {
    const details = document.getElementById("overviewDetails");
    // ถ้าไม่พบ accordion (เผื่ออนาคตมีการแก้ไข) ให้ทำงานตามปกติ ไม่ตัดอะไรออก
    if (!details || details.open) {
      return originalUpdateInfo.apply(this, args);
    }
    // ปิดอยู่ -> ข้าม ประหยัดซีพียู/แบต ไม่ต้องคำนวณ+เขียน DOM ก้อนใหญ่ทุกวินาที
  };

  document.addEventListener("DOMContentLoaded", () => {
    const details = document.getElementById("overviewDetails");
    if (!details) return;
    // พอผู้ใช้กางออกดู ให้รีเฟรชข้อมูลทันที ไม่ต้องรอรอบ interval ถัดไป
    details.addEventListener("toggle", () => {
      if (details.open) originalUpdateInfo();
    });
  });
})();
