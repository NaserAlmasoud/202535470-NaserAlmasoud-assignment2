/* =========================================================
   Portfolio interactivity
   1. Greeting by time of day
   2. Mobile navigation menu
   3. Highlight the nav link of the section in view
   4. Projects: filter, search and sort
   5. Codeforces stats from the public API
   6. Contact form validation (no backend)
   7. Footer year
   ========================================================= */

/* ---------- 1. Greeting by time of day ---------- */
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good evening.";
  if (hour < 12) greeting = "Good morning.";
  else if (hour < 18) greeting = "Good afternoon.";
  document.getElementById("greeting").textContent = greeting;
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

  // Close the menu after a link is chosen, or with the Escape key
  menu.querySelectorAll(".nav__link").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* ---------- 3. Active nav link while scrolling ---------- */
function setupActiveLinks() {
  const links = document.querySelectorAll(".nav__link");

  // IntersectionObserver is cheaper than running code on every scroll event
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    // A section counts as "active" when it crosses the middle of the screen
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document.querySelectorAll("main section").forEach((section) => observer.observe(section));
}

/* ---------- 4. Projects: filter, search and sort ---------- */
// Projects marked sample: true are made-up examples for testing the filters.
const PROJECTS = [
  { title: "Spam Email Detector", category: "ai", date: "2026-03", tech: "Python, LLM",
    description: "An AI model that detects spam emails. An LLM studies many emails, then classifies a new one as normal or spam." },
  { title: "Deal Finder", category: "web", date: "2026-05", tech: "JavaScript, CSS, HTML, Python",
    description: "A web platform that helps online shoppers find, evaluate and access reliable e-commerce stores." },
  { title: "Student Performance Dashboard", category: "data", date: "2025-11", tech: "Python, Pandas, Matplotlib", sample: true,
    description: "Charts how study time, sleep and attendance relate to final grades in a public dataset." },
  { title: "Housing Price Predictor", category: "data", date: "2026-01", tech: "Python, scikit-learn", sample: true,
    description: "A regression model that estimates a house price from its size, location and age." },
  { title: "Arabic Sentiment Classifier", category: "ai", date: "2026-06", tech: "Python, PyTorch", sample: true,
    description: "Labels Arabic tweets as positive, negative or neutral using a fine-tuned transformer." },
  { title: "Handwritten Digit Recognizer", category: "ai", date: "2025-09", tech: "Python, TensorFlow", sample: true,
    description: "A neural network trained on MNIST that recognizes digits drawn on a canvas." },
  { title: "Course Schedule Planner", category: "web", date: "2025-12", tech: "HTML, CSS, JavaScript", sample: true,
    description: "Builds a weekly timetable from chosen course sections and warns about time clashes." },
];

const CATEGORY_LABELS = { ai: "AI", data: "Data Science", web: "Web Dev" };
const CATEGORY_ICONS = { ai: "fa-brain", data: "fa-chart-line", web: "fa-code" };

function setupProjects() {
  const grid = document.getElementById("projectGrid");
  const search = document.getElementById("projectSearch");
  const sort = document.getElementById("projectSort");
  const buttons = document.querySelectorAll(".filter-btn");
  let filter = "all";

  function render() {
    const query = search.value.trim().toLowerCase();

    // 1. keep projects in the chosen category that contain the search text
    const visible = PROJECTS.filter((p) => {
      const inCategory = filter === "all" || p.category === filter;
      const text = `${p.title} ${p.description} ${p.tech}`.toLowerCase();
      return inCategory && text.includes(query);
    });

    // 2. sort them (dates are "YYYY-MM", so comparing them as text works)
    visible.sort((a, b) => {
      if (sort.value === "az") return a.title.localeCompare(b.title);
      if (sort.value === "oldest") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });

    // 3. build the cards (the data is written above, not typed by users, so innerHTML is safe here)
    grid.innerHTML = visible.map((p) => `
      <article class="project">
        <div class="project__cover project__cover--${p.category}">
          <i class="fa-solid ${CATEGORY_ICONS[p.category]}" aria-hidden="true"></i>
          ${p.sample ? '<span class="project__sample">Sample</span>' : ""}
        </div>
        <div class="project__body">
          <p class="project__meta">${CATEGORY_LABELS[p.category]} · ${p.date}</p>
          <h3 class="project__title">${p.title}</h3>
          <p class="project__desc">${p.description}</p>
          <p class="project__tech">${p.tech}</p>
        </div>
      </article>`).join("");

    document.getElementById("projectEmpty").hidden = visible.length > 0;
    document.getElementById("projectCount").textContent = `Showing ${visible.length} of ${PROJECTS.length} projects`;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      buttons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      render();
    });
  });

  search.addEventListener("input", render); // filter live while typing
  sort.addEventListener("change", render);

  // "Clear filters" in the empty state: empty the search and click "All"
  document.getElementById("clearFilters").addEventListener("click", () => {
    search.value = "";
    buttons[0].click();
  });

  render();
}

/* ---------- 5. Codeforces stats from the public API ---------- */
const CF_URL = "https://codeforces.com/api/user.info?handles=Naser_md";

async function loadCodeforces() {
  const loading = document.getElementById("cfLoading");
  const error = document.getElementById("cfError");
  const content = document.getElementById("cfContent");

  loading.hidden = false;
  error.hidden = true;
  content.hidden = true;

  try {
    const response = await fetch(CF_URL);
    const data = await response.json();
    if (data.status !== "OK") throw new Error(data.comment);

    const user = data.result[0];
    document.getElementById("cfHandle").textContent = user.handle;
    document.getElementById("cfRating").textContent = user.rating || "Unrated";
    document.getElementById("cfMaxRating").textContent = user.maxRating || "–";
    document.getElementById("cfRank").textContent = user.rank || "Unrated";
    document.getElementById("cfMaxRank").textContent = user.maxRank || "–";
    content.hidden = false;
  } catch (err) {
    // No internet, Codeforces down, or a bad response: tell the user what to do
    error.hidden = false;
  } finally {
    loading.hidden = true;
  }
}

/* ---------- 6. Contact form validation ---------- */
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

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `form__status form__status--${type}`;
  }

  // Re-check a field when the user leaves it
  fields.forEach((field) => field.addEventListener("blur", () => validateField(field)));

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // no backend: stay on the page

    // map() checks every field so all errors show at once
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      showStatus("Please fix the highlighted fields and try again.", "error");
      fields.find((field) => field.classList.contains("is-invalid")).focus();
      return;
    }

    const name = form.elements.name.value.trim();
    showStatus(`Thanks, ${name}! This demo form has no backend yet, so nothing was sent. Please email me at me@naser.md.`, "success");
    form.reset();
  });
}

/* ---------- 7. Footer year ---------- */
function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* Run everything once the HTML is ready. Each feature runs on its own,
   so an error in one (shown in the console) does not stop the others. */
document.addEventListener("DOMContentLoaded", () => {
  [setGreeting, setupMobileNav, setupActiveLinks, setupProjects, setupContactForm, setYear].forEach((setup) => {
    try {
      setup();
    } catch (err) {
      console.error(`${setup.name} failed:`, err);
    }
  });

  loadCodeforces();
  document.getElementById("cfRetry").addEventListener("click", loadCodeforces);
});
