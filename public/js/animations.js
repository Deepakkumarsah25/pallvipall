/**
 * ANIMATIONS.JS - Intelligent, Responsive Scroll-Reveal Engine
 * Excludes Hero Section entirely. Animates About, Achievements, Gallery, Social Wall & all subsequent sections.
 */
(function () {
  'use strict';

  // 1. Reduced motion check
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) return;

  var root = document.documentElement;
  var seen = new Set();
  var io;

  // Check if element belongs to Hero section
  function isHero(el) {
    if (!el) return false;
    if (el.id === 'home' || /hero/i.test(el.id || '') || /hero/i.test(el.className || '')) return true;
    return Boolean(el.closest('#home, .ak-hero-wrapper, .ak-hero-slider, .ak-hero-slide'));
  }

  // Tag element for scroll animation
  function tagElement(el, type, delay) {
    if (!el || seen.has(el) || isHero(el)) return;
    seen.add(el);

    el.classList.add('rv-item');
    el.setAttribute('data-rv', type || 'up');
    el.style.setProperty('--rv-delay', (delay || 0) + 'ms');

    if (io) io.observe(el);
  }

  // Configure section-specific animations
  function setupAboutSection(sec) {
    var header = sec.querySelector('.ak-section-header');
    if (header) tagElement(header, 'down', 0);

    var visual = sec.querySelector('.ak-about-visual');
    if (visual) tagElement(visual, 'left', 120);

    var content = sec.querySelector('.ak-about-content');
    if (content) {
      var heading = content.querySelector('.ak-about-heading');
      if (heading) tagElement(heading, 'right', 150);

      var texts = content.querySelectorAll('.ak-about-text');
      texts.forEach(function (txt, idx) {
        tagElement(txt, 'right', 220 + idx * 80);
      });

      var points = content.querySelectorAll('.ak-about-points li');
      points.forEach(function (pt, idx) {
        tagElement(pt, 'up', 320 + idx * 70);
      });

      var cta = content.querySelector('.ak-about-cta');
      if (cta) tagElement(cta, 'zoom', 550);
    }
  }

  function setupAchievementsSection(sec) {
    var header = sec.querySelector('.ak-section-header');
    if (header) tagElement(header, 'down', 0);

    var sub = sec.querySelector('.ak-header-sub');
    if (sub) tagElement(sub, 'up', 100);

    var isMobile = window.innerWidth <= 768;
    if (isMobile) {
      var track = sec.querySelector('.ak-cards-scroll-wrap');
      if (track) tagElement(track, 'up', 150);
    } else {
      var cards = sec.querySelectorAll('.ak-achievement-card');
      cards.forEach(function (card, idx) {
        tagElement(card, 'up', 120 + idx * 110);
      });
    }
  }

  function setupGallerySection(sec) {
    var header = sec.querySelector('.ak-section-header');
    if (header) tagElement(header, 'down', 0);

    var sub = sec.querySelector('.ak-header-sub');
    if (sub) tagElement(sub, 'up', 100);

    var isMobile = window.innerWidth <= 768;
    if (isMobile) {
      var track = sec.querySelector('.ak-cards-scroll-wrap');
      if (track) tagElement(track, 'up', 150);
    } else {
      var cards = sec.querySelectorAll('.ak-card');
      cards.forEach(function (card, idx) {
        tagElement(card, 'zoom', 120 + idx * 100);
      });
    }

    var cta = sec.querySelector('.ak-section-cta');
    if (cta) tagElement(cta, 'up', 450);
  }

  function setupSocialSection(sec) {
    var header = sec.querySelector('.ak-section-header');
    if (header) tagElement(header, 'down', 0);

    var sub = sec.querySelector('.ak-header-sub');
    if (sub) tagElement(sub, 'up', 100);

    var rails = sec.querySelectorAll('.social-rail-section');
    rails.forEach(function (rail, idx) {
      tagElement(rail, 'up', 120 + idx * 120);
    });

    var cta = sec.querySelector('.ak-section-cta');
    if (cta) tagElement(cta, 'zoom', 250);
  }

  // Fallback scanner for any additional sections
  function setupGenericSection(sec) {
    if (isHero(sec)) return;

    var header = sec.querySelector('.ak-section-header, h2');
    if (header) tagElement(header, 'down', 0);

    var sub = sec.querySelector('.ak-header-sub, p');
    if (sub && sub !== header) tagElement(sub, 'up', 100);

    var items = sec.querySelectorAll('.ak-card, article, .card');
    if (items.length) {
      items.forEach(function (it, idx) {
        tagElement(it, 'up', 120 + (idx % 4) * 100);
      });
    }
  }

  // Scan all page sections in main-content
  function scanPage() {
    var main = document.getElementById('main-content') || document.querySelector('main');
    if (!main) return;

    var sections = main.querySelectorAll(':scope > section, :scope > div');
    sections.forEach(function (sec) {
      if (isHero(sec)) return;

      var secId = (sec.id || '').toLowerCase();
      if (secId === 'about') {
        setupAboutSection(sec);
      } else if (secId === 'achievements') {
        setupAchievementsSection(sec);
      } else if (secId === 'gallery') {
        setupGallerySection(sec);
      } else if (secId === 'social') {
        setupSocialSection(sec);
      } else {
        setupGenericSection(sec);
      }
    });
  }

  // Initialize observer & listeners
  function init() {
    try {
      var isMobile = window.innerWidth <= 768;

      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;

            var el = entry.target;
            io.unobserve(el);

            // Trigger reveal
            el.classList.add('rv-revealed');

            // Cleanup after entrance animation so CSS hover effects function completely natively
            var delayMs = parseInt(el.style.getPropertyValue('--rv-delay'), 10) || 0;
            var totalDuration = delayMs + (isMobile ? 700 : 850);

            setTimeout(function () {
              el.classList.add('rv-complete');
              el.classList.remove('rv-item', 'rv-revealed');
              el.removeAttribute('data-rv');
              el.style.removeProperty('--rv-delay');
            }, totalDuration);
          });
        },
        {
          threshold: isMobile ? 0.08 : 0.12,
          rootMargin: isMobile ? '0px 0px -25px 0px' : '0px 0px -40px 0px',
        }
      );

      // Scan and tag target elements
      scanPage();

      // Enable CSS reveal states
      root.classList.add('rv-active');

      // Observe dynamic content mutations (e.g. social wall cards loaded async)
      if ('MutationObserver' in window) {
        var timer;
        var main = document.getElementById('main-content') || document.querySelector('main');
        if (main) {
          new MutationObserver(function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
              scanPage();
            }, 300);
          }).observe(main, { childList: true, subtree: true });
        }
      }
    } catch (err) {
      // In case of any error, ensure content is never hidden
      root.classList.remove('rv-active');
      document.querySelectorAll('.rv-item').forEach(function (el) {
        el.classList.remove('rv-item');
      });
      console.warn('[animations] Graceful fallback triggered:', err.message);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
