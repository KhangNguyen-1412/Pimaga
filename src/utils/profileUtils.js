import katex from 'katex';

function safeRenderKatexToString(tex, options = {}) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('No character metrics')) {
      return;
    }
    originalWarn.apply(console, args);
  };
  try {
    return katex.renderToString(tex, {
      ...options,
      throwOnError: false,
      strict: false,
    });
  } finally {
    console.warn = originalWarn;
  }
}

/**
 * Tiện ích hồ sơ học thuật, tính toán thống kê và xuất tài liệu toán học
 */

export const ACADEMIC_RANKS = [
  {
    tier: 1,
    title: 'Tập sự Toán học',
    minSolved: 0,
    maxSolved: 4,
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    iconType: 'seedling',
    desc: 'Khởi đầu hành trình khám phá các bài toán trên Tạp chí Pi.',
  },
  {
    tier: 2,
    title: 'Tín đồ Pi',
    minSolved: 5,
    maxSolved: 14,
    badgeColor: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300 border-cerulean/30 dark:border-blue-900',
    iconType: 'book',
    desc: 'Đã giải thành công nhiều bài toán và nắm vững phương pháp tư duy.',
  },
  {
    tier: 3,
    title: 'Kiện tướng Toán học',
    minSolved: 15,
    maxSolved: 29,
    badgeColor: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300 border-jasper/30 dark:border-rose-900',
    iconType: 'star',
    desc: 'Chinh phục được nhiều bài toán hóc búa, tư duy sắc bén.',
  },
  {
    tier: 4,
    title: 'Đại kiện tướng Pi',
    minSolved: 30,
    maxSolved: Infinity,
    badgeColor: 'bg-blue-100 text-cerulean dark:bg-blue-950/80 dark:text-blue-200 border border-cerulean dark:border-blue-500',
    iconType: 'trophy',
    desc: 'Bậc thầy giải đề Pi với kho bài giải đồ sộ và xuất sắc.',
  },
];

export const MATH_TOPIC_OPTIONS = [
  'Đại số & Đa thức',
  'Hình học phẳng',
  'Số học & Lý thuyết số',
  'Tổ hợp & Đồ thị',
  'Bất đẳng thức & Cực trị',
  'Giải tích & Dãy số',
  'Hình học không gian',
  'Phương trình hàm',
  'Toán Olympic',
  'Toán Ứng dụng & Tin học',
];

export const ROLE_OPTIONS = [
  'Học sinh THCS',
  'Học sinh THPT Chuyên',
  'Học sinh THPT',
  'Sinh viên Toán / CNTT',
  'Sinh viên Đại học',
  'Giáo viên Toán',
  'Nhà nghiên cứu / Giảng viên',
  'Người yêu toán tự do',
];

/**
 * Xác định cấp bậc học thuật dựa trên số bài đã giải
 */
export function getAcademicRank(solvedCount = 0) {
  const count = Math.max(0, Number(solvedCount) || 0);
  for (let i = ACADEMIC_RANKS.length - 1; i >= 0; i--) {
    const rank = ACADEMIC_RANKS[i];
    if (count >= rank.minSolved) {
      const nextRank = ACADEMIC_RANKS[i + 1] || null;
      const progressPercent = nextRank
        ? Math.min(100, Math.round(((count - rank.minSolved) / (nextRank.minSolved - rank.minSolved)) * 100))
        : 100;
      const neededForNext = nextRank ? Math.max(0, nextRank.minSolved - count) : 0;

      return {
        ...rank,
        currentCount: count,
        nextRank,
        progressPercent,
        neededForNext,
      };
    }
  }
  return {
    ...ACADEMIC_RANKS[0],
    currentCount: count,
    nextRank: ACADEMIC_RANKS[1],
    progressPercent: 0,
    neededForNext: ACADEMIC_RANKS[1].minSolved,
  };
}

/**
 * Tính toán thống kê theo độ khó
 */
export function calculateDifficultyStats(problems = [], userSolutionsMap = {}) {
  const groups = {
    easy: { name: 'Cơ bản (1-2★)', count: 0, total: 0, percent: 0 },
    medium: { name: 'Tiêu chuẩn (3★)', count: 0, total: 0, percent: 0 },
    hard: { name: 'Nâng cao (4-5★)', count: 0, total: 0, percent: 0 },
  };

  problems.forEach((p) => {
    const lvl = Number(p.difficulty) || 1;
    const isSolved = Boolean(userSolutionsMap[p.id]);

    let key = 'easy';
    if (lvl === 3) key = 'medium';
    else if (lvl >= 4) key = 'hard';

    groups[key].total += 1;
    if (isSolved) groups[key].count += 1;
  });

  Object.values(groups).forEach((g) => {
    g.percent = g.total > 0 ? Math.round((g.count / g.total) * 100) : 0;
  });

  return groups;
}

/**
 * Tính toán thống kê thế mạnh theo chuyên mục
 */
export function calculateCategoryStats(problems = [], userSolutionsMap = {}, categories = []) {
  const catMap = {};
  categories.forEach((cat) => {
    catMap[cat.id] = {
      id: cat.id,
      name: cat.name,
      total: 0,
      solved: 0,
      percent: 0,
    };
  });

  problems.forEach((p) => {
    if (p.categoryId && catMap[p.categoryId]) {
      catMap[p.categoryId].total += 1;
      if (userSolutionsMap[p.id]) {
        catMap[p.categoryId].solved += 1;
      }
    }
  });

  const list = Object.values(catMap).map((item) => ({
    ...item,
    percent: item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0,
  }));

  // Sắp xếp chuyên mục giải nhiều nhất lên đầu
  list.sort((a, b) => b.solved - a.solved || b.total - a.total);
  return list;
}

export const TIKZ_REGEX = /(\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}|```(?:tikz|latex)\s*[\s\S]*?\\begin\{tikzpicture\}[\s\S]*?```)/gi;

/**
 * Chuẩn hóa mã TikZ để gửi đến Kroki API nếu cần
 */
export function wrapTikzDocument(rawCode = '') {
  let cleanCode = String(rawCode).trim();
  cleanCode = cleanCode.replace(/^```(?:tikz|latex)?\s*/i, '').replace(/\s*```$/, '').trim();
  if (cleanCode.includes('\\documentclass')) {
    return cleanCode;
  }
  return `\\documentclass[tikz,border=6pt]{standalone}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usepackage{tkz-euclide}
\\usetikzlibrary{calc,angles,quotes,intersections,arrows.meta,through,backgrounds}
\\begin{document}
${cleanCode}
\\end{document}`;
}

/**
 * Tạo chuỗi hash đơn giản từ mã TikZ để tra cứu bộ nhớ đệm
 */
export function simpleHash(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Lấy SVG của mã TikZ từ localStorage hoặc gọi Kroki API
 */
export async function fetchTikzSvg(code = '') {
  const cleanCode = String(code).trim();
  if (!cleanCode) return '';
  const hash = simpleHash(cleanCode);
  const cacheKey = `pimaga_tikz_${hash}`;

  // 1. Kiểm tra trong localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached && cached.includes('<svg')) {
        return cached;
      }
    } catch (_) {}
  }

  // 2. Gọi Kroki API
  try {
    const fullLatex = wrapTikzDocument(cleanCode);
    const res = await fetch('https://kroki.io/tikz/svg', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
      body: fullLatex,
    });
    if (res.ok) {
      const svg = await res.text();
      if (svg && svg.includes('<svg')) {
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, svg);
          } catch (_) {}
        }
        return svg;
      }
    }
  } catch (err) {
    console.warn('Lỗi kết xuất TikZ SVG cho tài liệu xuất:', err);
  }

  return '';
}

/**
 * Tải trước toàn bộ hình vẽ TikZ trong danh sách bài giải
 */
export async function prefetchTikzSvgs(solvedItems = []) {
  const tikzCodes = new Set();
  solvedItems.forEach((item) => {
    const p = item.problem || {};
    const content = p.content || '';
    const sol = item.solution || '';

    const cMatches = content.match(TIKZ_REGEX) || [];
    cMatches.forEach((m) => tikzCodes.add(m));

    const sMatches = sol.match(TIKZ_REGEX) || [];
    sMatches.forEach((m) => tikzCodes.add(m));
  });

  const svgMap = new Map();
  await Promise.all(
    Array.from(tikzCodes).map(async (code) => {
      const svg = await fetchTikzSvg(code);
      if (svg) svgMap.set(code, svg);
    })
  );

  return svgMap;
}

/**
 * Chuyển đổi chuỗi SVG sang PNG Data URL để tương thích tuyệt đối với Microsoft Word
 */
export function svgToPngDataUrl(svgString = '') {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
      return;
    }
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const width = img.width || 600;
          const height = img.height || 400;
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(1000, Math.max(320, width));
          canvas.height = Math.round(canvas.width * (height / width));
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(pngUrl);
        } catch {
          URL.revokeObjectURL(url);
          resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
      };
      img.src = url;
    } catch {
      resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
    }
  });
}

/**
 * Chuyển Map chứa SVG sang Map chứa PNG Data URL cho Word
 */
export async function convertSvgMapToPngMap(svgMap = new Map()) {
  const imgMap = new Map();
  await Promise.all(
    Array.from(svgMap.entries()).map(async ([code, svg]) => {
      try {
        const pngUrl = await svgToPngDataUrl(svg);
        imgMap.set(code, pngUrl);
      } catch {
        imgMap.set(code, `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
      }
    })
  );
  return imgMap;
}

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render nội dung Markdown với KaTeX, hình vẽ TikZ (SVG) và hình ảnh Markdown cho bản in PDF
 */
export function renderMarkdownWithKatex(text = '', svgMap = new Map()) {
  if (!text) return '';

  // 1. Tách và lưu trữ toàn bộ các khối mã LaTeX TikZ trước tiên
  const tikzStore = [];
  let processed = text.replace(TIKZ_REGEX, (match) => {
    const idx = tikzStore.length;
    tikzStore.push(match);
    return `\uE002TIKZ_${idx}\uE003`;
  });

  // 2. Tách và lưu trữ hình ảnh Markdown ![alt](url)
  const imgStore = [];
  processed = processed.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
    const idx = imgStore.length;
    imgStore.push({ alt: alt.trim(), src: src.trim() });
    return `\uE004IMG_${idx}\uE005`;
  });

  // 3. Render công thức Toán KaTeX
  // Display math $$...$$
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return `<div class="katex-display-box">${safeRenderKatexToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="katex-display-box">\\[${escapeHtml(math)}\\]</div>`;
    }
  });

  // Inline math $...$
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    try {
      return safeRenderKatexToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `\\(${escapeHtml(math)}\\)`;
    }
  });

  // 4. Định dạng Markdown cơ bản (đậm, nghiêng, code inline, xuống dòng)
  processed = processed
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+?)`/g, '<code style="background:#f3f4f6;padding:2px 5px;border-radius:4px;font-family:monospace;font-size:0.9em;">$1</code>')
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  // 5. Khôi phục hình ảnh Markdown ![alt](url)
  processed = processed.replace(/\uE004IMG_(\d+)\uE005/g, (_, idxStr) => {
    const item = imgStore[parseInt(idxStr, 10)];
    if (!item) return '';
    return `<figure class="diagram-figure" style="text-align: center; margin: 16px auto; page-break-inside: avoid;">
      <img src="${item.src}" alt="${escapeHtml(item.alt)}" style="max-width: 100%; max-height: 420px; border-radius: 8px; border: 1px solid #e5e7eb; display: block; margin: 0 auto;" />
      ${item.alt ? `<figcaption style="font-size: 12px; font-style: italic; color: #6b7280; margin-top: 6px; text-align: center;">Hình vẽ: ${escapeHtml(item.alt)}</figcaption>` : ''}
    </figure>`;
  });

  // 6. Khôi phục khối hình vẽ TikZ
  processed = processed.replace(/\uE002TIKZ_(\d+)\uE003/g, (_, idxStr) => {
    const rawTikz = tikzStore[parseInt(idxStr, 10)];
    if (!rawTikz) return '';
    const svg = svgMap.get(rawTikz);
    if (svg) {
      return `<figure class="diagram-figure" style="text-align: center; margin: 18px auto; page-break-inside: avoid;">
        <div class="tikz-svg-container" style="max-width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
          ${svg}
        </div>
        <figcaption style="font-size: 12px; font-style: italic; color: #4b5563; margin-top: 6px; text-align: center;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #2A52BE; margin-right: 5px; vertical-align: middle;"></span>
          <strong>Hình vẽ hình học (LaTeX TikZ)</strong>
        </figcaption>
      </figure>`;
    }

    const clean = rawTikz.replace(/^```(?:tikz|latex)?\s*/i, '').replace(/\s*```$/, '').trim();
    return `<div style="border: 1px dashed #2A52BE; background: #F0F4FF; padding: 10px 14px; border-radius: 8px; margin: 12px 0; font-family: monospace; font-size: 12px;">
      <p style="margin: 0 0 6px 0; font-weight: bold; color: #2A52BE;">📐 [Hình vẽ hình học: LaTeX TikZ]</p>
      <pre style="margin: 0; font-size: 11px; white-space: pre-wrap; color: #374151;">${escapeHtml(clean)}</pre>
    </div>`;
  });

  return `<p>${processed}</p>`;
}

/**
 * Render nội dung Markdown sang HTML tối ưu cho Microsoft Word (.docx)
 */
export function renderMarkdownForWord(text = '', imgMap = new Map()) {
  if (!text) return '';

  // 1. Tách và lưu trữ khối TikZ
  const tikzStore = [];
  let processed = text.replace(TIKZ_REGEX, (match) => {
    const idx = tikzStore.length;
    tikzStore.push(match);
    return `\uE002TIKZ_${idx}\uE003`;
  });

  // 2. Tách và lưu trữ hình ảnh Markdown ![alt](url)
  const imgStore = [];
  processed = processed.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
    const idx = imgStore.length;
    imgStore.push({ alt: alt.trim(), src: src.trim() });
    return `\uE004IMG_${idx}\uE005`;
  });

  // 3. Escape HTML trên phần text còn lại
  processed = escapeHtml(processed);

  // 4. Công thức Display math $$...$$
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    return `<div style="text-align: center; margin: 8pt 0; font-family: 'Cambria Math', 'Times New Roman', serif; font-style: italic; color: #1E3A8A;">${math}</div>`;
  });

  // 5. Công thức Inline math $...$
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    return `<span style="font-family: 'Cambria Math', 'Times New Roman', serif; font-style: italic;">${math}</span>`;
  });

  // 6. Formatting
  processed = processed
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n+/g, '</p><p style="margin: 4pt 0 6pt 0;">')
    .replace(/\n/g, '<br/>');

  // 7. Khôi phục hình ảnh Markdown ![alt](url) cho Word
  processed = processed.replace(/\uE004IMG_(\d+)\uE005/g, (_, idxStr) => {
    const item = imgStore[parseInt(idxStr, 10)];
    if (!item) return '';
    return `<div align="center" style="text-align: center; margin: 12pt 0; page-break-inside: avoid;">
      <img src="${item.src}" alt="${escapeHtml(item.alt)}" style="max-width: 420pt; max-height: 320pt; height: auto;" />
      ${item.alt ? `<p style="margin: 4pt 0 0 0; font-family: 'Times New Roman', serif; font-size: 9.5pt; font-style: italic; color: #4B5563;">Hình vẽ: ${escapeHtml(item.alt)}</p>` : ''}
    </div>`;
  });

  // 8. Khôi phục khối hình vẽ TikZ cho Word
  processed = processed.replace(/\uE002TIKZ_(\d+)\uE003/g, (_, idxStr) => {
    const rawTikz = tikzStore[parseInt(idxStr, 10)];
    if (!rawTikz) return '';
    const imgDataUrl = imgMap.get(rawTikz);
    if (imgDataUrl) {
      return `<div align="center" style="text-align: center; margin: 12pt 0; page-break-inside: avoid;">
        <img src="${imgDataUrl}" alt="Hình vẽ hình học TikZ" style="max-width: 420pt; max-height: 320pt; height: auto;" />
        <p style="margin: 4pt 0 0 0; font-family: 'Times New Roman', serif; font-size: 9.5pt; font-style: italic; color: #2A52BE; font-weight: bold;">
          Hình vẽ hình học (LaTeX TikZ)
        </p>
      </div>`;
    }

    const clean = rawTikz.replace(/^```(?:tikz|latex)?\s*/i, '').replace(/\s*```$/, '').trim();
    return `<div style="border: 1pt dashed #2A52BE; background-color: #F0F4FF; padding: 8pt 10pt; margin: 8pt 0;">
      <p style="margin: 0 0 4pt 0; font-size: 9.5pt; font-weight: bold; color: #2A52BE;">[Hình vẽ hình học: LaTeX TikZ]</p>
      <pre style="margin: 0; font-size: 9pt; font-family: 'Consolas', monospace; color: #374151;">${escapeHtml(clean)}</pre>
    </div>`;
  });

  return `<p style="margin: 0 0 6pt 0;">${processed}</p>`;
}

/**
 * Sinh file mã nguồn LaTeX (.tex) hoàn chỉnh chứa tất cả bài giải của người dùng
 */
export function generateSolutionsLatex(user = {}, solvedItems = [], scopeName = 'Toàn tập bài giải') {
  const authorName = user.displayName || user.email || 'Người dùng Pimaga';
  const now = new Date().toLocaleDateString('vi-VN');

  const sections = solvedItems.map((item, idx) => {
    const p = item.problem || {};
    const sol = item.solution || '';
    const code = p.code || `Bài ${idx + 1}`;
    const issue = item.issueName || 'Kỳ báo Pi';
    const category = item.categoryName || 'Chuyên mục Toán';

    return `
% -------------------------------------------------------------
% Bài toán ${code}
% -------------------------------------------------------------
\\section*{${escapeLatexText(code)} - ${escapeLatexText(category)} (${escapeLatexText(issue)})}
\\addcontentsline{toc}{section}{${escapeLatexText(code)} - ${escapeLatexText(category)}}

\\subsection*{Đề bài}
${cleanLatexMath(p.content || '')}

\\subsection*{Bài làm / Lời giải}
${cleanLatexMath(sol)}

\\vspace{0.8cm}
\\hrule
\\vspace{0.8cm}
`;
  }).join('\n');

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[vietnamese]{babel}
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
\\usepackage{geometry}
\\usepackage{tikz}
\\usepackage{tkz-euclide}
\\usetikzlibrary{calc,angles,quotes,intersections}
\\usepackage{hyperref}
\\usepackage{fancyhdr}

\\geometry{a4paper, margin=2cm}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\small \\textsf{Tạp Chí Pi - ${escapeLatexText(scopeName)}}}
\\fancyhead[R]{\\small \\textsf{${escapeLatexText(authorName)}}}
\\fancyfoot[C]{\\thepage}

\\title{\\Huge \\textbf{Tập Bài Giải Toán Tạp Chí Pi}\\\\
\\large \\textsf{${escapeLatexText(scopeName)} - Pimaga}}
\\author{\\textbf{${escapeLatexText(authorName)}}}
\\date{Xuất ngày: ${now}}

\\begin{document}

\\maketitle
\\tableofcontents
\\newpage

${sections}

\\end{document}
`;
}

/**
 * Sinh file Markdown (.md) chứa tất cả bài giải của người dùng
 */
export function generateSolutionsMarkdown(user = {}, solvedItems = [], scopeName = 'Toàn tập bài giải') {
  const authorName = user.displayName || user.email || 'Người dùng Pimaga';
  const now = new Date().toLocaleDateString('vi-VN');

  let md = `# Tập Bài Giải Toán Tạp Chí Pi\n\n`;
  md += `**Tập / Số phát hành:** ${scopeName}  \n`;
  md += `**Tác giả:** ${authorName}  \n`;
  md += `**Ngày xuất:** ${now}  \n`;
  md += `**Tổng số bài đã giải:** ${solvedItems.length} bài  \n\n`;
  md += `---\n\n`;

  solvedItems.forEach((item, idx) => {
    const p = item.problem || {};
    const sol = item.solution || '';
    const code = p.code || `Bài ${idx + 1}`;
    const issue = item.issueName || 'Kỳ báo Pi';
    const category = item.categoryName || 'Chuyên mục Toán';

    md += `## ${idx + 1}. [${code}] ${category} (${issue})\n\n`;
    md += `### 📌 Đề bài\n\n${p.content || '*Chưa có nội dung đề bài*'}\n\n`;
    md += `### 💡 Bài làm / Lời giải của tôi\n\n${sol || '*Chưa có nội dung lời giải*'}\n\n`;
    md += `---\n\n`;
  });

  return md;
}

/**
 * Sinh tài liệu Word (HTML format tương thích MS Word, Google Docs)
 */
export function generateSolutionsDocxHtml(user = {}, solvedItems = [], scopeName = 'Toàn tập bài giải', imgMap = new Map()) {
  const authorName = user.displayName || user.email || 'Người dùng Pimaga';
  const now = new Date().toLocaleDateString('vi-VN');

  const problemSections = solvedItems.map((item, idx) => {
    const p = item.problem || {};
    const sol = item.solution || '';
    const code = p.code || `Bài ${idx + 1}`;
    const issue = item.issueName || 'Kỳ báo Pi';
    const category = item.categoryName || 'Chuyên mục Toán';

    const formattedContent = renderMarkdownForWord(p.content || '', imgMap);
    const formattedSol = renderMarkdownForWord(sol || '', imgMap);

    return `
      <div style="margin-bottom: 24pt; page-break-inside: avoid;">
        <div style="border-bottom: 2pt solid #2A52BE; padding-bottom: 4pt; margin-bottom: 10pt;">
          <h2 style="margin: 0; font-family: 'Times New Roman', serif; font-size: 14pt; color: #2A52BE;">
            ${idx + 1}. [${escapeHtml(code)}] ${escapeHtml(category)} &mdash; <span style="font-weight: normal; font-size: 11pt; color: #4B5563;">${escapeHtml(issue)}</span>
          </h2>
        </div>

        <div style="background-color: #F8FAFC; border-left: 3.5pt solid #2A52BE; padding: 10pt 12pt; margin-bottom: 10pt;">
          <p style="margin: 0 0 4pt 0; font-family: 'Times New Roman', serif; font-weight: bold; font-size: 11pt; color: #2A52BE;">
            ĐỀ BÀI:
          </p>
          <div style="font-family: 'Times New Roman', 'Cambria Math', serif; font-size: 11pt; line-height: 1.5; color: #111827;">
            ${formattedContent}
          </div>
        </div>

        <div style="background-color: #FFFFFF; border-left: 3.5pt solid #D73B3E; padding: 10pt 12pt; margin-bottom: 10pt; border-top: 1pt solid #E5E7EB; border-right: 1pt solid #E5E7EB; border-bottom: 1pt solid #E5E7EB;">
          <p style="margin: 0 0 4pt 0; font-family: 'Times New Roman', serif; font-weight: bold; font-size: 11pt; color: #D73B3E;">
            BÀI LÀM / LỜI GIẢI CỦA TÔI:
          </p>
          <div style="font-family: 'Times New Roman', 'Cambria Math', serif; font-size: 11pt; line-height: 1.5; color: #111827;">
            ${formattedSol}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Pimaga - Tập Bài Giải ${escapeHtml(scopeName)}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm 20mm 20mm 20mm;
          mso-header-margin: 36.0pt;
          mso-footer-margin: 36.0pt;
        }
        body {
          font-family: 'Times New Roman', 'Cambria Math', serif;
          font-size: 12pt;
          color: #111827;
          line-height: 1.5;
        }
        h1 {
          font-family: 'Times New Roman', serif;
          font-size: 22pt;
          color: #2A52BE;
          text-align: center;
          margin-bottom: 4pt;
        }
        .meta-table {
          width: 100%;
          border-collapse: collapse;
          margin: 12pt 0 20pt 0;
          border-top: 1.5pt solid #E5E7EB;
          border-bottom: 1.5pt solid #E5E7EB;
        }
        .meta-table td {
          padding: 6pt 4pt;
          font-size: 10.5pt;
          color: #4B5563;
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; margin-bottom: 16pt;">
        <p style="margin: 0 0 4pt 0; font-size: 10.5pt; text-transform: uppercase; letter-spacing: 2pt; color: #D73B3E; font-weight: bold;">
          Tạp Chí Pi &mdash; Diễn Đàn Toán Học &amp; Tuổi Trẻ
        </p>
        <h1>TẬP BÀI GIẢI TOÁN TẠP CHÍ PI</h1>
        <p style="margin: 4pt 0 0 0; font-size: 12pt; font-style: italic; color: #4B5563;">
          ${escapeHtml(scopeName)}
        </p>
      </div>

      <table class="meta-table">
        <tr>
          <td><strong>Người giải:</strong> ${escapeHtml(authorName)}</td>
          <td style="text-align: right;"><strong>Ngày xuất:</strong> ${now}</td>
        </tr>
        <tr>
          <td><strong>Phạm vi:</strong> ${escapeHtml(scopeName)}</td>
          <td style="text-align: right;"><strong>Tổng số bài:</strong> ${solvedItems.length} bài đã giải</td>
        </tr>
      </table>

      <div>
        ${problemSections}
      </div>

      <div style="margin-top: 30pt; text-align: center; font-size: 10pt; color: #9CA3AF; border-top: 1pt solid #E5E7EB; padding-top: 10pt;">
        Tài liệu được kết xuất từ Pimaga &mdash; Hệ thống đề bài &amp; lời giải Tạp chí Pi
      </div>
    </body>
    </html>
  `;
}

/**
 * Thực hiện tải file Word (.docx)
 */
export async function exportSolutionsDocx(user = {}, solvedItems = [], scopeName = 'Toàn tập bài giải') {
  // Pre-fetch toàn bộ hình vẽ TikZ và chuyển sang PNG Data URL cho Word
  const svgMap = await prefetchTikzSvgs(solvedItems);
  const imgMap = await convertSvgMapToPngMap(svgMap);
  const content = generateSolutionsDocxHtml(user, solvedItems, scopeName, imgMap);
  const safeScope = scopeName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  downloadFile(content, `pimaga_bai_giai_${safeScope}_${Date.now()}.docx`, 'application/vnd.ms-word;charset=utf-8');
}

/**
 * Sinh HTML in ấn / xem trước chuẩn KaTeX để lưu PDF
 */
export function generateSolutionsPrintableHtml(user = {}, solvedItems = [], scopeName = 'Toàn tập bài giải', svgMap = new Map()) {
  const authorName = user.displayName || user.email || 'Người dùng Pimaga';
  const now = new Date().toLocaleDateString('vi-VN');

  const problemSections = solvedItems.map((item, idx) => {
    const p = item.problem || {};
    const sol = item.solution || '';
    const code = p.code || `Bài ${idx + 1}`;
    const issue = item.issueName || 'Kỳ báo Pi';
    const category = item.categoryName || 'Chuyên mục Toán';

    let renderedContent = '';
    let renderedSol = '';
    try {
      renderedContent = renderMarkdownWithKatex(p.content || '', svgMap);
    } catch {
      renderedContent = `<p>${escapeHtml(p.content || '')}</p>`;
    }
    try {
      renderedSol = renderMarkdownWithKatex(sol || '', svgMap);
    } catch {
      renderedSol = `<p>${escapeHtml(sol || '')}</p>`;
    }

    return `
      <section class="problem-card">
        <header class="problem-header">
          <div class="problem-badge">
            <span class="badge-code">${idx + 1}. ${escapeHtml(code)}</span>
            <span class="badge-category">${escapeHtml(category)}</span>
          </div>
          <span class="badge-issue">${escapeHtml(issue)}</span>
        </header>

        <div class="box problem-box">
          <div class="box-title">Đề Bài:</div>
          <div class="box-content">${renderedContent}</div>
        </div>

        <div class="box solution-box">
          <div class="box-title">Bài Làm / Lời Giải:</div>
          <div class="box-content">${renderedSol}</div>
        </div>
      </section>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Pimaga - Tập Bài Giải ${escapeHtml(scopeName)} - ${escapeHtml(authorName)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Playfair+Display:ital,wght@0,600..900;1,600..900&display=swap');

    @page {
      size: A4;
      margin: 18mm 18mm 18mm 18mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Newsreader', serif;
      font-size: 15px;
      line-height: 1.6;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: #2A52BE;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      font-family: system-ui, -apple-system, sans-serif;
    }

    .toolbar-title {
      font-size: 14px;
      font-weight: 600;
    }

    .toolbar-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 7px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.2s;
    }

    .btn-print {
      background: #D73B3E;
      color: #ffffff;
    }
    .btn-print:hover {
      opacity: 0.9;
    }

    .btn-close {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
    .btn-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .document-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 20px 60px 20px;
    }

    .doc-header {
      text-align: center;
      border-bottom: 2px solid #2A52BE;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .motto {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #D73B3E;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 900;
      color: #2A52BE;
      margin: 0 0 6px 0;
      line-height: 1.2;
    }

    .scope-title {
      font-family: 'Playfair Display', serif;
      font-size: 17px;
      font-style: italic;
      color: #4b5563;
      margin: 0 0 16px 0;
    }

    .doc-meta {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #6b7280;
      border-top: 1px dashed #e5e7eb;
      padding-top: 8px;
    }

    .problem-card {
      margin-bottom: 30px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .problem-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #e5e7eb;
      padding-bottom: 6px;
      margin-bottom: 12px;
    }

    .problem-badge {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-code {
      font-family: 'Playfair Display', serif;
      font-weight: 800;
      font-size: 16px;
      color: #2A52BE;
    }

    .badge-category {
      font-size: 13px;
      font-weight: 600;
      color: #4b5563;
    }

    .badge-issue {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
    }

    .box {
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 12px;
      font-size: 15px;
    }

    .problem-box {
      background-color: #f8fafc;
      border-left: 4px solid #2A52BE;
    }

    .solution-box {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-left: 4px solid #D73B3E;
    }

    .box-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .problem-box .box-title {
      color: #2A52BE;
    }

    .solution-box .box-title {
      color: #D73B3E;
    }

    .box-content p {
      margin: 0 0 8px 0;
    }
    .box-content p:last-child {
      margin-bottom: 0;
    }

    .katex-display-box {
      margin: 8px 0;
      overflow-x: auto;
    }

    /* Định dạng hình vẽ hình học TikZ & Hình ảnh Markdown */
    .diagram-figure {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin: 16px auto !important;
      text-align: center !important;
    }

    .tikz-svg-container {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      margin: 0 auto !important;
      overflow: hidden !important;
      max-width: 100% !important;
    }

    .tikz-svg-container svg {
      max-width: 100% !important;
      max-height: 420px !important;
      height: auto !important;
      display: block !important;
      margin: 0 auto !important;
    }

    .diagram-figure img {
      max-width: 100% !important;
      max-height: 420px !important;
      height: auto !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 6px;
    }

    @media print {
      .toolbar {
        display: none !important;
      }
      .document-container {
        max-width: 100% !important;
        padding: 0 !important;
      }
      body {
        background: #ffffff !important;
      }
      .problem-card {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <span class="toolbar-title">Tạp Chí Pi &mdash; Bản Xem Trước In &amp; Xuất PDF</span>
    <div class="toolbar-actions">
      <button class="btn btn-print" onclick="window.print()">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        <span>In hoặc Lưu PDF (Ctrl + P)</span>
      </button>
      <button class="btn btn-close" onclick="window.close()">Đóng</button>
    </div>
  </div>

  <div class="document-container">
    <header class="doc-header">
      <p class="motto">Toán Học &amp; Tuổi Trẻ</p>
      <h1>TẬP BÀI GIẢI TOÁN TẠP CHÍ PI</h1>
      <p class="scope-title">${escapeHtml(scopeName)}</p>
      <div class="doc-meta">
        <span><strong>Người giải:</strong> ${escapeHtml(authorName)}</span>
        <span><strong>Tổng số bài:</strong> ${solvedItems.length} bài</span>
        <span><strong>Ngày xuất:</strong> ${now}</span>
      </div>
    </header>

    <main>
      ${problemSections}
    </main>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.log(e);
        }
      }, 700);
    });
  </script>
</body>
</html>`;
}

/**
 * Thực hiện mở giao diện in ấn / lưu PDF kèm kết xuất hình vẽ TikZ
 */
export async function exportSolutionsPdf(user = {}, solvedItems = [], scopeName = 'Toàn tập bài giải') {
  // 1. Mở cửa sổ ngay để ngăn chặn popup blocker của trình duyệt
  let printWindow = null;
  if (typeof window !== 'undefined' && window.open) {
    try {
      printWindow = window.open('', '_blank');
      if (printWindow && printWindow.document) {
        printWindow.document.open();
        printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pimaga - Đang chuẩn bị bản in PDF...</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafafa; color: #2A52BE; text-align: center; }
    .spinner { width: 36px; height: 36px; border: 3px solid #2A52BE; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <div style="font-weight: bold; font-size: 16px; color: #111827;">Đang kết xuất bản in PDF &amp; hình vẽ hình học...</div>
  <div style="font-size: 13px; color: #6b7280; margin-top: 6px;">Cửa sổ in sẽ tự động kích hoạt ngay sau khi hoàn tất.</div>
</body>
</html>`);
        printWindow.document.close();
      }
    } catch (_) {}
  }

  // 2. Pre-fetch toàn bộ hình vẽ TikZ sang vector SVG
  const svgMap = await prefetchTikzSvgs(solvedItems);

  // 3. Sinh mã HTML in ấn KaTeX chứa SVG
  const htmlContent = generateSolutionsPrintableHtml(user, solvedItems, scopeName, svgMap);

  // 4. Cập nhật vào cửa sổ in
  if (printWindow && !printWindow.closed) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    downloadFile(htmlContent, `pimaga_in_pdf_${Date.now()}.html`, 'text/html;charset=utf-8');
  }
}

/**
 * Hỗ trợ tải một file văn bản xuống máy tính người dùng
 */
export function downloadFile(content, fileName, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeLatexText(str = '') {
  return String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function cleanLatexMath(text = '') {
  let clean = String(text).trim();
  // Bỏ cú pháp markdown code block nếu có quanh tikz/latex để mã LaTeX hợp lệ
  clean = clean.replace(/```(?:tikz|latex)?\s*([\s\S]*?)\s*```/gi, '$1');
  return clean;
}

/**
 * Tính toán chuỗi ngày học liên tục (Streak Counter)
 * @param {Object} streakData { current: number, longest: number, lastActiveDate: string }
 * @param {string} [todayDateStr] YYYY-MM-DD
 */
export function calculateStreak(streakData = {}, todayDateStr) {
  const today = todayDateStr || new Date().toISOString().split('T')[0];
  const lastActive = streakData.lastActiveDate;
  const current = Math.max(0, Number(streakData.current) || 0);
  const longest = Math.max(0, Number(streakData.longest) || 0);

  if (!lastActive) {
    return {
      current: 1,
      longest: Math.max(1, longest),
      lastActiveDate: today,
    };
  }

  if (lastActive === today) {
    const validCurrent = Math.max(1, current);
    return {
      current: validCurrent,
      longest: Math.max(validCurrent, longest),
      lastActiveDate: today,
    };
  }

  // Day difference calculation
  const dLast = new Date(lastActive + 'T00:00:00');
  const dToday = new Date(today + 'T00:00:00');
  const diffTime = dToday.getTime() - dLast.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day
    const nextCurrent = current + 1;
    return {
      current: nextCurrent,
      longest: Math.max(nextCurrent, longest),
      lastActiveDate: today,
    };
  } else if (diffDays > 1) {
    // Missed a day or more
    return {
      current: 1,
      longest: longest,
      lastActiveDate: today,
    };
  }

  return {
    current: Math.max(1, current),
    longest: Math.max(current, longest),
    lastActiveDate: today,
  };
}

/**
 * Tính toán tiến độ thử thách theo từng Số phát hành (Monthly Issue Challenges)
 */
export function calculateIssueChallenges(issues = [], problems = [], userSolutionsMap = {}) {
  return issues.map((issue) => {
    const issueProblems = problems.filter((p) => p.issueId === issue.id);
    const total = issueProblems.length;
    let solved = 0;

    issueProblems.forEach((p) => {
      if (userSolutionsMap[p.id] && String(userSolutionsMap[p.id]).trim()) {
        solved += 1;
      }
    });

    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
    const isCompleted = total > 0 && solved === total;

    return {
      issueId: issue.id,
      issueName: issue.name,
      total,
      solved,
      percent,
      isCompleted,
    };
  });
}

/**
 * Danh sách Bảng vinh danh học thuật (Leaderboard / Hall of Fame)
 */
export function generateLeaderboard(userProfile = {}, solvedCount = 0, currentStreak = 0) {
  const currentUserName = userProfile.displayName || 'Bạn (Hồ sơ của bạn)';
  const currentUserSchool = userProfile.school || 'Tạp chí Pi';

  const sampleHonors = [
    { id: 'h1', name: 'Nguyễn Chu An', school: 'Chuyên KHTN Hà Nội', solved: 38, streak: 19, tier: 4, rankTitle: 'Đại kiện tướng Pi' },
    { id: 'h2', name: 'Trần Minh Đức', school: 'Chuyên Lê Hồng Phong TP.HCM', solved: 27, streak: 12, tier: 3, rankTitle: 'Kiện tướng Toán học' },
    { id: 'h3', name: 'Lê Hoàng Yến', school: 'ĐH Sư Phạm Hà Nội', solved: 22, streak: 15, tier: 3, rankTitle: 'Kiện tướng Toán học' },
    { id: 'h4', name: 'Vũ Quốc Bảo', school: 'Chuyên Lam Sơn Thanh Hóa', solved: 14, streak: 7, tier: 2, rankTitle: 'Tín đồ Pi' },
    { id: 'h5', name: 'Phạm Thu Trang', school: 'Chuyên Phan Bội Châu Nghệ An', solved: 9, streak: 5, tier: 2, rankTitle: 'Tín đồ Pi' },
  ];

  const userRankObj = getAcademicRank(solvedCount);
  const currentUserEntry = {
    id: 'current_user',
    name: currentUserName,
    school: currentUserSchool,
    solved: solvedCount,
    streak: currentStreak,
    tier: userRankObj.tier,
    rankTitle: userRankObj.title,
    isCurrentUser: true,
  };

  const list = [...sampleHonors, currentUserEntry];
  list.sort((a, b) => {
    if (b.solved !== a.solved) return b.solved - a.solved;
    return b.streak - a.streak;
  });

  return list.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}

