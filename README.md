# barkov-devfolio-v2

Personal portfolio site for **barysh** (barkov). Built with opencode — an AI-powered terminal-first coding tool.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript 6 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 (via `@import "tailwindcss"` in `App.css`) |
| UI Primitives | shadcn/ui (Radix Lyra style, `components/ui/`) |
| Icons | [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`) |
| Routing | React Router v7 (`BrowserRouter`, `Routes`, `Route`, `Link`) |
| Rich Text | TipTap (`@tiptap/react`, `@tiptap/starter-kit`) |
| Drag & Drop | dnd-kit |
| Backend / Auth | Supabase |
| Package Manager | pnpm |

## Project Structure

```
barkov-devfolio-v2/
├── .agents/skills/        # opencode skill definitions
│   ├── bryl-minimal-design/
│   ├── shadcn/
│   ├── supabase/
│   └── supabase-postgres-best-practices/
├── components/            # Shared UI components
│   ├── ui/                # shadcn/ui primitives (button, card, dialog, sidebar, etc.)
│   ├── theme-provider.tsx # Light/dark/system theme via next-themes
│   ├── mode-toggle.tsx    # Theme toggle switch
│   └── ...                # blog-card, inquiry-form, gallery-dialog, etc.
├── contexts/
│   └── auth-context.tsx   # Auth state management
├── hooks/
│   └── use-mobile.ts      # Responsive breakpoint hook
├── lib/
│   ├── supabase.ts        # Supabase client instance
│   ├── types.ts           # Shared TypeScript interfaces (Profile, Project, Experience, etc.)
│   ├── utils.ts           # cn() utility (clsx + tailwind-merge)
│   └── icons.tsx          # Phosphor icon re-exports
├── src/
│   ├── assets/            # Static images (hero, projects)
│   ├── pages/             # Route-level page components
│   │   ├── Home.tsx       # /
│   │   ├── Blog.tsx       # /blog
│   │   ├── BlogPost.tsx   # /blog/:slug
│   │   ├── Gallery.tsx    # /gallery
│   │   ├── Game.tsx       # /game
│   │   ├── Login.tsx      # /login
│   │   └── dashboard/     # Admin panel (protected)
│   │       ├── DashboardLayout.tsx
│   │       ├── DashboardHome.tsx
│   │       ├── InquiriesManager.tsx
│   │       ├── blogs/     # BlogEditor, BlogList
│   │       ├── gallery/   # GalleryManager
│   │       └── sections/  # ProfileEditor, TechStackManager, ProjectsManager, etc.
│   ├── sections/          # Page content blocks
│   │   ├── header.tsx, footer.tsx
│   │   ├── about.tsx, projects.tsx, experience.tsx, tech-stack.tsx
│   │   ├── blogs.tsx, gallery.tsx, socials.tsx
│   │   └── components/   # project-card.tsx, experience-card.tsx
│   ├── contexts/          # (empty — auth lives in root contexts/)
│   ├── App.tsx            # Route definitions, layout
│   ├── App.css            # Tailwind import + global styles
│   └── main.tsx           # Entry point (BrowserRouter wrapper)
├── supabase/
│   └── migrations/        # Database migrations
├── public/                # Static files (favicon, icons, images)
├── opencode.json          # opencode configuration (MCP, etc.)
├── skills-lock.json       # Installed opencode skills
└── AGENTS.md              # Internal developer notes
```

## Getting Started

```bash
pnpm install
pnpm dev          # Start Vite dev server
pnpm build        # Type-check + production build
pnpm preview      # Preview production build
pnpm lint         # ESLint
```

## Supabase MCP Setup

This project uses the Supabase MCP server for database introspection, migrations, and management. The configuration lives in `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "supabase": {
      "type": "remote",
      "url": "https://mcp.supabase.com/mcp?project_ref=<your-project-ref>",
      "enabled": true
    }
  }
}
```

To set up locally:

1. **Install the Supabase CLI** — see [supabase.com/docs/guides/local-development](https://supabase.com/docs/guides/local-development)
2. Start the local stack: `supabase start`
3. For local MCP, change the config to use a local Supabase MCP server
4. Run `pnpm dlx supabase --experimental` to scaffold local migrations

The existing migrations in `supabase/migrations/` set up tables for blogs, gallery, and inquiries.

## opencode Skills

Skills provide structured knowledge and workflows for the AI agent. Currently installed:

| Skill | Source | Purpose |
|-------|--------|---------|
| **bryl-minimal-design** | Local (`.agents/skills/`) | Monochrome, typography-driven minimal design aesthetic |
| **shadcn** | shadcn/ui (GitHub) | Component authoring conventions |
| **supabase** | supabase/agent-skills | Supabase development workflows |
| **supabase-postgres-best-practices** | supabase/agent-skills | Postgres performance and security |

Add a new skill:
```bash
npx skills add <source>
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/barkov/barkov-devfolio-v2/issues).

## License

MIT
