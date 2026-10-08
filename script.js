/* =========================================================
   STACKLY — NUTRITION CENTRE | Vanilla JS
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- PRELOADER ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => $("#preloader") && $("#preloader").classList.add("hide"), 450);
  });
  setTimeout(() => $("#preloader") && $("#preloader").classList.add("hide"), 3500); // fallback

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = $("#cursor"), dot = $("#cursorDot");
  if (cursor && window.matchMedia("(hover:hover)").matches) {
    let x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    });
    (function loop() {
      cx += (x - cx) * 0.16;
      cy += (y - cy) * 0.16;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();
    $$("a,button,.flip-card,input,select,textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("grow"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
    });
  }

  /* ---------- HEADER + NAV + SCROLL SPY ---------- */
  const header = $("#header");
  const sections = $$("section[id]");
  const pageFor = { about:"about", services:"services", plans:"plans", bmi:"bmi", coaches:"experts", blog:"tips", testimonials:"reviews", contact:"contact" };
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    const toTop = $("#toTop");
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
    if (header) spyActive();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function spyActive() {
    const pos = window.scrollY + 140;
    let cur = "home";
    let last = "";
    sections.forEach((s) => {
      if (pos >= s.offsetTop) {
        cur = s.id;
        if (pageFor[cur]) last = pageFor[cur];
      }
    });
    $$(".nav__link").forEach((l) => {
      const href = l.getAttribute("href") || "";
      if (href.startsWith("#")) {
        l.classList.toggle("active", href === "#" + cur);
      } else {
        l.classList.toggle("active", last === href.replace(".html", "") || (cur === "home" && href === "index.html"));
      }
    });
  }

  /* ---------- BACK TO TOP ---------- */
  const toTopBtn = $("#toTop");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    );
  }

  /* ---------- 404 GO BACK ---------- */
  const goBack = $("#goBack");
  if (goBack) {
    goBack.addEventListener("click", () => {
      if (history.length > 1) history.back();
      else window.location.href = "index.html";
    });
  }

  /* ---------- AUTH PAGES (LOGIN / REGISTER) ---------- */
  $$(".auth__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = $(btn.dataset.toggle);
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.classList.toggle("visible", show);
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  const authLogin = $("#loginForm.auth__form");
  if (authLogin) {
    const note = $("#loginNote");
    authLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = $("#loginUser").value.trim();
      const pass = $("#loginPass").value;
      const role = $('input[name="role"]:checked');
      const roleName = role ? role.value : "client";

      if (!user || !pass) {
        note.classList.add("err");
        note.textContent = "Please enter your email/phone and password.";
        return;
      }
      if (pass.length < 6) {
        note.classList.add("err");
        note.textContent = "Password must be at least 6 characters.";
        return;
      }
      note.classList.remove("err");
      note.textContent = roleName === "admin"
        ? "Admin access granted! Redirecting…"
        : "Welcome back! Redirecting to your dashboard…";
      setTimeout(() => {
        window.location.href = roleName === "admin" ? "admin-dashboard.html" : "clients-dashboard.html";
      }, 1200);
    });
  }

  const authRegister = $("#registerForm");
  if (authRegister) {
    const note = $("#registerNote");
    authRegister.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#regName").value.trim();
      const user = $("#regUser").value.trim();
      const pass = $("#regPass").value;
      const terms = $("#regTerms").checked;
      const role = $('input[name="role"]:checked');
      const roleName = role ? role.value : "client";

      if (!name || !user || !pass) {
        note.classList.add("err");
        note.textContent = "Please fill in all the fields.";
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(user) && !/^[0-9+\-\s]{10,15}$/.test(user)) {
        note.classList.add("err");
        note.textContent = "Enter a valid email or phone number.";
        return;
      }
      if (pass.length < 6) {
        note.classList.add("err");
        note.textContent = "Password must be at least 6 characters.";
        return;
      }
      const pass2 = $("#regPass2").value;
      if (pass2 !== pass) {
        note.classList.add("err");
        note.textContent = "Passwords do not match.";
        return;
      }
      if (!terms) {
        note.classList.add("err");
        note.textContent = "Please accept the Terms & Privacy Policy.";
        return;
      }
      note.classList.remove("err");
      note.textContent = (roleName === "admin" ? "Admin " : "Account ") + "created successfully! Redirecting…";
      setTimeout(() => {
        window.location.href = roleName === "admin" ? "admin-dashboard.html" : "clients-dashboard.html";
      }, 1200);
    });
  }

  /* ---------- SCROLL ANIMATIONS (IntersectionObserver) ---------- */
  const animEls = $$("[data-anim]");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const d = e.target.dataset.delay || 0;
            setTimeout(() => e.target.classList.add("in"), +d);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    animEls.forEach((el) => io.observe(el));
  } else {
    animEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- NUMBER COUNTERS (start only when scrolled into view) ---------- */
  const counters = $$("[data-count]");
  const runCount = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = +el.dataset.count;
    const decimals = el.dataset.count.includes(".") ? el.dataset.count.split(".")[1].length : 0;
    const dur = 1800;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.9 && r.bottom > 0;
  };
  const checkCounters = () => counters.forEach((c) => { if (inView(c)) runCount(c); });
  window.addEventListener("scroll", checkCounters, { passive: true });
  window.addEventListener("resize", checkCounters);
  window.addEventListener("load", checkCounters);
  checkCounters();

  /* ---------- 3D TILT ON CARDS ---------- */
  const canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (canHover && !reduced) {
    $$("[data-tilt]").forEach((card) => {
      const max = card.classList.contains("price-card") ? 14 : 10;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const base = card.classList.contains("price-card--featured") ? "translateY(-16px) " : "";
        card.style.transform = `${base}perspective(1000px) rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateZ(12px)`;
        card.style.transition = "transform .12s ease-out, box-shadow .4s";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .7s cubic-bezier(.22,1,.36,1), box-shadow .4s";
        card.style.transform = "";
      });
    });
  }

  /* ---------- FLIP CARDS (touch devices) ---------- */
  $$(".flip-card").forEach((c) => {
    c.addEventListener("click", (e) => {
      if (!canHover) {
        e.preventDefault();
        c.classList.toggle("flipped");
      }
    });
  });

  /* ---------- PARALLAX HERO (desktop only) ---------- */
  const heroVisual = $(".hero__visual");
  if (heroVisual && canHover && !reduced) {
    window.addEventListener("mousemove", (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 22;
      const dy = (e.clientY / window.innerHeight - 0.5) * 18;
      heroVisual.style.transform = `translate3d(${dx}px,${dy}px,0)`;
    });
  }

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const track = $("#track");
  if (track) {
    const slides = $$(".slide", track);
    const dotsWrap = $("#dots");
    let i = 0, timer;

    slides.forEach((_, n) => {
      const d = document.createElement("i");
      if (n === 0) d.classList.add("on");
      d.addEventListener("click", () => go(n));
      dotsWrap.appendChild(d);
    });
    const dots = $$("i", dotsWrap);

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
      restart();
    }
    function restart() {
      clearInterval(timer);
      if (!reduced) timer = setInterval(() => go(i + 1), 5500);
    }
    $("#next").addEventListener("click", () => go(i + 1));
    $("#prev").addEventListener("click", () => go(i - 1));
    restart();

    // swipe support
    let sx = 0;
    track.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) go(dx < 0 ? i + 1 : i - 1);
    });
  }

  /* ---------- ACCORDION ---------- */
  const closeAllAcc = (scope, openBtn) => {
    $$(scope).forEach((item) => {
      if (item === openBtn.parentElement) return;
      item.classList.remove("open");
      const body = item.querySelector(".acc__body, .faq-answer");
      if (body) body.style.maxHeight = null;
    });
  };
  $$(".acc__head").forEach((head) => {
    head.addEventListener("click", () => {
      const item = head.parentElement;
      const body = head.nextElementSibling;
      const isOpen = item.classList.contains("open");

      closeAllAcc(".acc__item", head);
      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
  $$(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const body = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");

      closeAllAcc(".faq-item", btn);
      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  /* ---------- BMI CALCULATOR ---------- */
  const bmiBtn = $("#bmiBtn");
  if (bmiBtn) {
    const hEl = $("#bmiHeight"), wEl = $("#bmiWeight");
    const vEl = $("#bmiValue"), cEl = $("#bmiCat"), barEl = $("#bmiBar"), noteEl = $("#bmiNote");

    const calc = () => {
      const h = parseFloat(hEl.value), w = parseFloat(wEl.value);
      if (!h || !w || h < 80 || h > 250 || w < 20 || w > 300) {
        vEl.textContent = "--";
        cEl.textContent = "Enter a valid height (80–250 cm) and weight (20–300 kg)";
        barEl.style.left = "50%";
        return;
      }
      const bmi = w / Math.pow(h / 100, 2);
      const val = Math.round(bmi * 10) / 10;

      let cat, color, note;
      if (val < 18.5) {
        cat = "Underweight"; color = "#60a5fa";
        note = "Focus on a calorie surplus with protein-dense meals. A dietitian can help you gain weight healthily.";
      } else if (val < 25) {
        cat = "Normal / Healthy"; color = "#a3e635";
        note = "Great place to be. Maintain with balanced meals, strength training and regular activity.";
      } else if (val < 30) {
        cat = "Overweight"; color = "#f59e0b";
        note = "A 5–10% weight loss over 3–6 months significantly improves heart and metabolic markers.";
      } else {
        cat = "Obese"; color = "#ef4444";
        note = "Medical supervision is recommended. Book a free consult so we can plan this safely with your doctor.";
      }

      vEl.textContent = val;
      vEl.style.color = color;
      cEl.textContent = cat;
      barEl.style.left = Math.min(Math.max(((val - 12) / 28) * 100, 2), 98) + "%";
      noteEl.textContent = note;
    };

    bmiBtn.addEventListener("click", calc);
    [hEl, wEl].forEach((i) => i.addEventListener("keydown", (e) => { if (e.key === "Enter") calc(); }));
  }

  /* ---------- FORMS ---------- */
  const form = $("#form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = $("#formNote");
      const name = $("#name").value.trim();
      const phone = $("#phone").value.trim();
      const email = $("#email").value.trim();
      const goal = $("#goal").value;

      if (!name || !phone || !email || !goal) {
        note.style.color = "#fca5a5";
        note.textContent = "Please fill in all required fields.";
        return;
      }
      if (!/^[0-9+\s-]{8,15}$/.test(phone)) {
        note.style.color = "#fca5a5";
        note.textContent = "Enter a valid phone number.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.style.color = "#fca5a5";
        note.textContent = "Enter a valid email address.";
        return;
      }

      note.style.color = "#a3e635";
      note.textContent = "Thank you " + name + "! Our dietitian will call you shortly.";
      form.reset();
    });
  }

  const news = $("#news");
  if (news) {
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = news.querySelector("input");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) return;
      inp.value = "";
      inp.placeholder = "Subscribed ✓";
      setTimeout(() => (inp.placeholder = "Your email"), 3000);
    });
  }

  /* ---------- CONTACT FORM ---------- */
  const contactForm = $("#contactForm");
  const contactSuccess = $("#contactSuccess");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Submitting…"; }
      setTimeout(() => {
        contactForm.reset();
        if (contactSuccess) contactSuccess.classList.add("show");
        if (btn) { btn.disabled = false; btn.textContent = "Request My Free Call"; }
      }, 700);
    });
  }

  /* ---------- FAQ (.faq__q / .faq__a) ---------- */
  $$(".faq__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      const answer = item.querySelector(".faq__a");
      const icon = btn.querySelector("span");
      const isOpen = item.classList.contains("open");

      $$(".faq__item").forEach((faq) => {
        faq.classList.remove("open");
        const faqAnswer = faq.querySelector(".faq__a");
        const faqIcon = faq.querySelector(".faq__q span");
        if (faqAnswer) faqAnswer.style.maxHeight = null;
        if (faqIcon) faqIcon.textContent = "+";
      });

      if (!isOpen) {
        item.classList.add("open");
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
        if (icon) icon.textContent = "−";
      }
    });
  });
})();

/* =========================================================
   STACKLY MOBILE MENU
   HAMBURGER + SLIDER + X CLOSE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".nav");

    if (!hamburger || !nav) {
        console.warn("Mobile menu elements not found.");
        return;
    }

    /* -----------------------------------------
       Create overlay
       ----------------------------------------- */

    let overlay = document.querySelector(".mobile-menu-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "mobile-menu-overlay";

        document.body.appendChild(overlay);
    }

    /* -----------------------------------------
       Create X close button
       ----------------------------------------- */

    let closeButton = nav.querySelector(".nav-close");

    if (!closeButton) {

        closeButton = document.createElement("button");

        closeButton.type = "button";
        closeButton.className = "nav-close";

        closeButton.setAttribute(
            "aria-label",
            "Close navigation"
        );

        closeButton.innerHTML = "&times;";

        nav.insertBefore(
            closeButton,
            nav.firstChild
        );
    }

    /* -----------------------------------------
       Open menu
       ----------------------------------------- */

    function openMenu() {

        nav.classList.add("open");

        hamburger.classList.add("active");

        overlay.classList.add("show");

        document.body.classList.add("menu-open");

        hamburger.setAttribute(
            "aria-expanded",
            "true"
        );

        nav.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    /* -----------------------------------------
       Close menu
       ----------------------------------------- */

    function closeMenu() {

        nav.classList.remove("open");

        hamburger.classList.remove("active");

        overlay.classList.remove("show");

        document.body.classList.remove("menu-open");

        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );

        nav.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    /* -----------------------------------------
       Hamburger CLICK
       ----------------------------------------- */

    hamburger.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (nav.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }

    });

    /* -----------------------------------------
       X CLICK
       ----------------------------------------- */

    closeButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        closeMenu();

    });

    /* -----------------------------------------
       Overlay CLICK
       ----------------------------------------- */

    overlay.addEventListener("click", function () {
        closeMenu();
    });

    /* -----------------------------------------
       Navigation link CLICK
       ----------------------------------------- */

    const navLinks = nav.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {
            closeMenu();
        });

    });

    /* -----------------------------------------
       ESC key
       ----------------------------------------- */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMenu();
        }

    });

    /* -----------------------------------------
       Resize
       ----------------------------------------- */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 992) {
            closeMenu();
        }

    });

});

/* =========================================================
   STACKLY DASHBOARDS (ADMIN + CLIENT)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

    /* ---------- MOBILE SIDEBAR TOGGLE ---------- */
    const dashBurger = document.querySelector(".dash-top__burger");
    const dashOverlay = document.querySelector(".dash-overlay");
    const dashSide = document.querySelector(".dash-side");

    const closeDash = () => {
        document.body.classList.remove("dash-open");
        if (dashBurger) dashBurger.setAttribute("aria-expanded", "false");
    };

    if (dashBurger && dashSide) {
        dashBurger.setAttribute("aria-expanded", "false");
        dashBurger.addEventListener("click", () => {
            const open = document.body.classList.toggle("dash-open");
            dashBurger.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    if (dashOverlay) dashOverlay.addEventListener("click", closeDash);

    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDash(); });

    window.addEventListener("resize", () => { if (window.innerWidth > 1024) closeDash(); });

    /* Close sidebar when a nav link is tapped */
    $$(".dash-nav__link").forEach((link) => {
        link.addEventListener("click", closeDash);
    });

    /* ---------- NOTIFICATIONS DROPDOWN ---------- */
    const dashBell = document.querySelector(".dash-icon-btn");
    const notifPanel = document.querySelector(".dash-notif");

    const closeNotif = () => {
        document.body.classList.remove("dash-notif-open");
        if (dashBell) dashBell.setAttribute("aria-expanded", "false");
    };

    if (dashBell && notifPanel) {
        dashBell.setAttribute("aria-expanded", "false");
        dashBell.setAttribute("aria-haspopup", "true");

        dashBell.addEventListener("click", (e) => {
            e.stopPropagation();
            const open = document.body.classList.toggle("dash-notif-open");
            dashBell.setAttribute("aria-expanded", open ? "true" : "false");
        });

        document.addEventListener("click", (e) => {
            if (!notifPanel.contains(e.target) && !dashBell.contains(e.target)) closeNotif();
        });

        document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNotif(); });
    }

    if (dashBurger) dashBurger.addEventListener("click", closeNotif);

    /* ---------- PAGINATION ---------- */
    $$(".dpage").forEach((page) => {
        const nums = Array.from(page.querySelectorAll("a:not([aria-label])"))
            .filter((b) => b.textContent.trim() !== "…");
        const next = page.querySelector('a[aria-label="Next page"]');
        const setOn = (b) => nums.forEach((n) => n.classList.toggle("on", n === b));
        nums.forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); setOn(b); }));
        if (next) {
            next.addEventListener("click", (e) => {
                e.preventDefault();
                const cur = nums.findIndex((n) => n.classList.contains("on"));
                if (cur === -1) setOn(nums[0]);
                else setOn(nums[(cur + 1) % nums.length]);
            });
        }
    });

    /* ---------- CHECK-IN / APPOINTMENT CALENDAR ---------- */
    const cal = document.querySelector(".dcal");
    if (cal) {
        const now = new Date();
        const month = now.getMonth();            // current month (0-11)
        const year = now.getFullYear();
        const today = now.getDate();
        const checkins = (cal.dataset.checkins || "")
            .split(",").map((n) => parseInt(n, 10)).filter((n) => n > 0);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDow = new Date(year, month, 1).getDay();
        const dows = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const label = document.getElementById("calLabel");

        const dowRow = dows.map((d) => `<span class="dcal__dow">${d}</span>`).join("");
        let days = "";
        for (let d = 1; d <= daysInMonth; d++) {
            const cls = ["dcal__day"];
            if (checkins.includes(d)) cls.push("dcal__day--checkin");
            if (d === today) cls.push("dcal__day--today");
            days += `<div class="${cls.join(" ")}">${d}</div>`;
        }

        const leading = Array(startDow).fill("").map(() => `<div class="dcal__day dcal__day--muted"></div>`).join("");
        cal.innerHTML = dowRow + leading + days;

        if (label) {
            label.textContent = cal.dataset.label || "";
        }
    }

    /* ---------- DASHBOARD SEARCH (tables) ---------- */
    const dashSearch = document.getElementById("dashSearch");
    let dashFilter = "all";
    const applyDashFilter = () => {
        const q = dashSearch ? dashSearch.value.trim().toLowerCase() : "";
        $$(".dash-table tbody tr").forEach((tr) => {
            const okFilter = dashFilter === "all" || (tr.dataset.status || "") === dashFilter;
            const okText = !q || tr.textContent.toLowerCase().includes(q);
            tr.style.display = okFilter && okText ? "" : "none";
        });
    };

    if (dashSearch) {
        dashSearch.addEventListener("input", applyDashFilter);
    }

    /* ---------- FILTER PILLS (tables) ---------- */
    const dfilters = $$(".dfilter");
    if (dfilters.length) {
        dfilters.forEach((pill) => {
            pill.addEventListener("click", () => {
                dfilters.forEach((p) => p.classList.remove("on"));
                pill.classList.add("on");
                dashFilter = pill.dataset.filter || "all";
                applyDashFilter();
            });
        });
    }

    /* ---------- PLAN MIX BARS ANIMATE ---------- */
    const fills = $$(".dbar__fill[data-w]");
    if (fills.length) {
        const animate = () => {
            fills.forEach((f) => {
                f.style.width = f.dataset.w + "%";
            });
        };
        if (window.requestAnimationFrame) {
            requestAnimationFrame(() => requestAnimationFrame(animate));
        } else {
            animate();
        }
    }

    /* ---------- SIDEBAR ACTIVE STATE (click) ---------- */
    $$(".dash-nav__link").forEach((link) => {
        link.addEventListener("click", () => {
            $$(".dash-nav__link").forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
        });
    });

});
