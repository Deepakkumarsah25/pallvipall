/**
 * SANKALP PHOTO GALLERY — JAVASCRIPT
 * District Filter, Real-time Search, and Lightbox Viewer
 */

document.addEventListener("DOMContentLoaded", () => {
  let cards = Array.from(document.querySelectorAll(".gallery-card"));
  let emptyState = document.getElementById("galleryEmptyState");
  const searchInput = document.getElementById("gallerySearchInput");
  const districtFilter = document.getElementById("galleryDistrictFilter");
  const filterForm = document.getElementById("galleryFilters");
  const grid = document.getElementById("galleryGrid");
  const paginationHost = document.getElementById("galleryPaginationHost");
  const visibleCountBadge = document.getElementById("visibleCountBadge");

  // Lightbox Elements
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxDistrict = document.getElementById("lightboxDistrict");
  const lightboxDate = document.getElementById("lightboxDate");
  const lightboxName = document.getElementById("lightboxName");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");
  const lightboxDownloadBtn = document.getElementById("lightboxDownloadBtn");

  let currentVisibleCards = [...cards];
  let activeIndex = 0;
  let filterTimer;
  let activeRequest;

  // ==========================================
  // FILTERING LOGIC
  // ==========================================

  function applyFilters() {
    currentVisibleCards = [...cards];
    cards.forEach((card) => { card.style.display = ""; });
    if (emptyState) emptyState.style.display = cards.length ? "none" : "block";
    if (visibleCountBadge) visibleCountBadge.textContent = `${cards.length} फ़ोटो`;
  }

  const buildFilterUrl = () => {
    const url = new URL(filterForm.action, window.location.origin);
    const params = new URLSearchParams(new FormData(filterForm));
    params.delete("page");
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
      if (!response.ok) throw new Error(`Gallery request failed (${response.status})`);
      const documentHtml = await response.text();
      const nextDocument = new DOMParser().parseFromString(documentHtml, "text/html");
      const nextGrid = nextDocument.getElementById("galleryGrid");
      const nextPagination = nextDocument.getElementById("galleryPaginationHost");
      if (!nextGrid || !nextPagination) throw new Error("Gallery results were not found in the response.");

      grid.innerHTML = nextGrid.innerHTML;
      paginationHost.innerHTML = nextPagination.innerHTML;
      cards = Array.from(grid.querySelectorAll(".gallery-card"));
      emptyState = grid.querySelector("#galleryEmptyState");
      applyFilters();
      if (historyMode === "push") history.pushState({}, "", url.pathname + url.search);
      else if (historyMode === "replace") history.replaceState({}, "", url.pathname + url.search);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
        window.location.assign(url.pathname + url.search);
      }
    }
  };

  const scheduleFilter = (delay = 350) => {
    clearTimeout(filterTimer);
    filterTimer = setTimeout(() => loadGallery(buildFilterUrl()), delay);
  };

  if (filterForm) {
    filterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      scheduleFilter(0);
    });
    districtFilter?.addEventListener("change", () => scheduleFilter(250));
    searchInput?.addEventListener("input", () => scheduleFilter(450));
    paginationHost?.addEventListener("click", (event) => {
      const link = event.target.closest(".gallery-pagination a");
      if (!link) return;
      const target = new URL(link.href, window.location.origin);
      if (target.origin !== window.location.origin) return;
      event.preventDefault();
      clearTimeout(filterTimer);
      loadGallery(target, "push");
    });
    window.addEventListener("popstate", () => {
      clearTimeout(filterTimer);
      const params = new URLSearchParams(window.location.search);
      searchInput.value = params.get("search") || "";
      districtFilter.value = params.get("district") || "all";
      loadGallery(new URL(window.location.href), "none");
    });
  }
  // LIGHTBOX LOGIC
  // ==========================================

  function openLightbox(index) {
    if (!currentVisibleCards || currentVisibleCards.length === 0) return;

    activeIndex = (index + currentVisibleCards.length) % currentVisibleCards.length;
    const card = currentVisibleCards[activeIndex];
    if (!card) return;

    const imgUrl = card.getAttribute("data-image");
    const name = card.getAttribute("data-name") || "अभियान के सदस्य";
    const district = card.getAttribute("data-district") || "";
    const date = card.getAttribute("data-date") || "";
    const caption = card.getAttribute("data-caption") || "";

    lightboxImg.src = imgUrl;
    lightboxImg.alt = name;
    lightboxName.textContent = name;
    lightboxDistrict.textContent = district ? `📍 ${district}` : "";
    lightboxDate.textContent = date ? `📅 ${date}` : "";
    lightboxCaption.textContent = caption || "पल्लवी पाल - जनसेवा एवं सामाजिक सरोकार के ऐतिहासिक पल।";

    if (lightboxDownloadBtn) {
      lightboxDownloadBtn.href = imgUrl;
    }

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showNextPhoto() {
    openLightbox(activeIndex + 1);
  }

  function showPrevPhoto() {
    openLightbox(activeIndex - 1);
  }

  // Event delegation keeps lightbox clicks working after AJAX filter updates.
  grid?.addEventListener("click", (event) => {
    const card = event.target.closest(".gallery-card");
    const index = currentVisibleCards.indexOf(card);
    if (index !== -1) openLightbox(index);
  });

  // Lightbox Nav buttons
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNextPhoto();
  });
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrevPhoto();
  });

  // Click outside box to close
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNextPhoto();
    if (e.key === "ArrowLeft") showPrevPhoto();
  });

  // Mobile Touch Swipe support for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

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
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 50) {
          if (diffX < 0) {
            // Swiped left
            showNextPhoto();
          } else {
            // Swiped right
            showPrevPhoto();
          }
        }
      },
      { passive: true }
    );
  }

  // Initial filter run
  applyFilters();
});
