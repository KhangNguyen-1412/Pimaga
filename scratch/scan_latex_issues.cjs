const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(walk(filePath));
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '..', 'src'));
console.log(`Scanning ${files.length} files...`);

// Check each file
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(path.join(__dirname, '..'), file);

  // Check 1: single backslash followed by control characters like \frac, \sum, \int, \pi, etc.
  // In source code text:
  // If source code has "\frac", it has \ followed by f.
  // If source code has "\\frac", it has \\ followed by f.
  const lines = content.split('\n');
  lines.forEach((line, lineNum) => {
    // Look for JSX text containing raw $...$
    // e.g. >...$...< or >...$\pi$...<
    const rawDollarInJsx = />[^<]*\$[^<]*</.exec(line);
    if (rawDollarInJsx && !line.includes('MathRenderer') && !line.includes('`$') && !line.includes('${')) {
      // Could be raw math in JSX
      console.log(`[RAW $ IN JSX] ${relPath}:${lineNum + 1}: ${line.trim()}`);
    }

    // Look for single backslash in string literals before LaTeX commands:
    // Regex for: quote (" or ' or `), followed by (not backslash)\frac, \sum, \sqrt, \prod, \int, \pi, \alpha, \beta, etc.
    const badEscape = /(["'`])(?:(?!(?:\1|\\\\)).)*?(?<!\\)\\(frac|sqrt|sum|prod|int|pi|alpha|beta|gamma|theta|lambda|sigma|omega|phi|dots|le|ge|neq|approx|pm|mp|times|div|cdot|binom|left|right|begin|end|text|vec|widehat|triangle)\b/g;
    let m;
    while ((m = badEscape.exec(line)) !== null) {
      // Ignore if line is an import, or regex definition
      if (!line.includes('RegExp') && !line.includes('/\\') && !line.includes('replace(') && !line.includes('//')) {
        console.log(`[SINGLE BACKSLASH IN STRING] ${relPath}:${lineNum + 1} (${m[2]}): ${line.trim()}`);
      }
    }
  });
}
