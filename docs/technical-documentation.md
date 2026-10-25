# Technical Documentation

## 1. Overview

A single-page static website with no server, database or build step. The browser loads `index.html`, which links two stylesheets (`css/theme.css`, then `css/styles.css`) and one script (`js/script.js`). The only network requests besides the site's own files are the Font Awesome icons (CDN) and one call to the public Codeforces API.

| Assignment 2 requirement | Implementation |
|---|---|
| Dynamic content | Project category filter (`setupProjects`) |
| Data handling | Codeforces API with `fetch` (`loadCodeforces`); contact form validation (`setupContactForm`) |
| Animation & transitions | `fadeUp` keyframes, hover transitions, scroll-in sections (`setupReveal`) |
| Error handling & feedback | Loading spinner, API error message with retry, inline form errors, success message |

## 2. Page structure (`index.html`)

| Element | Purpose |
|---|---|
| `<header>` / `<nav>` | Sticky navigation bar with section links and the mobile menu button |
| `#about` | Greeting, name, intro, call-to-action buttons, profile image, social links |
| `#skills` | List of skills |
| `#projects` | Filter buttons and an empty `#projectGrid` that JavaScript fills |
| `#codeforces` | Panel with three states: `#cfLoading`, `#cfError`, `#cfContent` |
| `#contact` | Contact form with an error line under each field and a `#formStatus` message |
| `<footer>` | Copyright and "Back to top" link |

Accessibility details:
- Filter buttons use `aria-pressed` so screen readers know which one is active.
- The loading message has `role="status"` and the error box `role="alert"`, so they are announced when they appear.
- Form errors use `aria-live="polite"` and invalid fields get `aria-invalid="true"`.
- A `<noscript>` message explains that the project list needs JavaScript.

## 3. Styling

### Theme (`css/theme.css`)
Defines every colour as a CSS variable on `:root` (dark palette only), self-hosts the fonts, and styles plain HTML elements. Components use the variables (`var(--accent)`, `var(--bg-raised)`, …), so colours are changed in one place.

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#24255c` | Page background |
| `--bg-raised` | `#2d2e6b` | Cards, panels |
| `--bg-sunken` | `#1c1d4a` | Inputs, stat tiles, message boxes |
| `--ink` / `--ink-muted` | `#eff0fa` / `#b9bbe0` | Text |
| `--accent` | `#a7a9f0` | Links, buttons, active filter |
| `--success` / `--danger` / `--warning` | `#7ed9a6` / `#f58c96` / `#f0b86b` | Form messages, error icon, "Sample" tag |

### Layout (`css/styles.css`)
Sections are numbered in the file: 1 base, 2 buttons, 3 navigation, 4 sections, 5 footer, 6 animations, 7 breakpoints.

- **Grid** for the About section, the project cards and the Codeforces stat tiles; **Flexbox** for the nav, filters and footer.
- Project cards are flex columns and the tech line has `margin-top: auto`, so tech lists line up at the bottom of each row.
- Project covers are CSS gradients with a Font Awesome icon, so no image files are downloaded.
- A global `[hidden] { display: none !important; }` rule makes sure the `hidden` attribute always wins over a class that sets `display`. Without it, the loading spinner (`display: flex`) never disappeared.
- Classes follow a light BEM style (`block__element--modifier`); state classes use `is-` (`is-active`, `is-open`, `is-invalid`, `is-visible`).

### Responsive breakpoints

| Width | Changes |
|---|---|
| > 900px | 3 project columns, 4 Codeforces tiles in a row |
| ≤ 900px | 2 project columns, Codeforces tiles in a 2×2 grid |
| ≤ 680px | 1 column, hamburger menu, smaller photo above the text |

## 4. JavaScript (`js/script.js`)

All setup runs once the HTML is ready (`DOMContentLoaded`).

| Function | What it does |
|---|---|
| `setupMobileNav()` | Opens/closes the mobile menu, updates `aria-expanded`, closes on link click or Escape |
| `setupProjects()` | Builds project cards from `PROJECTS` and filters them when a button is clicked |
| `loadCodeforces()` | Fetches Codeforces stats and shows the loading, error or data state |
| `setupContactForm()` | Validates the form and shows error or success messages |
| `setupReveal()` | Fades sections in as they scroll into view |

### 4.1 Project filter

Projects are stored as objects in the `PROJECTS` array (`title`, `category`, `date`, `tech`, `description`, optional `sample`). Adding a project means adding one object, not copying HTML.

```js
const visible = PROJECTS.filter((p) => filter === "all" || p.category === filter);
grid.innerHTML = visible.map((p) => `<article class="project">…</article>`).join("");
```

1. Clicking a filter button stores its `data-filter` value (`all`, `ai`, `data`, `web`), moves the `is-active` class and updates `aria-pressed`.
2. `render()` keeps the matching projects with `filter()`, turns each into card HTML with `map()`, and joins them into one string, so the grid is updated in a single step.
3. `innerHTML` is safe here because the text comes from the `PROJECTS` array in the code, never from user input.

### 4.2 Codeforces API

- **Endpoint:** `GET https://codeforces.com/api/user.info?handles=Naser_md` (public, no API key).
- **Response:** `{ "status": "OK", "result": [ { "handle", "rating", "maxRating", "rank", "maxRank", … } ] }`. On failure, Codeforces returns `{ "status": "FAILED", "comment": "…" }`.

```js
loading.hidden = false;                 // 1. show "Loading…"
try {
  const response = await fetch(CF_URL); // 2. request the data
  const data = await response.json();
  if (data.status !== "OK") throw new Error(data.comment);
  // 3. fill the four tiles with textContent and show them
} catch (err) {
  error.hidden = false;                 // 4. any failure → friendly error
} finally {
  loading.hidden = true;                // 5. always hide "Loading…"
}
```

- `async/await` makes the request read top to bottom; `try/catch` catches every failure in one place (no internet, Codeforces down, invalid JSON, or `status: "FAILED"`).
- `finally` runs whether it worked or not, so the spinner can never get stuck.
- Unrated accounts have no `rating`/`rank` fields, so `|| "Unrated"` and `|| "–"` give fallbacks.
- **Try again** calls `loadCodeforces()` again.
- Values are inserted with `textContent`, so API text is never treated as HTML.

### 4.3 Contact form validation

| Field | Rule | Error message |
|---|---|---|
| Name | At least 2 characters | "Enter your name (at least 2 characters)." |
| Email | Matches `text@text.text` | "Enter a valid email, like name@example.com." |
| Message | At least 10 characters | "Write a message of at least 10 characters." |

- Each rule is a small function that returns an error message, or `""` when valid.
- A field is checked when the user leaves it (`blur`) and again on submit.
- `fields.map(validateField).every(Boolean)` checks **all** fields first, so every error shows at once; `every()` alone would stop at the first invalid field.
- On errors, a red summary appears and focus moves to the first invalid field. On success, a green confirmation appears and the form is reset.
- The form uses `novalidate` (so the browser's own pop-ups are replaced by consistent inline messages) and `event.preventDefault()` (there is no backend, so the page must not reload).

### 4.4 Scroll animation

`setupReveal()` adds a `js` class to `<html>`, then an `IntersectionObserver` adds `is-visible` to each section when 10% of it is on screen and stops watching it (`unobserve`), so each section animates once. `IntersectionObserver` is used because it is cheaper than running code on every scroll event.

## 5. Animations

| Effect | How |
|---|---|
| About text fades in on load | `animation: fadeUp 0.6s` |
| Project cards fade in on every filter click | `.project { animation: fadeUp 0.4s }`, replayed because the cards are rebuilt |
| Cards lift on hover | `transform: translateY(-4px)` + shadow, smoothed by `transition` |
| Messages slide in | `fadeUp` on the form status boxes and Codeforces panel states |
| Sections fade in on scroll | `.js main section:not(:first-child)` starts at `opacity: 0`; `.is-visible` fades it in with a `transition` |
| Spinner | `@keyframes spin` rotates a circle with one coloured border |

Design decisions:
- Only `opacity` and `transform` are animated, because the browser can animate them smoothly without recalculating the layout.
- `animation-fill-mode: backwards` is used instead of `both`: with `both`, the finished animation keeps holding `transform`, which blocked the hover lift.
- Sections are only hidden when the `js` class is present, so the content stays visible if JavaScript fails.
- `:not(:first-child)` is used instead of `:not(#about)`: an ID inside `:not()` raises the selector's priority above `.is-visible`, so the sections never appeared.
- `@media (prefers-reduced-motion: reduce)` turns off all animations and transitions and shows sections immediately.

## 6. Error handling and user feedback

| Situation | What the user sees |
|---|---|
| Codeforces stats loading | Spinner and "Loading Codeforces stats…" |
| Codeforces unreachable or error response | "Couldn't load Codeforces stats", what might be wrong, **Try again** and a link to the profile |
| Form field invalid | Red outline and a message under the field explaining the fix |
| Form submitted with errors | "Please fix the highlighted fields and try again." and focus on the first one |
| Form submitted successfully | Green confirmation explaining that nothing was actually sent |
| JavaScript turned off | "Turn on JavaScript to see the project list." |

## 7. Performance

- No frameworks: about 200 lines of JavaScript and no build step.
- Project covers are CSS gradients and icons, not images.
- Fonts are self-hosted WOFF2 files with `font-display: swap`.
- One small API request (`user.info`) instead of several.
- Rendering the grid with one `innerHTML` assignment avoids many separate page updates.
- `IntersectionObserver` instead of scroll event listeners.
- Animations use only `opacity` and `transform`.

## 8. Browser compatibility

The script avoids very new JavaScript functions. An earlier version used `Object.hasOwn` and `replaceChildren`, which broke the projects section in older browsers, so they were removed. Everything used (`fetch`, `async/await`, `IntersectionObserver`, CSS Grid and custom properties) is supported by all current versions of Chrome, Edge, Firefox and Safari.

| Browser | Desktop | Mobile |
|---|---|---|
| Chrome | ✅ | ✅ |
| Edge | ✅ | – |
| Firefox | *(update after testing)* | – |
| Safari | *(update after testing)* | *(update after testing)* |

## 9. Testing checklist

- [x] Each filter button shows only its category; **All** shows all 7 projects
- [x] Codeforces stats load; with the network blocked, the error message and **Try again** work
- [x] Form shows errors for empty/invalid input and a confirmation for valid input
- [x] Sections fade in when scrolled to; hover lifts cards
- [x] With reduced motion turned on, nothing animates and all content is visible
- [x] Mobile menu opens and closes; no horizontal scrolling at 375px width
- [x] No errors in the browser console
- [ ] Lighthouse report run (Performance / Accessibility / Best Practices / SEO)

## 10. Future improvements

- Replace the five sample projects with real ones, with links to code and demos
- Connect the contact form to a service such as Formspree
- Show the Codeforces rating history as a chart
