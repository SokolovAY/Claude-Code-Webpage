# Andrei's creator site

Personal site where Medium readers can support Andrei by buying pay-what-you-want article bundles.

- Product requirements: [docs/PRD.md](docs/PRD.md)
- Implementation guide: [CLAUDE.md](CLAUDE.md)

## Getting started

```bash
npm install
npx playwright install   # browsers for the e2e tests
cp .env.example .env.local
npm run dev              # http://localhost:3000
```

## Scripts

| Command                   | Purpose                            |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Dev server                         |
| `npm run build`           | Production build                   |
| `npm run start`           | Serve the production build         |
| `npm run lint`            | ESLint                             |
| `npm run typecheck`       | Generate route types, then `tsc`   |
| `npm run format`          | Prettier write                     |
| `npm run test:e2e`        | Playwright, headless, all projects |
| `npm run test:e2e:ui`     | Playwright UI mode                 |
| `npm run test:e2e:update` | Update visual baselines            |
