document.addEventListener("DOMContentLoaded", () => {
  const strip = document.querySelector("[data-gallery-strip]");
  const prevBtn = document.querySelector("[data-gallery-prev]");
  const nextBtn = document.querySelector("[data-gallery-next]");

  const lightbox = document.getElementById("artLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxMeta = document.getElementById("lightboxMeta");
  const closeButtons = document.querySelectorAll("[data-lightbox-close]");
  const zoomTriggers = document.querySelectorAll(".gallery-zoom-trigger");

  function getStep(direction = 1) {
  if (!strip) return 0;

  const items = Array.from(strip.querySelectorAll(".gallery-item"));
  if (!items.length) return strip.clientWidth * 0.7;

  const stripLeft = strip.getBoundingClientRect().left;
  const currentScroll = strip.scrollLeft;

  if (direction > 0) {
    const nextItem = items.find((item) => item.offsetLeft > currentScroll + 10);
    return nextItem ? nextItem.offsetLeft - currentScroll : strip.clientWidth * 0.7;
  } else {
    const previousItems = items.filter((item) => item.offsetLeft < currentScroll - 10);
    const prevItem = previousItems[previousItems.length - 1];
    return prevItem ? currentScroll - prevItem.offsetLeft : strip.clientWidth * 0.7;
  }
}

  if (prevBtn && strip) {
  prevBtn.addEventListener("click", () => {
    strip.scrollBy({
      left: -getStep(-1),
      behavior: "smooth"
    });
  });
}

if (nextBtn && strip) {
  nextBtn.addEventListener("click", () => {
    strip.scrollBy({
      left: getStep(1),
      behavior: "smooth"
    });
  });
}

  if (zoomTriggers.length && lightbox && lightboxImage) {
    zoomTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const src = trigger.dataset.zoomSrc;
        const alt = trigger.dataset.zoomAlt || "";
        const title = trigger.dataset.zoomTitle || "";
        const meta = trigger.dataset.zoomMeta || "";

        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightboxTitle.textContent = title;
        lightboxMeta.textContent = meta;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightboxImage.src = "";
      lightboxImage.alt = "";
      lightboxTitle.textContent = "";
      lightboxMeta.textContent = "";
    }, 180);
  }

  if (strip) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    strip.addEventListener("mousedown", (e) => {
      isDown = true;
      strip.classList.add("is-dragging");
      startX = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
    });

    strip.addEventListener("mouseleave", () => {
      isDown = false;
      strip.classList.remove("is-dragging");
    });

    strip.addEventListener("mouseup", () => {
      isDown = false;
      strip.classList.remove("is-dragging");
    });

    strip.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.1;
      strip.scrollLeft = scrollLeft - walk;
    });
  }
});