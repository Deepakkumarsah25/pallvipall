const burger = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");
const drawerOverlay = document.getElementById("drawerOverlay");

let scrollPosition = 0;


// =========================================
// OPEN DRAWER
// =========================================

function openDrawer() {

  // Current scroll position save
  scrollPosition = window.scrollY;

  navLinks.classList.add("open");

  drawerOverlay.classList.add("open");

  burger.classList.add("open");

  burger.setAttribute(
    "aria-expanded",
    "true"
  );
  burger.setAttribute("aria-label", "Close menu");


  // Complete page lock
  document.documentElement.style.overflow = "hidden";

  document.body.style.position = "fixed";

  document.body.style.top =
    `-${scrollPosition}px`;

  document.body.style.left = "0";

  document.body.style.right = "0";

  document.body.style.width = "100%";

  document.body.style.overflow = "hidden";
}


// =========================================
// CLOSE DRAWER
// =========================================

function closeDrawer() {
  if (!navLinks.classList.contains("open")) return;

  navLinks.classList.remove("open");

  drawerOverlay.classList.remove("open");

  burger.classList.remove("open");

  burger.setAttribute(
    "aria-expanded",
    "false"
  );
  burger.setAttribute("aria-label", "Open menu");


  // Unlock page
  document.documentElement.style.overflow = "";

  document.body.style.position = "";

  document.body.style.top = "";

  document.body.style.left = "";

  document.body.style.right = "";

  document.body.style.width = "";

  document.body.style.overflow = "";


  // Return to previous position
  window.scrollTo({
    left: 0,
    top: scrollPosition,
    behavior: "instant",
  });
}


// =========================================
// HAMBURGER
// =========================================

burger.addEventListener("click", () => {

  if (
    navLinks.classList.contains("open")
  ) {

    closeDrawer();

  } else {

    openDrawer();

  }

});


// =========================================
// OVERLAY
// =========================================

drawerOverlay.addEventListener(
  "click",
  closeDrawer
);

// Close the mobile drawer when tapping anywhere outside the menu or toggle.
document.addEventListener("pointerdown", (event) => {
  if (!navLinks.classList.contains("open")) return;
  if (navLinks.contains(event.target) || burger.contains(event.target)) return;
  closeDrawer();
});


// =========================================
// MENU LINK
// =========================================

navLinks
  .querySelectorAll("a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      closeDrawer
    );

  });


// =========================================
// ESC KEY
// =========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      navLinks.classList.contains("open")
    ) {

      closeDrawer();

    }

  }
);

// =========================================
// AUTO ACTIVE LINK SYNCHRONIZATION
// =========================================
(function initActiveNavSync() {
  const path = window.location.pathname.toLowerCase();
  const links = document.querySelectorAll(".nav-links a");
  let matched = false;

  links.forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (!href) return;

    if (href !== "/" && (path === href || path.startsWith(href + "/") || (href === "/gallery" && path.startsWith("/images")))) {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      matched = true;
    }
  });

  if (!matched && (path === "/" || path === "")) {
    links.forEach((l) => {
      if (l.getAttribute("href") === "/") {
        l.classList.add("active");
      } else {
        l.classList.remove("active");
      }
    });
  }
})();
