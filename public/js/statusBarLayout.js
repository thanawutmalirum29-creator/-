/* ===============================
   ซิงก์ความสูงจริงของ #statusBar (แถบลอยบนสุด) เข้ากับตัวแปร CSS
   --status-bar-h เพื่อกันไม่ให้เนื้อหาด้านล่างโดนแถบลอยทับ
   ทำงานอัตโนมัติทุกครั้งที่ขนาดแถบเปลี่ยน (ตัดบรรทัด/ฟอนต์โหลดเสร็จ/หมุนจอ/ย่อขยายจอ)
   =============================== */
(function () {
  function syncHeight() {
    const bar = document.getElementById("statusBar");
    if (!bar) return;
    const h = Math.ceil(bar.getBoundingClientRect().height);
    if (h > 0) {
      document.documentElement.style.setProperty("--status-bar-h", h + "px");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    syncHeight();

    const bar = document.getElementById("statusBar");
    if (bar && "ResizeObserver" in window) {
      const ro = new ResizeObserver(() => syncHeight());
      ro.observe(bar);
    }

    // เผื่อฟอนต์เว็บ (Kanit/Sarabun) โหลดเสร็จช้ากว่า DOM แล้วทำให้ความกว้าง/ความสูงเปลี่ยน
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncHeight).catch(() => {});
    }

    window.addEventListener("resize", syncHeight);
    window.addEventListener("orientationchange", () => setTimeout(syncHeight, 150));
  });
})();
