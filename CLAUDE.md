# new-portfolio

Design systems portfolio — experimental, not traditional.

## Status: Phase 1 Complete

**Last session**: 2024-12-20
**Last commit**: `feat: experimental homepage and newspaper project pages`

### What's Built

- **Homepage** (`/`) — Dark atmospheric with parallax text, floating fragments, work orbs that reveal on hover
- **Project page** (`/work/component-architecture`) — Newspaper-style light theme with editorial layout
- **Design tokens** — Typography scale, color palette, spacing in `global.css`
- **Components** — CursorGlow, Nav, Base layout

### What's Next

1. Wire up orbs to actual project pages
2. Add more project pages (Typographic Systems, Interaction Patterns)
3. Theory section/pages
4. Content — real case studies, not placeholder
5. Deploy to Vercel

## Quick Reference

```bash
npm run dev      # localhost:4321
npm run build    # static output to dist/
```

## Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Fonts | JetBrains Mono + DM Sans | Technical feel, two fonts only |
| Homepage | Experimental/atmospheric | Phantom.Land-inspired, not traditional |
| Project pages | Newspaper light theme | Contrast shift, editorial feel |
| Layout | Single-page hero → content pages | Impact first, depth on click |

## File Structure

```
src/
├── components/
│   ├── CursorGlow.astro    # Mouse-follow ambient glow
│   └── Nav.astro           # Minimal "N" mark (homepage only)
├── layouts/
│   └── Base.astro          # Fonts, meta, hideNav prop
├── pages/
│   ├── index.astro         # Experimental homepage
│   └── work/
│       └── component-architecture.astro
├── styles/
│   └── global.css          # Design tokens via @theme
└── content/
    ├── theory/             # MDX articles (empty)
    └── work/               # MDX case studies (empty)
```

## Design Tokens

### Typography
- **Display**: JetBrains Mono (light 300, regular 400)
- **Body**: DM Sans
- **Scale**: Major Third (1.250) — 14/18/22/28/35/44/55/69px

### Colors
- **Dark**: `#0a0a0a` surface, `#f5f5f5` text
- **Newspaper**: `#f4f1eb` paper, `#1a1a1a` ink
- **Warm accent**: `#ebe6dc` for media placeholders

---

@./.claude/scoped-rules.md
