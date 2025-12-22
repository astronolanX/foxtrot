# Theory Page Code Examples Design

**Date:** 2025-12-22
**Status:** Validated

## Overview

Add interactive code examples to theory pages showing usage patterns for each theoretical concept. Uses tabbed interface with CSS-only switching.

## Design Decisions

| Aspect | Decision |
|--------|----------|
| Example type | Usage examples (how developers/agents interact) |
| Interface | Tabbed (multiple examples, one visible at a time) |
| Language | Language-agnostic pseudo-code |
| Quantity | Varies by theory (3-4 tabs each) |
| Approach | Custom CSS-only CodeTabs component |

## CodeTabs Component

### API

```astro
<CodeTabs
  tabs={[
    { label: "Tab Name", code: `code here` },
    { label: "Another Tab", code: `more code` }
  ]}
/>
```

### Implementation

- Hidden `<input type="radio">` elements control state
- `<label>` elements act as clickable tabs
- CSS `:checked` selector shows/hides code panels
- No JavaScript required

### Styling

- Tab bar: `--color-ink` active, `--color-ink-muted` inactive
- Code panel: `--color-paper-warm` background
- Font: `JetBrains Mono` for code
- Active tab indicator: underline

## Examples by Page

### Semantic Negotiation (4 tabs)

**Tab 1: Request**
```
agent.request({
  component: "Button",
  props: { label: "Submit your application for review and approval" }
})
```

**Tab 2: Constraint**
```
component.constraint({
  violated: "label.maxLength",
  limit: 40,
  actual: 52,
  rationale: "Labels over 40 chars break mobile layout"
})
```

**Tab 3: Alternatives**
```
component.alternatives([
  { action: "truncate", result: "Submit your application..." },
  { action: "wrap", result: "Multi-line button" },
  { action: "split", result: "Use secondary action pattern" }
])
```

**Tab 4: Resolution**
```
agent.select("truncate")
// Component renders with truncated label
```

### Agent Credentialing (4 tabs)

**Tab 1: Check Permission**
```
agent.request({
  action: "modify",
  target: "Button.variant",
  value: "destructive"
})
```

**Tab 2: Evaluate Trust**
```
system.evaluateTrust({
  agentId: "agent-7x9k",
  level: 1,
  action: "modify",
  pattern: "destructive-variant"
})
// Result: REQUIRES_REVIEW (Level 2 needed)
```

**Tab 3: Escalate**
```
system.escalate({
  reason: "Agent below required trust level",
  requiredLevel: 2,
  currentLevel: 1,
  reviewQueue: "design-system-changes"
})
```

**Tab 4: Graduate**
```
system.promote({
  agentId: "agent-7x9k",
  from: 1,
  to: 2,
  reason: "50 successful modifications, 0 violations"
})
```

### Compositional Intent (3 tabs)

**Tab 1: Propose Tree**
```
agent.propose({
  root: "Card",
  children: [
    { component: "Icon", props: { name: "warning" } },
    { component: "Text", props: { content: "Alert message" } },
    { component: "Button", props: { label: "Dismiss" } }
  ]
})
```

**Tab 2: Validate**
```
graph.validate({
  check: "Card > Icon + Text + Button",
  rules: [
    { rule: "card-allows-icon", result: "pass" },
    { rule: "card-allows-text", result: "pass" },
    { rule: "card-allows-button", result: "pass" },
    { rule: "icon-button-pairing", result: "pass" }
  ]
})
```

**Tab 3: Invalid Example**
```
agent.propose({
  root: "Button",
  children: [
    { component: "Button", props: { label: "Inner" } }
  ]
})

graph.reject({
  rule: "no-nested-interactive",
  message: "Button cannot contain Button",
  suggestion: "Use ButtonGroup for adjacent actions"
})
```

## Placement

Code examples appear after "The Proposal" section, before "Why Now" — readers see concept explained, then concrete examples, then context.

## Implementation Steps

1. Create `CodeTabs.astro` component with CSS-only tab switching
2. Add to Semantic Negotiation page (4 tabs)
3. Add to Agent Credentialing page (4 tabs)
4. Add to Compositional Intent page (3 tabs)
5. Test tab interactions and mobile responsiveness
