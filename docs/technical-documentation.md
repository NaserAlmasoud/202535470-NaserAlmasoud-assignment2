# Technical Documentation

## 1. Overview

A single-page static website. There is no server, database, or build step: the browser loads `index.html`, which links one stylesheet (`css/styles.css`) and one script (`js/script.js`).

## 2. Page structure (`index.html`)

| Element | Purpose |
|---|---|
| `<header>` / `<nav>` | Sticky navigation bar with section links, mobile menu button, and theme toggle |
| `#about` | Greeting, name, tagline, short intro, call-to-action buttons, profile image |
| `#skills` | List of skills (extra section) |
| `#projects` | Grid of project cards (`<article>` elements) |
| `#contact` | Contact form with inline error messages |
| `<footer>` | Copyright year and "Back to top" link |

Semantic elements (`header`, `nav`, `main`, `section`, `article`, `footer`) are used so screen readers and search engines understand the page layout. A small inline script in `<head>` applies the saved theme *before* the page is drawn, which prevents a flash of the wrong colors.

## 3. Styling (`css/styles.css`)

### Theme and design tokens
The site uses the **Personal Site Theme** (`css/theme.css`), loaded before `css/styles.css`. The theme defines every colour as a CSS variable, self-hosts the fonts (Manrope for headings, Source Serif 4 for body text, in `css/fonts/`) and styles the plain HTML elements. Dark mode redefines the same variables under `:root[data-theme="dark"]` (or follows the system setting when no choice is saved), so no component needs its own dark-mode rules. `styles.css` only adds the portfolio's layout and components, using the theme's variables.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#eff0fa` | `#24255c` | Page background |
| `--bg-raised` | `#ffffff` | `#2d2e6b` | Project cards, mobile menu |
| `--bg-sunken` | `#e3e5f3` | `#1c1d4a` | Form inputs |
| `--ink` | `#1a1b45` | `#eff0fa` | Text |
| `--ink-muted` | `#4a4d80` | `#b9bbe0` | Secondary text |
| `--accent` | `#4345c2` | `#a7a9f0` | Links, buttons, greeting |
| `--accent-soft` | `#dcdcf7` | `#34368a` | Skill pills, active nav link |
| `--border-hairline` | `#c5c8e4` | `#45478c` | Card and header borders |

Following the theme's guide, cards are separated by borders rather than shadows; the only shadow is on the floating mobile menu.

### Naming
Classes follow a light BEM style (`block__element--modifier`), e.g. `.nav__link`, `.btn--primary`. State classes use an `is-` prefix (`.is-open`, `.is-active`, `.is-invalid`).

### Layout
- **Grid** for the About section (text + photo) and the Projects cards.
- **Flexbox** for the navigation, skills list, buttons, and footer.
- `.container` uses `width: min(100% - 2.5rem, 1100px)` to center content with side padding on every screen size.
- Headline sizes use `clamp()` so text scales smoothly between phone and desktop.

### Responsive breakpoints

| Width | Changes |
|---|---|
| > 900px (desktop) | Three project columns, two-column About section |
| ≤ 900px (tablet) | Two project columns |
| ≤ 680px (mobile) | One column everywhere, hamburger menu, smaller photo shown above the text |

### Accessibility
- Visible `:focus-visible` outline on all interactive elements
- "Skip to content" link for keyboard users
- Color contrast checked for both themes
- `prefers-reduced-motion` disables smooth scrolling and transitions

## 4. JavaScript (`js/script.js`)

All code runs after `DOMContentLoaded` and is split into small functions:

| Function | What it does |
|---|---|
| `setGreeting()` | Reads the current hour and shows "Good morning" (before 12), "Good afternoon" (12–17), or "Good evening" (18+) |
| `setupThemeToggle()` | Switches `data-theme` on `<html>` between `light` and `dark`, saves the choice in `localStorage`, and updates the button's `aria-label` |
| `setupMobileNav()` | Opens/closes the mobile menu, updates `aria-expanded`, closes on link click or the Escape key |
| `setupActiveLinks()` | Uses `IntersectionObserver` to highlight the nav link of the section in the middle of the screen |
| `setupContactForm()` | Validates each field on blur and on submit, shows specific error messages, focuses the first invalid field, and shows a confirmation when all fields are valid |
| `setYear()` | Writes the current year in the footer |

### Form validation rules

| Field | Rule |
|---|---|
| Name | At least 2 characters |
| Email | Matches the pattern `text@text.text` |
| Message | At least 10 characters |

The form uses `novalidate` so the browser's default pop-ups are replaced with consistent inline messages. `event.preventDefault()` stops the page from reloading because there is no backend.

## 5. Performance

- No frameworks or libraries: the whole site is a few kilobytes of HTML, CSS, and JS.
- Images are small SVG files; project images use `loading="lazy"` and have fixed `width`/`height` to avoid layout shifts.
- Fonts are self-hosted WOFF2 files (no third-party request) and load with `font-display: swap`, with system-font fallbacks.
- `IntersectionObserver` is used instead of a scroll event listener.

## 6. Browser compatibility

Tested in (update with your own results):

| Browser | Desktop | Mobile |
|---|---|---|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | – |
| Edge | ✅ | – |
| Safari | ✅ | ✅ (iOS) |

Features used (CSS custom properties, Grid, `clamp()`, `IntersectionObserver`) are supported by all current major browsers.

## 7. Testing checklist

- [ ] Resized the browser and checked Chrome DevTools device mode (iPhone SE, iPad, 1440px desktop)
- [ ] Theme toggle works and is remembered after reload
- [ ] Greeting matches the time of day
- [ ] Form shows errors for empty/invalid input and a confirmation for valid input
- [ ] All nav links scroll to the right section; mobile menu opens and closes
- [ ] No errors in the browser console
- [ ] Lighthouse report run (Performance / Accessibility / Best Practices / SEO)

## 8. Future improvements

- Connect the contact form to a service such as Formspree
- Replace placeholder images with real project screenshots
- Add links to each project's GitHub repository and live demo
