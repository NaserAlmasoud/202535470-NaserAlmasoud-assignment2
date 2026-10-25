# Personal Portfolio – Assignment 2

My personal portfolio website, built with plain HTML, CSS and JavaScript. Assignment 2 builds on [Assignment 1](https://github.com/NaserAlmasoud/202535470-NaserAlmasoud-assignment1) and makes the site interactive: projects can be filtered by area, my Codeforces stats load live from a public API, the contact form gives clear feedback, and sections animate into view.

**Live demo:** https://naseralmasoud.github.io/202535470-NaserAlmasoud-assignment2/

## What's new in Assignment 2

| Requirement | Feature | Where |
|---|---|---|
| Dynamic content | **Time-of-day greeting**: the headline says "Good morning / afternoon / evening" based on the visitor's clock | `#about`, `setGreeting()` |
| Dynamic content | **Project filter**: All / AI / Data Science / Web Dev buttons show only matching projects. Cards are built from a data array. | `#projects`, `setupProjects()` |
| Data handling | **Live Codeforces stats** (rating, max rating, rank, max rank) fetched from the Codeforces API | `#codeforces`, `loadCodeforces()` |
| Data handling | **Contact form validation** with a confirmation message | `#contact`, `setupContactForm()` |
| Animation | Sections fade in on scroll, cards fade in on filter and lift on hover, messages slide in | `styles.css` §6, `setupReveal()` |
| Error handling & feedback | "Loading…" spinner, friendly API error with **Try again**, inline form errors | Codeforces panel, contact form |

Kept from Assignment 1: About and Skills sections, responsive layout with a mobile menu, dark theme, accessibility features (skip link, focus styles, ARIA labels, reduced-motion support).

> Five of the seven projects are marked **Sample**. They are example entries used to test the filter and will be replaced with real projects.

## Tech stack

- HTML5 (semantic elements)
- CSS3 (custom properties, Grid, Flexbox, keyframe animations, media queries)
- Vanilla JavaScript (ES6+): `fetch`, `async/await`, `IntersectionObserver`. No frameworks, libraries or build step.
- [Codeforces API](https://codeforces.com/apiHelp) (public, no key needed)
- Font Awesome 6 icons (CDN) and self-hosted Manrope / Source Serif 4 fonts

## Project structure

```
.
├── README.md
├── index.html                  # Page markup
├── css/
│   ├── theme.css               # Colours (dark palette), fonts, base element styles
│   ├── styles.css              # Layout, components, animations, breakpoints
│   └── fonts/                  # Manrope + Source Serif 4 (WOFF2)
├── js/
│   └── script.js               # Greeting, menu, project filter, Codeforces API, form, scroll animation
├── assets/
│   └── images/                 # Profile illustration
├── docs/
│   ├── ai-usage-report.md      # How AI tools were used (with declaration)
│   └── technical-documentation.md
└── .gitignore
```

## Run locally

No installation or build step is needed. You only need a web browser and an internet connection (for the Codeforces stats and icons).

1. Clone the repository:
   ```bash
   git clone https://github.com/NaserAlmasoud/202535470-NaserAlmasoud-assignment2.git
   cd 202535470-NaserAlmasoud-assignment2
   ```
2. Open the site using **one** of these options:
   - **Simplest:** double-click `index.html` to open it in your browser.
   - **VS Code:** install the *Live Server* extension, right-click `index.html`, and choose **Open with Live Server** (reloads on save).
   - **Python:** run `python -m http.server 8000` in the project folder and visit http://localhost:8000.
3. After pulling new changes, hard-refresh with **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac), so the browser doesn't use old cached CSS/JS.

## Using the site

- **Navigate:** click the links in the top bar (or the ☰ button on mobile) to jump to a section.
- **Filter projects:** click **AI**, **Data Science** or **Web Dev** to show only those projects; click **All** to show every project.
- **Codeforces stats:** load automatically. While loading you see a spinner. If Codeforces can't be reached, a message explains it; press **Try again** or open the profile directly.
- **Contact form:** fill in your name, email and a message, then press **Send message**. Invalid fields are outlined in red with a message explaining how to fix them. The form has no backend, so nothing is actually emailed; the confirmation tells you to email me directly.

## Deployment (GitHub Pages)

1. In the repository, go to **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
3. After about a minute the site is live at https://naseralmasoud.github.io/202535470-NaserAlmasoud-assignment2/.

## AI use summary

I used **Claude Code** to analyze the assignment rubric, plan the work step by step, and write a first version of each feature, which I then reviewed and changed. I asked it to explain every piece of code it wrote, removed features the assignment did not need (the script went from about 700 lines to 200), and made my own changes, such as the Codeforces handle and the README. Every AI-assisted commit is marked `Assisted-by: Claude (Claude Code)`. Full details, the usage log and my declaration are in [docs/ai-usage-report.md](docs/ai-usage-report.md).

## Documentation

- [Technical documentation](docs/technical-documentation.md)
- [AI usage report](docs/ai-usage-report.md)

## Author

**Naser Almasoud**, Student ID `202535470`
