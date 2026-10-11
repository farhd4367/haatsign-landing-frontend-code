# Local development with Docker

Runs the production image of the landing site (`Dockerfile`: Next.js
`next start`, non-root) on **http://localhost:8080**.

## Requirements

- The **haatsign-landing-backend** repository's local stack running
  (http://localhost:8104) for content. Without it the site still starts, with
  empty pages (each page falls back to empty data when the API is unreachable).

All commands are run from the **repository root**.

## Start

```bash
docker compose -f docker/local/docker-compose.yml up -d --build
```

Pages are statically generated with revalidation (ISR): content added to the
landing backend appears after a page's revalidation period (60 seconds).

## Everyday commands

| What | Command |
|---|---|
| After code changes | `docker compose -f docker/local/docker-compose.yml up -d --build` |
| Stop / start | `... stop` / `... up -d` |
| Logs | `... logs -f web` |
| Remove | `... down` |

## Notes

- The build arguments are **fake, local-only values**; the API key/secret must
  match the landing backend's `docker/local/local.env`.
- Port 8080 is used because the landing backend's CORS settings already allow
  `http://localhost:8080`.
- Some code calls the **production** API directly, independent of these
  settings: `src/pages/api/check-status.js` and `src/pages/api/get-coming-soon-date.js`
  (used by the middleware for the maintenance / coming-soon check), and the
  fallback URLs in `src/config/apiConfig.js`.
