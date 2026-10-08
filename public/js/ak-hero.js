// ==========================================================================
// ARVIND KEJRIWAL AAP STYLE HERO SLIDER JS
// Smooth autoplay, prev/next arrows, dot indicators, touch swipe support
// ==========================================================================

(() => {
  const slider = document.getElementById("akHeroSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".ak-hero-slide");
  const dots = slider.querySelectorAll(".ak-hero-dot");
  const prevBtn = document.getElementById("akHeroPrevBtn");
  const nextBtn = document.getElementById("akHeroNextBtn");

  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  const DELAY = 5000;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((s, idx) => {
      s.classList.toggle("active", idx === currentIndex);
    });

    dots.forEach((d, idx) => {
      d.classList.toggle("active", idx === currentIndex);
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    if (slides.length > 1) {
      timer = setInterval(nextSlide, DELAY);
    }
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      showSlide(idx);
      startAutoplay();
    });
  });

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  // Touch Swipe for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      startAutoplay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      startAutoplay();
    }
  }, { passive: true });

  startAutoplay();
})();
