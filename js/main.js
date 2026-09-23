(function () {
  "use strict";

  // Header scroll state
  var header = document.querySelector("[data-header]");
  function onScroll() {
    var scrolled = window.scrollY > 20;
    header.classList.toggle("is-scrolled", scrolled);
    updateActiveNav();
  }

  // Active nav highlighting
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNav() {
    var current = "";
    var offset = 120;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= offset) {
        current = sections[i].id;
      }
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
      current = sections[sections.length - 1].id;
    }
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
    });
  }

  // Mobile nav
  var navToggle = document.querySelector("[data-nav-toggle]");
  var siteNav = document.querySelector(".site-nav");
  function closeNav() {
    navToggle.classList.remove("is-open");
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开菜单");
  }
  navToggle.addEventListener("click", function () {
    var open = siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });
  siteNav.addEventListener("click", function (e) {
    if (e.target.closest(".nav-link")) closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  // Product filtering
  var filterBar = document.querySelector("[data-filter-bar]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".product-card"));
  filterBar.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter-btn");
    if (!btn) return;
    var filter = btn.getAttribute("data-filter");
    filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
      var active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });
    cards.forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("is-hidden", !match);
    });
  });

  // Scroll reveal
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".section-heading, .about-art, .about-copy, .about-stats, .product-card, .contact-panel"));
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach(function (item) {
      item.classList.add("reveal");
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  // Animated counters
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }

  // Contact form
  var form = document.querySelector("[data-form]");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector("[data-submit]");
    var note = form.querySelector("[data-form-note]");
    var name = form.querySelector('[name="name"]').value.trim();
    var phone = form.querySelector('[name="phone"]').value.trim();

    note.classList.remove("is-error");
    if (!name || !phone) {
      note.textContent = "请填写称呼和联系电话";
      note.classList.add("is-error");
      return;
    }

    submitBtn.classList.add("is-loading");
    submitBtn.querySelector("[data-submit-text]").textContent = "提交中…";
    setTimeout(function () {
      submitBtn.classList.remove("is-loading");
      submitBtn.querySelector("[data-submit-text]").textContent = "提交咨询";
      note.textContent = "提交成功，我们的营养顾问会尽快与您联系。";
      form.reset();
      setTimeout(function () { note.textContent = ""; }, 5000);
    }, 900);
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
