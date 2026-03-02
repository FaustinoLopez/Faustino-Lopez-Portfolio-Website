const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealTargets = document.querySelectorAll(".glass-panel, .section-shell");
const sectionEls = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('.site-header nav a[href^="#"]');
const nameStage = document.querySelector(".name-stage");
const nameTitle = document.querySelector(".name-title");

if (revealTargets.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((el) => {
    el.classList.add("js-reveal");
    revealObserver.observe(el);
  });
}

if (sectionEls.length > 0 && navLinks.length > 0 && "IntersectionObserver" in window) {
  const linkMap = new Map();

  navLinks.forEach((link) => {
    const id = link.getAttribute("href");
    if (id) {
      linkMap.set(id.slice(1), link);
    }
  });

  const activeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length === 0) {
        return;
      }

      const activeId = visible[0].target.id;

      navLinks.forEach((link) => {
        link.classList.remove("is-active");
      });

      const activeLink = linkMap.get(activeId);
      if (activeLink) {
        activeLink.classList.add("is-active");
      }
    },
    { threshold: [0.2, 0.5, 0.75], rootMargin: "-16% 0px -55% 0px" }
  );

  sectionEls.forEach((section) => {
    activeObserver.observe(section);
  });
}

if (nameStage && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let frameId = 0;

  const updatePointerVars = (event) => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }

    frameId = requestAnimationFrame(() => {
      const rect = nameStage.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;

      nameStage.style.setProperty("--spot-x", `${Math.max(0, Math.min(100, px)).toFixed(2)}%`);
      nameStage.style.setProperty("--spot-y", `${Math.max(0, Math.min(100, py)).toFixed(2)}%`);
    });
  };

  nameStage.addEventListener("pointermove", updatePointerVars);
  nameStage.addEventListener("pointerenter", updatePointerVars);
  nameStage.addEventListener("pointerleave", () => {
    nameStage.style.removeProperty("--spot-x");
    nameStage.style.removeProperty("--spot-y");
  });
}

if (nameTitle) {
  const sourceText = nameTitle.textContent || "";
  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let scrambleTimer = 0;

  const runScramble = () => {
    if (!sourceText) {
      return;
    }

    if (scrambleTimer) {
      clearInterval(scrambleTimer);
      scrambleTimer = 0;
    }

    let progress = 0;

    scrambleTimer = window.setInterval(() => {
      const nextText = sourceText
        .split("")
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }

          if (index < progress) {
            return sourceText[index];
          }

          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("");

      nameTitle.textContent = nextText;
      progress += 0.45;

      if (progress >= sourceText.length) {
        clearInterval(scrambleTimer);
        scrambleTimer = 0;
        nameTitle.textContent = sourceText;
      }
    }, 32);
  };

  nameTitle.addEventListener("pointerenter", runScramble);
  nameTitle.addEventListener("focus", runScramble);
  nameTitle.addEventListener("pointerleave", () => {
    if (scrambleTimer) {
      clearInterval(scrambleTimer);
      scrambleTimer = 0;
    }
    nameTitle.textContent = sourceText;
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const finalSubject = subject || "New Portfolio Inquiry";
    const bodyLines = [
      `Name: ${name || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      "",
      message || "No message provided."
    ];

    const mailtoHref =
      `mailto:faustinolopezdev@gmail.com?subject=${encodeURIComponent(finalSubject)}` +
      `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailtoHref;
  });
}
