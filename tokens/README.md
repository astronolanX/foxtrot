# Design Token Pipeline Demo

Interactive demo showing Figma → Code token sync with drift detection and impact analysis.

## Prerequisites

1. **Claude Code** with Figma MCP configured
2. **Figma account** (free tier works)
3. **Node.js** 18+ installed

## Quick Start

```bash
# 1. Open Claude Code in the foxtrot project
cd /path/to/foxtrot
claude

# 2. Run the demo
/design-token-demo
```

## What Happens

The demo runs through 7 phases:

### Phase 1: Environment Check
Verifies Figma MCP is available and project structure is correct.

### Phase 2: Figma Read
- Opens Figma file in browser (visual)
- Reads all Variables via MCP
- Shows cursor highlighting each token
- Saves to `tokens/figma-source.json`

### Phase 3: Drift Detection
Scans the codebase for hardcoded values that should be tokens:

```
Found 4 hardcoded values:

src/components/Nav.astro:12
│ color: #a0a0a0
└→ Use: var(--color-text-secondary)

Parity score: 87%
```

### Phase 4: Transform
Converts Figma tokens to CSS via Style Dictionary:
- `figma-source.json` → `tokens.json` (W3C DTCG format)
- `tokens.json` → `generated-theme.css` (Tailwind @theme)

### Phase 5: Impact Analysis
Checks what breaks if changes are applied:
- WCAG contrast analysis for color changes
- Layout impact for spacing changes
- Reflow warnings for typography changes

```
TOKEN: --color-accent
CHANGE: #e5e5e5 → #ff6b35

⚠️  WCAG FAILURES (2)
src/components/Button.astro:15
│ Contrast: 2.8:1 (needs 4.5:1)
```

### Phase 6: PR Simulation
Shows what an automated PR would contain:
- Files changed
- Diff with before/after
- Impact summary
- Simulated Slack notification

### Phase 7: Apply (Optional)
Asks if you want to apply changes to `global.css`.

## Flags

```bash
/design-token-demo --verbose    # Show live status updates
/design-token-demo --dry-run    # Preview only, don't apply
/design-token-demo --record     # Record GIF of the demo
```

## Manual Scripts

Run individual phases manually:

```bash
# Drift detection only
npm run tokens:drift

# Transform tokens (requires figma-source.json)
npm run tokens:transform

# Impact analysis (requires tokens.json)
npm run tokens:impact
```

## Files

After running the demo:

```
tokens/
├── README.md                  # This file
├── figma-source.json          # Raw MCP output
├── tokens.json                # W3C DTCG format
├── generated-theme.css        # Tailwind @theme output
└── style-dictionary.config.js # Transform config
```

## Figma Setup

The demo expects a Figma file with Variables matching this structure:

| Collection | Variable | Example Value |
|------------|----------|---------------|
| Colors | surface/deep | #0a0a0a |
| Colors | surface/raised | #141414 |
| Colors | text/primary | #f5f5f5 |
| Colors | text/secondary | #a0a0a0 |
| Colors | accent/default | #e5e5e5 |
| Spacing | section/md | 88 |
| Spacing | gutter | 24 |
| Typography | size/base | 18 |
| Typography | size/xl | 28 |

## MCP Configuration

Add Figma MCP to your Claude Code config:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-context-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Get your Figma access token from: https://www.figma.com/developers/api#access-tokens

## Architecture

```
┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│    Figma     │────▶│  Claude Code  │────▶│   Codebase     │
│  Variables   │ MCP │  + Scripts    │     │  global.css    │
└──────────────┘     └───────────────┘     └────────────────┘
                            │
                            ├── Drift Detection
                            ├── Impact Analysis
                            └── Style Dictionary
```

## Why This Exists

Most token sync tools are dumb pipes. They move values without understanding consequences.

This demo shows a smarter approach:
- **Drift detection** finds debt before it compounds
- **Impact analysis** catches accessibility issues before shipping
- **Context-aware** knows text contrast matters, decorative glow doesn't

It's not just automation—it's automation with intelligence.

## Related

- [Case Study: Design Token Pipeline](/work/design-token-pipeline)
- [W3C Design Tokens Spec](https://design-tokens.github.io/community-group/format/)
- [Style Dictionary Docs](https://styledictionary.com/)
- [Figma MCP](https://github.com/GLips/Figma-Context-MCP)
