---
name: deployment
description: "Handles static site deployment to Vercel, Netlify, or Cloudflare Pages. Use when deploying or setting up CI/CD."
---

# Static Site Deployment

Deploy Astro sites to modern hosting platforms.

## Supported Platforms

| Platform | Command | Config File |
|----------|---------|-------------|
| Vercel | `npx vercel` | `vercel.json` |
| Netlify | `npx netlify deploy` | `netlify.toml` |
| Cloudflare | `npx wrangler pages deploy` | `wrangler.toml` |

## Astro Adapter Setup

```bash
# For Vercel
npx astro add vercel

# For Netlify
npx astro add netlify

# For Cloudflare
npx astro add cloudflare
```

## Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

```bash
# Deploy
npx vercel --prod
```

## Netlify Deployment

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

## GitHub Actions (Generic)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      # Add platform-specific deploy step
```

## Pre-Deployment Checklist

- [ ] `npm run build` succeeds locally
- [ ] All images optimized
- [ ] Meta tags and OG images set
- [ ] Lighthouse score acceptable
- [ ] Environment variables configured
- [ ] Custom domain DNS ready

## Rollback

All platforms support instant rollback to previous deployments via their dashboards or CLI.
