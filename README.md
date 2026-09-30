# PERSA website

Professional, mobile-first website for the Persian Student Association at the University of Utah. It is a plain static site: no paid hosting, build tools, database, or software installation is required.

## Intended public address

`https://persauofu.github.io`

The GitHub account/organization name `Persauofu` returned a public 404 when checked on September 30, 2026, so it appeared unclaimed at that moment. A name is not reserved until the organization is created. If it is claimed before setup, use `PERSA-Utah` (or another available organization name), name the repository exactly `<organization-name>.github.io`, and update the URL in the structured-data block in `index.html`.

## First-time GitHub Pages setup (recommended ownership model)

1. Sign in to GitHub and create a **GitHub organization** named `Persauofu`. Use an organization, not one officer's personal account, so future officers can inherit the site.
2. Add at least two current PERSA officers as organization owners. Require two-factor authentication.
3. Create a **public** repository named exactly `Persauofu.github.io`.
4. Upload every file and folder from this project to the repository root. Keep the folder structure unchanged.
5. In the repository, open **Settings → Pages**. Under “Build and deployment,” choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
6. After GitHub finishes the first deployment, visit `https://persauofu.github.io`. HTTPS is automatic.
7. In repository **Settings → Branches**, add a protection rule for `main` that requires a pull request. This reduces accidental breakage.

No GitHub Actions file is needed. The empty `.nojekyll` file tells GitHub to serve the files directly.

## What officers edit most often

All routine information is in the `data` folder. GitHub's web editor is enough: open a file, click the pencil icon, edit, and commit.

### Links and payment instructions — `data/site.json`

- `email`: shared PERSA inbox used by the registration email draft
- `instagram`: full profile URL
- `telegram`: full invite/channel URL; the website already says admin approval is required
- `campusConnect`: full official Campus Connect organization URL
- `venmoHandle`: temporary event payment handle, for example `@ExampleHandle`
- `paymentMemoTemplate`: memo attendees must use

Leave a value as an empty string until it is confirmed. The website will show it as “coming soon” rather than sending visitors to the wrong place. Never put a password, API key, card number, bank information, or other payment credential in this repository.

### Events — `data/events.json`

Copy one event object, keep the commas valid, and edit its fields. Dates use `YYYY-MM-DD`.

- `id`: short unique value using lowercase letters and hyphens
- `registrationUrl`: keep `registration.html?event=EVENT-ID` for the built-in email workflow, or paste an approved external registration form URL
- `featured`: set one event to `true` for the large visual card
- `status`: use `upcoming`; use `hidden` to temporarily remove it

The current event entries are safe starter examples and must be replaced with confirmed dates, times, rooms, and prices before promotion.

### Team — `data/team.json`

Replace each name, role, email, and photo. Save headshots inside `assets/images/team/`, then use a path such as `assets/images/team/president.jpg`. If `photo` is empty, the site shows a polished letter placeholder. If `email` is present, the member's name card has a clickable email link.

### Gallery — `data/gallery.json`

Put optimized JPG or WebP photos in `assets/images/gallery/`. Aim for under 500 KB per image. Add the relative file path, a short title, caption, and useful `alt` text describing what is visible. Obtain permission before publishing recognizable attendee photos.

## Event registration and Venmo design

GitHub Pages cannot securely receive or store form submissions. The included registration page therefore:

- lets a visitor select an event and enter details locally in their browser;
- prepares an email draft addressed to the shared PERSA email after `email` is configured;
- never transmits or stores card, bank, Venmo login, or other payment credentials;
- presents the Venmo handle, payment memo, and safety guidance separately.

For high-volume ticketed events, replace an event's `registrationUrl` with a University-approved Google/Microsoft form or ticketing service. Do not paste private form responses into this public repository. Personal Venmo is documented as a temporary event workflow, not permanent financial infrastructure; officers should confirm the current University/SLI requirements before every paid event.

## Old Persian name converter

The converter is client-side JavaScript in `assets/converter.js` and duplicated in compact form on the home page in `assets/app.js`. It is deliberately labeled an educational phonetic approximation. It does not claim to translate modern names historically.

## Design and symbol policy

The site uses PERSA's supplied Achaemenid-inspired artwork. It contains no current Iranian flag. Do not add that flag in future edits. If a national flag is ever necessary, PERSA's stated direction is to use the Lion & Sun flag; verify that the specific image is licensed for reuse before uploading it.

## Transfer checklist for each new executive board

1. Add two incoming officers as organization owners.
2. Confirm they can edit the repository and Pages settings.
3. Update `data/team.json` and shared contact links.
4. Transfer control of the shared email, Instagram, Telegram, Campus Connect, and any approved payment account separately—never through this public repository.
5. Remove outgoing owners only after the new owners confirm access.
6. Review gallery photo permissions and archive obsolete events.

## Previewing changes

GitHub Pages is the simplest preview: make changes on a temporary branch and open a pull request. For a local preview, serve the folder with any static web server; opening `index.html` directly will not load the JSON files because browsers restrict local file access.

## File map

- `index.html` — all main page sections
- `registration.html` — event selection, registration email, and payment guide
- `name-converter.html` — expanded Old Persian activity
- `data/*.json` — content officers update
- `assets/styles.css` — all visual styling and responsive layouts
- `assets/app.js` — home page content and interactions
- `assets/registration.js` — registration workflow
- `assets/converter.js` — expanded converter
- `assets/images/` — supplied PERSA artwork and future photos

