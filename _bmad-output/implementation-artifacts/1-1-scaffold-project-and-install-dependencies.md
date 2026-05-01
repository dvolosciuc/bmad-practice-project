# Story 1.1: Scaffold Project and Install Dependencies

Status: ready-for-dev

## Story

As a developer,
I want the Vite react-ts project scaffolded with all required dependencies installed,
so that the team has a compilable, runnable starting point that matches the architecture spec.

## Acceptance Criteria

1. Running `npm create vite@latest moldova-ev-overview -- --template react-ts` followed by post-scaffold installs produces a project that matches the Architecture spec directory shape.
2. `npm run dev` starts the Vite dev server with no errors or TypeScript warnings.
3. `npm run build` produces a `dist/` folder with no TypeScript compilation errors.
4. All required packages are present and correct in `package.json`: `react`, `react-dom`, `react-i18next`, `i18next`, `i18next-browser-languagedetector` as runtime deps; `tailwindcss`, `@tailwindcss/vite` as dev deps.
5. The project root contains: `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `package.json`, `.gitignore`.
6. `src/` contains at minimum: `main.tsx`, `App.tsx`.

## Tasks / Subtasks

- [ ] Scaffold the project (AC: 1, 5)
  - [ ] Run `npm create vite@latest moldova-ev-overview -- --template react-ts` in the workspace root
  - [ ] `cd moldova-ev-overview`
  - [ ] Run `npm install` to install scaffold deps
- [ ] Install additional runtime dependencies (AC: 4)
  - [ ] Run `npm install react-i18next i18next i18next-browser-languagedetector`
- [ ] Install dev dependencies (AC: 4)
  - [ ] Run `npm install -D tailwindcss @tailwindcss/vite`
- [ ] Configure Tailwind Vite plugin (AC: 2, 3)
  - [ ] In `vite.config.ts`, import `tailwindcss` from `@tailwindcss/vite` and add it to the `plugins` array
  - [ ] Create `tailwind.config.js` as a minimal valid config (full tokens added in Story 1.2)
  - [ ] Add `@import "tailwindcss"` to `src/index.css` (or the CSS entry point Vite uses)
- [ ] Clean up scaffold boilerplate (AC: 2, 3)
  - [ ] Remove Vite's default content from `App.tsx` and `App.css` / `index.css` (leave structure, clear contents)
  - [ ] Verify `npm run dev` starts cleanly
  - [ ] Verify `npm run build` completes with zero TypeScript errors
- [ ] Create empty placeholder directories per Architecture spec (AC: 1)
  - [ ] `src/components/` (empty, add `.gitkeep`)
  - [ ] `src/data/` (empty, add `.gitkeep`)
  - [ ] `src/locales/` (empty, add `.gitkeep`)
  - [ ] `src/lib/` (empty, add `.gitkeep`)

## Dev Notes

### Scaffold Command (exact)

```bash
npm create vite@latest moldova-ev-overview -- --template react-ts
cd moldova-ev-overview
npm install
npm install react-i18next i18next i18next-browser-languagedetector
npm install -D tailwindcss @tailwindcss/vite
```

Node.js 20.19+ required for Vite 6+. [Source: architecture.md#Starter Template]

### Tailwind v4 + Vite Integration

Tailwind CSS v4 uses a **Vite plugin** approach — NOT the traditional `tailwind.config.js` PostCSS setup. The integration is:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

In v4, design tokens are defined in CSS using `@theme` directive (in `src/index.css`), NOT in `tailwind.config.js`. However, the architecture spec references `tailwind.config.js` for token definition — the actual token configuration happens in Story 1.2. For this story, just ensure the plugin is wired and `npm run build` passes.

> ⚠️ Do NOT attempt to write full token config in this story — that is Story 1.2's responsibility.

### TypeScript Strict Mode

The `react-ts` template ships with `"strict": true` in `tsconfig.json`. Do not weaken this — all subsequent stories depend on strict mode being active. [Source: architecture.md#Core Architectural Decisions]

### Project Structure — Final Target

The scaffold will produce a flat `src/` structure. This story adds the empty subdirectories so subsequent stories have the correct locations. Do NOT create any files inside these directories yet — that is the responsibility of the stories that first need them:

```
moldova-ev-overview/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js        ← minimal valid, tokens added in Story 1.2
├── .gitignore
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css              ← @import "tailwindcss" added here
    ├── components/            ← empty .gitkeep
    ├── data/                  ← empty .gitkeep
    ├── locales/               ← empty .gitkeep
    └── lib/                   ← empty .gitkeep
```

[Source: architecture.md#Complete Project Tree]

### What This Story Does NOT Do

- Does NOT configure Tailwind design tokens (Story 1.2)
- Does NOT create i18n initialisation or locale files (Story 1.3)
- Does NOT create `netlify.toml` (Story 1.4)
- Does NOT create any component, type, or data file (Epic 2+)

### Naming Conventions

All subsequent stories depend on these conventions being established from the start:

| Category          | Convention                                                         |
| ----------------- | ------------------------------------------------------------------ |
| Component files   | PascalCase `.tsx`                                                  |
| Utility/lib files | camelCase `.ts`                                                    |
| Styling           | Tailwind utility classes only — no `.css` files except `index.css` |
| Props interfaces  | `ComponentNameProps` suffix                                        |

[Source: architecture.md#Naming Conventions]

### No Security Concerns

This story installs well-known, actively maintained packages from the official npm registry. No sensitive data, no API keys, no environment variables required at this stage.

### Project Structure Notes

- The scaffold command creates the directory `moldova-ev-overview/` as a subdirectory of wherever it is run. Confirm the target location with the user before running if working directory is ambiguous.
- The `.gitignore` from the Vite scaffold already includes `node_modules/` and `dist/` — do not overwrite it.

### References

- [Source: architecture.md#Starter Template] — exact scaffold command and rationale
- [Source: architecture.md#Complete Project Tree] — full directory structure target
- [Source: architecture.md#Naming Conventions] — conventions to establish from day one
- [Source: epics.md#Story 1.1] — acceptance criteria and story intent

## Dev Agent Record

### Agent Model Used

_to be filled on implementation_

### Debug Log References

### Completion Notes List

### File List

_to be filled on implementation_
