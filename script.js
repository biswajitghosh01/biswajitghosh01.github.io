/* ============================================
   Portfolio Interactions
   ============================================ */
(function () {
  "use strict";

  /* ---------- Nav: scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Nav: mobile toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
    }
  });

  /* ---------- Nav: active link on scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-link:not(.nav-cta)");
  const setActive = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = "";
    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    navItems.forEach((item) => {
      item.classList.toggle(
        "active",
        item.getAttribute("href") === "#" + currentId,
      );
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });

  /* ---------- Hero typing effect ---------- */
  const typingEl = document.getElementById("typing");
  const phrases = [
    "Full-Stack Developer",
    "React & Next.js Specialist",
    "Freelance Problem Solver",
    "Available for Projects",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];
    if (!isDeleting) {
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
      setTimeout(typeLoop, 70);
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 35);
    }
  }
  if (typingEl) typeLoop();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Project demo videos ---------- */
  document.querySelectorAll(".project-demo").forEach((demo) => {
    const videoUrl = demo.dataset.videoUrl.trim();
    if (!videoUrl) return;

    const video = document.createElement("video");
    video.controls = true;
    video.preload = "none";
    video.playsInline = true;
    video.src = videoUrl;
    video.setAttribute("aria-label", demo.dataset.videoLabel);
    demo.append(video);
  });

  /* ---------- Hero particle network ---------- */
  const canvas = document.getElementById("particles");
  if (
    canvas &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      const count = Math.min(Math.floor(w / 14), 90);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.15,
      }));
    };

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124, 108, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 108, 255, ${p.alpha})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createParticles();
      }, 200);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else draw();
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.action.includes("YOUR_FORM_ID")) {
        formNote.textContent =
          "Form not configured yet — add your Formspree ID in the form action.";
        formNote.className = "form-note error";
        return;
      }
      formNote.textContent = "Sending...";
      formNote.className = "form-note";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          formNote.textContent =
            "Message sent! I will get back to you within 24 hours.";
          formNote.className = "form-note success";
          form.reset();
        } else {
          throw new Error("Request failed");
        }
      } catch (err) {
        formNote.textContent =
          "Something went wrong. Please email me directly.";
        formNote.className = "form-note error";
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
