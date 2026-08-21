const sidebar = document.getElementById("sidebar");
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

function updateSidebarPosition() {
  if (!sidebar) return;

  const scrollY = window.scrollY;
  const offset = Math.min(scrollY * 0.25, 120);
  sidebar.style.transform = `translateY(${offset}px)`;
}

function setActiveLink() {
  if (!navLinks.length) return;

  let currentSection = "sobre-nos";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (
      rect.top <= window.innerHeight * 0.4 &&
      rect.bottom >= window.innerHeight * 0.4
    ) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
  });
}

function initCarousels() {
  const carousels = document.querySelectorAll(".game-carousel");

  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll(".slide");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");

    if (!slides.length) return;

    let currentIndex = 0;
    let intervalId = null;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentIndex);
      });
    };

    const startAutoPlay = () => {
      const speed = Number(carousel.dataset.speed) || 3000;
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        showSlide(currentIndex + 1);
      }, speed);
    };

    prevBtn?.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      startAutoPlay();
    });

    nextBtn?.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });

    showSlide(0);
    startAutoPlay();
  });
}

window.addEventListener("scroll", () => {
  updateSidebarPosition();
  setActiveLink();
});

window.addEventListener("load", () => {
  updateSidebarPosition();
  setActiveLink();
  initCarousels();
});

window.addEventListener("DOMContentLoaded", () => {
  updateSidebarPosition();
  setActiveLink();
  initCarousels();
});
