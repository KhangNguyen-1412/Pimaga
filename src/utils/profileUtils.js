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
    icon: '🌱',
    desc: 'Khởi đầu hành trình khám phá các bài toán trên Tạp chí Pi.',
  },
  {
    tier: 2,
    title: 'Tín đồ Pi',
    minSolved: 5,
    maxSolved: 14,
    badgeColor: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    icon: '📘',
    desc: 'Đã giải thành công nhiều bài toán và nắm vững phương pháp tư duy.',
  },
  {
    tier: 3,
    title: 'Kiện tướng Toán học',
    minSolved: 15,
    maxSolved: 29,
    badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    icon: '⭐',
    desc: 'Chinh phục được nhiều bài toán hóc búa, tư duy sắc bén.',
  },
  {
    tier: 4,
    title: 'Đại kiện tướng Pi',
    minSolved: 30,
    maxSolved: Infinity,
    badgeColor: 'bg-rose-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    icon: '👑',
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

/**
 * Sinh file mã nguồn LaTeX (.tex) hoàn chỉnh chứa tất cả bài giải của người dùng
 */
export function generateSolutionsLatex(user = {}, solvedItems = []) {
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
\\fancyhead[L]{\\small \\textsf{Tạp Chí Pi - Kho Bài Giải Cá Nhân}}
\\fancyhead[R]{\\small \\textsf{${escapeLatexText(authorName)}}}
\\fancyfoot[C]{\\thepage}

\\title{\\Huge \\textbf{Tập Bài Giải Toán Tạp Chí Pi}\\\\
\\large \\textsf{Hồ sơ học thuật cá nhân - Pimaga}}
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
export function generateSolutionsMarkdown(user = {}, solvedItems = []) {
  const authorName = user.displayName || user.email || 'Người dùng Pimaga';
  const now = new Date().toLocaleDateString('vi-VN');

  let md = `# Tập Bài Giải Toán Tạp Chí Pi\n\n`;
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
  // Giữ nguyên các khối công thức toán $...$ hoặc $$...$$, xử lý xuống dòng
  return String(text).trim();
}
