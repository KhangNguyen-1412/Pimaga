import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

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

// Thay thế các placeholder \uE000MATH_i\uE001 bằng phần tử KaTeX đã render
function resolveMathAndText(text, mathStore, keyPrefix) {
  if (!text) return null;
  const parts = text.split(/(\uE000MATH_\d+\uE001)/g);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-m${idx}`;
    const match = part.match(/^\uE000MATH_(\d+)\uE001$/);
    if (match) {
      const mathItem = mathStore[parseInt(match[1], 10)];
      if (mathItem) {
        return renderKatex(mathItem, key);
      }
    }
    return part;
  });
}

// Phân tích và tạo React elements cho các định dạng Markdown inline
function renderInlineMarkdown(text, mathStore, keyPrefix) {
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
        <figure key={key} className="my-3 block text-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[420px] mx-auto rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 object-contain bg-white dark:bg-slate-900 p-1.5 transition hover:shadow-md cursor-zoom-in"
            loading="lazy"
            onClick={() => window.open(src, '_blank')}
            title="Nhấn để xem hình ảnh kích thước gốc"
          />
          {alt && (
            <figcaption className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 italic font-sans">
              📷 {alt}
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
            {resolveMathAndText(content, mathStore, `${key}-bi`)}
          </em>
        </strong>
      );
    }

    // **In đậm**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <strong key={key} className="font-bold text-gray-900 dark:text-slate-100">
          {resolveMathAndText(content, mathStore, `${key}-b`)}
        </strong>
      );
    }

    // *In nghiêng*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const content = part.slice(1, -1);
      return (
        <em key={key} className="italic text-gray-800 dark:text-slate-200">
          {resolveMathAndText(content, mathStore, `${key}-i`)}
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
          {resolveMathAndText(content, mathStore, `${key}-d`)}
        </del>
      );
    }

    // Text thông thường (có thể chứa placeholder toán)
    return (
      <React.Fragment key={key}>
        {resolveMathAndText(part, mathStore, key)}
      </React.Fragment>
    );
  });
}

export default function MathRenderer({ content, className = '' }) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // 1. Tách và lưu trữ toàn bộ công thức toán để bảo toàn cú pháp trước khi parse Markdown
    const mathStore = [];
    const textWithPlaceholders = content.replace(MATH_REGEX, (match) => {
      const idx = mathStore.length;
      const isDisplay = match.startsWith('$$') && match.endsWith('$$');
      mathStore.push({
        display: isDisplay,
        tex: isDisplay ? match.slice(2, -2).trim() : match.slice(1, -1).trim(),
        raw: match,
      });
      return `\uE000MATH_${idx}\uE001`;
    });

    // 2. Tách theo từng dòng
    const lines = textWithPlaceholders.split('\n');

    return lines.map((line, lineIdx) => {
      // Tiêu đề Markdown: ###, ##, #
      if (line.startsWith('### ')) {
        return (
          <h3 key={lineIdx} className="text-base font-bold text-gray-900 dark:text-slate-100 mt-3 mb-1">
            {renderInlineMarkdown(line.slice(4), mathStore, `l${lineIdx}-h3`)}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={lineIdx} className="text-lg font-bold text-gray-900 dark:text-slate-100 mt-4 mb-2">
            {renderInlineMarkdown(line.slice(3), mathStore, `l${lineIdx}-h2`)}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={lineIdx} className="text-xl font-bold text-gray-900 dark:text-slate-100 mt-4 mb-2">
            {renderInlineMarkdown(line.slice(2), mathStore, `l${lineIdx}-h1`)}
          </h1>
        );
      }

      // Trích dẫn: > 
      if (line.startsWith('> ')) {
        return (
          <blockquote key={lineIdx} className="border-l-4 border-amber-500/60 pl-3 py-1 my-2 italic text-gray-700 dark:text-slate-300 bg-gray-50/50 dark:bg-slate-800/30 rounded-r">
            {renderInlineMarkdown(line.slice(2), mathStore, `l${lineIdx}-bq`)}
          </blockquote>
        );
      }

      // Kiểm tra nếu dòng chỉ là 1 khối display math ($$...$$) hoặc 1 hình vẽ đơn lẻ
      const isSingleBlockElement = /^\s*(\uE000MATH_\d+\uE001|!\[[^\]]*?\]\([^)\s]+\))\s*$/.test(line);

      return (
        <React.Fragment key={lineIdx}>
          {renderInlineMarkdown(line, mathStore, `l${lineIdx}`)}
          {lineIdx < lines.length - 1 && !isSingleBlockElement && <br />}
        </React.Fragment>
      );
    });
  }, [content]);

  if (!content) {
    return <span className="italic text-gray-400 dark:text-slate-500">Xem trước sẽ hiển thị tại đây...</span>;
  }

  return <div className={`leading-relaxed ${className}`}>{renderedElements}</div>;
}
