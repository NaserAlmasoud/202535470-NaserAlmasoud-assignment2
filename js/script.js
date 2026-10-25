/* =========================================================
   Portfolio interactivity
   1. Greeting by time of day
   2. Mobile navigation menu
   3. Highlight the nav link of the section in view
   4. Contact form validation (no backend)
   5. Footer year
   ========================================================= */

/* ---------- 1. Greeting by time of day ---------- */
function setGreeting() {
  const greetingEl = document.getElementById("greeting");
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning.";
  } else if (hour < 18) {
    greeting = "Good afternoon.";
  } else {
    greeting = "Good evening.";
  }

  greetingEl.textContent = greeting;
}

/* ---------- 2. Mobile navigation ---------- */
function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after a link is chosen
  menu.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu with the Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* ---------- 3. Active nav link while scrolling ---------- */
function setupActiveLinks() {
  const links = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("main section");

  // IntersectionObserver is cheaper than running code on every scroll event
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const matches = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", matches);
        });
      });
    },
    // A section counts as "active" when it crosses the middle of the screen
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 4. Contact form validation ---------- */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const fields = [...form.querySelectorAll("input, textarea")];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Each rule returns an error message, or an empty string when the value is valid
  const rules = {
    name: (value) => (value.length < 2 ? "Enter your name (at least 2 characters)." : ""),
    email: (value) => (!emailPattern.test(value) ? "Enter a valid email, like name@example.com." : ""),
    message: (value) => (value.length < 10 ? "Write a message of at least 10 characters." : ""),
  };

  function validateField(field) {
    const error = rules[field.name](field.value.trim());
    document.getElementById(`${field.name}Error`).textContent = error;
    field.classList.toggle("is-invalid", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }

  // Re-check a field when the user leaves it
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // no backend: stay on the page
    status.textContent = "";

    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      // Move focus to the first field that needs fixing
      fields.find((field) => field.classList.contains("is-invalid")).focus();
      return;
    }

    const name = form.elements.name.value.trim();
    status.textContent = `Thanks, ${name}. This demo form has no backend yet, so nothing was sent — please email me directly for now.`;
    form.reset();
  });
}

/* ---------- 5. Footer year ---------- */
function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* Run everything once the HTML is ready */
document.addEventListener("DOMContentLoaded", () => {
  setGreeting();
  setupMobileNav();
  setupActiveLinks();
  setupContactForm();
  setYear();
});
