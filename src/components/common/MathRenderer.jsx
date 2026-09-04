import React, { useMemo, useState, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import TikzRenderer from './TikzRenderer';

// Regex nhận diện khối mã LaTeX TikZ (vẽ hình hình học)
const TIKZ_REGEX = /(\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}|```(?:tikz|latex)\s*[\s\S]*?\\begin\{tikzpicture\}[\s\S]*?```)/g;

// Regex nhận diện công thức Toán: $$...$$ (display block) và $...$ (inline)
const MATH_REGEX = /(\$\$[\s\S]*?\$\$|\$(?!\$)[^$\n]+?\$)/g;

// Regex nhận diện các định dạng Markdown inline:
// 1. Hình ảnh: ![alt](url)
// 2. Liên kết: [text](url)
// 3. ***Đậm và Nghiêng***
// 4. **In đậm**
// 5. *In nghiêng* (có kiểm tra không chứa khoảng trắng ở 2 đầu)
// 6. `Mã code inline`
// 7. ~~Gạch ngang chữ~~
const INLINE_MARKDOWN_REGEX = /(!\[[^\]]*?\]\([^)\s]+\)|(?<!!)\[[^\]]+?\]\((?:https?:\/\/[^\s)]+|\/[^\s)]+|data:image\/[^\s)]+)\)|\*\*\*[^*\n]+?\*\*\*|\*\*[^*\n]+?\*\*|(?<!\*)\*(?!\s)[^*\n]+?(?<!\s)\*(?!\*)|`[^`\n]+?`|~~[^~\n]+?~~)/g;

function renderKatex(mathItem, key) {
  try {
    const html = katex.renderToString(mathItem.tex, {
      displayMode: mathItem.display,
      throwOnError: false,
    });

    if (mathItem.display) {
      return (
        <span
          key={key}
          className="my-3 block overflow-x-auto py-1 text-center"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return (
      <span
        key={key}
        className="inline-block px-0.5 align-baseline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (err) {
    return (
      <span key={key} className="text-red-500 font-mono text-sm">
        {mathItem.raw}
      </span>
    );
  }
}

// Thay thế các placeholder \uE000MATH_i\uE001 và \uE002TIKZ_i\uE003
function resolveMathAndTikz(text, mathStore, tikzStore, keyPrefix, onZoomImage) {
  if (!text) return null;
  const parts = text.split(/(\uE000MATH_\d+\uE001|\uE002TIKZ_\d+\uE003)/g);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-p${idx}`;
    const mathMatch = part.match(/^\uE000MATH_(\d+)\uE001$/);
    if (mathMatch) {
      const mathItem = mathStore[parseInt(mathMatch[1], 10)];
      if (mathItem) {
        return renderKatex(mathItem, key);
      }
    }

    const tikzMatch = part.match(/^\uE002TIKZ_(\d+)\uE003$/);
    if (tikzMatch) {
      const tikzCode = tikzStore[parseInt(tikzMatch[1], 10)];
      if (tikzCode) {
        return <TikzRenderer key={key} code={tikzCode} onZoom={onZoomImage} />;
      }
    }

    return part;
  });
}

// Phân tích và tạo React elements cho các định dạng Markdown inline
function renderInlineMarkdown(text, mathStore, keyPrefix, onZoomImage) {
  if (!text) return null;

  const parts = text.split(INLINE_MARKDOWN_REGEX);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-t${idx}`;
    if (!part) return null;

    // ![alt](url) - Hình ảnh / Sơ đồ hình học
    const imageMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const alt = imageMatch[1] || 'Hình vẽ minh họa';
      const src = imageMatch[2];
      return (
        <figure key={key} className="my-4 block text-center not-prose">
          <div className="group relative inline-block max-w-full rounded-2xl p-2 bg-white/95 dark:bg-slate-900/95 border border-gray-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-cerulean/50 dark:hover:border-blue-500/50">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[460px] rounded-xl object-contain mx-auto bg-white dark:bg-slate-950 p-1 transition duration-300 group-hover:brightness-[1.02] cursor-zoom-in"
              loading="lazy"
              onClick={(e) => {
                e.stopPropagation();
                if (onZoomImage) onZoomImage({ src, alt });
                else window.open(src, '_blank');
              }}
              title="Nhấn vào hình vẽ để xem phóng to chi tiết"
            />
            {/* Nút phóng to nổi khi rê chuột */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onZoomImage) onZoomImage({ src, alt });
                else window.open(src, '_blank');
              }}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900/85 backdrop-blur-xs text-white text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-cerulean transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              <span>Phóng to</span>
            </div>
          </div>
          {alt && (
            <figcaption className="text-xs text-gray-600 dark:text-slate-400 mt-2.5 font-newsreader italic flex items-center justify-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cerulean dark:bg-blue-400"></span>
              <span className="font-bold text-gray-800 dark:text-slate-200">Hình vẽ:</span> {alt}
            </figcaption>
          )}
        </figure>
      );
    }

    // [text](url) - Liên kết tham khảo
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch && !part.startsWith('!')) {
      const label = linkMatch[1];
      const href = linkMatch[2];
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cerulean dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
        >
          {label}
        </a>
      );
    }

    // ***Đậm & Nghiêng***
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      const content = part.slice(3, -3);
      return (
        <strong key={key} className="font-bold text-gray-900 dark:text-slate-100">
          <em className="italic">
            {resolveMathAndTikz(content, mathStore, tikzStore, `${key}-bi`, onZoomImage)}
          </em>
        </strong>
      );
    }

    // **In đậm**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <strong key={key} className="font-bold text-gray-900 dark:text-slate-100">
          {resolveMathAndTikz(content, mathStore, tikzStore, `${key}-b`, onZoomImage)}
        </strong>
      );
    }

    // *In nghiêng*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const content = part.slice(1, -1);
      return (
        <em key={key} className="italic text-gray-800 dark:text-slate-200">
          {resolveMathAndTikz(content, mathStore, tikzStore, `${key}-i`, onZoomImage)}
        </em>
      );
    }

    // `Code inline`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const content = part.slice(1, -1);
      return (
        <code
          key={key}
          className="bg-gray-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-[0.88em] font-mono border border-gray-200 dark:border-slate-700"
        >
          {content}
        </code>
      );
    }

    // ~~Gạch ngang~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <del key={key} className="line-through text-gray-400 dark:text-slate-500">
          {resolveMathAndTikz(content, mathStore, tikzStore, `${key}-d`, onZoomImage)}
        </del>
      );
    }

    // Text thông thường (có thể chứa placeholder toán hoặc TikZ)
    return (
      <React.Fragment key={key}>
        {resolveMathAndTikz(part, mathStore, tikzStore, key, onZoomImage)}
      </React.Fragment>
    );
  });
}

export default function MathRenderer({ content, className = '' }) {
  const [zoomModal, setZoomModal] = useState(null);

  // Đóng modal phóng to ảnh khi người dùng nhấn phím Esc
  useEffect(() => {
    if (!zoomModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setZoomModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomModal]);

  const renderedElements = useMemo(() => {
    if (!content) return null;

    // 1. Tách và lưu trữ toàn bộ các khối mã LaTeX TikZ trước tiên để bảo toàn cú pháp
    const tikzStore = [];
    const textWithoutTikz = content.replace(TIKZ_REGEX, (match) => {
      const idx = tikzStore.length;
      tikzStore.push(match);
      return `\uE002TIKZ_${idx}\uE003`;
    });

    // 2. Tách và lưu trữ toàn bộ công thức toán KaTeX
    const mathStore = [];
    const textWithPlaceholders = textWithoutTikz.replace(MATH_REGEX, (match) => {
      const idx = mathStore.length;
      const isDisplay = match.startsWith('$$') && match.endsWith('$$');
      mathStore.push({
        display: isDisplay,
        tex: isDisplay ? match.slice(2, -2).trim() : match.slice(1, -1).trim(),
        raw: match,
      });
      return `\uE000MATH_${idx}\uE001`;
    });

    // 3. Tách theo từng dòng
    const lines = textWithPlaceholders.split('\n');

    return lines.map((line, lineIdx) => {
      // Dòng chứa duy nhất 1 khối LaTeX TikZ
      const tikzLineMatch = line.trim().match(/^\uE002TIKZ_(\d+)\uE003$/);
      if (tikzLineMatch) {
        const tikzCode = tikzStore[parseInt(tikzLineMatch[1], 10)];
        return (
          <TikzRenderer key={lineIdx} code={tikzCode} onZoom={setZoomModal} />
        );
      }

      // Tiêu đề Markdown: ###, ##, #
      if (line.startsWith('### ')) {
        return (
          <h3 key={lineIdx} className="text-base font-bold text-gray-900 dark:text-slate-100 mt-3 mb-1">
            {renderInlineMarkdown(line.slice(4), mathStore, tikzStore, `l${lineIdx}-h3`, setZoomModal)}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={lineIdx} className="text-lg font-bold text-gray-900 dark:text-slate-100 mt-4 mb-2">
            {renderInlineMarkdown(line.slice(3), mathStore, tikzStore, `l${lineIdx}-h2`, setZoomModal)}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={lineIdx} className="text-xl font-bold text-gray-900 dark:text-slate-100 mt-4 mb-2">
            {renderInlineMarkdown(line.slice(2), mathStore, tikzStore, `l${lineIdx}-h1`, setZoomModal)}
          </h1>
        );
      }

      // Trích dẫn: > 
      if (line.startsWith('> ')) {
        return (
          <blockquote key={lineIdx} className="border-l-4 border-amber-500/60 pl-3 py-1 my-2 italic text-gray-700 dark:text-slate-300 bg-gray-50/50 dark:bg-slate-800/30 rounded-r">
            {renderInlineMarkdown(line.slice(2), mathStore, tikzStore, `l${lineIdx}-bq`, setZoomModal)}
          </blockquote>
        );
      }

      // Kiểm tra nếu dòng chỉ là 1 khối display math ($$...$$), khối TikZ, hoặc 1 hình vẽ đơn lẻ
      const isSingleBlockElement = /^\s*(\uE000MATH_\d+\uE001|\uE002TIKZ_\d+\uE003|!\[[^\]]*?\]\([^)\s]+\))\s*$/.test(line);

      return (
        <React.Fragment key={lineIdx}>
          {renderInlineMarkdown(line, mathStore, tikzStore, `l${lineIdx}`, setZoomModal)}
          {lineIdx < lines.length - 1 && !isSingleBlockElement && <br />}
        </React.Fragment>
      );
    });
  }, [content]);

  if (!content) {
    return <span className="italic text-gray-400 dark:text-slate-500">Xem trước sẽ hiển thị tại đây...</span>;
  }

  return (
    <>
      <div className={`leading-relaxed ${className}`}>{renderedElements}</div>

      {/* Lightbox Modal xem ảnh phóng to chi tiết */}
      {zoomModal && (
        <div
          className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 cursor-zoom-out animate-fadeIn"
          onClick={() => setZoomModal(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Header controls */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white mb-2 shrink-0 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-sm font-newsreader truncate">
              <span className="text-amber-400 font-bold">📐 Hình vẽ:</span>
              <span className="text-gray-200 truncate">{zoomModal.alt || 'Chi tiết hình vẽ'}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={zoomModal.src}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs rounded-md bg-white/15 hover:bg-white/25 text-white transition flex items-center gap-1 font-sans"
                title="Mở hình ảnh trong tab mới"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Tab mới
              </a>
              <button
                type="button"
                onClick={() => setZoomModal(null)}
                className="p-1 rounded-md bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
                title="Đóng (Esc)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] overflow-auto p-2.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-white/20 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomModal.src}
              alt={zoomModal.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto"
            />
          </div>

          {/* Hint */}
          <div className="text-xs text-gray-400 mt-2 font-sans">
            Nhấn <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">Esc</kbd> hoặc click ra ngoài để đóng
          </div>
        </div>
      )}
    </>
  );
}
