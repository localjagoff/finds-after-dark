import "./styles.css";
import "./mobile-fixes.css";

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const tiktokEyebrow = document.querySelector(".tiktok-cta .eyebrow");
if (tiktokEyebrow) {
  tiktokEyebrow.innerHTML = "<span></span> Finds After Dark";
}

function createStars() {
  const field = document.querySelector("[data-stars]");
  if (!field) return;

  let seed = 48271;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const fragment = document.createDocumentFragment();
  const starCount = window.innerWidth < 700 ? 34 : 58;

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("span");
    const size = 1 + random() * 2.2;
    star.style.left = `${random() * 100}%`;
    star.style.top = `${random() * 100}%`;
    star.style.setProperty("--size", `${size.toFixed(2)}px`);
    star.style.setProperty("--alpha", (0.3 + random() * 0.65).toFixed(2));
    star.style.setProperty("--speed", `${3.2 + random() * 5.2}s`);
    star.style.setProperty("--delay", `${-random() * 7}s`);
    fragment.appendChild(star);
  }

  field.appendChild(fragment);
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.13, rootMargin: "0px 0px -6% 0px" },
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    observer.observe(item);
  });
}

function setupHeroParallax() {
  if (reduceMotion || !finePointer) return;

  const root = document.querySelector("[data-parallax-root]");
  if (!root) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;
    root.style.setProperty("--mx", currentX.toFixed(4));
    root.style.setProperty("--my", currentY.toFixed(4));

    if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  };

  const requestRender = () => {
    if (rafId === null) rafId = requestAnimationFrame(render);
  };

  root.addEventListener("pointermove", (event) => {
    const rect = root.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    requestRender();
  });

  root.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    requestRender();
  });
}

function setupCardTilt() {
  if (reduceMotion || !finePointer) return;

  document.querySelectorAll(".experience-card.tilt").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 7;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function setupHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 28);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

createStars();
setupReveal();
setupHeroParallax();
setupCardTilt();
setupHeaderState();
