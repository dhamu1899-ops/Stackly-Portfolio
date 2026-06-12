const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const end = Number(target.dataset.count);
    let current = 0;
    const increment = Math.max(1, Math.ceil(end / 42));
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        target.textContent = end;
        clearInterval(timer);
      } else {
        target.textContent = current;
      }
    }, 24);
    countObserver.unobserve(target);
  });
}, { threshold: 0.8 });

document.querySelectorAll("[data-count]").forEach((item) => countObserver.observe(item));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const skill = entry.target;
    skill.style.setProperty("--level", `${skill.dataset.level}%`);
    skill.classList.add("filled");
    skillObserver.unobserve(skill);
  });
}, { threshold: 0.45 });

document.querySelectorAll(".skill").forEach((skill) => skillObserver.observe(skill));

const sections = [...document.querySelectorAll("main section[id]")];
const hasHashNavigation = [...navLinks].some((link) => link.getAttribute("href")?.startsWith("#"));
if (sections.length && hasHashNavigation) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.42 });

  sections.forEach((section) => activeObserver.observe(section));
}

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = event.currentTarget.querySelector(".form-note");
    if (note) {
      note.textContent = "Thanks. Your message is ready to connect with Stackly.";
    }
    event.currentTarget.reset();
  });
});
