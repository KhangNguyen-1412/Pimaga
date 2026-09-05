const katex = require('katex');

const MATH_REGEX = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\begin\{(?:equation|align|gather|alignat|multline)\*?\}[\s\S]*?\\end\{(?:equation|align|gather|alignat|multline)\*?\}|\\\([\s\S]*?\\\)|\$(?!\$)[^$\n]+?\$)/g;

const text = 'Cho \\(x > 0\\) và \\[\frac{a}{b} = 1\\] cùng với $y = 2$ và $$z = 3$$ và \\begin{align} a &= 1 \\\\ b &= 2 \\end{align}';
let m;
const matches = [];
while ((m = MATH_REGEX.exec(text)) !== null) {
  matches.push(m[0]);
}
console.log('Matches:', matches);

// Check stripping logic
matches.forEach(m => {
  let isDisplay = false;
  let tex = '';
  if (m.startsWith('$$') && m.endsWith('$$')) {
    isDisplay = true;
    tex = m.slice(2, -2).trim();
  } else if (m.startsWith('\\[') && m.endsWith('\\]')) {
    isDisplay = true;
    tex = m.slice(2, -2).trim();
  } else if (m.startsWith('\\(') && m.endsWith('\\)')) {
    isDisplay = false;
    tex = m.slice(2, -2).trim();
  } else if (m.startsWith('\\begin{')) {
    isDisplay = true;
    tex = m.trim();
  } else if (m.startsWith('$') && m.endsWith('$')) {
    isDisplay = false;
    tex = m.slice(1, -1).trim();
  }

  // If tex contains environments that require display mode
  if (/\\begin\{(?:align|gather|equation|multline)\*?\}/.test(tex)) {
    isDisplay = true;
  }

  const html = katex.renderToString(tex, { displayMode: isDisplay, throwOnError: false });
  console.log(`Rendered [${m.slice(0, 15)}...]: isDisplay=${isDisplay}, htmlLen=${html.length}`);
});
