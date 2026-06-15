const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const menuOverlay = document.querySelector("#menuOverlay");
const menuClose = document.querySelector("#menuClose");
const scrollTop = document.querySelector("#scrollTop");
const contactForm = document.querySelector(".contact-form");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

const pageLoader = document.createElement("div");
pageLoader.className = "page-loader is-active";
pageLoader.setAttribute("aria-hidden", "true");
pageLoader.innerHTML = "<span>LOADING</span>";
document.body.prepend(pageLoader);

const showLoader = () => {
  pageLoader.classList.remove("is-hiding");
  pageLoader.classList.add("is-active");
};

const hideLoader = () => {
  pageLoader.classList.add("is-hiding");
  setTimeout(() => pageLoader.classList.remove("is-active"), 420);
};

let typewritersStarted = false;

const runTypewriters = () => {
  if (typewritersStarted) return;
  typewritersStarted = true;

  document.querySelectorAll(".hero-copy h1, .service-page-hero h1, .about-page-hero h1, .contact-hero h1, .inner-hero h1, .footer-cta > a").forEach((title, titleIndex) => {
    const fullText = (title.textContent || "").trim();
    if (!fullText) return;

    title.classList.add("typing-text", "is-typing");
    title.setAttribute("aria-label", fullText);
    title.textContent = "";

    let index = 0;
    const speed = title.matches(".footer-cta > a") ? 95 : 120;
    const startDelay = title.matches(".footer-cta > a") ? 180 : titleIndex * 90;

    setTimeout(() => {
      const timer = setInterval(() => {
        title.textContent = fullText.slice(0, index + 1);
        index += 1;
        if (index >= fullText.length) {
          clearInterval(timer);
          setTimeout(() => title.classList.remove("is-typing"), 900);
        }
      }, speed);
    }, startDelay);
  });
};

const navigateWithLoader = (url) => {
  showLoader();
  sessionStorage.setItem("stacklyNavigating", "true");
  setTimeout(() => {
    window.location.href = url;
  }, 2000);
};

const finishFirstLoad = () => {
  if (sessionStorage.getItem("stacklyNavigating") === "true") {
    sessionStorage.removeItem("stacklyNavigating");
    setTimeout(() => {
      hideLoader();
      runTypewriters();
    }, 120);
    return;
  }
  setTimeout(() => {
    hideLoader();
    runTypewriters();
  }, 3000);
};

window.addEventListener("load", finishFirstLoad);
setTimeout(hideLoader, 3000);

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a, .menu-panel a, .footer-links a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  if (!href || href === "#" || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  const linkPage = href.split("#")[0];
  const normalizedLink = linkPage || "index.html";
  if (normalizedLink === currentPage || (currentPage === "" && normalizedLink === "index.html")) {
    link.classList.add("is-active");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#") || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const moveCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(moveCursor);
  };

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.classList.add("is-visible");
    cursorRing.classList.add("is-visible");
  });

  window.addEventListener("mouseleave", () => {
    cursorDot.classList.remove("is-visible");
    cursorRing.classList.remove("is-visible");
  });

  document.querySelectorAll("a, button, input, textarea").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.add("is-hovering");
      cursorRing.classList.add("is-hovering");
    });
    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("is-hovering");
      cursorRing.classList.remove("is-hovering");
    });
  });

  moveCursor();
}

const revealItems = document.querySelectorAll(
  "main > section, .service-card, .service-tile, .process-grid article, .mission-grid article, .detail-card, .stat-box, .contact-card, .footer"
);

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal-on-scroll");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 130}ms`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const mediaItems = document.querySelectorAll(
  ".hero-art, .about-media img, .video-frame img, .skills-image img, .about-wide-media img, .about-company-grid img, .mission-image img, .testimonial-card, .contact-card"
);

if ("IntersectionObserver" in window) {
  mediaItems.forEach((item) => item.classList.add("media-slide"));

  const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-media-visible", entry.isIntersecting);
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -8% 0px" });

  mediaItems.forEach((item) => mediaObserver.observe(item));
} else {
  mediaItems.forEach((item) => item.classList.add("is-media-visible"));
}

const skillItems = document.querySelectorAll(".skill-item");
const resetSkills = () => skillItems.forEach((item) => {
  item.style.setProperty("--progress", "0%");
  const percent = item.querySelector("div span:last-child");
  if (percent) percent.textContent = "0%";
});

resetSkills();

let skillsAnimationId = null;
let skillsRunning = false;

const animateSkills = () => {
  if (skillsAnimationId) cancelAnimationFrame(skillsAnimationId);
  skillsRunning = true;
  resetSkills();

  const startTime = performance.now();
  const duration = 2300;

  const tick = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    skillItems.forEach((item) => {
      const value = Number.parseInt(item.style.getPropertyValue("--value"), 10) || 0;
      const current = Math.round(value * eased);
      const percent = item.querySelector("div span:last-child");
      item.style.setProperty("--progress", `${current}%`);
      if (percent) percent.textContent = `${current}%`;
    });

    if (progress < 1 && skillsRunning) {
      skillsAnimationId = requestAnimationFrame(tick);
    }
  };

  skillsAnimationId = requestAnimationFrame(tick);
};

const stopSkills = () => {
  skillsRunning = false;
  if (skillsAnimationId) cancelAnimationFrame(skillsAnimationId);
  skillsAnimationId = null;
  resetSkills();
};

const finishSkills = () => {
  skillItems.forEach((item) => {
    const value = Number.parseInt(item.style.getPropertyValue("--value"), 10) || 0;
    const percent = item.querySelector("div span:last-child");
    item.style.setProperty("--progress", `${value}%`);
    if (percent) percent.textContent = `${value}%`;
  });
};

if (skillItems.length) {
  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkills();
        } else {
          stopSkills();
        }
      });
    }, { threshold: 0.45 });

    const skillsSection = document.querySelector(".skills");
    if (skillsSection) skillObserver.observe(skillsSection);
  } else {
    finishSkills();
  }
}

const whoWeAreSection = document.querySelector("#about.about");
if (whoWeAreSection) {
  whoWeAreSection.classList.add("zoom-reveal");
  if ("IntersectionObserver" in window) {
    const whoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-zoom-visible", entry.isIntersecting);
      });
    }, { threshold: 0.28, rootMargin: "0px 0px -8% 0px" });

    whoObserver.observe(whoWeAreSection);
  } else {
    whoWeAreSection.classList.add("is-zoom-visible");
  }
}

const setMenuOpen = (isOpen) => {
  if (!menuOverlay || !menuToggle) return;
  menuOverlay.classList.toggle("is-open", isOpen);
  menuOverlay.setAttribute("aria-hidden", String(!isOpen));
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
};

if (menuToggle) {
  menuToggle.addEventListener("click", () => setMenuOpen(true));
}

if (menuClose) {
  menuClose.addEventListener("click", () => setMenuOpen(false));
}

if (navLinks) {
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });
}

if (menuOverlay) {
  menuOverlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
}

document.querySelectorAll(".social-row a, .footer-social a, .menu-info a[href='#']").forEach((link) => {
  link.setAttribute("href", "404.html");
});

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href") || "";
    if (!href || href === "#" || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
    if (href.startsWith("#")) return;
    const targetUrl = new URL(href, window.location.href);
    if (targetUrl.origin !== window.location.origin) return;
    const currentUrl = new URL(window.location.href);
    if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash) return;
    event.preventDefault();
    navigateWithLoader(targetUrl.href);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

if (scrollTop) {
  window.addEventListener("scroll", () => {
    scrollTop.classList.toggle("is-visible", window.scrollY > 500);
  });

  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (contactForm) {
  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.required = true;
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    navigateWithLoader("404.html");
  });
}
