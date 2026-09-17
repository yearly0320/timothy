(function () {
  "use strict";
  var root = document.documentElement;

  // ---------- 主题：深/浅色，跨页面记忆 ----------
  function applyStoredTheme() {
    try {
      var saved = localStorage.getItem("timothy-theme");
      if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
    } catch (e) {}
  }
  applyStoredTheme();

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var isDark = current === "dark" || (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
      var next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("timothy-theme", next); } catch (e) {}
    });
  }

  // ---------- 鼠标跟随光斑（仅在有鼠标、未开启"减少动效"时启用）----------
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canHover && !reduceMotion) {
    var ticking = false;
    var lastX = window.innerWidth / 2, lastY = window.innerHeight * 0.18;
    window.addEventListener("mousemove", function (e) {
      lastX = e.clientX; lastY = e.clientY;
      if (!ticking) {
        window.requestAnimationFrame(function () {
          root.style.setProperty("--spotlight-x", lastX + "px");
          root.style.setProperty("--spotlight-y", lastY + "px");
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- 侧边栏导航：滚动高亮 ----------
  var navLinks = document.querySelectorAll("nav.sections a, .mobile-nav a");
  var sections = document.querySelectorAll("main section");
  function setActive(id) {
    navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-target") === id); });
  }
  if (sections.length && "IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  // ---------- 滚动进场动画 ----------
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }
})();
