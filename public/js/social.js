/**
 * Social Wall - Interactive Horizontal Rails Script
 */

document.addEventListener("DOMContentLoaded", function () {
  // Setup rail arrow controls
  const arrowButtons = document.querySelectorAll(".rail-arrow-btn");

  arrowButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const rail = document.getElementById(targetId);
      if (!rail) return;

      const isPrev = this.classList.contains("rail-prev");
      const scrollAmount = rail.clientWidth * 0.75 || 340;

      rail.scrollBy({
        left: isPrev ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    });
  });

  // Enable smooth mouse drag to scroll for rails
  const rails = document.querySelectorAll(".social-track-wrap");

  rails.forEach(function (slider) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener("mousedown", function (e) {
      isDown = true;
      slider.classList.add("is-dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", function () {
      isDown = false;
      slider.classList.remove("is-dragging");
    });

    slider.addEventListener("mouseup", function () {
      isDown = false;
      slider.classList.remove("is-dragging");
    });

    slider.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });
  });
});
