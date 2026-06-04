# AGENTS.md

> Map for AI coding agents (Claude Code, Codex, Cursor, Copilot, etc.) working on this
> repository. Read top-to-bottom before making any change. Keep this file in sync with
> reality — if you discover something undocumented while working, add it here.

## Project

Personal developer portfolio for **Eric Phạm** (Phạm Tiến Thuận Phát).
Single-page Next.js site with sections for About, Experience, Education,
Skills, Projects, Contact, plus a stub Blog page that pulls articles from
dev.to. Deployed by pushing to `main` (Vercel-style auto-deploy assumed).

Repository: `git@github.com:delee03/fuderrdev.git`
Default branch: `main`

## Stack

- **Next.js 15.5.18** (App Router) — pinned for CVE remediation, do not downgrade
- **React 19.0.0**
- **Tailwind CSS** + SCSS for styling
- **ESLint** via `next lint` (no flat config; uses `.eslintrc.json`)
- **Nodemailer** + Google reCAPTCHA for the contact form
- **No test runner is configured** — verification is `npm run lint` and `npm run build`

## The map — where to make changes

### Content (~90% of edits go here)

All site content is data-driven from JS modules under `utils/data/`. Editing one of
these files is the only thing needed for most content updates.

| Visible section / element                 | File                                          | Notes                                                                 |
| ------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------- |
| Name, photo, role, summary, social links, resume URL | `utils/data/personal-data.js`        | Single source of truth for personal info                              |
| Hero `skills: [...]` "code block"          | `app/components/homepage/hero-section/index.jsx` | **Hardcoded JSX** — see Gotchas below                              |
| Experience cards                           | `utils/data/experience.js`                    | Most recent first                                                     |
| Education + Certificates                   | `utils/data/educations.js`                    | Single list (degree + certs), reverse-chronological                  |
| Skills grid                                | `utils/data/skills.js`                        | Strings only render if mapped in `skill-image.js` — see Gotchas       |
| Projects                                   | `utils/data/projects-data.js`                 | Most recent first; `tools[]` renders as plain text (no icon required) |
| Contact section / footer links             | `utils/data/contactsData.js`                  | Email + socials                                                       |
| Page `<title>` and OG description          | `app/layout.js`                               | Two near-identical strings to keep in sync                            |
| Header brand text                          | `app/components/navbar.jsx`                   | Currently "Eric Pham" (no diacritic, intentional)                     |
| Footer credit text                         | `app/components/footer.jsx`                   |                                                                       |

### Components

```
app/components/
├── footer.jsx
├── navbar.jsx
├── helper/                  # scroll-to-top, glow-card, lottie wrappers
└── homepage/
    ├── about/
    ├── blog/                # pulls dev.to articles via API route
    ├── contact/
    ├── education/
    ├── experience/
    ├── hero-section/
    ├── projects/            # has project-card.jsx + single-project.jsx
    └── skills/
```

Each section has an `index.jsx` that renders the corresponding `utils/data/*.js`
content.

### Static assets

| Path                              | What it is                                                |
| --------------------------------- | --------------------------------------------------------- |
| `public/profile.png`              | Current avatar — replace this file to update the photo    |
| `public/profile_fallback.png`     | Original avatar — recovery copy, **do not delete**        |
| `public/image/`, `public/png/`    | Section illustrations and project thumbnails              |
| `public/*.svg`                    | Background graphics (`hero.svg`, `top-bg.svg`, etc.)      |
| `app/favicon.ico`                 | Site favicon                                              |
| `app/assets/svg/skills/`          | Tech-icon SVGs used by Skills grid (mapped in `skill-image.js`) |
| `app/assets/lottie/`              | Lottie JSON animations                                    |

### API routes

```
app/api/
├── contact/route.js   # POST: contact form → Nodemailer
├── data/route.js      # GET: internal data fetch (dev.to articles)
└── google/route.js    # POST: reCAPTCHA verification
```

## Common tasks (copy-paste-ready workflows)

### Update content (new project, new cert, change role, etc.)

1. Edit the relevant `utils/data/*.js` file.
2. If touching skills, also reorder/update the **hardcoded** array in
   `app/components/homepage/hero-section/index.jsx` to keep both in sync.
3. `npm run lint` — must be clean.
4. Commit with conventional-commit subject (see Conventions).
5. `git push origin main` — Vercel auto-deploys.

### Add a brand-new skill icon to the Skills grid

1. Drop the SVG into `app/assets/svg/skills/<name>.svg`.
2. Add an `import` line and a `case '<lowercased name>':` branch to
   `utils/skill-image.js` (the `switch` matches on `skill.toLowerCase()`).
3. Add the display name to `utils/data/skills.js`.

### Bump a dependency for a CVE

1. `npm install <pkg>@<patched-version>` (or `npm audit fix` for non-breaking).
2. `npm run build` must succeed end-to-end.
3. Commit: `chore(deps): bump <pkg> to <version> for <CVE-id-or-reason>`.

## Conventions

### Branching and push

- Direct push to `main` is acceptable for small content tweaks.
- For larger changes, create a feature branch and open a PR via `gh pr create`.
- Remote is SSH (`git@github.com:delee03/fuderrdev.git`); no `gh` auth needed for `git push`.

### Code style

- Match the surrounding file. Mostly JSX (`.jsx`), some `.js` modules.
- Tailwind utility classes live inline; no CSS-in-JS.
- ESLint flat-config-equivalent via `next lint`; do not introduce a separate ESLint config.

### Verification

```bash
npm run dev      # local preview at http://localhost:3000
npm run lint     # required before commit
npm run build    # required after dep bumps or component changes
```

## Gotchas (read these — they will bite you)

### 1. Skill icons require a lowercase mapping in `skill-image.js`

`utils/skill-image.js` does `skill.toLowerCase()` then a `switch`. **Any skill
listed in `skills.js` without a matching `case` renders as blank** in the Skills
grid. Project `tools[]` arrays are different — they render as plain text and
work without an icon mapping.

### 2. The Hero `skills:` array is hardcoded JSX, not data-driven

`app/components/homepage/hero-section/index.jsx` contains a literal sequence of
`<span>` elements forming the `skills: ['…', '…', …]` line. It is not generated
from `utils/data/skills.js`. When you change skills, update **both** files.

### 3. Branding name has two intentional forms

- **Header (navbar):** "Eric Pham" — no diacritic, by design
- **Everywhere else:** "Eric Phạm" — with diacritic
- **Page `<title>` and OG description:** still uses the full Vietnamese name
  "Phạm Tiến Thuận Phát"

When updating display names, respect these distinctions instead of normalizing.

### 4. Social usernames are split between two real accounts

- `ericpham03` — Facebook, X/Twitter (current handle)
- `fuderrpham03` / `fuderrpham` / `fuderr-pham` — StackOverflow, LeetCode, dev.to
  (legacy account names that are still real, working URLs — **do not rename**)
- `delee03` — GitHub username (do not change)

### 5. Two near-identical metadata strings in `app/layout.js`

The page `<title>` text and the `<meta name="description">` content are
near-duplicates of the OG `metadata.title` / `metadata.description` strings at
the top of the file. When updating site name or description, edit **both**.

## Don'ts

- Don't delete `public/profile_fallback.png` (recovery copy).
- Don't rename or remove existing social usernames (they're real accounts).
- Don't downgrade Next.js below `15.5.18` (CVE remediation; see commit `66490b5`).
- Don't add a test runner without asking the maintainer first.
- Don't introduce a separate ESLint config — `next lint` handles everything.
- Don't reformat unrelated files when making a small content change.

