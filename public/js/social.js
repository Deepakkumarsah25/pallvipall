/**
 * Interactive Horizontal Rails Script (Gallery & Social Media Rails)
 * Supports:
 * - Smooth right-to-left Auto-Slide with interval loop
 * - Touch swipe & mouse drag-to-scroll with grab cursor
 * - Pause on hover / touch / user scroll & auto-resume
 * - Interactive Previous / Next arrow buttons
 * - Infinite scroll pagination on horizontal drag/scroll for platform rails
 */

document.addEventListener("DOMContentLoaded", function () {
  const rails = document.querySelectorAll(".social-track-wrap, .ak-cards-scroll-wrap");

  // Helper to construct dynamic social post cards matching exact homepage UI
  function createCardElement(post, platform) {
    const card = document.createElement("a");
    card.href = post.url || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.className = "rail-card rail-card-" + platform + " rail-card-clickable";
    card.setAttribute("aria-label", post.title || post.caption || platform + " Post");

    // Media Box
    const mediaBox = document.createElement("div");
    mediaBox.className = "rail-card-media-box";

    const fallbackImg =
      platform === "instagram"
        ? "/images/kalash-yatra-featured.jpg"
        : platform === "facebook"
        ? "/images/democratic-pledge-featured.jpg"
        : "/images/ranchi-kalash-procession.jpg";

    if (post.mediaUrl) {
      const img = document.createElement("img");
      img.src = post.mediaUrl;
      img.alt = post.title || post.caption || platform + " Post";
      img.className = "rail-media-img";
      img.loading = "lazy";
      img.onerror = function () {
        this.onerror = null;
        this.src = fallbackImg;
      };
      mediaBox.appendChild(img);
    } else {
      const fallbackDiv = document.createElement("div");
      fallbackDiv.className = "rail-media-fallback";
      mediaBox.appendChild(fallbackDiv);
    }

    if (post.mediaType === "video") {
      const videoBadge = document.createElement("div");
      videoBadge.className = "rail-video-play-badge";
      videoBadge.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
      mediaBox.appendChild(videoBadge);
    }

    const cornerIcon = document.createElement("span");
    const cornerClass = platform === "instagram" ? "corner-ig" : platform === "facebook" ? "corner-fb" : "corner-tw";
    cornerIcon.className = "rail-corner-icon " + cornerClass;
    cornerIcon.title = platform === "instagram" ? "Instagram" : platform === "facebook" ? "Facebook" : "X (Twitter)";

    if (platform === "instagram") {
      cornerIcon.innerHTML =
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
    } else if (platform === "facebook") {
      cornerIcon.innerHTML =
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
    } else {
      cornerIcon.innerHTML =
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
    }
    mediaBox.appendChild(cornerIcon);
    card.appendChild(mediaBox);

    // Card Body
    const cardBody = document.createElement("div");
    cardBody.className = "rail-card-body";

    // Date Pill (No platform chip beside date)
    const bodyTop = document.createElement("div");
    bodyTop.className = "rail-body-top";

    const datePill = document.createElement("div");
    datePill.className = "rail-date-pill";
    const formattedDate =
      post.formattedDate ||
      (post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "25 May 2026");
    datePill.innerHTML = '<span class="pill-cal-icon">📅</span><span class="pill-date-text">' + formattedDate + "</span>";
    bodyTop.appendChild(datePill);
    cardBody.appendChild(bodyTop);

    // Heading only (No description below title)
    const heading = document.createElement("h4");
    heading.className = "rail-card-heading";
    heading.textContent = post.title || post.caption || platform + " Post";
    cardBody.appendChild(heading);

    // Footer Metrics (No 'View Post' link button)
    const footer = document.createElement("div");
    footer.className = "rail-card-footer";
    const metricsGroup = document.createElement("div");
    metricsGroup.className = "rail-metrics-group";

    const likesCount = (post.likesCount || 0).toLocaleString();
    const commentsCount = (post.commentsCount || 0).toLocaleString();
    const sharesCount = (post.sharesCount || 0).toLocaleString();

    if (platform === "facebook") {
      metricsGroup.innerHTML =
        '<span class="rail-metric metric-likes" title="Likes"><span class="metric-icon">👍</span><span class="metric-num">' +
        likesCount +
        '</span></span><span class="rail-metric metric-comments" title="Comments"><span class="metric-icon">💬</span><span class="metric-num">' +
        commentsCount +
        '</span></span><span class="rail-metric metric-shares" title="Shares"><span class="metric-icon">🔁</span><span class="metric-num">' +
        sharesCount +
        "</span></span>";
    } else if (platform === "twitter") {
      metricsGroup.innerHTML =
        '<span class="rail-metric metric-likes" title="Likes"><span class="metric-icon">❤️</span><span class="metric-num">' +
        likesCount +
        '</span></span><span class="rail-metric metric-comments" title="Replies"><span class="metric-icon">💬</span><span class="metric-num">' +
        commentsCount +
        '</span></span><span class="rail-metric metric-shares" title="Reposts"><span class="metric-icon">🔁</span><span class="metric-num">' +
        sharesCount +
        "</span></span>";
    } else {
      metricsGroup.innerHTML =
        '<span class="rail-metric metric-likes" title="Likes"><span class="metric-icon">❤️</span><span class="metric-num">' +
        likesCount +
        '</span></span><span class="rail-metric metric-comments" title="Comments"><span class="metric-icon">💬</span><span class="metric-num">' +
        commentsCount +
        "</span></span>";
    }

    footer.appendChild(metricsGroup);
    cardBody.appendChild(footer);
    card.appendChild(cardBody);

    return card;
  }

  // Helper to load next page for platform rails
  async function checkAndLoadMore(rail) {
    if (!rail.dataset.platform || rail.dataset.hasMore !== "true" || rail.dataset.loading === "true") {
      return;
    }

    const scrollRemaining = rail.scrollWidth - (rail.scrollLeft + rail.clientWidth);
    if (scrollRemaining > 450) {
      return;
    }

    rail.dataset.loading = "true";
    const platform = rail.dataset.platform;
    const currentPage = parseInt(rail.dataset.page || "1", 10);
    const nextPage = currentPage + 1;

    try {
      const res = await fetch("/api/social/posts?platform=" + encodeURIComponent(platform) + "&page=" + nextPage + "&limit=8");
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const json = await res.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const track = rail.querySelector(".social-cards-track");
        if (track) {
          json.data.forEach(function (post) {
            const cardEl = createCardElement(post, platform);
            track.appendChild(cardEl);
          });
        }
        rail.dataset.page = String(nextPage);
        rail.dataset.hasMore = json.pagination && json.pagination.hasNext ? "true" : "false";
      } else {
        rail.dataset.hasMore = "false";
      }
    } catch (err) {
      console.warn("Error fetching more " + platform + " posts:", err);
      rail.dataset.hasMore = "false";
    } finally {
      rail.dataset.loading = "false";
    }
  }

  rails.forEach(function (rail, index) {
    if (rail.dataset.railInitialized === "true") return;
    rail.dataset.railInitialized = "true";

    let isPaused = false;
    let autoSlideTimer = null;
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasMoved = false;
    let userScrollTimeout = null;

    // Helper to calculate card step (card width + gap)
    function getStepSize() {
      const firstCard = rail.querySelector(".gallery-card, .rail-card, .ak-card, article");
      if (firstCard) {
        const style = window.getComputedStyle(firstCard);
        const cardWidth = firstCard.offsetWidth;
        const marginRight = parseFloat(style.marginRight) || 0;
        return cardWidth + marginRight + 20;
      }
      return rail.clientWidth * 0.75 || 320;
    }

    // Function to advance the rail forward (Right-to-Left slide)
    function slideNext() {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 10) return; // Not enough content to scroll

      // Trigger lazy pagination load if approaching rail end
      checkAndLoadMore(rail);

      const step = getStepSize();
      if (rail.scrollLeft >= maxScroll - 25) {
        if (rail.dataset.hasMore === "true") {
          // Keep sliding once more content loads
          checkAndLoadMore(rail);
        } else {
          // Reached the end and no more posts to load, loop back smoothly to start
          rail.scrollTo({ left: 0, behavior: "smooth" });
        }
      } else {
        // Advance forward
        rail.scrollBy({ left: step, behavior: "smooth" });
      }
    }

    // Function to slide backwards
    function slidePrev() {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 10) return;

      const step = getStepSize();
      if (rail.scrollLeft <= 25) {
        rail.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        rail.scrollBy({ left: -step, behavior: "smooth" });
      }
    }

    // Setup Auto-Slide with staggered interval (Gallery: 3500ms, IG: 4000ms, FB: 4500ms, TW: 5000ms)
    const intervalMs = 3500 + (index % 4) * 500;

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(function () {
        if (!isPaused && document.visibilityState === "visible") {
          slideNext();
        }
      }, intervalMs);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    // Pause on hover
    rail.addEventListener("mouseenter", function () {
      isPaused = true;
    });

    rail.addEventListener("mouseleave", function () {
      isPaused = false;
      isDown = false;
      rail.classList.remove("is-dragging");
    });

    // Pause on touch gestures & swipe
    rail.addEventListener(
      "touchstart",
      function () {
        isPaused = true;
      },
      { passive: true }
    );

    rail.addEventListener(
      "touchmove",
      function () {
        checkAndLoadMore(rail);
      },
      { passive: true }
    );

    rail.addEventListener(
      "touchend",
      function () {
        clearTimeout(userScrollTimeout);
        userScrollTimeout = setTimeout(function () {
          isPaused = false;
        }, 2800);
      },
      { passive: true }
    );

    // Smooth pause on manual scrolling & infinite scroll pagination check
    rail.addEventListener(
      "scroll",
      function () {
        checkAndLoadMore(rail);

        if (isDown) return;
        isPaused = true;
        clearTimeout(userScrollTimeout);
        userScrollTimeout = setTimeout(function () {
          isPaused = false;
        }, 3000);
      },
      { passive: true }
    );

    // Enable mouse drag-to-scroll on desktop
    rail.addEventListener("mousedown", function (e) {
      isDown = true;
      hasMoved = false;
      isPaused = true;
      rail.classList.add("is-dragging");
      startX = e.pageX - rail.offsetLeft;
      scrollStart = rail.scrollLeft;
    });

    window.addEventListener("mouseup", function () {
      if (isDown) {
        isDown = false;
        rail.classList.remove("is-dragging");
        clearTimeout(userScrollTimeout);
        userScrollTimeout = setTimeout(function () {
          isPaused = false;
        }, 2500);
      }
    });

    rail.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) {
        hasMoved = true;
      }
      rail.scrollLeft = scrollStart - walk;
      checkAndLoadMore(rail);
    });

    // Prevent accidental card click while dragging
    rail.addEventListener(
      "click",
      function (e) {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    // Initialize auto-slide
    startAutoSlide();

    // Store controller for button triggers & tab visibility
    rail._railController = {
      slideNext: slideNext,
      slidePrev: slidePrev,
      startAutoSlide: startAutoSlide,
      stopAutoSlide: stopAutoSlide,
      checkAndLoadMore: function () {
        return checkAndLoadMore(rail);
      },
    };
  });

  // Setup Arrow Controls (‹ and › buttons if present)
  const arrowButtons = document.querySelectorAll(".rail-arrow-btn");
  arrowButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-target");
      const rail = document.getElementById(targetId);
      if (!rail) return;

      const isPrev = this.classList.contains("rail-prev");
      if (rail._railController) {
        if (isPrev) {
          rail._railController.slidePrev();
        } else {
          rail._railController.slideNext();
        }
      } else {
        const step = rail.clientWidth * 0.75 || 320;
        rail.scrollBy({
          left: isPrev ? -step : step,
          behavior: "smooth",
        });
      }
    });
  });

  // Handle tab visibility change
  document.addEventListener("visibilitychange", function () {
    rails.forEach(function (r) {
      if (r._railController) {
        if (document.hidden) {
          r._railController.stopAutoSlide();
        } else {
          r._railController.startAutoSlide();
        }
      }
    });
  });
});
