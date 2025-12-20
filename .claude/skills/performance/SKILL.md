---
name: performance
description: "Optimizes web performance for Core Web Vitals. Use when analyzing or improving site speed."
---

# Web Performance Optimization

Achieve excellent Core Web Vitals scores.

## Core Web Vitals Targets

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | ≤4s | >4s |
| INP (Interaction to Next Paint) | ≤200ms | ≤500ms | >500ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | ≤0.25 | >0.25 |

## Astro-Specific Optimizations

### Image Optimization
```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---

<Image
  src={hero}
  alt="Hero image"
  widths={[400, 800, 1200]}
  sizes="(max-width: 800px) 100vw, 800px"
  loading="eager"  <!-- for above-fold -->
/>
```

### Component Islands
```astro
<!-- Only hydrate when visible -->
<InteractiveWidget client:visible />

<!-- Only hydrate on idle -->
<HeavyComponent client:idle />

<!-- Never hydrate (static) -->
<StaticComponent />
```

### Font Loading
```astro
---
// In head
---
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=..."
  rel="stylesheet"
  media="print"
  onload="this.media='all'"
/>
```

## Critical CSS

Astro inlines critical CSS by default. For manual control:

```astro
<style is:inline>
  /* Critical above-fold styles */
</style>
```

## Lazy Loading

```astro
<!-- Images below fold -->
<img src="..." loading="lazy" decoding="async" />

<!-- Defer non-critical scripts -->
<script defer src="..."></script>
```

## Bundle Analysis

```bash
# Visualize bundle size
npx astro build -- --analyze
```

## Performance Checklist

- [ ] Images use modern formats (WebP, AVIF)
- [ ] Above-fold images eager loaded
- [ ] Below-fold images lazy loaded
- [ ] Fonts preconnected and display:swap
- [ ] No layout shift from loading content
- [ ] JavaScript minimized and deferred
- [ ] CSS inlined or preloaded
- [ ] Compression enabled (gzip/brotli)

## Testing Tools

- Lighthouse (Chrome DevTools)
- PageSpeed Insights
- WebPageTest
- `npx unlighthouse` for full-site audit
