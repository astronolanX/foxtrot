# Portfolio Design Document

**Date:** 2025-12-20
**Status:** Approved

---

## Vision

A design systems portfolio that demonstrates the thinking, not just the output. The site itself is a specimen of the design system philosophy being sold.

**Core feeling:** Impressed + Delighted (craft meets joy)
**Positioning:** Thinker who ships, not shipper who thinks

---

## Typography System

### Scale: Major Third (1.250)

| Step | Size | Use |
|------|------|-----|
| -1 | 14px | Small, captions |
| 0 | 18px | Body |
| 1 | 22px | Lead, large body |
| 2 | 28px | H4 |
| 3 | 35px | H3 |
| 4 | 44px | H2 |
| 5 | 55px | H1 |
| 6 | 69px | Display |

### Font Stack

- **Display/Headlines:** Fraunces (variable, expressive serifs)
- **Body:** DM Sans (geometric, neutral)
- **Mono:** JetBrains Mono (code, labels)

### Hierarchy Principles

- Weight + space over size alone
- Vertical rhythm derived from scale
- Line heights: 1.2 (display), 1.5 (body), 1.6 (small)

---

## Color System

### Surfaces

```css
--surface-deep:     #0a0a0a;   /* Primary canvas */
--surface-raised:   #141414;   /* Cards, elevated */
--surface-light:    #fafafa;   /* Editorial contrast */
```

### Text

```css
--text-primary:     #f5f5f5;   /* On dark */
--text-secondary:   #a0a0a0;
--text-muted:       #525252;
--text-inverse:     #0a0a0a;   /* On light */
```

### Accent

```css
--accent:           #e5e5e5;   /* Subtle, not flashy */
--accent-hover:     #ffffff;
```

### Atmosphere

```css
--glow:             rgba(255, 255, 255, 0.03);
--grain:            url('/noise.svg');
```

---

## Atmosphere

**Dark canvas + editorial breaks.** Inspired by Phantom.Land's moody depth with magazine-like precision.

### Layers

1. **Base:** Deep warm black (#0a0a0a)
2. **Grain:** Film noise overlay (subtle, ambient)
3. **Cursor glow:** Soft radial gradient follows mouse
4. **Generative:** Slow drifting shapes (WebGL or CSS)
5. **Editorial breaks:** Light sections for rhythm

---

## Layout

### Grid

- 12-column
- Container: max-w-6xl (1152px)
- Gutter: 24px
- Section spacing: from type scale (55px, 89px, 144px)

### Page Structure

```
NAV         Minimal: wordmark + 2-3 links
HERO        "I think in systems." + ambient background
THEORY      Light section, frameworks/principles
APPLICATION Dark, case studies as evidence
EXPERIMENTS Dark, work in progress
ABOUT       Human + open conversation
```

---

## Interaction

### Layer 1: Ambient (passive)

- Film grain overlay
- Slow generative shapes drifting
- Subtle enough to not distract

### Layer 2: Cursor Response (active)

- Soft light follows cursor
- Magnetic lift on nearby elements
- Hero background distorts around pointer

### Layer 3: Easter Eggs (discovery)

- Konami code triggers something
- Wordmark click sequence
- Draggable elements that shouldn't be
- Cursor changes in zones
- Hidden `/lab` page

---

## Content Architecture

### Routes

```
/                     Home (hero + sections)
/theory               Framework index
/theory/[slug]        Individual framework
/work                 Case study index
/work/[slug]          Individual case study
/experiments          Works in progress
/about                Human + contact
/lab                  Easter egg (hidden)
```

### Content Models

```typescript
interface Theory {
  title: string;
  summary: string;
  status: 'forming' | 'developing' | 'mature';
  body: MDX;
}

interface CaseStudy {
  title: string;
  client?: string;
  type: 'logo' | 'product' | 'system' | 'feature';
  theory?: Theory[];  // Links to frameworks applied
  body: MDX;
}
```

### Key Insight

Theory and Application are linked. Case studies reference the frameworks that drove them. The thinking is visible in the work.

---

## Technical Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Astro 5 | Static, fast, islands architecture |
| Styling | Tailwind 4 | Design tokens via CSS vars |
| Type | Google Fonts + Fontshare | Fraunces, DM Sans, JetBrains Mono |
| Motion | Motion One | Lightweight, springs |
| WebGL | OGL or vanilla | Ambient layer only |
| Content | Astro Content Collections | MDX support |
| Deploy | Vercel | Via MCP integration |

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Astro project setup
- [ ] Tailwind config with design tokens
- [ ] Typography system (fonts, scale, rhythm)
- [ ] Color tokens
- [ ] Base layout components

### Phase 2: Atmosphere
- [ ] Grain overlay
- [ ] Cursor glow effect
- [ ] Ambient generative background (hero)
- [ ] Light/dark section transitions

### Phase 3: Content
- [ ] Content collections (theory, work)
- [ ] MDX setup
- [ ] Index pages
- [ ] Detail pages

### Phase 4: Interaction
- [ ] Micro-interactions (hover, focus)
- [ ] Scroll-driven reveals
- [ ] Easter eggs

### Phase 5: Polish
- [ ] Performance optimization
- [ ] Lighthouse audit
- [ ] SEO / meta
- [ ] Vercel deploy

---

*Generated: 2025-12-20*
