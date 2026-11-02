/* ==========================================================
   Portfolio Template — script.js
   Every feature is isolated so one failure can't break the rest.
   ========================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Safe localStorage (can throw on file://, private mode, sandboxed previews) */
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- 1. Scroll-reveal ---------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("show"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    els.forEach(function (el) { io.observe(el); });

    /* Safety net: if anything is still hidden after 3s, show it */
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add("show"); });
    }, 3000);
  }

  /* ---------- 2. Mobile menu ---------- */
  function initMenu() {
    var btn = $(".menu-toggle");
    var nav = $(".nav-links");
    if (!btn || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "\u2715" : "\u2630";
    }

    btn.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------- 3. Theme toggle ---------- */
  function initTheme() {
    var btn = $(".theme-toggle");
    if (!btn) return;

    function apply(mode, save) {
      root.setAttribute("data-theme", mode);
      btn.textContent = mode === "light" ? "\u263E" : "\u263C";
      btn.setAttribute("aria-label", mode === "light" ? "Switch to dark theme" : "Switch to light theme");
      if (save) store.set("portfolio-theme", mode);
    }

    apply(root.getAttribute("data-theme") || "dark", false);

    btn.addEventListener("click", function () {
      apply(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
    });
  }

  /* ---------- 4. Active nav link + header shadow ---------- */
  function initScrollSpy() {
    var header = $(".header");
    var links = $$(".nav-links a");

    if (header) {
      var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 10); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (!links.length || !("IntersectionObserver" in window)) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    links.forEach(function (a) {
      var id = (a.getAttribute("href") || "").slice(1);
      var section = id && document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- 5. Footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* Run each feature independently */
  [initReveal, initMenu, initTheme, initScrollSpy, initYear].forEach(function (fn) {
    try { fn(); } catch (err) { console.error("[portfolio] " + fn.name + " failed:", err); }
  });
})();