/* ===================================
   FUERA DE LÍNEA - JAVASCRIPT
   Interactive Features & Functionality
   =================================== */

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initNavigation();
  initTimezoneConverter();
  initCountdown();
  initScrollEffects();
  initContactForm();
  initSmoothScroll();
});

/* ===================================
   NAVIGATION
   =================================== */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky navbar on scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");

      // Animate hamburger
      const spans = navToggle.querySelectorAll("span");
      spans[0].style.transform = navMenu.classList.contains("active")
        ? "rotate(45deg) translate(5px, 5px)"
        : "rotate(0) translate(0, 0)";
      spans[1].style.opacity = navMenu.classList.contains("active") ? "0" : "1";
      spans[2].style.transform = navMenu.classList.contains("active")
        ? "rotate(-45deg) translate(7px, -6px)"
        : "rotate(0) translate(0, 0)";
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");

      // Reset hamburger animation
      const spans = navToggle.querySelectorAll("span");
      spans[0].style.transform = "rotate(0) translate(0, 0)";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "rotate(0) translate(0, 0)";
    });
  });
}

/* ===================================
   TIMEZONE CONVERTER
   =================================== */
function initTimezoneConverter() {
  const userTimezoneElement = document.getElementById("userTimezone");

  if (!userTimezoneElement) return;

  // Stream time: Wednesdays at 19:00 Argentina time (GMT-3)
  const argentinaTZ = "America/Argentina/Buenos_Aires";

  try {
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create a date object for Wednesday 19:00 Argentina time
    const now = new Date();
    const daysUntilWednesday = (3 - now.getDay() + 7) % 7;
    const nextWednesday = new Date(now);
    nextWednesday.setDate(now.getDate() + daysUntilWednesday);

    // Set to 19:00 Argentina time
    const streamTimeArgentina = new Date(
      nextWednesday.toLocaleString("en-US", {
        timeZone: argentinaTZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
    streamTimeArgentina.setHours(19, 0, 0, 0);

    // Convert to user's timezone
    const userTime = new Date(
      streamTimeArgentina.toLocaleString("en-US", {
        timeZone: userTimezone,
      })
    );

    // Format the time for display
    const options = {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };

    const formattedTime = new Intl.DateTimeFormat("es-ES", options).format(
      streamTimeArgentina
    );

    // Get user's local time
    const userLocalTime = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: userTimezone,
      timeZoneName: "short",
    });

    // Calculate the difference
    const argDate = new Date();
    argDate.setHours(19, 0, 0, 0);
    const argString = argDate.toLocaleString("en-US", {
      timeZone: argentinaTZ,
    });
    const userString = argDate.toLocaleString("en-US", {
      timeZone: userTimezone,
    });

    const argTime = new Date(argString);
    const userTimeCalc = new Date(userString);

    const diffHours = Math.round((userTimeCalc - argTime) / (1000 * 60 * 60));

    // Display user's timezone with the stream time
    let timezoneText = "";
    if (diffHours === 0) {
      timezoneText = `Miércoles 19:00 HS (Tu mismo horario)`;
    } else if (diffHours > 0) {
      timezoneText = `Miércoles ${
        (19 + diffHours) % 24
      }:00 HS (${diffHours} horas después)`;
    } else {
      timezoneText = `Miércoles ${(19 + diffHours + 24) % 24}:00 HS (${Math.abs(
        diffHours
      )} horas antes)`;
    }

    userTimezoneElement.innerHTML = `<strong>${timezoneText}</strong>`;
  } catch (error) {
    console.error("Error calculating timezone:", error);
    userTimezoneElement.textContent = "Miércoles 19:00 HS (Argentina)";
  }
}

/* ===================================
   COUNTDOWN TIMER - ARGENTINA (UTC-3)
   =================================== */
function initCountdown() {
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement)
    return;

  function getNextWednesday19() {
    const now = new Date();

    // Crear una fecha en zona horaria Argentina — sin depender del navegador
    const argTime = new Date(
      now.toLocaleString("en-US", {
        timeZone: "America/Argentina/Buenos_Aires",
      })
    );

    const day = argTime.getDay(); // 0 Dom ... 3 Mié ...
    const hour = argTime.getHours();

    let daysToAdd = (3 - day + 7) % 7; // próximo miércoles

    // Si hoy es miércoles y ya pasó las 19, ir al próximo
    if (day === 3 && hour >= 19) {
      daysToAdd = 7;
    }

    // Crear fecha del próximo miércoles a las 19
    const target = new Date(argTime);
    target.setDate(argTime.getDate() + daysToAdd);
    target.setHours(19, 0, 0, 0);

    return target;
  }

  function updateCountdown() {
    const now = new Date();

    // Target en horario argentino convertido automáticamente a la hora local del usuario
    const target = getNextWednesday19();

    const diff = target - now;

    if (diff <= 0) {
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ===================================
   SCROLL EFFECTS
   =================================== */
function initScrollEffects() {
  const scrollTopBtn = document.getElementById("scrollTop");

  if (!scrollTopBtn) return;

  // Show/hide scroll to top button
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  // Scroll to top functionality
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all section elements
  const animatedElements = document.querySelectorAll(
    ".value-card, .team-card, .video-card, .content-card, .sponsor-card, .social-card"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if href is just "#"
      if (href === "#") return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const offsetTop = target.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ===================================
   CONTACT FORM
   =================================== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    // Validate
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showMessage("Por favor completa todos los campos requeridos.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage("Por favor ingresa un email válido.", "error");
      return;
    }

    // Create mailto link (since this is a static site)
    const subject = encodeURIComponent(`[Sitio Web] ${formData.subject}`);
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Asunto: ${formData.subject}\n\n` +
        `Mensaje:\n${formData.message}`
    );

   const gmailLink =
  `https://mail.google.com/mail/?view=cm&fs=1` +
  `&to=fueradelinea.jph@gmail.com` +
  `&su=${subject}` +
  `&body=${body}`;

window.open(gmailLink, "_blank");


    // Show success message
    showMessage(
      "¡Gracias! Tu cliente de correo se abrirá para enviar el mensaje.",
      "success"
    );

    // Reset form after a delay
    setTimeout(() => {
      form.reset();
      hideMessage();
    }, 3000);
  });

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
  }

  function hideMessage() {
    formMessage.className = "form-message";
    formMessage.textContent = "";
  }
}

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format number with leading zeros
function padZero(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* ===================================
   PERFORMANCE OPTIMIZATIONS
   =================================== */

// Lazy load images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll("img[data-src]");
  images.forEach((img) => imageObserver.observe(img));
}

// Optimize scroll performance
let ticking = false;
window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(function () {
      // Scroll-based animations here
      ticking = false;
    });
    ticking = true;
  }
});

/* ===================================
   CONSOLE MESSAGE
   =================================== */
console.log(
  "%c🎬 Fuera De Línea 🎬",
  "font-size: 20px; font-weight: bold; color: #FFD700;"
);
console.log(
  "%cStreaming desde Santa Rosa, La Pampa",
  "font-size: 14px; color: #FF6B35;"
);
console.log(
  "%cTodos los Miércoles 19:00 HS (Argentina)",
  "font-size: 12px; color: #fff;"
);
console.log(
  "%c¡Síguenos en nuestras redes sociales!",
  "font-size: 12px; color: #FFD700;"
);
console.log("YouTube: https://www.youtube.com/@FueraDeLinea-amen");
console.log("Instagram: https://www.instagram.com/fueradelinea.ar");
console.log("TikTok: https://www.tiktok.com/@fueradelinea.ar");
console.log("Facebook: https://www.facebook.com/share/1X6yWV5iMF/");

// === VERSE OF THE WEEK ===
const verses = [
  {
    text: "Todo lo puedo en Cristo que me fortalece.",
    reference: "Filipenses 4:13"
  },
  {
    text: "Porque yo sé los planes que tengo para ustedes, planes de bienestar y no de calamidad.",
    reference: "Jeremías 29:11"
  },
  {
    text: "El Señor es mi pastor; nada me faltará.",
    reference: "Salmos 23:1"
  },
  {
    text: "El gozo del Señor es nuestra fortaleza.",
    reference: "Nehemías 8:10"
  }
];

// Obtener número de semana del año
function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
}

const weekNumber = getWeekNumber(new Date());
const verseIndex = weekNumber % verses.length;

const verseText = document.getElementById("weeklyVerse");
const verseRef = document.getElementById("weeklyVerseRef");

if (verseText && verseRef) {
  verseText.textContent = `“${verses[verseIndex].text}”`;
  verseRef.textContent = verses[verseIndex].reference;
}

const guestsScroll = document.getElementById("guestsScroll");

document.querySelector(".guests-arrow.left")
  .addEventListener("click", () => {
    guestsScroll.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  });

document.querySelector(".guests-arrow.right")
  .addEventListener("click", () => {
    guestsScroll.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  });
