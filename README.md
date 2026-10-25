# Personal Portfolio – Assignment 1

A simple, responsive personal portfolio built with plain HTML, CSS, and JavaScript. It introduces me, shows a few of my projects, and includes a contact form. This is the foundation for the professional portfolio I will expand in later assignments.

**Live demo:** https://NaserAlmasoud.github.io/202535470-NaserAlmasoud-assignment1/

## Features

| Feature | Description |
|---|---|
| About Me | Intro, tagline, and profile image |
| Skills | The tools and languages I work with |
| Projects | Three projects with image, description, and technologies used |
| Contact form | Name, email, and message with live validation (no backend) |
| Time-of-day greeting | Headline changes to "Good morning / afternoon / evening" |
| Dark / light theme | Toggle in the navigation bar; the choice is remembered |
| Smooth scrolling | Navigation links glide to each section |
| Active section highlight | The nav link of the section on screen gets a highlighted pill |
| Responsive layout | Works on desktop, tablet, and mobile (hamburger menu on small screens) |
| Accessibility | Skip link, keyboard focus styles, ARIA labels, reduced-motion support |

## Tech stack

- HTML5 (semantic elements)
- CSS3 (custom properties, Flexbox, Grid, media queries)
- Vanilla JavaScript (ES6+) – no frameworks or build tools
- [Personal Site Theme](css/theme.css): indigo palette with light/dark modes, self-hosted Manrope (headings) and Source Serif 4 (body) fonts

## Project structure

```
.
├── README.md
├── index.html                  # Page markup
├── css/
│   ├── theme.css               # Personal Site Theme: colours, fonts, base styles
│   ├── styles.css              # Portfolio layout, components and breakpoints
│   └── fonts/                  # Manrope + Source Serif 4 (WOFF2)
├── js/
│   └── script.js               # Greeting, theme toggle, menu, form validation
├── assets/
│   └── images/                 # Profile and project placeholder images (SVG)
├── docs/
│   ├── ai-usage-report.md      # How AI tools were used
│   └── technical-documentation.md
└── .gitignore
```

## Run locally

No installation or build step is needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-GITHUB-USERNAME/ID-FirstLast-assignment1.git
   cd ID-FirstLast-assignment1
   ```
2. Open the site using **one** of these options:
   - **Simplest:** double-click `index.html` to open it in your browser.
   - **VS Code:** install the *Live Server* extension, right-click `index.html`, and choose **Open with Live Server** (auto-reloads on save).
   - **Python:** run `python -m http.server 8000` in the project folder and visit http://localhost:8000.

## Using the site

- Click the links in the top bar (or the ☰ menu on mobile) to jump to a section.
- Click the round button at the end of the menu to switch between light and dark themes.
- Fill in the contact form and press **Send message**. Invalid fields show a message explaining how to fix them. Because there is no backend, nothing is actually emailed.

## Deployment (GitHub Pages)

1. In the repository, go to **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
3. After about a minute the site is live at `https://YOUR-GITHUB-USERNAME.github.io/REPO-NAME/`. Paste that link at the top of this README.

## AI use summary

I used Claude to generate the initial project scaffold, suggest a color palette and layout, and draft the documentation structure. I then reviewed every file, rewrote the content to describe my own background and projects, and tested the site in several browsers and screen sizes. Full details are in [docs/ai-usage-report.md](docs/ai-usage-report.md).

## Documentation

- [Technical documentation](docs/technical-documentation.md)
- [AI usage report](docs/ai-usage-report.md)

## Author

**Naser Almasoud** – Student ID: `202535470`
