/* ==========================================================================
   WORKNEST - MAIN.JS v5.0
   Interactive Particle Canvas, 3D Tilt, Counter Animations & Modal Systems
   ========================================================================== */

(function () {
  "use strict";

  // --- 1. PARTICLE CONSTELLATION CANVAS ---
  const canvas = document.getElementById("particleCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.color = Math.random() > 0.4 ? "rgba(16, 185, 129, " : "rgba(139, 92, 246, ";
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let dirX = (dx / distance) * force * 3;
            let dirY = (dy / distance) * force * 3;
            this.x -= dirX;
            this.y -= dirY;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let dist = Math.hypot(dx, dy);

          if (dist < 110) {
            let opacity = (1 - dist / 110) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  // --- 2. SMOOTH FLUID CURSOR ---
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".custom-cursor-follower");

  if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      requestAnimationFrame(renderFollower);
    }
    renderFollower();

    const hoverables = document.querySelectorAll("a, button, input, select, textarea, .glass-card, .space-tab-btn, .calc-plan-btn, .faq-trigger-btn");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => follower.classList.add("hovering"));
      el.addEventListener("mouseleave", () => follower.classList.remove("hovering"));
    });
  }

  // --- 3. NAVBAR SCROLL PROGRESS & SHRINK ---
  const navbar = document.getElementById("mainNavbar");
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const backToTopBtn = document.getElementById("backToTopBtn");
  const backToTopCircle = document.getElementById("backToTopCircle");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

    // Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent * 100}%`;
    }

    // Navbar Scrolled Glass
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Back to Top Button & SVG Ring
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }

      if (backToTopCircle) {
        const totalLength = 157;
        const offset = totalLength - scrollPercent * totalLength;
        backToTopCircle.style.strokeDashoffset = offset;
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- 4. DYNAMIC HERO TYPEWRITER ---
  const typewriterEl = document.getElementById("typewriterText");
  if (typewriterEl) {
    const phrases = [
      "Private Offices",
      "Dedicated Desks",
      "Executive Suites",
      "Creative Studios",
      "Conference Pods",
      "Virtual Offices"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
      const currentPhrase = phrases[phraseIdx];
      if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 50;
      } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 120;
      }

      if (!isDeleting && charIdx === currentPhrase.length) {
        typingSpeed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typingSpeed = 400; // Pause before typing next
      }

      setTimeout(typeWriter, typingSpeed);
    }
    setTimeout(typeWriter, 600);
  }

  // --- 5. INTERACTIVE 3D CARD TILT & SPOTLIGHT MOUSE GLOW ---
  const tiltCards = document.querySelectorAll(".glass-card, .hero-primary-card, .space-card-item");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spotlight glow coordinates
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Gentle 3D Tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      if (!card.classList.contains("no-tilt")) {
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // --- 6. ANIMATED NUMBER COUNTERS (On Viewport Intersection) ---
  const counterElements = document.querySelectorAll(".counter-value");
  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetNum = parseInt(target.getAttribute("data-count"), 10);
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * targetNum);

            target.textContent = currentVal.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.textContent = targetNum.toLocaleString();
            }
          }
          requestAnimationFrame(updateCounter);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  // --- 7. SCROLL ENTRANCE OBSERVER ---
  const animatedElements = document.querySelectorAll("[data-animate]");
  if (animatedElements.length > 0) {
    const entranceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    }, { threshold: 0.15 });

    animatedElements.forEach((el) => entranceObserver.observe(el));
  }

  // --- 8. SPACE TYPES TABBED FILTER ---
  const spaceTabs = document.querySelectorAll(".space-tab-btn");
  const spaceCards = document.querySelectorAll(".space-card-item");

  spaceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      spaceTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");
      spaceCards.forEach((card) => {
        const type = card.getAttribute("data-type");
        if (filter === "all" || type === filter) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 30);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  // --- 9. PROPERTIES CITY FILTER ---
  const cityFilterBtns = document.querySelectorAll(".city-filter-btn");
  const propertyCards = document.querySelectorAll(".property-card-unified");

  cityFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cityFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const city = btn.getAttribute("data-city");
      propertyCards.forEach((card) => {
        const cardCity = card.getAttribute("data-city");
        if (city === "all" || cardCity === city) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  // --- 10. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll(".faq-item-card");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger-btn");
    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach((other) => other.classList.remove("active"));
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // --- 11. LIVE TOAST NOTIFICATION STREAM ---
  const toastContainer = document.getElementById("liveToastContainer");
  if (toastContainer) {
    const toastNotifications = [
      { name: "Anthropic AI", action: "booked a 12-seat Private Suite", loc: "Indiranagar, Bangalore", time: "2 mins ago" },
      { name: "Kavya Menon", action: "reserved a Dedicated Desk", loc: "BKC, Mumbai", time: "5 mins ago" },
      { name: "Stripe India", action: "scheduled a team VIP Tour", loc: "CyberHub, Gurugram", time: "11 mins ago" },
      { name: "Rohit & Co", action: "booked Boardroom Pod A", loc: "Hitec City, Hyderabad", time: "18 mins ago" }
    ];

    let toastIdx = 0;
    function triggerNextToast() {
      const data = toastNotifications[toastIdx];
      const toastEl = document.createElement("div");
      toastEl.className = "live-toast";
      toastEl.innerHTML = `
        <div class="live-toast-icon"><i class="bi bi-lightning-charge-fill"></i></div>
        <div class="live-toast-content">
          <div class="live-toast-title"><strong>${data.name}</strong> ${data.action}</div>
          <div class="live-toast-time"><i class="bi bi-geo-alt"></i> ${data.loc} • ${data.time}</div>
        </div>
        <button class="live-toast-close" aria-label="Close notification"><i class="bi bi-x"></i></button>
      `;

      toastContainer.appendChild(toastEl);
      setTimeout(() => toastEl.classList.add("show"), 50);

      toastEl.querySelector(".live-toast-close").addEventListener("click", () => {
        toastEl.classList.remove("show");
        setTimeout(() => toastEl.remove(), 400);
      });

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.classList.remove("show");
          setTimeout(() => toastEl.remove(), 400);
        }
      }, 6000);

      toastIdx = (toastIdx + 1) % toastNotifications.length;
    }

    // Initial toast after 4s, then every 18s
    setTimeout(triggerNextToast, 4000);
    setInterval(triggerNextToast, 18000);
  }

  // --- 12. TOUR BOOKING MODAL ---
  const modalBackdrop = document.getElementById("tourModal");
  const openModalBtns = document.querySelectorAll("[data-open-modal='tourModal']");
  const closeModalBtns = document.querySelectorAll(".modal-close-trigger");

  function openTourModal(spaceName = "") {
    if (!modalBackdrop) return;
    const spaceInput = document.getElementById("modalSpaceSelect");
    if (spaceInput && spaceName) {
      spaceInput.value = spaceName;
    }
    modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeTourModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const space = btn.getAttribute("data-space-title") || "";
      openTourModal(space);
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", closeTourModal);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeTourModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
        closeTourModal();
      }
    });
  }

  // Modal Form Submission Simulation
  const tourForm = document.getElementById("tourBookingForm");
  if (tourForm) {
    tourForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = tourForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Confirming VIP Tour...`;
      submitBtn.disabled = true;

      setTimeout(() => {
        tourForm.innerHTML = `
          <div class="text-center py-4">
            <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: var(--primary-light); display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 20px;">
              <i class="bi bi-check-lg"></i>
            </div>
            <h3 style="color:#ffffff; margin-bottom: 12px;">Tour Confirmed!</h3>
            <p style="color:var(--text-secondary); max-width: 420px; margin: 0 auto 24px auto;">
              Our workspace concierge has reserved your VIP slot. You'll receive a calendar invitation and gate pass via email & WhatsApp shortly.
            </p>
            <button class="btn-magnetic btn-primary-glow btn-sm-custom modal-close-trigger" onclick="location.reload()">Done</button>
          </div>
        `;
      }, 1200);
    });
  }

  // --- 13. MOBILE OFFCANVAS DRAWER MENU ---
  const mobileToggleBtn = document.getElementById("mobileToggleBtn");
  const mobileNavDrawer = document.getElementById("mobileNavDrawer");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (mobileToggleBtn && mobileNavDrawer) {
    mobileToggleBtn.addEventListener("click", () => {
      mobileNavDrawer.classList.add("open");
      document.body.style.overflow = "hidden";
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener("click", () => {
        mobileNavDrawer.classList.remove("open");
        document.body.style.overflow = "";
      });
    }

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavDrawer.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

})();
