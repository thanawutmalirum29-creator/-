/* ===============================
   ซิงก์ความสูงจริงของ #quickBar (แถบเมนูลัดลอยติดล่างสุด) เข้ากับตัวแปร CSS
   --quick-bar-h เพื่อกันไม่ให้เนื้อหาด้านบนโดนแถบลอยนี้ทับ (แพทเทิร์นเดียวกับ statusBarLayout.js
   ที่ทำกับแถบสถานะด้านบน) ทำงานอัตโนมัติทุกครั้งที่ขนาดแถบเปลี่ยน (ตัดบรรทัด/ฟอนต์โหลดเสร็จ/หมุนจอ/ย่อขยายจอ)
   =============================== */
(function () {
  function syncHeight() {
    const bar = document.getElementById("quickBar");
    if (!bar) return;
    const h = Math.ceil(bar.getBoundingClientRect().height);
    if (h > 0) {
      document.documentElement.style.setProperty("--quick-bar-h", h + "px");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    syncHeight();

    const bar = document.getElementById("quickBar");
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
