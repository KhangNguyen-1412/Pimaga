import React, { useState, useEffect, useRef } from 'react';
import MathRenderer from '../common/MathRenderer';
import { useData } from '../../context/DataContext';

export default function SolutionModal({ isOpen, problem, onClose, onOpenLatexCheatsheet }) {
  const { userSolutionsMap, saveUserSolution } = useData();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && problem) {
      setContent(userSolutionsMap[problem.id] || '');
      setError('');
    }
  }, [isOpen, problem, userSolutionsMap]);

  // Handle Ctrl+Enter to save
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, content, problem]);

  if (!isOpen || !problem) return null;

  const problemHeading = problem.code
    ? problem.code.startsWith('Bài')
      ? problem.code
      : `Bài ${problem.code}`
    : problem.title || 'Bài toán';

  const insertMath = (snippet) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const text = el.value;
    const nextText = text.substring(0, start) + snippet + text.substring(end);
    setContent(nextText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  const handleSave = async () => {
    setError('');
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài làm trước khi lưu!');
      return;
    }

    try {
      setIsSubmitting(true);
      await saveUserSolution(problem.id, content);
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu bài làm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 dark:bg-black/70 z-[100] flex justify-center items-center backdrop-blur-sm px-4">
      <div className="bg-paper dark:bg-nightCard rounded-2xl shadow-2xl w-full max-w-6xl xl:max-w-7xl h-[92vh] max-h-[880px] flex flex-col border border-gray-300 dark:border-slate-800 overflow-hidden animate-dropdownFade transition-colors">
        {/* Header */}
        <div className="px-6 py-3.5 bg-blue-50/70 dark:bg-slate-900/80 border-b border-blue-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/assets/pimaga-logo.svg"
              alt="Pimaga Logo"
              className="w-8 h-8 rounded-full shadow-xs select-none"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h3 className="font-playfair text-2xl font-bold text-cerulean dark:text-blue-400 leading-none">
                Bài Làm Của Bạn
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader italic mt-0.5">
                Đang giải: <strong className="text-ink dark:text-slate-200 not-italic">{problemHeading}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200/60 dark:hover:bg-slate-800 transition text-2xl font-bold leading-none cursor-pointer"
            title="Đóng"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-4 custom-scrollbar">
          {/* 1. Problem Statement Card (ĐỀ BÀI TOÁN - Luôn hiển thị để người giải quan sát) */}
          <div className="bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/90 dark:border-amber-900/50 rounded-xl p-3.5 sm:p-4 shadow-2xs shrink-0">
            <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-amber-200/70 dark:border-amber-900/50">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold font-playfair bg-cerulean text-white uppercase tracking-wider shadow-2xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Đề Bài: {problemHeading}
                </span>
                {problem.author && (
                  <span className="text-xs text-gray-600 dark:text-slate-400 font-newsreader italic">
                    Tác giả: <strong className="text-ink dark:text-slate-200 not-italic">{problem.author}</strong>
                    {problem.province ? ` — ${problem.province}` : ''}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsProblemCollapsed((prev) => !prev)}
                className="text-xs font-bold text-amber-900 dark:text-amber-300 hover:text-cerulean dark:hover:text-blue-300 flex items-center gap-1 transition cursor-pointer px-2 py-0.5 rounded hover:bg-amber-100/60 dark:hover:bg-amber-900/40"
              >
                <span>{isProblemCollapsed ? 'Xem chi tiết đề bài ▼' : 'Thu gọn đề bài ▲'}</span>
              </button>
            </div>

            {!isProblemCollapsed && (
              <div className="font-newsreader text-base md:text-lg text-ink dark:text-slate-100 leading-relaxed max-h-52 overflow-y-auto pr-2 bg-paper/70 dark:bg-nightInput p-3 rounded-lg border border-amber-100/80 dark:border-slate-800">
                <MathRenderer content={problem.content} />
              </div>
            )}
          </div>

          {/* 2. Error banner */}
          {error && (
            <div className="p-3.5 rounded-xl border flex items-start gap-2.5 shadow-xs font-newsreader text-sm transition-all bg-red-50/95 dark:bg-rose-950/50 border-red-200 dark:border-rose-900 text-jasper dark:text-rose-400 border-l-4 border-jasper shrink-0">
              <svg className="w-5 h-5 text-jasper dark:text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="font-bold font-playfair leading-tight">Lỗi:</p>
                <p className="text-ink dark:text-slate-200 mt-0.5">{error}</p>
              </div>
              <button type="button" onClick={() => setError('')} className="text-gray-400 dark:text-slate-400 hover:text-ink dark:hover:text-slate-200 text-lg font-bold">&times;</button>
            </div>
          )}

          {/* 3. Workspace: Editor (Left) & Live Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[300px]">

          {/* Left: Editor & Quick Math Toolbar */}
          <div className="bg-white dark:bg-nightInput/60 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-1.5 shrink-0">
              <label className="text-xs font-bold text-cerulean dark:text-blue-400 font-playfair uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Lời Giải Của Bạn ($ và $$)
              </label>
              <button
                type="button"
                onClick={() => onOpenLatexCheatsheet((snippet) => insertMath(snippet))}
                className="px-2.5 py-1 bg-cerulean text-white hover:bg-blue-900 rounded-md font-bold text-xs flex items-center gap-1.5 transition shadow-2xs font-newsreader cursor-pointer"
                title="Mở danh mục tra cứu tất cả công thức toán LaTeX"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Tra Cứu LaTeX</span>
              </button>
            </div>

            {/* Quick Toolbar */}
            <div className="flex flex-wrap gap-1 mb-2 p-1 bg-blue-50/50 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 rounded text-xs font-mono shrink-0">
              <button type="button" onClick={() => insertMath('$\\frac{a}{b}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">a/b</button>
              <button type="button" onClick={() => insertMath('$x^2$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">x²</button>
              <button type="button" onClick={() => insertMath('$x_1$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">x₁</button>
              <button type="button" onClick={() => insertMath('$\\sqrt{x}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">√x</button>
              <button type="button" onClick={() => insertMath('$\\triangle ABC$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">△ABC</button>
              <button type="button" onClick={() => insertMath('$\\widehat{A}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">∠A</button>
              <button type="button" onClick={() => insertMath('$\\vec{u}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">v⃗</button>
              <button type="button" onClick={() => insertMath('$\\le$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">≤</button>
              <button type="button" onClick={() => insertMath('$\\ge$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">≥</button>
              <button type="button" onClick={() => insertMath('$\\neq$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">≠</button>
              <button type="button" onClick={() => insertMath('$\\perp$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">⊥</button>
              <button type="button" onClick={() => insertMath('$\\parallel$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">∥</button>
              <button type="button" onClick={() => insertMath('$\\pi$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">π</button>
              <button type="button" onClick={() => insertMath('$$\\dots$$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">$$...$$</button>
              <button type="button" onClick={() => insertMath('$$\\begin{cases} x + y = 1 \\\\\\\\ x - y = 0 \\end{cases}$$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">Hệ PT</button>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 min-h-[160px] md:min-h-[200px] max-h-[380px] overflow-y-auto border border-cerulean/40 dark:border-blue-500/40 focus:border-cerulean focus:ring-2 focus:ring-cerulean/20 bg-blue-50/20 dark:bg-nightInput text-ink dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg p-3 font-newsreader text-base resize-y outline-none transition custom-scrollbar"
              placeholder="Ghi chép cách giải của bạn vào đây. Sử dụng $công thức$ hoặc $$công thức$$ để KaTeX hiển thị đẹp..."
            />
          </div>

          {/* Right: Live Preview */}
          <div className="bg-white dark:bg-nightInput/60 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="text-xs font-bold text-cerulean dark:text-blue-400 font-playfair uppercase tracking-wider mb-2 flex items-center gap-1.5 shrink-0">
              <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem Trước Trực Tiếp (Live Preview):
            </div>
            <div className="flex-1 min-h-[160px] max-h-[380px] overflow-y-auto p-3.5 bg-paper dark:bg-nightInput border border-gray-200 dark:border-slate-800 rounded-lg text-ink dark:text-slate-100 font-newsreader text-base leading-relaxed shadow-inner custom-scrollbar">
              <MathRenderer content={content} />
            </div>
          </div>
        </div>
      </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-paperDark dark:bg-nightCard border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-xs text-gray-500 dark:text-slate-400 font-newsreader flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cerulean dark:bg-blue-400"></span>
            <span>
              Nhấn <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded font-mono text-xs text-gray-700 dark:text-slate-300 shadow-xs">Ctrl + Enter</kbd> để lưu nhanh bài làm
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-newsreader font-bold text-sm cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-cerulean text-white px-7 py-2 rounded-lg hover:bg-blue-800 transition font-playfair font-bold text-base shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Lưu Bài Làm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
