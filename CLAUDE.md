# foxtrot

Design systems portfolio — experimental, not traditional.

> **Session Logging Required:** Before ending any session, append a summary to `.claude/sessions.md` using the template at the bottom of that file. Include session ID (fox-XXX), date, completed work, and key commits.

## Status: Phase 2 Complete

**Last session**: 2024-12-21
**Last commit**: `feat: add theory pages and case study with navigation loop`

### What's Built

- **Homepage** (`/`) — Dark atmospheric with floating fragments, partitioned list view
- **Theory pages** (3) — Semantic Negotiation, Agent Credentialing, Compositional Intent
- **Case study** (1) — Onboarding Digitization with real metrics
- **Navigation loop** — Circular Next links between all project pages
- **Design tokens** — Typography scale, color palette, spacing in `global.css`
- **Components** — CursorGlow, Base layout

### What's Next

1. Add media/diagrams to theory pages (currently placeholders)
2. Deploy to Vercel
3. Consider additional theories from backlog

## Theory Ideas

Reference for future theory content. Mix of AI-forward concepts and foundational thinking.

### Implemented

| Title | Domain | Concept |
|-------|--------|---------|
| Semantic Negotiation Layer | Agent-Component Interfaces | Components explain constraints to AI, negotiate alternatives |
| Agent Credentialing System | Trust & Governance | Graduated permissions based on demonstrated competence |
| Compositional Intent Graphs | Component Relationships | Graph-based model of valid component compositions |

### Backlog: Tooling & Adoption

Practical tools for design system governance and product team enablement:

- **Component Telemetry Dashboard** — Components report usage data back to design systems team
- **Lift Kit** — Agent skill that helps product teams adopt design system style streams
- **Content Scanner** — Recommends changes to align with design system rules

### Backlog: AI-Forward

Generated concepts for design systems in an agentic world:

- **Style Provenance Chain** — Track where design decisions came from (human vs AI)
- **Token Diffusion Networks** — How design tokens propagate through agentic pipelines
- **Ambient Specification Mining** — AI discovers patterns from codebase, not just docs
- **Failure-Mode Libraries** — Catalog of how AI breaks design systems, with prevention
- **Temporal Coherence Contracts** — Ensure AI-generated UI stays consistent over time

### Backlog: Foundational

Original conceptual topics about design systems thinking:

- **Constraint as creative fuel** — How limitations drive better design
- **The grammar of components** — Linguistic view of component composition
- **Why systems fail** — Common failure modes in design systems
- **Tokens vs. decisions** — When abstraction helps vs when it hides intent
- **The cost of flexibility** — Trade-offs of making everything configurable

## Quick Reference

```bash
npm run dev      # localhost:4321
npm run build    # static output to dist/
```

## Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Fonts | JetBrains Mono + DM Sans | Technical feel, two fonts only |
| Homepage | List view with sections | Cleaner than orbs, mobile-friendly |
| Project pages | Newspaper light theme | Contrast shift, editorial feel |
| Theory format | Problem/Proposal/Why Now/Prior Art | Structured argumentation |
| Navigation | Circular Next links | Encourages exploration |

## File Structure

```
src/
├── components/
│   └── CursorGlow.astro    # Mouse-follow ambient glow
├── layouts/
│   └── Base.astro          # Fonts, meta
├── pages/
│   ├── index.astro         # Homepage with partitioned list
│   └── work/
│       ├── semantic-negotiation.astro
│       ├── agent-credentialing.astro
│       ├── compositional-intent.astro
│       └── onboarding-digitization.astro
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
