document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const isHome = body.classList.contains("page-home");

  const header = document.getElementById("siteHeader");
  const slider = document.getElementById("heroSlider");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");

  let currentSlide = 0;
  let autoPlay = null;
  const slideInterval = 5500;

  function setActiveSlide(index) {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    const isActive = i === currentSlide;
    slide.classList.toggle("is-active", isActive);

    const video = slide.querySelector("video");
    if (video) {
      if (isActive) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === currentSlide);
  });
}

  function nextSlide() {
    setActiveSlide(currentSlide + 1);
  }

  function prevSlideFn() {
    setActiveSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    if (slides.length < 2) return;
    stopAutoPlay();
    autoPlay = setInterval(nextSlide, slideInterval);
  }

  function stopAutoPlay() {
    if (autoPlay) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
  }

  if (slides.length) {
    setActiveSlide(0);
    startAutoPlay();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlideFn();
      startAutoPlay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveSlide(index);
      startAutoPlay();
    });
  });

  if (slider) {
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);
  }

  document.addEventListener("visibilitychange", () => {
  const activeSlide = slides[currentSlide];
  const activeVideo = activeSlide ? activeSlide.querySelector("video") : null;

  if (document.hidden) {
    stopAutoPlay();
    if (activeVideo) activeVideo.pause();
  } else {
    startAutoPlay();
    if (activeVideo) activeVideo.play().catch(() => {});
  }
});

  if (header && !isHome) {
  header.classList.add("is-solid");
}

let lastScrollY = window.scrollY;

if (header) {
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    const scrollingUp = currentY < lastScrollY;

    if (isHome) {
      if (currentY <= 20) {
        header.classList.remove("is-hidden", "is-glass");
      } else if (scrollingUp) {
        header.classList.remove("is-hidden");
        header.classList.add("is-glass");
      } else {
        header.classList.add("is-hidden");
        header.classList.remove("is-glass");
      }
    } else {
      if (currentY > 160 && currentY > lastScrollY) {
        header.classList.add("is-hidden");
      } else {
        header.classList.remove("is-hidden");
      }
    }

    lastScrollY = currentY;
  });
}

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }
});