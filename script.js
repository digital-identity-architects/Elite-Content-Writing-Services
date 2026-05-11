// Small, dependency-free interactions for Elite Content.

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Register service worker (PWA + TWA prerequisite)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* swallow registration errors silently */
    });
  });
}

// Nav: scrolled state + mobile toggle
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");

const onScroll = () => {
  if (window.scrollY > 8) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close mobile nav on link click
document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

// Reveal-on-scroll using IntersectionObserver
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Tilt-y parallax for the floating proof card inside .hero on desktop only
const proof = document.querySelector(".hero .proof-card");
const hero = document.querySelector(".hero");
if (proof && hero && window.matchMedia("(pointer:fine)").matches) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    proof.style.transform = `translate(${dx * -10}px, ${dy * -10}px) rotateX(${
      dy * -3
    }deg) rotateY(${dx * 3}deg)`;
  });
  hero.addEventListener("mouseleave", () => {
    proof.style.transform = "";
  });
}
