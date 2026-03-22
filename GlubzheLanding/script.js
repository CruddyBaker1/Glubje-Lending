(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setMenuOpen(open) {
    if (!header || !toggle) return;
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenuOpen(!header.classList.contains("is-open"));
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          setMenuOpen(false);
        }
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header && header.classList.contains("is-open")) {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollToHash(hash, pushHistory) {
    if (!hash || hash === "#") return;
    var el = document.querySelector(hash);
    if (!el) return;
    var headerEl = document.querySelector(".site-header");
    var offset = headerEl ? headerEl.offsetHeight : 0;
    var top = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReduced ? "auto" : "smooth",
    });
    if (pushHistory) {
      history.pushState(null, "", hash);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = anchor.getAttribute("href");
      if (!href || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollToHash(href, true);
    });
  });

  if (window.location.hash) {
    window.addEventListener("load", function () {
      scrollToHash(window.location.hash, false);
    });
  }

  if (!prefersReduced) {
    var heroReveals = document.querySelectorAll(".hero .reveal");
    heroReveals.forEach(function (el, i) {
      window.setTimeout(function () {
        el.classList.add("is-visible");
      }, 80 + i * 100);
    });

    var sections = document.querySelectorAll(".reveal-section");
    if (sections.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      sections.forEach(function (section) {
        io.observe(section);
      });
    } else {
      sections.forEach(function (section) {
        section.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal, .reveal-section").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
