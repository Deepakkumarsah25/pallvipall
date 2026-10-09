/**
 * PALLAVI PAL - MODERN GALLERY JAVASCRIPT
 * Real-time Instant Search, Fullscreen Lightbox, & AJAX Pagination
 */

document.addEventListener("DOMContentLoaded", () => {
  let cards = Array.from(document.querySelectorAll(".gallery-card"));
  let emptyState = document.getElementById("galleryEmptyState");
  const searchInput = document.getElementById("gallerySearchInput");
  const filterForm = document.getElementById("galleryFilters");
  const grid = document.getElementById("galleryGrid");
  const paginationHost = document.getElementById("galleryPaginationHost");

  // Lightbox Elements
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxDistrict = document.getElementById("lightboxDistrict");
  const lightboxDate = document.getElementById("lightboxDate");
  const lightboxName = document.getElementById("lightboxName");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
  const lightboxFullscreenToggleBtn = document.getElementById("lightboxFullscreenToggleBtn");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");
  const lightboxDownloadBtn = document.getElementById("lightboxDownloadBtn");

  let currentVisibleCards = [...cards];
  let activeIndex = 0;
  let searchTimer;
  let activeRequest;

  // ==========================================
  // 1. INSTANT LIVE SEARCH LOGIC
  // ==========================================

  function refreshCardList() {
    cards = Array.from(grid?.querySelectorAll(".gallery-card") || []);
    currentVisibleCards = [...cards];
    emptyState = document.getElementById("galleryEmptyState");
    if (emptyState) {
      emptyState.style.display = cards.length ? "none" : "block";
    }
  }

  const buildSearchUrl = () => {
    const url = new URL(filterForm?.action || window.location.href, window.location.origin);
    const params = new URLSearchParams();
    const query = searchInput ? searchInput.value.trim() : "";
    if (query) {
      params.set("search", query);
    }
    url.search = params.toString();
    return url;
  };

  const loadGallery = async (url, historyMode = "replace") => {
    activeRequest?.abort();
    activeRequest = new AbortController();

    try {
      const response = await fetch(url.pathname + url.search, {
        signal: activeRequest.signal,
        headers: { "X-Requested-With": "XMLHttpRequest", Accept: "text/html" },
      });
      if (!response.ok) throw new Error(`Gallery fetch failed (${response.status})`);

      const html = await response.text();
      const nextDoc = new DOMParser().parseFromString(html, "text/html");
      const nextGrid = nextDoc.getElementById("galleryGrid");
      const nextPagination = nextDoc.getElementById("galleryPaginationHost");
      const nextTotalBadge = nextDoc.getElementById("galleryTotalBadge");

      if (nextGrid && grid) {
        grid.innerHTML = nextGrid.innerHTML;
      }
      if (nextPagination && paginationHost) {
        paginationHost.innerHTML = nextPagination.innerHTML;
      }
      const totalBadge = document.getElementById("galleryTotalBadge");
      if (nextTotalBadge && totalBadge) {
        totalBadge.innerHTML = nextTotalBadge.innerHTML;
      }

      refreshCardList();

      if (historyMode === "push") {
        history.pushState({}, "", url.pathname + url.search);
      } else if (historyMode === "replace") {
        history.replaceState({}, "", url.pathname + url.search);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Live search error:", err);
      }
    }
  };

  // Instant search on typing with small 280ms debounce (no button required!)
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        loadGallery(buildSearchUrl(), "replace");
      }, 280);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(searchTimer);
        loadGallery(buildSearchUrl(), "replace");
      }
    });
  }

  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearTimeout(searchTimer);
      loadGallery(buildSearchUrl(), "replace");
    });
  }

  // Smooth AJAX pagination click handler (Previous, Next, page numbers)
  if (paginationHost) {
    paginationHost.addEventListener("click", (e) => {
      const link = e.target.closest(".gallery-pagination a");
      if (!link) return;
      e.preventDefault();

      const target = new URL(link.href, window.location.origin);
      clearTimeout(searchTimer);
      loadGallery(target, "push");

      // Smooth scroll to top of gallery grid
      const controls = document.querySelector(".gallery-controls");
      if (controls) {
        controls.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  window.addEventListener("popstate", () => {
    clearTimeout(searchTimer);
    const params = new URLSearchParams(window.location.search);
    if (searchInput) searchInput.value = params.get("search") || "";
    loadGallery(new URL(window.location.href), "none");
  });

  // ==========================================
  // 2. FULLSCREEN LIGHTBOX VIEWER
  // ==========================================

  function openLightbox(index) {
    refreshCardList();
    if (!currentVisibleCards || currentVisibleCards.length === 0) return;

    activeIndex = (index + currentVisibleCards.length) % currentVisibleCards.length;
    const card = currentVisibleCards[activeIndex];
    if (!card) return;

    const imgUrl = card.getAttribute("data-image");
    const name = card.getAttribute("data-name") || "कार्यक्रम फ़ोटो";
    const district = card.getAttribute("data-district") || "";
    const date = card.getAttribute("data-date") || "";
    const caption = card.getAttribute("data-caption") || "";

    if (lightboxImg) {
      lightboxImg.src = imgUrl;
      lightboxImg.alt = name;
    }
    if (lightboxName) lightboxName.textContent = name;
    if (lightboxDistrict) {
      lightboxDistrict.textContent = district ? `📍 ${district}` : "";
      lightboxDistrict.style.display = district ? "inline-flex" : "none";
    }
    if (lightboxDate) {
      lightboxDate.textContent = date ? `📅 ${date}` : "";
      lightboxDate.style.display = date ? "inline-flex" : "none";
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || "पल्लवी पाल - जनसेवा एवं सामाजिक सरोकार के ऐतिहासिक पल।";
    }

    if (lightboxDownloadBtn) {
      lightboxDownloadBtn.href = imgUrl;
    }

    if (lightbox) {
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  function showNextPhoto() {
    openLightbox(activeIndex + 1);
  }

  function showPrevPhoto() {
    openLightbox(activeIndex - 1);
  }

  // Toggle true browser Fullscreen
  function toggleBrowserFullscreen() {
    if (!document.fullscreenElement) {
      if (lightbox?.requestFullscreen) {
        lightbox.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // Event delegation to catch clicks on any gallery card
  grid?.addEventListener("click", (e) => {
    const card = e.target.closest(".gallery-card");
    if (!card) return;
    refreshCardList();
    const index = currentVisibleCards.indexOf(card);
    if (index !== -1) openLightbox(index);
  });

  // Keyboard navigation on card
  grid?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".gallery-card");
      if (!card) return;
      e.preventDefault();
      refreshCardList();
      const index = currentVisibleCards.indexOf(card);
      if (index !== -1) openLightbox(index);
    }
  });

  // Lightbox controls
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  if (lightboxFullscreenToggleBtn) lightboxFullscreenToggleBtn.addEventListener("click", toggleBrowserFullscreen);
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showNextPhoto();
    });
  }
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showPrevPhoto();
    });
  }

  // Click on dark backdrop closes lightbox
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation inside lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNextPhoto();
    if (e.key === "ArrowLeft") showPrevPhoto();
    if (e.key === "f" || e.key === "F") toggleBrowserFullscreen();
  });

  // Mobile Touch Swipe support
  let touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (diffX > 45) showPrevPhoto();
        else if (diffX < -45) showNextPhoto();
      },
      { passive: true }
    );
  }
});
