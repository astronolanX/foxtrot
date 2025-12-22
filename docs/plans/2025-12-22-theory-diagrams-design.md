# Theory Page Diagrams Design

**Date:** 2025-12-22
**Status:** Validated

## Overview

Add 6 inline SVG diagrams to replace placeholders across 3 theory pages. Use Mermaid for code-based diagram generation with a custom editorial theme.

## Design Decisions

| Aspect | Decision |
|--------|----------|
| Medium | Inline SVG |
| Style | Editorial/minimal (thin lines, ink-on-paper) |
| Motion | Interactive hover (CSS-based) |
| Color | Monochrome ink + warm accent highlights |
| Priority | Concept clarity over technical depth |
| Tool | Mermaid (client-side rendering) |

## Mermaid Configuration

```js
mermaid.initialize({
  theme: 'base',
  themeVariables: {
    primaryColor: '#f4f1eb',      // paper-warm
    primaryTextColor: '#1a1a1a',  // ink
    lineColor: '#1a1a1a',         // ink
    secondaryColor: '#ebe6dc',    // accent
    fontSize: '14px',
    fontFamily: 'JetBrains Mono'
  }
})
```

## Diagram Specifications

### Semantic Negotiation Page

**1. Negotiation Flow Diagram**
- Type: `flowchart LR`
- Shows: Agent request → Component validates → Valid? → Render or Return alternatives → Agent chooses → Loop
- Key elements: Agent (rounded), Component (rectangle), Decision diamond, Loop arrow
- Labels: "request", "constraints violated", "alternatives", "selection"

**2. Constraint Communication Model**
- Type: Hand-crafted inline SVG (Mermaid doesn't support layered blocks)
- Shows: Three stacked horizontal layers
  - Top: Component API (what exists today)
  - Middle: Constraint Rationales (why limits exist)
  - Bottom: Negotiation Interface (how to resolve violations)

### Agent Credentialing Page

**3. Trust Tier Diagram**
- Type: `flowchart LR`
- Shows: Three boxes in horizontal progression
  - Level 0: Sandbox (Read-only, Reviewed)
  - Level 1: Trusted (Safe patterns)
  - Level 2: Full (Full access)
- Accent color on Level 2 to indicate goal state

**4. Graduation Pathway**
- Type: `flowchart TD`
- Shows: Vertical flow with feedback loop
  - Start at Level 0 → Accumulate successful interactions → Threshold met? → Promote
  - Violation detected? → Demote one level
- Emphasizes earned trust and demotion risk

### Compositional Intent Page

**5. Intent Graph Visualization**
- Type: `flowchart TD` with subgraphs
- Shows: Node-and-edge graph of component relationships
  - Card parent with Icon, Text, Button children
  - Dotted/accent edge showing valid sibling pairing (Icon + Button)
- Visualizes relationships beyond hierarchy

**6. Composition Validation Flow**
- Type: `flowchart TD`
- Shows: Agent proposes tree → Graph validates → Valid? → Render or Return error + explanation + alternatives
- Similar to negotiation flow but for tree validation

## Hover Interactions

Target Mermaid's generated SVG classes:

```css
.mermaid .node rect {
  transition: fill 0.2s ease;
}

.mermaid .node:hover rect {
  fill: var(--color-paper-warm);
}

.mermaid .edgePath:hover path {
  stroke-width: 2px;
}
```

Optional: Detail reveal via CSS `::after` with `data-` attributes.

## Implementation

### File Structure

```
src/
├── components/
│   └── Diagram.astro        # Wrapper for mermaid blocks
├── styles/
│   └── diagrams.css         # Hover states, theme overrides
└── pages/work/
    └── [existing theory pages]
```

### Steps

1. Add Mermaid via CDN in `Base.astro`, configure theme
2. Create `Diagram.astro` component (wrapper accepting mermaid definition as slot)
3. Write 6 diagram definitions in mermaid syntax
4. Add hover CSS targeting mermaid's generated classes
5. Replace `<figure class="media-placeholder">` with `<Diagram>` components
6. Test hover interactions across browsers

### Diagram Type Mapping

| Diagram | Mermaid Type |
|---------|--------------|
| Negotiation flow | `flowchart LR` |
| Constraint model | Hand-crafted SVG |
| Trust tiers | `flowchart LR` |
| Graduation pathway | `flowchart TD` |
| Intent graph | `flowchart TD` + subgraphs |
| Validation flow | `flowchart TD` |

## Notes

- Client-side Mermaid rendering chosen for simplicity (pages are light)
- One diagram (constraint model) uses hand-crafted SVG since Mermaid doesn't support layered blocks
- Hover states may need post-processing if Mermaid's SVG structure limits CSS targeting
