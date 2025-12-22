#!/usr/bin/env node

/**
 * Token Transform Pipeline
 *
 * 1. Reads figma-source.json (MCP output)
 * 2. Converts to W3C DTCG format
 * 3. Runs Style Dictionary to generate Tailwind @theme CSS
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import StyleDictionary from 'style-dictionary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const TOKENS_DIR = join(ROOT, 'tokens');

// Convert Figma MCP output to Style Dictionary format
function convertToStyleDictionary(figmaTokens) {
  const tokens = {};

  for (const [collection, variables] of Object.entries(figmaTokens)) {
    // Skip meta information
    if (collection === '_meta') continue;

    for (const [name, data] of Object.entries(variables)) {
      // Handle nested paths (e.g., "surface/deep" -> color-surface-deep)
      const parts = name.split('/');
      const tokenName = `${collection}-${parts.join('-')}`;

      let value = data.value;

      // Convert numbers to dimensions for spacing/sizing
      if (typeof value === 'number') {
        if (collection === 'spacing' || collection === 'typography') {
          value = `${value}px`;
        }
      }

      // Flatten into top-level tokens with dashes
      tokens[tokenName] = {
        value: value,
        ...(data.description && { comment: data.description }),
      };
    }
  }

  return tokens;
}

// Custom format for Tailwind @theme
StyleDictionary.registerFormat({
  name: 'css/tailwind-theme',
  format: function({ dictionary }) {
    const tokens = dictionary.allTokens;
    let output = '@theme {\n';

    for (const token of tokens) {
      // Convert token path to CSS custom property name
      const name = token.path.join('-');
      output += `  --${name}: ${token.value};\n`;
    }

    output += '}\n';
    return output;
  },
});

// Main transform function
export async function transformTokens() {
  const figmaSourcePath = join(TOKENS_DIR, 'figma-source.json');
  const dtcgPath = join(TOKENS_DIR, 'tokens.json');
  const outputPath = join(TOKENS_DIR, 'generated-theme.css');

  // Check for Figma source
  if (!existsSync(figmaSourcePath)) {
    console.log('\x1b[33m⚠️  No figma-source.json found.\x1b[0m');
    console.log('   Run the demo to fetch tokens from Figma first.');
    return null;
  }

  console.log('\n\x1b[36m🔄 Transforming tokens...\x1b[0m\n');

  // Step 1: Read Figma source
  console.log('  1. Reading figma-source.json');
  const figmaTokens = JSON.parse(readFileSync(figmaSourcePath, 'utf-8'));

  // Step 2: Convert to Style Dictionary format
  console.log('  2. Converting to Style Dictionary format');
  const sdTokens = convertToStyleDictionary(figmaTokens);
  writeFileSync(dtcgPath, JSON.stringify(sdTokens, null, 2));
  console.log(`     → Written to tokens/tokens.json`);

  // Step 3: Run Style Dictionary
  console.log('  3. Running Style Dictionary');

  const sd = new StyleDictionary({
    tokens: sdTokens,
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'tokens/',
        files: [
          {
            destination: 'generated-theme.css',
            format: 'css/tailwind-theme',
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
  console.log(`     → Written to tokens/generated-theme.css`);

  // Step 4: Show output
  const output = readFileSync(outputPath, 'utf-8');
  console.log('\n\x1b[32m✓ Transform complete!\x1b[0m\n');
  console.log('Generated CSS:');
  console.log('─'.repeat(50));
  console.log(output);
  console.log('─'.repeat(50));

  return output;
}

// Generate diff between current and generated tokens
export function generateDiff(rootDir = ROOT) {
  const currentPath = join(rootDir, 'src/styles/global.css');
  const generatedPath = join(TOKENS_DIR, 'generated-theme.css');

  if (!existsSync(generatedPath)) {
    console.log('\x1b[33m⚠️  No generated-theme.css found. Run transform first.\x1b[0m');
    return null;
  }

  const current = readFileSync(currentPath, 'utf-8');
  const generated = readFileSync(generatedPath, 'utf-8');

  // Extract @theme blocks
  const currentTheme = current.match(/@theme\s*\{([^}]+)\}/s)?.[1] || '';
  const generatedTheme = generated.match(/@theme\s*\{([^}]+)\}/s)?.[1] || '';

  // Parse into maps
  const parseTheme = (str) => {
    const map = new Map();
    const regex = /--([\w-]+):\s*([^;]+);/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      map.set(`--${match[1]}`, match[2].trim());
    }
    return map;
  };

  const currentMap = parseTheme(currentTheme);
  const generatedMap = parseTheme(generatedTheme);

  // Find differences
  const changes = [];

  for (const [key, newValue] of generatedMap) {
    const oldValue = currentMap.get(key);
    if (oldValue !== newValue) {
      changes.push({
        token: key,
        oldValue: oldValue || '(new)',
        newValue,
        type: oldValue ? 'changed' : 'added',
      });
    }
  }

  for (const [key, oldValue] of currentMap) {
    if (!generatedMap.has(key)) {
      changes.push({
        token: key,
        oldValue,
        newValue: '(removed)',
        type: 'removed',
      });
    }
  }

  return changes;
}

// Print diff report
export function printDiffReport(changes) {
  if (!changes || changes.length === 0) {
    console.log('\n\x1b[32m✓ No changes detected. Tokens are in sync!\x1b[0m\n');
    return;
  }

  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│  \x1b[33m📝 TOKEN DIFF\x1b[0m                                              │');
  console.log('├─────────────────────────────────────────────────────────────┤');

  for (const change of changes) {
    console.log('│                                                             │');
    const icon = change.type === 'added' ? '\x1b[32m+' :
                 change.type === 'removed' ? '\x1b[31m-' : '\x1b[33m~';
    console.log(`│  ${icon} ${change.token}\x1b[0m`);

    if (change.type === 'changed') {
      console.log(`│    \x1b[31m- ${change.oldValue}\x1b[0m`);
      console.log(`│    \x1b[32m+ ${change.newValue}\x1b[0m`);
    } else if (change.type === 'added') {
      console.log(`│    \x1b[32m+ ${change.newValue}\x1b[0m`);
    } else {
      console.log(`│    \x1b[31m- ${change.oldValue}\x1b[0m`);
    }
  }

  console.log('│                                                             │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log(`│  ${changes.length} token(s) would change                                  │`);
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  return changes;
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  transformTokens().then(() => {
    const changes = generateDiff();
    printDiffReport(changes);
  });
}
