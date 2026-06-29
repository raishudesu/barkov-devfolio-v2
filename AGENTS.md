# AGENTS.md — barkov-devfolio-v2

## Stack
- React 19 + TypeScript 6 + Vite 8 SPA
- Tailwind CSS v4 (no `tailwind.config.js`; CSS via `@import "tailwindcss"` in `src/App.css`)
- shadcn/ui (Radix Lyra style) — components in `components/ui/`
- Phosphor icons (`@phosphor-icons/react`) — not Lucide
- React Router v7 (library mode: `BrowserRouter`, `Routes`, `Route`, `Link`)
- pnpm

## Commands
| Command | Action |
|---------|--------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | `tsc -b && vite build` (typecheck first) |
| `pnpm lint` | ESLint flat config (`.js`) |
| `pnpm preview` | Vite preview |

No test framework configured.

## Paths
- `@/*` alias → project root (e.g. `@/lib/utils`, `@/components/ui/button`)
- Components: `components/` (theme, shared) + `components/ui/` (shadcn primitives)
- Pages: `src/pages/` — currently `Home.tsx` (`/`), `Blog.tsx` (`/blog`)
- Sections (page content blocks): `src/sections/`
- Data: `src/data/sections-data.ts` — all portfolio content (projects, experience, tech stack, socials)
- Fetch utility: `lib/fetch.ts` — `api.get/post/put/patch/delete/head/options`, typed, handles FormData + JSON

## TypeScript quirks
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `erasableSyntaxOnly: true` — no enums or namespaces
- `noUnusedLocals` + `noUnusedParameters: true`

## Pre-existing issues (don't reintroduce)
- `src/sections/components/project-card.tsx:30` — `string | null` → `string` type error (pre-existing)
- `react-refresh/only-export-components` lint errors in `button.tsx`, `badge.tsx`, `navigation-menu.tsx`, `theme-provider.tsx`, `mode-toggle.tsx` (pre-existing, all shadcn/ui components)

## Routing
- SPA with client-side routing via react-router-dom
- `BrowserRouter` wraps `<App>` in `main.tsx`
- Routes defined in `App.tsx` — `"/"` → Home, `"/blog"` → Blog
- Shared layout: `ThemeProvider > main (min-h-screen flex col) > Header + <Routes/> + Footer`
- For production, hosting needs SPA fallback (e.g. Vercel `rewrites`, Netlify `_redirects`)

## Theme
- Light/dark toggle via `components/mode-toggle.tsx` (Switch component)
- Default: `"system"` (follows OS preference on first visit)
- Storage key: `vite-ui-theme`

## Porting shadcn/ui components
- Icon library: `phosphor` (not lucide-react)
- Run `pnpm dlx shadcn@latest add <component-name>` inside project root
