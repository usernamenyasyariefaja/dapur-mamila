/* =========================================================
   SCRIPT UTAMA - DAPUR MAMILA CIREBON
   1. Navigasi Mobile Responsif
   2. Filter Kategori Produk + Indikator Jumlah Menu
   3. Pratinjau Poster di Halaman yang Sama + Tombol Tutup Atas & Bawah
   4. Pelacakan Konversi GA4 & UTM
   ========================================================= */

(function () {
  if (window.__dmReady) return;
  window.__dmReady = true;

  function jalankanSkrip() {
    // 1. Navigasi Mobile
    var navToggle = document.getElementById("nav-toggle");
    var navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        navToggle.textContent = isOpen ? "Tutup ✕" : "Menu ☰";
      });

      document.addEventListener("click", function (e) {
        if (
          navMenu.classList.contains("open") &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)
        ) {
          navMenu.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.textContent = "Menu ☰";
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth >= 768 && navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.textContent = "Menu ☰";
        }
      });
    }

    // 2. Tangkap Parameter UTM
    var params = new URLSearchParams(window.location.search);
    var utmSource = params.get("utm_source");
    if (utmSource) {
      sessionStorage.setItem("dm_utm_source", utmSource);
      sessionStorage.setItem("dm_utm_medium", params.get("utm_medium") || "unknown");
      sessionStorage.setItem("dm_utm_campaign", params.get("utm_campaign") || "teman_lapar_cirebon");
    }

    // 3. Pelacakan Konversi GA4 pada tombol WhatsApp
    function lacakKlikWa(label) {
      var savedSource = sessionStorage.getItem("dm_utm_source") || "direct";
      var savedCampaign = sessionStorage.getItem("dm_utm_campaign") || "teman_lapar_cirebon";
      if (typeof window.gtag === "function") {
        window.gtag("event", "click_wa", {
          event_category: "conversion",
          event_label: label,
          traffic_source: savedSource,
          campaign_name: savedCampaign,
          page_location: window.location.pathname
        });
      }
    }

    document.querySelectorAll(".track-wa").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lacakKlikWa(btn.getAttribute("data-wa-label") || btn.textContent.trim());
      });
    });

    // 4. Filter Kategori Katalog Produk
    var filterButtons = document.querySelectorAll(".filter-btn");
    var productCards = document.querySelectorAll(".product-item");
    var filterStatus = document.getElementById("filter-status");

    if (filterButtons.length > 0 && productCards.length > 0) {
      filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          filterButtons.forEach(function (b) {
            b.classList.remove("active");
          });
          button.classList.add("active");

          var category = button.getAttribute("data-filter");
          var visibleCount = 0;

          productCards.forEach(function (card) {
            var cardCats = card.getAttribute("data-category") || "";
            if (category === "all" || cardCats.indexOf(category) !== -1) {
              card.style.display = "flex";
              visibleCount++;
            } else {
              card.style.display = "none";
            }
          });

          if (filterStatus) {
            filterStatus.textContent =
              "Menampilkan " + visibleCount + " daftar menu pada kategori: " + button.textContent.trim();
            filterStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      });
    }

    // 5. Pratinjau Poster dengan Tombol Tutup Atas & Bawah
    var posterTriggers = document.querySelectorAll("[data-poster]");
    if (posterTriggers.length > 0) {
      var modal = document.createElement("div");
      modal.className = "poster-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Pratinjau Poster Menu Dapur Mamila");
      modal.innerHTML =
        '<div class="poster-modal-box">' +
        '  <div class="poster-modal-header">' +
        '    <span class="poster-modal-title">Pratinjau Poster Menu</span>' +
        '    <button type="button" class="modal-close-top" aria-label="Tutup poster">✕ Tutup</button>' +
        "  </div>" +
        '  <img id="modal-poster-img" src="" alt="Poster Menu Dapur Mamila">' +
        '  <p id="modal-poster-caption" class="poster-modal-caption"></p>' +
        '  <div class="poster-modal-actions">' +
        '    <a id="modal-wa-btn" href="https://wa.me/6287877516500" class="btn btn-wa btn-sm" target="_blank" rel="noopener">Pesan Menu Ini via WhatsApp</a>' +
        '    <button type="button" class="btn btn-outline btn-sm modal-close-bottom">Keluar / Tutup</button>' +
        "  </div>" +
        "</div>";
      document.body.appendChild(modal);

      var modalImg = document.getElementById("modal-poster-img");
      var modalCaption = document.getElementById("modal-poster-caption");
      var modalWaBtn = document.getElementById("modal-wa-btn");
      var closeTopBtn = modal.querySelector(".modal-close-top");
      var closeBottomBtn = modal.querySelector(".modal-close-bottom");

      function tutupPoster() {
        modal.classList.remove("open");
        document.body.style.overflow = "";
      }

      posterTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function (e) {
          e.preventDefault();
          var src = trigger.getAttribute("data-poster");
          var title = trigger.getAttribute("data-title") || "Poster Menu Dapur Mamila";
          modalImg.src = src;
          modalImg.alt = title;
          modalCaption.textContent = title;
          modalWaBtn.href =
            "https://wa.me/6287877516500?text=" +
            encodeURIComponent("Halo Dapur Mamila, saya melihat " + title + " dan ingin memesan.");
          modal.classList.add("open");
          document.body.style.overflow = "hidden";
        });
      });

      modalWaBtn.addEventListener("click", function () {
        lacakKlikWa("Pratinjau Poster WA");
      });

      closeTopBtn.addEventListener("click", tutupPoster);
      closeBottomBtn.addEventListener("click", tutupPoster);
      modal.addEventListener("click", function (e) {
        if (e.target === modal) tutupPoster();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("open")) tutupPoster();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", jalankanSkrip);
  } else {
    jalankanSkrip();
  }
})();