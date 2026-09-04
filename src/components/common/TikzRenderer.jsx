import React, { useState, useEffect } from 'react';

// Bộ nhớ cache tạm trong bộ nhớ cho các hình đã biên dịch
const MEMORY_CACHE = new Map();

/**
 * Tạo chuỗi hash đơn giản từ mã TikZ
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Chuẩn hóa mã TikZ, bọc đầy đủ preamble LaTeX standalone nếu người dùng chỉ nhập \begin{tikzpicture}
 */
function wrapTikzDocument(rawCode) {
  let cleanCode = rawCode.trim();

  // Bỏ cú pháp markdown code block nếu có
  cleanCode = cleanCode.replace(/^```(?:tikz|latex)?\s*/i, '').replace(/\s*```$/, '').trim();

  // Nếu người dùng đã cung cấp đầy đủ \documentclass thì giữ nguyên
  if (cleanCode.includes('\\documentclass')) {
    return cleanCode;
  }

  // Tự động bao bọc với các gói hình học chuẩn mực: tikz, tkz-euclide, amsmath
  return `\\documentclass[tikz,border=6pt]{standalone}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usepackage{tkz-euclide}
\\usetikzlibrary{calc,angles,quotes,intersections,arrows.meta,through,backgrounds}
\\begin{document}
${cleanCode}
\\end{document}`;
}

export default function TikzRenderer({ code, onZoom }) {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const cleanCode = code.trim();
    if (!cleanCode) {
      setLoading(false);
      return;
    }

    const hash = simpleHash(cleanCode);
    const cacheKey = `pimaga_tikz_${hash}`;

    // 1. Kiểm tra trong memory cache
    if (MEMORY_CACHE.has(hash)) {
      setSvgContent(MEMORY_CACHE.get(hash));
      setLoading(false);
      return;
    }

    // 2. Kiểm tra trong localStorage
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        MEMORY_CACHE.set(hash, stored);
        setSvgContent(stored);
        setLoading(false);
        return;
      }
    } catch (_) {}

    // 3. Gọi Kroki API để biên dịch mã LaTeX TikZ sang SVG
    setLoading(true);
    setError(null);

    const fullLatex = wrapTikzDocument(cleanCode);

    fetch('https://kroki.io/tikz/svg', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
      body: fullLatex,
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok || !text.includes('<svg')) {
          throw new Error(text || `Lỗi biên dịch mã TikZ (Mã lỗi ${res.status})`);
        }
        return text;
      })
      .then((svg) => {
        if (!isMounted) return;

        // Lưu vào cache
        MEMORY_CACHE.set(hash, svg);
        try {
          localStorage.setItem(cacheKey, svg);
        } catch (_) {}

        setSvgContent(svg);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('TikZ compile error:', err);
        setError(err.message || 'Không thể biên dịch mã TikZ này.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (loading) {
    return (
      <div className="my-4 p-4 rounded-xl border border-dashed border-cerulean/40 dark:border-blue-500/40 bg-blue-50/30 dark:bg-slate-900/40 flex flex-col items-center justify-center gap-2 text-center max-w-md mx-auto">
        <div className="w-6 h-6 border-2 border-cerulean border-t-transparent dark:border-blue-400 dark:border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-cerulean dark:text-blue-400 font-newsreader italic">
          Đang dựng hình vẽ từ mã LaTeX TikZ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-3 rounded-xl border border-red-200 dark:border-rose-900/60 bg-red-50/40 dark:bg-rose-950/30 text-left max-w-xl mx-auto">
        <div className="text-xs font-bold text-jasper dark:text-rose-400 flex items-center gap-1.5 mb-1">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Lỗi mã LaTeX TikZ:
        </div>
        <p className="text-xs text-gray-700 dark:text-slate-300 font-mono line-clamp-2 mb-2">
          {error}
        </p>
        <details className="text-[11px] text-gray-500 dark:text-slate-400">
          <summary className="cursor-pointer hover:underline">Xem mã nguồn TikZ</summary>
          <pre className="mt-1 p-2 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-slate-800 overflow-x-auto text-[10px] font-mono">
            {code}
          </pre>
        </details>
      </div>
    );
  }

  // Chuyển đổi SVG sang Data URL để hỗ trợ phóng to trong Lightbox
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

  return (
    <figure className="my-4 block text-center not-prose">
      <div className="group relative inline-block max-w-full rounded-2xl p-3 bg-white dark:bg-slate-950 border border-gray-200/90 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-cerulean/50 dark:hover:border-blue-500/50">
        <div
          className="max-w-full max-h-[460px] overflow-auto flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto cursor-zoom-in text-gray-900 dark:text-slate-100"
          dangerouslySetInnerHTML={{ __html: svgContent }}
          onClick={() => {
            if (onZoom) {
              onZoom({ src: svgDataUrl, alt: 'Hình vẽ LaTeX TikZ' });
            }
          }}
          title="Nhấn để xem phóng to hình vẽ TikZ"
        />

        {/* Nút phóng to nổi */}
        <div
          onClick={() => {
            if (onZoom) {
              onZoom({ src: svgDataUrl, alt: 'Hình vẽ LaTeX TikZ' });
            }
          }}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900/85 backdrop-blur-xs text-white text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-cerulean transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          <span>Phóng to</span>
        </div>
      </div>

      <figcaption className="text-xs text-gray-600 dark:text-slate-400 mt-2 font-newsreader italic flex items-center justify-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cerulean dark:bg-blue-400"></span>
        <span className="font-bold text-gray-800 dark:text-slate-200">Hình vẽ LaTeX TikZ</span>
      </figcaption>
    </figure>
  );
}
