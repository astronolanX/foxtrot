# Design Token Pipeline Demo

Interactive demo showing Figma → Code token sync with drift detection and impact analysis.

## Overview

A portfolio case study that demonstrates design-code parity through an automated token pipeline. Unlike typical sync tools, this demo includes:

- **Drift Detection** — Finds hardcoded values that should be tokens
- **Impact Analysis** — Checks WCAG contrast and layout risks before applying changes
- **Full Orchestration** — Browser automation with visible cursor, live status updates

## Audience

- Designers: See how Figma changes flow to code automatically
- Developers: See how Claude reads tokens and generates proper code
- Leadership: See the full pipeline reducing manual handoff

## Components

### 1. Figma Demo File
Minimal design system with Variables (created via browser automation):
- Colors: surface/deep, surface/raised, text/primary, text/secondary, accent/default
- Spacing: section/md, gutter
- Typography: size/base, size/xl

### 2. Figma MCP (GLips community server)
- URL-based reading (no desktop app required)
- Returns token names + values + code syntax

### 3. Drift Detection
Scans codebase for hardcoded values that match token definitions:
```
src/components/Nav.astro:12
│ color: #a0a0a0
└→ Use: var(--color-text-secondary)
```
Outputs parity score: (tokenized / total) × 100

### 4. Token Transformer
- Converts MCP output → W3C DTCG JSON
- Runs Style Dictionary → Tailwind @theme format

### 5. Impact Analysis
For color changes:
- Find all usages in codebase
- Calculate WCAG contrast ratios
- Flag failures with file:line references

For spacing changes:
- Check for potential overflow
- Validate mobile breakpoints

### 6. Demo Narrator
- Guides through each step with explanations
- Simulates PR creation + Slack notification
- Optional `--verbose` flag for live status updates

## File Structure

```
foxtrot/
├── src/pages/work/
│   └── design-token-pipeline.astro   # Case study page
├── tokens/
│   ├── README.md                      # Demo instructions
│   ├── figma-source.json              # Raw MCP output (generated)
│   ├── tokens.json                    # W3C DTCG format (generated)
│   └── style-dictionary.config.js     # Transform config
├── scripts/
│   └── transform-tokens.js            # Runs Style Dictionary
└── package.json                       # Add style-dictionary dep
```

## Demo Flow

### Phase 1: Environment Check
- Verify Figma MCP configured
- Verify foxtrot project structure
- Status: "Environment ready"

### Phase 2: Figma Read (Browser + MCP)
- Open Figma in browser, navigate to Variables
- Cursor highlights tokens as they're read
- MCP extracts all variable values
- Write to tokens/figma-source.json

### Phase 3: Drift Detection
- Scan codebase for hardcoded values
- Match against token definitions
- Report findings with parity score

### Phase 4: Transform (Style Dictionary)
- Convert Figma JSON → W3C DTCG format
- Run Style Dictionary → Tailwind @theme
- Write to tokens/generated-theme.css

### Phase 5: Impact Analysis
- Detect what changed (diff Figma vs current)
- For color changes: run WCAG contrast checks
- For spacing changes: identify affected layouts
- Report with specific file:line references

### Phase 6: Diff + Simulated PR
- Show before/after diff
- Simulate PR creation with impact summary
- Simulate Slack notification

### Phase 7: Apply (optional)
- Ask: "Apply changes to global.css?"
- If yes: update file, hot reload site
- Show before/after in browser

## Skill Definition

```
/design-token-demo

Flags:
  --verbose    Show "Claude is..." status updates throughout
  --record     Record GIF of the browser interactions
  --dry-run    Show what would happen without applying changes
```

## Case Study Page

Located at `/work/design-token-pipeline`

Sections:
1. The Problem — Design drift, manual handoff
2. The Solution — Automated pipeline with AI
3. Architecture Diagram — Visual of the flow
4. What Makes This Different — Drift detection + impact analysis
5. Try the Demo — Link to tokens/README.md
6. Technical Details — Stack and tools used

## Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| MCP Server | GLips community | URL-based, no desktop app needed |
| Token Format | W3C DTCG | Industry standard, Style Dictionary compatible |
| Transform | Style Dictionary | De facto standard, Tailwind @theme output |
| Drift Detection | Custom AST scan | Specific to this demo's needs |
| Contrast Check | Custom implementation | Simple, no external deps |

## Demo Tokens

For the demo, we'll change:
- `accent/default`: #e5e5e5 → #ff6b35 (orange accent)
- `section/md`: 88px → 120px (more breathing room)
- `size/base`: 18px → 20px (slightly larger body text)

These create visible before/after on the site.

## Dependencies

```json
{
  "devDependencies": {
    "style-dictionary": "^4.0.0",
    "@tokens-studio/sd-transforms": "^1.0.0"
  }
}
```

## Next Steps

1. Create Figma demo file via browser automation
2. Set up GLips Figma MCP in Claude Code
3. Build drift detection script
4. Build impact analysis script
5. Create Style Dictionary config
6. Build the skill orchestration
7. Create case study page
8. Write tokens/README.md
