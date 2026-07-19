// Lauana Ribeiro Santo — Landing Page
// Vanilla JS, sem dependências externas de build.
(function () {
  "use strict";

  var doc = document;

  /* ---------- Loader ---------- */
  window.addEventListener("load", function () {
    var loader = doc.getElementById("loader");
    if (loader) setTimeout(function () { loader.classList.add("hide"); }, 250);
  });

  /* ---------- Dark mode ---------- */
  var root = doc.documentElement;
  var themeToggle = doc.getElementById("themeToggle");
  var saved = null;
  try { saved = localStorage.getItem("lrs-theme"); } catch (e) {}
  if (saved) {
    root.setAttribute("data-theme", saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("lrs-theme", next); } catch (e) {}
    });
  }

  /* ---------- Navbar: fundo ao rolar + link ativo ---------- */
  var navbar = doc.getElementById("navbar");
  var navToggle = doc.getElementById("navToggle");
  var navLinks = doc.getElementById("navLinks");
  var sections = Array.prototype.slice.call(doc.querySelectorAll("section[id], header[id]"));
  var links = Array.prototype.slice.call(doc.querySelectorAll(".nav-link"));
  var backTop = doc.getElementById("backTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle("scrolled", y > 30);
    if (backTop) backTop.classList.toggle("show", y > 500);

    var current = "";
    sections.forEach(function (sec) {
      var top = sec.offsetTop - 140;
      if (y >= top) current = sec.id;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
      });
    });
  }

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(doc.querySelectorAll(".reveal, .reveal-stagger"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Contadores animados ---------- */
  var counters = Array.prototype.slice.call(doc.querySelectorAll("[data-count]"));
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = 0;
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterIO.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = Array.prototype.slice.call(doc.querySelectorAll(".faq-item"));
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    function setHeight(open) {
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    }
    setHeight(item.classList.contains("open"));
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        setHeight.call(other, false);
        other.querySelector(".faq-a").style.maxHeight = "0px";
      });
      if (!isOpen) {
        item.classList.add("open");
        setHeight(true);
      }
    });
  });
  window.addEventListener("resize", function () {
    faqItems.forEach(function (item) {
      if (item.classList.contains("open")) {
        var a = item.querySelector(".faq-a");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
})();
