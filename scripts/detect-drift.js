#!/usr/bin/env node

/**
 * Design Drift Detection
 *
 * Scans codebase for hardcoded values that should be tokens.
 * Compares against token definitions in global.css.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Parse tokens from global.css @theme block
function parseTokensFromCSS(cssPath) {
  const css = readFileSync(cssPath, 'utf-8');
  const tokens = new Map();

  // Match @theme { ... } block
  const themeMatch = css.match(/@theme\s*\{([^}]+)\}/s);
  if (!themeMatch) return tokens;

  const themeBlock = themeMatch[1];

  // Extract CSS custom properties
  const propRegex = /--([\w-]+):\s*([^;]+);/g;
  let match;

  while ((match = propRegex.exec(themeBlock)) !== null) {
    const [, name, value] = match;
    const cleanValue = value.trim();

    // Store both directions: value → token name, token name → value
    tokens.set(cleanValue, `--${name}`);
    tokens.set(`--${name}`, cleanValue);
  }

  return tokens;
}

// Scan a file for hardcoded values
function scanFile(filePath, tokens) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  // Patterns to match
  const patterns = [
    { regex: /#[0-9a-fA-F]{6}\b/g, type: 'color' },
    { regex: /#[0-9a-fA-F]{3}\b/g, type: 'color' },
    { regex: /rgba?\([^)]+\)/g, type: 'color' },
    { regex: /\b\d+(\.\d+)?px\b/g, type: 'dimension' },
    { regex: /\b\d+(\.\d+)?rem\b/g, type: 'dimension' },
  ];

  lines.forEach((line, index) => {
    // Skip lines that already use var()
    if (line.includes('var(--')) return;

    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) return;

    // Skip lines in @theme block (these ARE the token definitions)
    if (line.includes('@theme')) return;

    for (const { regex, type } of patterns) {
      let match;
      regex.lastIndex = 0;

      while ((match = regex.exec(line)) !== null) {
        const value = match[0];
        const tokenName = tokens.get(value);

        if (tokenName) {
          issues.push({
            file: filePath,
            line: index + 1,
            column: match.index + 1,
            value,
            tokenName,
            type,
            context: line.trim().substring(0, 60),
          });
        }
      }
    }
  });

  return issues;
}

// Recursively scan directory
function scanDirectory(dir, tokens, extensions = ['.astro', '.css', '.ts', '.tsx', '.js', '.jsx']) {
  const issues = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    // Skip directories we don't want to scan
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.astro', '.git', 'tokens'].includes(entry)) continue;
      issues.push(...scanDirectory(fullPath, tokens, extensions));
    } else if (extensions.includes(extname(entry))) {
      issues.push(...scanFile(fullPath, tokens));
    }
  }

  return issues;
}

// Count total token usages (for parity score)
function countTokenUsages(dir) {
  let count = 0;
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.astro', '.git', 'tokens'].includes(entry)) continue;
      count += countTokenUsages(fullPath);
    } else if (['.astro', '.css'].includes(extname(entry))) {
      const content = readFileSync(fullPath, 'utf-8');
      const matches = content.match(/var\(--[\w-]+\)/g);
      if (matches) count += matches.length;
    }
  }

  return count;
}

// Format output
function formatReport(issues, tokenUsages) {
  const totalUsages = tokenUsages + issues.length;
  const parityScore = totalUsages > 0
    ? Math.round((tokenUsages / totalUsages) * 100)
    : 100;

  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│  \x1b[36m🔍 DESIGN DRIFT REPORT\x1b[0m                                     │');
  console.log('├─────────────────────────────────────────────────────────────┤');

  if (issues.length === 0) {
    console.log('│                                                             │');
    console.log('│  \x1b[32m✓ No drift detected!\x1b[0m                                       │');
    console.log('│  All values are properly tokenized.                        │');
  } else {
    console.log('│                                                             │');
    console.log(`│  HARDCODED VALUES FOUND: \x1b[33m${issues.length}\x1b[0m                                  │`);
    console.log('│                                                             │');

    for (const issue of issues) {
      const relativePath = issue.file.replace(ROOT + '/', '');
      console.log(`│  \x1b[90m${relativePath}:${issue.line}\x1b[0m`);
      console.log(`│  │ ${issue.value}`);
      console.log(`│  └→ Use: \x1b[32mvar(${issue.tokenName})\x1b[0m`);
      console.log('│                                                             │');
    }
  }

  console.log('├─────────────────────────────────────────────────────────────┤');

  const scoreColor = parityScore >= 90 ? '\x1b[32m' : parityScore >= 70 ? '\x1b[33m' : '\x1b[31m';
  console.log(`│  PARITY SCORE: ${scoreColor}${parityScore}%\x1b[0m                                          │`);
  console.log(`│  ${tokenUsages} token usages found, ${issues.length} should be converted              │`);
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  return { issues, parityScore, tokenUsages, driftCount: issues.length };
}

// Export for use as module
export function detectDrift(rootDir = ROOT) {
  const cssPath = join(rootDir, 'src/styles/global.css');
  const tokens = parseTokensFromCSS(cssPath);
  const srcDir = join(rootDir, 'src');

  const issues = scanDirectory(srcDir, tokens);
  const tokenUsages = countTokenUsages(srcDir);

  return formatReport(issues, tokenUsages);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  detectDrift();
}
