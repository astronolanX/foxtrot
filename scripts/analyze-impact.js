#!/usr/bin/env node

/**
 * Impact Analysis
 *
 * Analyzes the impact of token changes:
 * - WCAG contrast checks for color changes
 * - Layout impact for spacing changes
 * - Reflow warnings for typography changes
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

// Calculate relative luminance (WCAG 2.1)
function getLuminance(rgb) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check WCAG compliance
function checkWCAG(ratio, context = 'normal-text') {
  if (context === 'normal-text') return { pass: ratio >= 4.5, required: 4.5 };
  if (context === 'large-text') return { pass: ratio >= 3.0, required: 3.0 };
  if (context === 'ui-component') return { pass: ratio >= 3.0, required: 3.0 };
  return { pass: true, required: 0 }; // decorative
}

// Find all usages of a token in codebase
function findTokenUsages(tokenName, rootDir) {
  const usages = [];

  function scanFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes(`var(${tokenName})`) || line.includes(tokenName)) {
        // Determine context from surrounding CSS properties
        let context = 'unknown';
        if (line.includes('color:') || line.includes('fill:')) context = 'text';
        if (line.includes('background')) context = 'background';
        if (line.includes('border')) context = 'border';
        if (line.includes('padding') || line.includes('margin') || line.includes('gap')) context = 'spacing';

        usages.push({
          file: filePath.replace(rootDir + '/', ''),
          line: index + 1,
          context,
          code: line.trim().substring(0, 60),
        });
      }
    });
  }

  function scanDir(dir) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', '.astro', '.git'].includes(entry)) {
          scanDir(fullPath);
        }
      } else if (['.astro', '.css', '.ts', '.tsx'].includes(extname(entry))) {
        scanFile(fullPath);
      }
    }
  }

  scanDir(join(rootDir, 'src'));
  return usages;
}

// Get background color for a component (simplified heuristic)
function inferBackgroundColor(filePath, tokens) {
  const content = readFileSync(join(ROOT, filePath), 'utf-8');

  // Check for explicit background
  const bgMatch = content.match(/background(?:-color)?:\s*(var\(--[\w-]+\)|#[0-9a-fA-F]{6})/);
  if (bgMatch) {
    const value = bgMatch[1];
    if (value.startsWith('var(')) {
      const tokenName = value.match(/var\((--[\w-]+)\)/)[1];
      return tokens[tokenName];
    }
    return value;
  }

  // Default to surface-deep for dark theme
  return tokens['--color-surface-deep'] || '#0a0a0a';
}

// Parse current tokens from global.css
function parseCurrentTokens(cssPath) {
  const css = readFileSync(cssPath, 'utf-8');
  const tokens = {};

  const themeMatch = css.match(/@theme\s*\{([^}]+)\}/s);
  if (!themeMatch) return tokens;

  const propRegex = /--([\w-]+):\s*([^;]+);/g;
  let match;

  while ((match = propRegex.exec(themeMatch[1])) !== null) {
    tokens[`--${match[1]}`] = match[2].trim();
  }

  return tokens;
}

// Analyze impact of token changes
export function analyzeImpact(changes, rootDir = ROOT) {
  const cssPath = join(rootDir, 'src/styles/global.css');
  const currentTokens = parseCurrentTokens(cssPath);

  const results = {
    colorChanges: [],
    spacingChanges: [],
    typographyChanges: [],
  };

  for (const change of changes) {
    const { token, oldValue, newValue } = change;
    const usages = findTokenUsages(token, rootDir);

    // Categorize change
    if (token.includes('color') || token.includes('surface') || token.includes('text') || token.includes('accent')) {
      // Color change - check contrast
      const issues = [];
      const safe = [];

      for (const usage of usages) {
        if (usage.context === 'text') {
          const bgColor = inferBackgroundColor(usage.file, currentTokens);
          const ratio = getContrastRatio(newValue, bgColor);

          if (ratio) {
            const wcag = checkWCAG(ratio, 'normal-text');
            if (!wcag.pass) {
              issues.push({
                ...usage,
                contrast: ratio.toFixed(1),
                required: wcag.required,
                suggestion: 'Adjust color or background for sufficient contrast',
              });
            } else {
              safe.push({ ...usage, contrast: ratio.toFixed(1) });
            }
          }
        } else if (usage.context === 'background') {
          // Check text colors on this background
          const textColor = currentTokens['--color-text-primary'] || '#f5f5f5';
          const ratio = getContrastRatio(textColor, newValue);

          if (ratio) {
            const wcag = checkWCAG(ratio, 'normal-text');
            if (!wcag.pass) {
              issues.push({
                ...usage,
                contrast: ratio.toFixed(1),
                required: wcag.required,
                suggestion: 'Text on this background may be hard to read',
              });
            } else {
              safe.push({ ...usage, contrast: ratio.toFixed(1) });
            }
          }
        } else {
          // Decorative or border - generally safe
          safe.push({ ...usage, note: 'decorative' });
        }
      }

      results.colorChanges.push({
        token,
        oldValue,
        newValue,
        issues,
        safe,
      });
    } else if (token.includes('space') || token.includes('gutter') || token.includes('section')) {
      // Spacing change
      const oldNum = parseFloat(oldValue);
      const newNum = parseFloat(newValue);
      const percentChange = Math.abs((newNum - oldNum) / oldNum * 100);

      results.spacingChanges.push({
        token,
        oldValue,
        newValue,
        percentChange: percentChange.toFixed(0),
        usages,
        warning: percentChange > 50 ? 'Large spacing change - review layout' : null,
      });
    } else if (token.includes('font') || token.includes('size') || token.includes('line')) {
      // Typography change
      const oldNum = parseFloat(oldValue);
      const newNum = parseFloat(newValue);
      const percentChange = Math.abs((newNum - oldNum) / oldNum * 100);

      results.typographyChanges.push({
        token,
        oldValue,
        newValue,
        percentChange: percentChange.toFixed(0),
        usages,
        warning: percentChange > 20 ? 'Significant size change - check line lengths' : null,
      });
    }
  }

  return results;
}

// Format and print report
export function printImpactReport(results) {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│  \x1b[35m⚡ IMPACT ANALYSIS\x1b[0m                                         │');
  console.log('├─────────────────────────────────────────────────────────────┤');

  // Color changes
  for (const change of results.colorChanges) {
    console.log('│                                                             │');
    console.log(`│  TOKEN: \x1b[36m${change.token}\x1b[0m`);
    console.log(`│  CHANGE: ${change.oldValue} → \x1b[33m${change.newValue}\x1b[0m`);
    console.log('│                                                             │');

    if (change.issues.length > 0) {
      console.log(`│  \x1b[31m⚠️  WCAG FAILURES (${change.issues.length})\x1b[0m`);
      console.log('│                                                             │');
      for (const issue of change.issues) {
        console.log(`│  \x1b[90m${issue.file}:${issue.line}\x1b[0m`);
        console.log(`│  │ ${issue.context} usage`);
        console.log(`│  │ Contrast: ${issue.contrast}:1 (needs ${issue.required}:1)`);
        console.log(`│  └→ ${issue.suggestion}`);
        console.log('│                                                             │');
      }
    }

    if (change.safe.length > 0) {
      console.log(`│  \x1b[32m✓ SAFE USAGES (${change.safe.length})\x1b[0m`);
      for (const safe of change.safe.slice(0, 3)) {
        console.log(`│  • ${safe.file} — ${safe.note || `contrast ${safe.contrast}:1`}`);
      }
      if (change.safe.length > 3) {
        console.log(`│  • ... and ${change.safe.length - 3} more`);
      }
    }
  }

  // Spacing changes
  for (const change of results.spacingChanges) {
    console.log('│                                                             │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│                                                             │');
    console.log(`│  TOKEN: \x1b[36m${change.token}\x1b[0m`);
    console.log(`│  CHANGE: ${change.oldValue} → \x1b[33m${change.newValue}\x1b[0m (${change.percentChange}% change)`);
    console.log('│                                                             │');

    if (change.warning) {
      console.log(`│  \x1b[33m⚠️  ${change.warning}\x1b[0m`);
    } else {
      console.log(`│  \x1b[32m✓ LAYOUT CHECK PASSED\x1b[0m`);
    }
    console.log(`│  • ${change.usages.length} usages affected`);
  }

  // Typography changes
  for (const change of results.typographyChanges) {
    console.log('│                                                             │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│                                                             │');
    console.log(`│  TOKEN: \x1b[36m${change.token}\x1b[0m`);
    console.log(`│  CHANGE: ${change.oldValue} → \x1b[33m${change.newValue}\x1b[0m (${change.percentChange}% change)`);
    console.log('│                                                             │');

    if (change.warning) {
      console.log(`│  \x1b[33m⚠️  REFLOW WARNING\x1b[0m`);
      console.log(`│  • ${change.percentChange}% size change`);
      console.log(`│  └→ Review: container max-widths`);
    } else {
      console.log(`│  \x1b[32m✓ TYPOGRAPHY CHECK PASSED\x1b[0m`);
    }
    console.log(`│  • ${change.usages.length} usages affected`);
  }

  console.log('│                                                             │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  return results;
}

// Run if called directly with sample changes
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Sample changes for testing
  const sampleChanges = [
    { token: '--color-accent', oldValue: '#e5e5e5', newValue: '#ff6b35' },
    { token: '--space-section-md', oldValue: '5.5rem', newValue: '7.5rem' },
    { token: '--font-size-base', oldValue: '1.125rem', newValue: '1.25rem' },
  ];

  const results = analyzeImpact(sampleChanges);
  printImpactReport(results);
}
