import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathRenderer({ content, className = '' }) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Tách văn bản thành các khối: $$...$$ (display mode), $...$ (inline mode), và văn bản thông thường
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$(?!\$)[^$\n]+?\$)/g;
    const parts = content.split(mathRegex);

    return parts.map((part, index) => {
      if (!part) return null;

      if (part.startsWith('$$') && part.endsWith('$$')) {
        const tex = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(tex, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="my-3 block overflow-x-auto py-1"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          return (
            <span key={index} className="text-red-500 font-mono text-sm block">
              {part}
            </span>
          );
        }
      }

      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const tex = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(tex, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="inline-block px-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          return (
            <span key={index} className="text-red-500 font-mono text-sm">
              {part}
            </span>
          );
        }
      }

      // Văn bản thông thường: giữ nguyên khoảng trắng và xuống dòng
      const subLines = part.split('\n');
      return (
        <React.Fragment key={index}>
          {subLines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {line}
              {lIdx < subLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    });
  }, [content]);

  if (!content) {
    return <span className="italic text-gray-400 dark:text-slate-500">Xem trước sẽ hiển thị tại đây...</span>;
  }

  return <div className={`leading-relaxed ${className}`}>{renderedElements}</div>;
}
