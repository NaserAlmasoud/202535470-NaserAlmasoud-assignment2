/* =========================================================
   Portfolio interactivity
   0. Safe localStorage helper
   1. Greeting by time of day (and the visitor's name, if saved)
   2. Mobile navigation menu
   3. Highlight the nav link of the section in view
   4. Projects: data, filter, search, sort
   5. Codeforces stats from the public API
   6. Contact form validation (no backend)
   7. Footer year
   ========================================================= */

/* ---------- 0. Safe localStorage helper ---------- */
/* localStorage can be unavailable (private mode, blocked site data) or
   hold broken JSON, so every read and write goes through these two
   functions, which never throw. The site works the same without storage. */
const storage = {
  get(key, fallback = null) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: ignore */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

/* ---------- 1. Greeting by time of day ---------- */
function setGreeting() {
  const greetingEl = document.getElementById("greeting");
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  // After someone sends the contact form, greet them by name on later visits
  const name = storage.get("visitor-name");
  greetingEl.textContent = name ? `${greeting}, ${name}.` : `${greeting}.`;
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

  // Current view settings; render() turns these into cards.
  // The chosen filter and sort are remembered between visits.
  // Saved values are only used if they are still valid options.
  const saved = Object(storage.get("project-prefs", {}));
  const state = {
    filter: Object.hasOwn(CATEGORIES, saved.filter) ? saved.filter : "all",
    query: "",
    sort: Object.hasOwn(SORTERS, saved.sort) ? saved.sort : "newest",
  };

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
    storage.set("project-prefs", { filter: state.filter, sort: state.sort });
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

  // Apply the saved settings to the controls before the first render
  setFilter(state.filter);
  sort.value = state.sort;
  render();
}

/* ---------- 5. Codeforces stats from the public API ---------- */
const CF_HANDLE = "Nasertmp";
const CF_API = "https://codeforces.com/api/";
const CF_CACHE_KEY = "cf-stats";
const CF_CACHE_MINUTES = 30;
const CF_TIMEOUT_MS = 10000;
const CF_CALL_GAP_MS = 2100; // Codeforces allows about one API call every 2 seconds

// Codeforces rank colours, lightened so they are readable on the dark page
const CF_RANK_COLORS = {
  newbie: "#b4b4c8",
  pupil: "#6fdc8c",
  specialist: "#4fd1c5",
  expert: "#8fa8ff",
  "candidate master": "#e07be0",
  master: "#ffb066",
  "international master": "#ffb066",
  grandmaster: "#ff7a7a",
  "international grandmaster": "#ff7a7a",
  "legendary grandmaster": "#ff7a7a",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let cfLastCall = 0;

/* One Codeforces API call. Waits if the previous call was too recent,
   gives up after CF_TIMEOUT_MS, and throws a readable error on failure. */
async function cfRequest(method, params, isRetry = false) {
  const wait = cfLastCall + CF_CALL_GAP_MS - Date.now();
  if (wait > 0) await delay(wait);
  cfLastCall = Date.now();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CF_TIMEOUT_MS);
  const url = `${CF_API}${method}?${new URLSearchParams(params)}`;

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    throw new Error(error.name === "AbortError" ? "timeout" : "network");
  } finally {
    clearTimeout(timer);
  }

  // Codeforces answers errors with JSON too, e.g. {status: "FAILED", comment: "..."}
  const data = await response.json().catch(() => null);
  if (data && data.status === "OK") return data.result;

  const comment = (data && data.comment) || `HTTP ${response.status}`;
  if (/call limit/i.test(comment) && !isRetry) {
    await delay(CF_CALL_GAP_MS);
    return cfRequest(method, params, true);
  }
  throw new Error(/not found/i.test(comment) ? "not-found" : "api");
}

// Turn an internal error code into a message that says what to do next
function cfErrorMessage(error) {
  if (!navigator.onLine) return "You seem to be offline. Check your internet connection, then press Try again.";
  switch (error.message) {
    case "timeout":
      return "Codeforces is taking too long to respond. It may be busy, so please try again in a moment.";
    case "not-found":
      return `The Codeforces handle "${CF_HANDLE}" was not found.`;
    default:
      return "Codeforces could not be reached right now. Please try again in a moment, or open the profile directly.";
  }
}

// Count distinct problems with at least one accepted submission
function countSolved(submissions) {
  const solved = new Set();
  submissions.forEach((sub) => {
    if (sub.verdict === "OK") solved.add(`${sub.problem.contestId}-${sub.problem.index}`);
  });
  return solved.size;
}

function minutesAgo(timestamp) {
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
}

// Draw the rating history as a small SVG line chart
function drawRatingChart(container, contests) {
  if (contests.length === 0) {
    container.innerHTML = '<p class="cf__placeholder">No rated contests yet. The chart appears after the first rated contest.</p>';
    return;
  }

  const width = 600;
  const height = 180;
  const pad = 12;
  // Number() makes sure only numbers end up in the SVG markup
  const ratings = contests.map((c) => Number(c.newRating));
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const range = Math.max(max - min, 50); // avoid a flat line when ratings barely change

  const x = (i) => (ratings.length === 1 ? width / 2 : pad + (i * (width - 2 * pad)) / (ratings.length - 1));
  const y = (rating) => height - pad - ((rating - min) / range) * (height - 2 * pad);

  const points = ratings.map((r, i) => `${x(i).toFixed(1)},${y(r).toFixed(1)}`).join(" ");
  const dots = ratings
    .map((r, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(r).toFixed(1)}" r="4"><title>${r}</title></circle>`)
    .join("");

  const first = ratings[0];
  const last = ratings[ratings.length - 1];
  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Rating went from ${first} to ${last} over ${ratings.length} rated contests, peaking at ${max}.">
      <line class="cf__grid" x1="0" x2="${width}" y1="${y(max)}" y2="${y(max)}" />
      <line class="cf__grid" x1="0" x2="${width}" y1="${y(min)}" y2="${y(min)}" />
      <polyline class="cf__line" points="${points}" />
      <g class="cf__dots">${dots}</g>
    </svg>
    <p class="cf__chart-caption" aria-hidden="true">
      <span>Peak <strong>${max}</strong></span>
      <span>Lowest <strong>${min}</strong></span>
      <span>First → latest <strong>${first} → ${last}</strong></span>
    </p>`;
}

function setupCodeforces() {
  const panel = document.getElementById("cfPanel");
  const loading = document.getElementById("cfLoading");
  const loadingText = document.getElementById("cfLoadingText");
  const errorBox = document.getElementById("cfError");
  const errorText = document.getElementById("cfErrorText");
  const content = document.getElementById("cfContent");
  const notice = document.getElementById("cfNotice");
  const el = (id) => document.getElementById(id);

  let busy = false;

  // Show exactly one of: loading, error, content
  function show(view) {
    loading.hidden = view !== "loading";
    errorBox.hidden = view !== "error";
    content.hidden = view !== "content";
    panel.setAttribute("aria-busy", String(view === "loading"));
  }

  function renderProfile(info) {
    const rank = info.rank || "unrated";
    el("cfHandle").textContent = info.handle;
    el("cfRank").textContent = rank;
    el("cfRank").style.color = CF_RANK_COLORS[rank] || "var(--ink-muted)";
    el("cfRating").textContent = info.rating ?? "Unrated";
    el("cfMaxRating").textContent = info.maxRating ?? "–";

    const avatar = el("cfAvatar");
    if (info.titlePhoto) {
      avatar.src = info.titlePhoto.startsWith("//") ? `https:${info.titlePhoto}` : info.titlePhoto;
      avatar.alt = `${info.handle}'s Codeforces avatar`;
      avatar.hidden = false;
      avatar.onerror = () => (avatar.hidden = true);
    }
  }

  function renderContests(contests) {
    el("cfContestCount").textContent = contests.length;
    drawRatingChart(el("cfChart"), contests);

    const list = el("cfContests");
    list.replaceChildren();
    if (contests.length === 0) {
      list.innerHTML = '<li class="cf__placeholder">No rated contests yet.</li>';
      return;
    }

    // Newest five contests first
    contests.slice(-5).reverse().forEach((c) => {
      const change = c.newRating - c.oldRating;
      const li = document.createElement("li");
      li.className = "cf__contest";
      li.innerHTML = `
        <a class="cf__contest-name" target="_blank" rel="noopener"></a>
        <span class="cf__contest-date"></span>
        <span class="cf__contest-rank"></span>
        <span class="cf__contest-change"></span>`;
      const link = li.querySelector("a");
      link.href = `https://codeforces.com/contest/${c.contestId}`;
      link.textContent = c.contestName;
      li.querySelector(".cf__contest-date").textContent = new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      li.querySelector(".cf__contest-rank").textContent = `Rank ${c.rank}`;
      const changeEl = li.querySelector(".cf__contest-change");
      changeEl.textContent = change > 0 ? `+${change}` : String(change);
      changeEl.classList.add(change >= 0 ? "is-up" : "is-down");
      list.append(li);
    });
  }

  function renderAll(stats) {
    renderProfile(stats.info);
    renderContests(stats.contests);
    el("cfSolved").textContent = stats.solved;
    el("cfUpdated").textContent = `Updated ${minutesAgo(stats.savedAt)}`;
  }

  async function load({ force = false } = {}) {
    if (busy) return;
    busy = true;
    notice.hidden = true;

    // Ignore saved data that is missing parts (e.g. from an older version of the site)
    let cached = storage.get(CF_CACHE_KEY);
    if (!cached || !cached.info || !Array.isArray(cached.contests) || typeof cached.savedAt !== "number") cached = null;
    const isFresh = cached && Date.now() - cached.savedAt < CF_CACHE_MINUTES * 60000;

    // Recent saved stats: show them instantly without calling the API
    if (cached && isFresh && !force) {
      renderAll(cached);
      show("content");
      busy = false;
      return;
    }

    loadingText.textContent = "Loading Codeforces stats…";
    show("loading");

    try {
      // Three calls, spaced out by cfRequest. Each part is shown as soon as it arrives.
      const [info] = await cfRequest("user.info", { handles: CF_HANDLE });
      renderProfile(info);
      el("cfContestCount").textContent = "…";
      el("cfSolved").textContent = "…";
      el("cfUpdated").textContent = "Loading contest history and solved problems…";
      show("content");

      const contests = await cfRequest("user.rating", { handle: CF_HANDLE });
      renderContests(contests);

      const submissions = await cfRequest("user.status", { handle: CF_HANDLE });
      const stats = { info, contests, solved: countSolved(submissions), savedAt: Date.now() };
      storage.set(CF_CACHE_KEY, stats);
      renderAll(stats);
    } catch (error) {
      if (cached) {
        // Older saved stats are better than an empty box: show them with a note
        renderAll(cached);
        notice.textContent = `Live update failed, so these are saved stats from ${minutesAgo(cached.savedAt)}. ${cfErrorMessage(error)}`;
        notice.hidden = false;
        show("content");
      } else {
        errorText.textContent = cfErrorMessage(error);
        show("error");
      }
    } finally {
      busy = false;
    }
  }

  el("cfRetry").addEventListener("click", () => load({ force: true }));
  el("cfRefresh").addEventListener("click", () => load({ force: true }));

  // Only call the API when the section is about to scroll into view
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    },
    { rootMargin: "300px 0px" }
  );
  observer.observe(panel);
}

/* ---------- 6. Contact form validation ---------- */
const MESSAGE_MAX = 500;
const DRAFT_KEY = "contact-draft";

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const counter = document.getElementById("messageCount");
  const draftNote = document.getElementById("draftNote");
  const submitBtn = form.querySelector('button[type="submit"]');
  const fields = [...form.querySelectorAll("input, textarea")];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Each rule returns an error message, or an empty string when the value is valid
  const rules = {
    name: (value) => (value.length < 2 ? "Enter your name (at least 2 characters)." : ""),
    email: (value) => {
      if (!value) return "Enter your email so I can reply.";
      return !emailPattern.test(value) ? "That email looks incomplete. Use a format like name@example.com." : "";
    },
    message: (value) => {
      if (value.length < 10) return `Write a message of at least 10 characters (${10 - value.length} more to go).`;
      if (value.length > MESSAGE_MAX) return `Keep the message under ${MESSAGE_MAX} characters.`;
      return "";
    },
  };

  function validateField(field) {
    const error = rules[field.name](field.value.trim());
    document.getElementById(`${field.name}Error`).textContent = error;
    field.classList.toggle("is-invalid", Boolean(error));
    field.classList.toggle("is-valid", !error);
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }

  function updateCounter() {
    const length = form.elements.message.value.length;
    counter.textContent = `${length} / ${MESSAGE_MAX}`;
    counter.classList.toggle("is-near", length > MESSAGE_MAX * 0.9 && length <= MESSAGE_MAX);
    counter.classList.toggle("is-over", length > MESSAGE_MAX);
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `form__status form__status--${type}`;
    // Restart the slide-in animation even if the same type is shown twice
    status.classList.remove("is-shown");
    void status.offsetWidth;
    status.classList.add("is-shown");
  }

  // Restore an unsent draft from a previous visit
  const draft = storage.get(DRAFT_KEY);
  if (draft) {
    fields.forEach((field) => {
      if (draft[field.name]) field.value = draft[field.name];
    });
    draftNote.hidden = false;
  }
  updateCounter();

  fields.forEach((field) => {
    // Check a field when the user leaves it
    field.addEventListener("blur", () => {
      if (field.value.trim()) validateField(field);
    });

    field.addEventListener("input", () => {
      // Once a field has shown an error, re-check it while typing so the error clears right away
      if (field.classList.contains("is-invalid")) validateField(field);
      if (field.name === "message") updateCounter();

      // Save the draft as the user types
      storage.set(DRAFT_KEY, Object.fromEntries(fields.map((f) => [f.name, f.value])));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // no backend: stay on the page

    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      const count = fields.filter((field) => field.classList.contains("is-invalid")).length;
      showStatus(`Please fix the ${count === 1 ? "highlighted field" : `${count} highlighted fields`} and try again.`, "error");
      // Move focus to the first field that needs fixing
      fields.find((field) => field.classList.contains("is-invalid")).focus();
      return;
    }

    // Short "Sending…" state so the user sees the click was received
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    setTimeout(() => {
      const name = form.elements.name.value.trim();
      showStatus(`Thanks, ${name}! Your message is ready. This demo form has no backend yet, so nothing was sent. Please email me directly at me@naser.md for now.`, "success");

      storage.set("visitor-name", name.split(" ")[0]);
      storage.remove(DRAFT_KEY);
      draftNote.hidden = true;
      form.reset();
      fields.forEach((field) => field.classList.remove("is-valid"));
      updateCounter();
      setGreeting();

      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }, 600);
  });
}

/* ---------- 7. Footer year ---------- */
function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* Run everything once the HTML is ready */
document.addEventListener("DOMContentLoaded", () => {
  setGreeting();
  setupMobileNav();
  setupActiveLinks();
  setupProjects();
  setupCodeforces();
  setupContactForm();
  setYear();
});
