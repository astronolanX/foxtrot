---
name: lighthouse-ci
description: "Integrates Lighthouse CI for automated performance testing, Core Web Vitals tracking, and regression detection."
---

# Lighthouse CI Integration

Automated performance testing in CI/CD pipelines.

## Installation

```bash
npm install -D @lhci/cli
```

## Configuration

Create `lighthouserc.js`:

```js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4321/'],  // Astro default port
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // or 'mobile' for mobile testing
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

## GitHub Actions Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npx @lhci/cli autorun
```

## Running Locally

```bash
# Build first
npm run build

# Run Lighthouse CI
npx lhci autorun
```

## Budget Thresholds

| Metric | Target | Critical |
|--------|--------|----------|
| Performance | ≥90 | ≥80 |
| LCP | ≤2.5s | ≤4s |
| CLS | ≤0.1 | ≤0.25 |
| TBT | ≤300ms | ≤600ms |

## Best Practices

- Run on every PR to catch regressions early
- Test both mobile and desktop presets
- Set realistic budgets based on baseline measurements
- Monitor trends over time, not just pass/fail
