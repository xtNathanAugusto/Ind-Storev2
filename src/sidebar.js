(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const sections = Array.from(document.querySelectorAll(".section"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const progressFill = document.getElementById("scrollProgress");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  const revealEls = document.querySelectorAll(".reveal");

  revealEls.forEach((el) => {
    Array.from(el.children).forEach((child, i) => {
      child.style.setProperty("--reveal-index", i);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;
        const link = navLinks.find((a) => a.getAttribute("href") === `#${id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { threshold: 0.5 },
  );

  sections.forEach((sec) => {
    if (sec.id) navObserver.observe(sec);
  });

  let progressTicking = false;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) {
      progressFill.style.height = `${Math.min(100, Math.max(0, pct))}%`;
    }
    progressTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!progressTicking) {
        requestAnimationFrame(updateProgress);
        progressTicking = true;
      }
    },
    { passive: true },
  );

  updateProgress();

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      sidebar.classList.toggle("is-open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        sidebar.classList.remove("is-open");
      });
    });
  }

  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    let backToTopTicking = false;

    function updateBackToTop() {
      if (window.scrollY > window.innerHeight * 0.6) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
      backToTopTicking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!backToTopTicking) {
          requestAnimationFrame(updateBackToTop);
          backToTopTicking = true;
        }
      },
      { passive: true },
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });

    updateBackToTop();
  }

  const dealCountdown = document.getElementById("dealCountdown");

  if (dealCountdown) {
    const hours = parseInt(dealCountdown.dataset.hours || "72", 10);
    const storageKey = "indstore_deal_deadline";
    let deadline = Number(sessionStorage.getItem(storageKey));

    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + hours * 60 * 60 * 1000;
      sessionStorage.setItem(storageKey, String(deadline));
    }

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tickCountdown() {
      const remaining = deadline - Date.now();

      if (remaining <= 0) {
        dealCountdown.textContent = "Oferta encerrada";
        clearInterval(countdownInterval);
        return;
      }

      const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remaining / (1000 * 60)) % 60);
      const s = Math.floor((remaining / 1000) % 60);

      dealCountdown.textContent = `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    }

    tickCountdown();
    const countdownInterval = setInterval(tickCountdown, 1000);
  }

  const statValues = document.querySelectorAll(".stat__value[data-count-to]");

  function animateCount(el) {
    const target = parseFloat(el.dataset.countTo || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = prefersReducedMotion ? 0 : 1400;
    const start = performance.now();

    function frame(now) {
      const progress =
        duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = `${value.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  if (statValues.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );

    statValues.forEach((el) => statsObserver.observe(el));
  }
})();
