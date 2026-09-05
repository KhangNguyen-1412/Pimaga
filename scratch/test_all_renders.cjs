const fs = require('fs');
const path = require('path');
const katex = require('katex');

// Test katex render on all strings in constants/latexFormulas.js
const { LATEX_FORMULAS } = require('../src/constants/latexFormulas.js');
console.log(`Checking ${LATEX_FORMULAS.length} formulas in latexFormulas.js...`);
for (const f of LATEX_FORMULAS) {
  try {
    const html = katex.renderToString(f.preview, { displayMode: false, throwOnError: true });
  } catch (err) {
    console.error(`ERROR in latexFormulas [${f.id}] preview: "${f.preview}":`, err.message);
  }
  try {
    const html = katex.renderToString(f.code, { displayMode: false, throwOnError: true });
  } catch (err) {
    console.error(`ERROR in latexFormulas [${f.id}] code: "${f.code}":`, err.message);
  }
}

// Check MathRenderer parsing logic
console.log('Testing MathRenderer logic...');
const MATH_REGEX = /(\$\$[\s\S]*?\$\$|\$(?!\$)[^$\n]+?\$)/g;

// Check files for raw $\pi$ or $...$ in JSX text
function checkFileForRawLatexInJSX(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Check if line has $\pi$ or $\TeX$ or $...$ directly in JSX children
    const jsxTextMatches = line.match(/>([^<]*\$[^<]+)<|`([^`]*\$[^`]+)`/g);
    if (jsxTextMatches) {
      jsxTextMatches.forEach(m => {
        // filter out template strings like `${...}` or regex or MathRenderer or comments
        if (!m.includes('${') && !m.includes('MATH_') && !m.includes('//') && !line.includes('onClick=') && !line.includes('MathRenderer') && !line.includes('insertMath') && !line.includes('snippet')) {
          if (m.includes('$\\pi$') || m.includes('$\\TeX$') || m.includes('$\\') || m.includes('$P =')) {
            console.log(`[RAW LATEX IN JSX TEXT] ${path.basename(filePath)}:${i+1}: ${m.trim()}`);
          }
        }
      });
    }

    // Check for single backslash inside string literals: "\frac", "\pi", etc.
    // e.g. content="$$P = \frac{2L}{\pi D}$$"
    const singleSlashMatch = line.match(/(content|formula|insight)\s*=\s*["']([^"']*\\[a-zA-Z]+[^"']*)["']/);
    if (singleSlashMatch) {
      const str = singleSlashMatch[2];
      // In source code, does it have single \frac instead of \\frac?
      // Notice: if source has \\frac, str in JS regex on file source has \\frac
      if (str.match(/(?<!\\)\\(frac|sqrt|sum|prod|int|pi|alpha|beta|gamma|text|vec|binom)\b/)) {
        console.log(`[UNESCAPED BACKSLASH IN PROP] ${path.basename(filePath)}:${i+1}: ${line.trim()}`);
      }
    }
  });
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      scanDir(full);
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
      checkFileForRawLatexInJSX(full);
    }
  }
}

scanDir(path.join(__dirname, '..', 'src'));
console.log('Done scanning!');
