// Small, dependency-free interactions for Elite Content.

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

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

// Tilt-y parallax for the floating proof card on desktop only
const proof = document.querySelector(".proof-card");
if (proof && window.matchMedia("(pointer:fine)").matches) {
  const hero = document.querySelector(".hero");
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
