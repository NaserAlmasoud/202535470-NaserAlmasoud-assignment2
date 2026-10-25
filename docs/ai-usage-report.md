# AI Usage Report – Assignment 2

> **Before submitting:** check every part marked **TODO**, make sure it describes what you actually did, and sign the declaration at the end.

## 1. Tools used

| Tool | How I used it |
|---|---|
| **Claude Code** (claude.ai/code) | Read the assignment brief and rubric with me and planned the work step by step. Wrote a first version of each feature in my repository, explained every part of the code when I asked, fixed bugs I reported, and drafted this documentation. |

I did not use any other AI tools for this assignment. **TODO:** confirm this, or add rows for any other tools (e.g. Copilot, ChatGPT).

## 2. Usage log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|---|---|---|---|---|---|
| C01 | Claude Code (**TODO:** model name shown in the session) | 2026-10-25 | Plan Assignment 2 from the rubric; build the features step by step; explain the code; fix bugs; write documentation | `index.html`, `css/styles.css`, `css/theme.css`, `js/script.js`, `README.md`, `docs/*`, `.gitignore` | Asked it to work one requirement at a time and to explain all the code before continuing. Removed the features the assignment does not need (script cut from 726 to 179 lines before the animation step). Reported that projects and the Codeforces stats did not appear in my browser; the cause was old cached files, fixed with a hard refresh. Changed the Codeforces handle to `Naser_md`, edited the README title, and set `data-theme="dark"` myself. Checked every feature in my browser (filters, Codeforces stats, form errors and success, animations, mobile menu). |
| A01 | Claude Code | 2026-10-25 | First full version of the interactive features (search, sort, saved preferences, form draft, Codeforces chart and cache) | `js/script.js`, `index.html`, `css/styles.css` | Too long and had features the assignment does not need. I asked for them to be removed (see A02). Saved in `artifacts/` from commit `a817bb5`. |
| A02 | Claude Code | 2026-10-25 | Simplified script (250 lines) | `js/script.js` | Asked to remove every feature that is not required: greeting, active link, footer year, search, sort, empty state. Result: commit `96244d7`. Saved in `artifacts/`. |
| A03 | Claude Code | 2026-10-25 | Animations (step 5) | `css/styles.css`, `js/script.js` | Asked for the plan to be explained before coding. Checked the fade-ins, hover lift and reduced-motion behaviour in my browser. Commit `0184df6`. |
| A04 | Claude Code | 2026-10-25 | Draft README, technical documentation and this report | `README.md`, `docs/*` | **TODO:** describe what you edited in the drafts. |

To export the intermediate versions for `artifacts/`, run, for example:
```bash
git show a817bb5:js/script.js > artifacts/A01-script.js
git show 96244d7:js/script.js > artifacts/A02-script.js
```

## 3. How AI helped (effective use)

- **Planning:** the AI mapped each rubric requirement to a concrete feature (project filter → dynamic content, Codeforces API → data handling, spinner and error messages → feedback) before any code was written.
- **Step-by-step building:** each requirement was built and committed on its own, so the history shows the progress and I could review each part.
- **Explanations:** I asked for every line of code to be explained before moving on, which helped me understand `fetch`, `async/await`, `try/catch/finally`, `filter()/map()` and `IntersectionObserver`.
- **Debugging:** when projects did not appear, it compared my screenshot with the code and found that my browser was using old cached CSS and JS.
- **Testing:** it tested the site in a headless browser with fake API responses (success, network failure, unknown handle), which I could not easily do myself.

## 4. What I changed and why

| AI output | My change | Why |
|---|---|---|
| ~700-line script with search, sort, saved settings, form draft, chart, cache | Asked to keep only what the assignment requires (179 lines before animations) | Easier to understand, explain and maintain |
| Codeforces handle `Nasertmp` | Changed to `Naser_md` | It is my real account |
| README title "Assignment 1" | Changed to "Assignment 2" | Correct assignment |
| `<html lang="en">` | Added `data-theme="dark"` | Keep the theme attribute explicit |
| **TODO** | **TODO:** any other edits you make before submitting | |

## 5. Understanding: what I learned

- **`fetch` + `async/await`:** `await` pauses the function until the response arrives; `try/catch` handles every failure in one place, and `finally` always hides the loading spinner.
- **Data-driven HTML:** keeping projects in an array and building cards with `filter()` and `map()` means adding a project is one object, not copied HTML.
- **CSS priority:** an ID inside `:not()` makes a selector stronger than a class, which is why `:not(#about)` stopped sections from appearing.
- **Animation fill mode:** `animation-fill-mode: both` keeps holding the last frame's `transform`, which blocked the hover effect; `backwards` fixes it.
- **Browser cache:** after changing CSS/JS, a hard refresh (Ctrl+Shift+R) is needed to see the new files.
- **Limits of AI:** the AI's first version did much more than the assignment needed, and it could not test the real Codeforces API from its environment, so I had to check the live result in my own browser.

**TODO:** add anything else you learned in your own words.

## 6. Innovation

- Used a **real public API about me** (my Codeforces account) instead of a generic one, so the data handling also shows my competitive-programming background.
- Used AI to **test failure cases** (blocked network, unknown handle) with fake API responses, to make sure the error messages work before relying on them.
- Asked the AI to **simplify its own output** and explain it, instead of accepting the first version.

## 7. Academic integrity

I did not submit the AI output unchanged. I directed the work step by step, removed features I did not need, made my own changes (listed above), tested the site myself, and documented all AI assistance here. Every commit containing AI-assisted code is marked with `Assisted-by: Claude (Claude Code)`. The full conversation and the intermediate artifacts are in the AI Evidence ZIP submitted on Blackboard, not in this repository.

## 8. Declaration

I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

- **Name:** Naser Almasoud
- **Student ID:** 202535470
- **Date:** **TODO**
