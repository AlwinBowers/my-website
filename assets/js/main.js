/* Mopao Building and Roofing - site behaviour (no dependencies) */
(function () {
  "use strict";

  // Sticky header shadow
  var header = document.querySelector("[data-header]");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile navigation
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector("[data-nav-menu]");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // Fade sections in as they enter the viewport
  var revealEls = document.querySelectorAll("[data-reveal]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
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
    revealEls.forEach(function (el, i) {
      // light stagger for siblings in a grid
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(idx, 5) * 70 + "ms";
      io.observe(el);
    });
  }

  // Services page: highlight the service currently in view
  var jumpLinks = document.querySelectorAll(".service-jump a");
  if (jumpLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    jumpLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            jumpLinks.forEach(function (a) { a.classList.remove("is-active"); });
            var link = byId[entry.target.id];
            if (link) {
              link.classList.add("is-active");
              var bar = link.parentNode;
              bar.scrollTo({ left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
            }
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  // Reminder for site owners while the JosephAI link has not been configured yet
  if (document.querySelector("[data-joseph-unconfigured]")) {
    console.info("JosephAI WhatsApp Assistant URL not set: update josephAiWhatsAppUrl in site.config.js and rebuild.");
  }
})();
