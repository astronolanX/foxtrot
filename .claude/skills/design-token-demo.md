---
name: design-token-demo
description: "Interactive demo: Figma → MCP → Style Dictionary → PR simulation with drift detection and impact analysis"
---

# Design Token Pipeline Demo

Interactive demo showing how design tokens flow from Figma to code with intelligent analysis.

## Overview

This demo showcases design-code parity through:
1. **Figma Read** — Read tokens via MCP with visual browser automation
2. **Drift Detection** — Find hardcoded values that should be tokens
3. **Transform** — Convert to CSS via Style Dictionary
4. **Impact Analysis** — Check WCAG contrast and layout risks
5. **PR Simulation** — Show what the automated PR would contain

## Flags

Parse these from the user's invocation:
- `--verbose` — Show live "Claude is..." status updates
- `--record` — Record GIF of browser interactions
- `--dry-run` — Show what would happen without applying changes

## Execution Flow

### Phase 1: Environment Check

```
Status: "🔍 Checking environment..."

1. Verify Figma MCP is available (check for figma-context-mcp or similar)
2. Verify we're in the foxtrot project directory
3. Verify tokens/ directory exists
4. Verify scripts/ has the required files

Status: "✓ Environment ready"
```

If any check fails, provide helpful error message and exit.

### Phase 2: Figma Read (Browser + MCP)

```
Status: "📖 Reading tokens from Figma..."

1. Get the Figma file URL from tokens/figma-config.json or ask user
2. Use browser automation (claude-in-chrome) to:
   - Open the Figma file in browser
   - Navigate to show the Variables panel (if possible)
   - Take screenshot showing the design system
3. Use Figma MCP to read all variables:
   - Call the MCP tool to get file data
   - Extract variables/tokens from response
4. Write raw output to tokens/figma-source.json
5. Show summary: "Extracted N tokens from Figma"

If --verbose:
  Show each token as it's extracted: "  Reading color/surface-deep: #0a0a0a"
```

### Phase 3: Drift Detection

```
Status: "🔍 Scanning for design drift..."

1. Run: node scripts/detect-drift.js
2. Capture and display the output
3. Show parity score prominently

This finds hardcoded values in the codebase that should be using tokens.
```

### Phase 4: Transform

```
Status: "🔄 Transforming tokens..."

1. Run: node scripts/transform-tokens.js
2. This converts Figma JSON → W3C DTCG → Tailwind @theme CSS
3. Show the generated CSS
4. Show the diff against current global.css

Status: "✓ Generated tokens/generated-theme.css"
```

### Phase 5: Impact Analysis

```
Status: "⚡ Analyzing impact..."

1. Parse the diff to identify what changed
2. For each change, run impact analysis:
   - Color changes: WCAG contrast check
   - Spacing changes: Layout impact
   - Typography changes: Reflow warnings
3. Run: node scripts/analyze-impact.js
4. Display the formatted report

Highlight any WCAG failures prominently — these are the "wow" moment.
```

### Phase 6: PR Simulation

```
Status: "📝 Simulating PR creation..."

Display a mock PR interface:

┌─────────────────────────────────────────────────────────────┐
│  PR #42: Update design tokens from Figma                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Files changed: 1                                           │
│  • src/styles/global.css                                    │
│                                                             │
│  ## Summary                                                 │
│  Updated N tokens from Figma design system.                 │
│                                                             │
│  ## Changes                                                 │
│  - accent/default: #e5e5e5 → #ff6b35                       │
│  - section/md: 88px → 120px                                │
│  - size/base: 18px → 20px                                  │
│                                                             │
│  ## Impact Analysis                                         │
│  ⚠️ 2 WCAG contrast issues detected                         │
│  ✓ Layout checks passed                                     │
│                                                             │
│  ## Drift Report                                            │
│  Parity score: 87% (4 hardcoded values found)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Then simulate:
  "📣 Slack notification sent to #design-systems"
  "→ In production, this PR would trigger CI/CD"
```

### Phase 7: Apply Changes (Optional)

```
Ask the user:
  "Apply these changes to global.css? (y/n)"

If yes:
  1. Copy relevant sections from generated-theme.css to global.css
  2. Run dev server if not running
  3. Show before/after in browser (take screenshots)
  4. Status: "✓ Changes applied! Refresh browser to see updates."

If no:
  Status: "Changes saved to tokens/generated-theme.css for review."
```

## Browser Automation Details

When using claude-in-chrome for the Figma portion:

1. **Take screenshot first** — Capture the initial state
2. **Cursor movements should be visible** — Move to elements before clicking
3. **Pause briefly** at each step so viewer can follow
4. **Narrate actions** via status updates if --verbose

Example sequence:
```
1. Navigate to Figma URL
2. Wait for page load
3. Screenshot: "Figma file loaded"
4. If Variables panel visible, highlight it
5. Screenshot: "Design tokens in Figma"
```

## Error Handling

- If Figma MCP not configured: Explain how to set it up
- If Figma file not found: Ask for correct URL
- If no tokens extracted: Check file has Variables defined
- If scripts fail: Show error output, suggest fixes

## Output Files

After running, these files will exist:
- `tokens/figma-source.json` — Raw MCP output
- `tokens/tokens.json` — W3C DTCG format
- `tokens/generated-theme.css` — Tailwind @theme output

## Example Invocation

```
User: /design-token-demo --verbose

Claude:
🔍 Checking environment...
✓ Environment ready

📖 Reading tokens from Figma...
  [Opens Figma in browser, shows Variables]
  Reading color/surface-deep: #0a0a0a
  Reading color/surface-raised: #141414
  ...
✓ Extracted 9 tokens from Figma

🔍 Scanning for design drift...
  [Shows drift report with parity score]

🔄 Transforming tokens...
  [Shows generated CSS and diff]

⚡ Analyzing impact...
  [Shows WCAG failures and layout checks]

📝 Simulating PR creation...
  [Shows mock PR interface]

Apply these changes to global.css? (y/n)
```
