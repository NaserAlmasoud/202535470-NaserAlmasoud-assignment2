/* =========================================================
   Portfolio interactivity
   1. Greeting by time of day
   2. Mobile navigation menu
   3. Highlight the nav link of the section in view
   4. Projects: data, filter, search, sort
   5. Contact form validation (no backend)
   6. Footer year
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

/* ---------- 4. Projects: data, filter, search, sort ---------- */

/* Project data. The cards are built from this array, so adding a project
   means adding one object here, not copying HTML.
   Entries marked sample: true are made-up examples used to test the
   filter, search and sort features; they show a "Sample" tag on the card. */
const PROJECTS = [
  {
    title: "Spam Email Detector",
    category: "ai",
    date: "2026-03",
    description: "An AI model that detects spam emails so you can ignore them. An LLM studies a large number of emails, then classifies a new email as normal or spam.",
    tech: ["Python", "LLM"],
  },
  {
    title: "Deal Finder",
    category: "web",
    date: "2026-05",
    description: "A centralized web-based store discovery platform that helps online shoppers find, evaluate and access reliable e-commerce retailers.",
    tech: ["JavaScript", "CSS", "HTML", "Python"],
  },
  {
    title: "Student Performance Dashboard",
    category: "data",
    date: "2025-11",
    description: "Cleans a public dataset of exam scores and charts how study time, sleep and attendance relate to final grades.",
    tech: ["Python", "Pandas", "Matplotlib"],
    sample: true,
  },
  {
    title: "Housing Price Predictor",
    category: "data",
    date: "2026-01",
    description: "Explores housing listings and trains a regression model that estimates a price from size, location and age.",
    tech: ["Python", "scikit-learn", "Pandas"],
    sample: true,
  },
  {
    title: "Arabic Sentiment Classifier",
    category: "ai",
    date: "2026-06",
    description: "Fine-tunes a small transformer to label Arabic tweets as positive, negative or neutral.",
    tech: ["Python", "PyTorch", "Transformers"],
    sample: true,
  },
  {
    title: "Handwritten Digit Recognizer",
    category: "ai",
    date: "2025-09",
    description: "A convolutional neural network trained on MNIST, with a canvas where you draw a digit and see the prediction.",
    tech: ["Python", "TensorFlow", "JavaScript"],
    sample: true,
  },
  {
    title: "Course Schedule Planner",
    category: "web",
    date: "2025-12",
    description: "Pick your courses and sections and get a weekly timetable that warns you about time clashes. Saves your plan in the browser.",
    tech: ["HTML", "CSS", "JavaScript"],
    sample: true,
  },
];

// Label and Font Awesome icon for each category
const CATEGORIES = {
  ai: { label: "AI", icon: "fa-brain" },
  data: { label: "Data Science", icon: "fa-chart-line" },
  web: { label: "Web Dev", icon: "fa-code" },
};

// Each sort option is a compare function for Array.prototype.sort
const SORTERS = {
  newest: (a, b) => b.date.localeCompare(a.date),
  oldest: (a, b) => a.date.localeCompare(b.date),
  az: (a, b) => a.title.localeCompare(b.title),
};

// "2026-03" -> "Mar 2026"
function formatMonth(isoMonth) {
  const [year, month] = isoMonth.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Build one card. textContent is used for all data, so no text is ever parsed as HTML.
function createProjectCard(project, index) {
  const category = CATEGORIES[project.category];
  const card = document.createElement("article");
  card.className = "project";
  card.style.setProperty("--i", index); // used to stagger the fade-in animation

  card.innerHTML = `
    <div class="project__cover project__cover--${project.category}" aria-hidden="true">
      <i class="fa-solid ${category.icon}"></i>
    </div>
    <div class="project__body">
      <div class="project__meta">
        <span class="project__category"></span>
        <time class="project__date"></time>
      </div>
      <h3 class="project__title"></h3>
      <p class="project__desc"></p>
      <ul class="project__tech" aria-label="Technologies used"></ul>
    </div>`;

  card.querySelector(".project__category").textContent = category.label;
  const time = card.querySelector(".project__date");
  time.dateTime = project.date;
  time.textContent = formatMonth(project.date);
  card.querySelector(".project__title").textContent = project.title;
  card.querySelector(".project__desc").textContent = project.description;

  const techList = card.querySelector(".project__tech");
  project.tech.forEach((tech) => {
    const li = document.createElement("li");
    li.textContent = tech;
    techList.append(li);
  });

  if (project.sample) {
    const tag = document.createElement("span");
    tag.className = "project__sample";
    tag.textContent = "Sample";
    tag.title = "Example project used to demo filtering";
    card.querySelector(".project__cover").append(tag);

    // The cover is hidden from screen readers, so add the same note to the title
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = " (sample project)";
    card.querySelector(".project__title").append(note);
  }

  return card;
}

function setupProjects() {
  const grid = document.getElementById("projectGrid");
  const count = document.getElementById("projectCount");
  const empty = document.getElementById("projectEmpty");
  const search = document.getElementById("projectSearch");
  const sort = document.getElementById("projectSort");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Current view settings; render() turns these into cards
  const state = { filter: "all", query: "", sort: "newest" };

  function matches(project) {
    const inCategory = state.filter === "all" || project.category === state.filter;
    // Search the title, description and technologies, ignoring case
    const text = [project.title, project.description, ...project.tech].join(" ").toLowerCase();
    return inCategory && text.includes(state.query);
  }

  function render() {
    const visible = PROJECTS.filter(matches).sort(SORTERS[state.sort]);

    // Build all cards in a fragment, then swap them in with one DOM update
    const fragment = document.createDocumentFragment();
    visible.forEach((project, i) => fragment.append(createProjectCard(project, i)));
    grid.replaceChildren(fragment);

    empty.hidden = visible.length > 0;
    count.textContent = `Showing ${visible.length} of ${PROJECTS.length} projects`;
  }

  function setFilter(value) {
    state.filter = value;
    filterButtons.forEach((btn) => {
      const active = btn.dataset.filter === value;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(btn.dataset.filter);
      render();
    });
  });

  // Filter live while typing
  search.addEventListener("input", () => {
    state.query = search.value.trim().toLowerCase();
    render();
  });

  sort.addEventListener("change", () => {
    state.sort = sort.value;
    render();
  });

  // Empty-state button resets the search and the category
  document.getElementById("clearFilters").addEventListener("click", () => {
    search.value = "";
    state.query = "";
    setFilter("all");
    render();
    search.focus();
  });

  render();
}

/* ---------- 5. Contact form validation ---------- */
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

/* ---------- 6. Footer year ---------- */
function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* Run everything once the HTML is ready */
document.addEventListener("DOMContentLoaded", () => {
  setGreeting();
  setupMobileNav();
  setupActiveLinks();
  setupProjects();
  setupContactForm();
  setYear();
});
