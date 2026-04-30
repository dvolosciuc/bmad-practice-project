# Story 1.4: Configure Netlify Auto-Deploy

Status: ready-for-dev

## Story

As Andrei (the maintainer),
I want the project connected to Netlify with a `netlify.toml` build configuration,
so that every push to `main` automatically builds and deploys the app with no manual steps.

## Acceptance Criteria

1. `netlify.toml` exists in the project root with `[build] command = "npm run build"` and `publish = "dist"`.
2. The deployed URL serves the app over HTTPS.
3. A push to `main` triggers a Netlify build automatically using `npm run build`.
4. The `dist/` folder is used as the published directory.
5. A subsequent push with a visible text change is reflected on the live URL within 3 minutes.
6. SPA routing is handled: a `[[redirects]]` rule in `netlify.toml` redirects all paths to `index.html` with a 200 status (required for any future anchor or hash navigation not to 404 on direct URL access).

## Tasks / Subtasks

- [ ] Create `netlify.toml` (AC: 1, 3, 4, 6)
  - [ ] Create `netlify.toml` in the project root with the exact content shown in Dev Notes
  - [ ] Include `[[redirects]]` rule for SPA fallback
- [ ] Connect repository to Netlify (AC: 2, 3, 5)
  - [ ] Log into Netlify and create a new site from Git, selecting the correct repository
  - [ ] Set base directory to `moldova-ev-overview` (subdirectory of the repo root) if the scaffold was run inside the workspace root
  - [ ] Netlify auto-detects `netlify.toml`; verify the build command and publish directory shown in Netlify UI match AC1
  - [ ] Trigger a manual deploy to verify HTTPS URL is active
- [ ] Verify push-triggered deploy (AC: 5)
  - [ ] Make a trivial visible change (e.g., update the `app.title` heading text)
  - [ ] Push to `main` — confirm Netlify build starts automatically and the change is live within 3 minutes
- [ ] Confirm HTTPS (AC: 2)
  - [ ] Open the Netlify URL — confirm it uses `https://` and the browser shows no security warnings

## Dev Notes

### netlify.toml — Exact Content

```toml
[build]
  command   = "npm run build"
  publish   = "dist"

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

The `[[redirects]]` rule is mandatory for SPAs on Netlify. Without it, directly accessing any URL that isn't the root (e.g., a shared deep link with a hash) returns a 404 from Netlify's CDN. Even though this app is single-page with anchor scroll (no React Router), it is defensive best practice and costs nothing.

[Source: architecture.md#Deployment]

### Base Directory Consideration

If the Vite project was scaffolded as `moldova-ev-overview/` inside the BMad practice repo root (`bmad-practice-project/`), then when connecting to Netlify:
- **Repository**: the Git repo root (`bmad-practice-project`)
- **Base directory**: `moldova-ev-overview`
- **Build command**: `npm run build` (relative to base directory)
- **Publish directory**: `dist` (relative to base directory)

Alternatively, if `moldova-ev-overview/` is its own Git repository, the base directory is `/` (root).

> ⚠️ Confirm with Dumitru which Git repo structure is being used before wiring Netlify. The `netlify.toml` file itself is the same either way — only the Netlify UI site settings differ.

### Netlify Free Tier

The free tier is fully sufficient:
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Automatic HTTPS via Let's Encrypt
- PR preview deploys included (useful for Andrei's tariff-update review workflow)

[Source: architecture.md#Deployment — "Free tier sufficient"]

### PR Preview Deploys

Netlify automatically creates preview URLs for every pull request. This enables Andrei's journey: when he opens a PR to update `operators.json`, Netlify builds a preview so he can verify the new tariffs before merging to `main`. No additional configuration needed — it is on by default.

[Source: prd.md#Journey 3 — Andrei, the Data Maintainer]

### Environment Variables

No environment variables are required for V1. The app is fully static — no API keys, no build-time secrets, no runtime config. If a `.env` file exists from the Vite scaffold, it is safe to leave as-is; nothing in V1 reads from it.

### Security Notes

- HTTPS is provided automatically by Netlify via Let's Encrypt — no manual certificate management needed (satisfies NFR6).
- No server-side code is deployed — the site is a static CDN delivery of `dist/` assets. Attack surface is minimal.
- The `netlify.toml` should be committed to the repository (it is not a secret file).

[Source: prd.md#NFR6]

### What This Story Does NOT Do

- Does NOT set up GitHub Actions (that is the V2 ANRE fetch workflow — not in this epic)
- Does NOT configure custom domains (out of scope for V1)
- Does NOT configure Netlify environment variables (none needed in V1)

### Project Structure Notes

Files created in this story:
- `netlify.toml` (new, in project root — `moldova-ev-overview/netlify.toml`)

No other files are modified.

### References

- [Source: architecture.md#Deployment] — Netlify platform choice, auto-deploy on `main`, PR previews
- [Source: architecture.md#Complete Project Tree] — `netlify.toml` location in project tree
- [Source: prd.md#FR29] — "maintainer can publish by pushing to main with no manual steps"
- [Source: prd.md#NFR6] — HTTPS requirement
- [Source: prd.md#Journey 3 — Andrei] — PR preview deploy use case
- [Source: epics.md#Story 1.4] — acceptance criteria

## Dev Agent Record

### Agent Model Used

_to be filled on implementation_

### Debug Log References

### Completion Notes List

### File List

_to be filled on implementation_
