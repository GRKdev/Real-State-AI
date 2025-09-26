# Repository Guidelines

## Project Structure & Module Organization
This Next.js 14 app uses the App Router. Feature routes live in `app/[lang]/` with `page.tsx` and supporting API handlers under `app/[lang]/api/`. Shared UI elements belong in `components/`, hooks in `hooks/`, and contextual state providers in `contexts/`. Domain dictionaries and localization assets reside in `dictionaries/` and `types/`. Static assets (icons, images) live in `public/`. Use `lib/` and `utils/` for reusable server and client helpers. Keep experimental artifacts in `tmp/` and remove them before merging.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Run `npm run dev` for the local dev server at `http://localhost:3000`. Build production output via `npm run build`, and launch the optimized server with `npm run start`. Execute `npm run lint` before every PR to apply the Next.js ESLint rules. Docker users can run `docker-compose up --build` to mirror the production stack.

## Coding Style & Naming Conventions
TypeScript is required for all modules; prefer typed props and return values. Follow 2-space indentation, functional React components, and PascalCase component files (e.g., `components/ui/WelcomeMessage.tsx`). Co-locate styles with components using Tailwind utility classes; favor semantic class groupings. Keep imports sorted from external to internal modules, and use named exports unless a file exposes a single component. Run `npm run lint` to enforce the shared ESLint config (`next/core-web-vitals`) and autoprefixer/postcss pipeline.

## Testing Guidelines
Automated tests are not yet established. When adding them, place Jest or Playwright specs alongside the feature (`component.spec.tsx`) and ensure they run via a future `npm test` script. Until then, validate critical flows manually: perform search queries in multiple locales, verify Clerk authentication, and confirm GPT prompts resolve without rate-limit errors. Aim for high coverage on search logic and dictionary helpers once tests exist.

## Commit & Pull Request Guidelines
Commit messages follow Conventional Commits (`feat:`, `fix:`, `build(deps):`), matching the current history. Keep messages imperative and scoped (`feat: add copy to clipboard`). PRs must include a concise summary, screenshots or logs for UI changes, linked issue references, and notes on testing performed. Ensure branches are rebased on `main`, lint passes, and environment variables required for reviewers are documented in the PR body.

## Environment & Security Notes
Store secrets in `.env.local`, never commit them. Rotate OpenAI, Clerk, and database keys regularly and use Vercel project-level secrets for production. Before deploying, verify `next.config.mjs` mirrors required domains and that middleware localization rules cover all supported languages.
