/**
 * ABOUT.JS - पल्लवी पाल परिचय पेज इंटरैक्टिविटी
 * Handles smooth scrolling, scrollspy, and back to top
 */

document.addEventListener("DOMContentLoaded", () => {
  const navPills = document.querySelectorAll(".nav-pill-item");
  const stickyNav = document.getElementById("aboutStickyNav");
  const navContainer = document.getElementById("aboutNavContainer");
  const backToTopBtn = document.getElementById("backToTopBtn");

  // Sections list for scrollspy
  const sections = Array.from(navPills).map((pill) => {
    const targetId = pill.getAttribute("href");
    return {
      pill,
      targetEl: document.querySelector(targetId),
    };
  }).filter((item) => item.targetEl !== null);

  // 1. Smooth Scroll with Sticky Nav Offset
  navPills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      const targetId = pill.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const navHeight = stickyNav ? stickyNav.offsetHeight : 50;
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 75;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Set active manually on click
          navPills.forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          scrollActivePillIntoView(pill);
        }
      }
    });
  });

  // Helper to ensure active pill is horizontally scrolled into view on mobile
  const scrollActivePillIntoView = (activePill) => {
    if (navContainer && activePill) {
      const pillLeft = activePill.offsetLeft;
      const pillWidth = activePill.offsetWidth;
      const containerWidth = navContainer.offsetWidth;
      const scrollPos = pillLeft - (containerWidth / 2) + (pillWidth / 2);
      navContainer.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }
  };

  // 2. Scrollspy to highlight active pill as user scrolls
  let isThrottled = false;
  window.addEventListener("scroll", () => {
    if (!isThrottled) {
      window.requestAnimationFrame(() => {
        handleScrollspy();
        handleBackToTopVisibility();
        isThrottled = false;
      });
      isThrottled = true;
    }
  });

  const handleScrollspy = () => {
    const scrollPos = window.pageYOffset + 140;

    for (let i = sections.length - 1; i >= 0; i--) {
      const { pill, targetEl } = sections[i];
      if (targetEl.offsetTop <= scrollPos) {
        if (!pill.classList.contains("active")) {
          navPills.forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          scrollActivePillIntoView(pill);
        }
        break;
      }
    }
  };

  // 3. Back to Top Button
  const handleBackToTopVisibility = () => {
    if (backToTopBtn) {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  };

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
