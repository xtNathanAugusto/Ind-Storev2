(function () {
  const track = document.getElementById("carouselTrack");
  const thumbs = Array.from(document.querySelectorAll(".carousel-thumb"));
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const stage = document.querySelector(".carousel-stage");

  let index = 0;
  const total = slides.length;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 5000;

  function render() {
    track.style.transform = "translateX(" + -index * 100 + "%)";
    thumbs.forEach((t, i) => t.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = (i + total) % total;
    render();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  nextBtn.addEventListener("click", () => {
    next();
    startAutoplay();
  });
  prevBtn.addEventListener("click", () => {
    prev();
    startAutoplay();
  });
  thumbs.forEach((t) => {
    t.addEventListener("click", () => {
      goTo(parseInt(t.dataset.index, 10));
      startAutoplay();
    });
  });

  stage.addEventListener("mouseenter", stopAutoplay);
  stage.addEventListener("mouseleave", startAutoplay);

  let dragStartX = null;
  stage.addEventListener("pointerdown", (e) => {
    dragStartX = e.clientX;
  });
  stage.addEventListener("pointerup", (e) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (delta > 60) prev();
    else if (delta < -60) next();
    dragStartX = null;
    startAutoplay();
  });

  render();
  startAutoplay();
})();
