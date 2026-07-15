/* ===============================
   ประหยัดโหลดเครื่อง: ข้ามการคำนวณ/วาด #info ก้อนใหญ่
   เมื่อ accordion "รายงานภาพรวมโดยละเอียด" ปิดอยู่ (ค่าเริ่มต้น)
   ไม่แตะ logic เกม แค่ครอบฟังก์ชัน updateInfo เดิมไว้เฉยๆ
   =============================== */
(function () {
  const originalUpdateInfo = window.updateInfo;
  if (typeof originalUpdateInfo !== "function") return; // กันพัง ถ้าลำดับสคริปต์เปลี่ยนไป

  // เดิม: ทุกครั้งที่มีอะไรมาเรียก updateInfo() (รวมถึง setInterval ทุก 1 วิ จาก scriptCity.js)
  // จะคำนวณ+เขียน DOM ก้อนใหญ่ "ทันทีแบบ synchronous" ถ้า accordion เปิดอยู่ ทำให้ตอนกดเปิดครั้งแรก
  // เบราว์เซอร์ต้องแบกงานหนักตรงกับตอนที่กำลังวาดกล่อง accordion ให้กางออกพอดี เกิดอาการค้าง/แลค
  // แก้โดย: 1) รวมคำสั่งเรียกซ้ำๆ ในเฟรมเดียวกันให้เหลือแค่ 1 ครั้ง (requestAnimationFrame)
  //         2) เว้นจังหวะเขียน DOM ก้อนใหญ่ไม่ให้ถี่เกิน 2 วิ/ครั้ง (ข้อมูลไม่จำเป็นต้องเรียลไทม์ระดับวินาที)
  //         3) ตอนกดเปิด accordion ครั้งแรก ให้รอเฟรมถัดไปก่อนค่อยคำนวณ ให้เบราว์เซอร์วาดกล่องกางออกจบก่อน
  let renderScheduled = false;
  let lastRenderTime = 0;
  const MIN_RENDER_INTERVAL_MS = 2000;

  function scheduleRender(force) {
    if (renderScheduled) return;
    renderScheduled = true;
    requestAnimationFrame(() => {
      renderScheduled = false;
      const now = Date.now();
      if (!force && now - lastRenderTime < MIN_RENDER_INTERVAL_MS) return;
      lastRenderTime = now;
      originalUpdateInfo();
    });
  }

  window.updateInfo = function (...args) {
    const details = document.getElementById("overviewDetails");
    // ถ้าไม่พบ accordion (เผื่ออนาคตมีการแก้ไข) ให้ทำงานตามปกติ ไม่ตัดอะไรออก
    if (!details) {
      return originalUpdateInfo.apply(this, args);
    }
    if (!details.open) return; // ปิดอยู่ -> ข้าม ประหยัดซีพียู/แบต ไม่ต้องคำนวณ+เขียน DOM ก้อนใหญ่ทุกวินาที
    scheduleRender(false);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const details = document.getElementById("overviewDetails");
    if (!details) return;
    // พอผู้ใช้กางออกดู ให้รีเฟรชข้อมูลทันที แต่รอให้เบราว์เซอร์วาดกล่อง accordion กางออกให้เสร็จก่อน
    // (2 เฟรม) กันไม่ให้การคำนวณ+เขียน DOM ก้อนใหญ่ไปบล็อกจังหวะที่กำลังกางกล่องอยู่พอดี
    details.addEventListener("toggle", () => {
      if (details.open) {
        requestAnimationFrame(() => requestAnimationFrame(() => scheduleRender(true)));
      }
    });
  });
})();
