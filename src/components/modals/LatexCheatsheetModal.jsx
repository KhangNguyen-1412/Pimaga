import React, { useState, useMemo } from 'react';
import MathRenderer from '../common/MathRenderer';
import { LATEX_CATEGORIES, LATEX_FORMULAS } from '../../constants/latexFormulas';
import { useToast } from '../../context/ToastContext';

export default function LatexCheatsheetModal({ isOpen, onClose, onInsertSnippet }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const filteredFormulas = useMemo(() => {
    return LATEX_FORMULAS.filter((f) => {
      const matchCat = selectedCat === 'all' || f.cat === selectedCat;
      if (!matchCat) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        f.name.toLowerCase().includes(term) ||
        f.code.toLowerCase().includes(term) ||
        (f.desc && f.desc.toLowerCase().includes(term))
      );
    });
  }, [selectedCat, searchTerm]);

  if (!isOpen) return null;

  const handleCopy = async (code) => {
    let snippet = code;
    if (snippet.startsWith('\\begin') || snippet.startsWith('\\left[')) {
      snippet = `$$\n${snippet}\n$$`;
    } else if (!snippet.startsWith('$')) {
      snippet = `$${snippet}$`;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const temp = document.createElement('textarea');
        temp.value = snippet;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      showToast('Đã sao chép: ' + snippet, 'success');
    } catch (e) {
      showToast('Lỗi sao chép: ' + e.message, 'error');
    }
  };

  const handleInsert = (code) => {
    let snippet = code;
    if (snippet.startsWith('\\begin') || snippet.startsWith('\\left[')) {
      snippet = `$$\n${snippet}\n$$`;
    } else if (!snippet.startsWith('$')) {
      snippet = `$${snippet}$`;
    }

    if (onInsertSnippet) {
      onInsertSnippet(snippet);
      showToast('Đã chèn: ' + snippet, 'success');
      onClose();
    } else {
      handleCopy(code);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 dark:bg-black/70 z-[100] flex justify-center items-center backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-paper dark:bg-nightCard rounded-none sm:rounded-2xl shadow-2xl w-full max-w-5xl h-full sm:h-[92vh] sm:max-h-[850px] flex flex-col border-0 sm:border border-gray-300 dark:border-slate-800 overflow-hidden animate-dropdownFade transition-colors">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-blue-50/70 dark:bg-slate-900/80 border-b border-blue-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/assets/pimaga-logo.svg"
              alt="Pimaga Emblem"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-xs select-none"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h3 className="font-playfair text-lg sm:text-2xl font-bold text-cerulean dark:text-blue-400 leading-none flex items-center gap-2">
                <span>Sổ Tay LaTeX</span>
                <span className="text-[10px] sm:text-xs bg-cerulean text-white font-mono px-2 py-0.5 rounded-full font-normal">
                  KaTeX
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader mt-0.5 hidden xs:block">
                Bấm "Chèn" để thêm vào con trỏ bài viết hoặc "Sao chép" mã LaTeX
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

        {/* Search & Tabs */}
        <div className="p-3.5 bg-white dark:bg-nightCard border-b border-gray-200 dark:border-slate-800 shrink-0 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <svg
                className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nhanh công thức (ví dụ: phân số, tích phân, căn, góc, vecto, ma trận, hệ pt, pi...)"
                className="w-full h-9.5 pl-10 pr-4 bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-ink dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg text-sm font-newsreader focus:outline-none focus:border-cerulean dark:focus:border-blue-400 focus:ring-2 focus:ring-cerulean/20 transition"
              />
            </div>
            <span className="text-xs text-cerulean dark:text-blue-300 font-mono font-bold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900 shrink-0">
              {filteredFormulas.length} công thức
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 font-newsreader text-xs">
            {LATEX_CATEGORIES.map((cat) => {
              const isSel = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSel
                      ? 'bg-cerulean text-white shadow-2xs'
                      : 'bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-blue-50/70 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulas Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-paperDark dark:bg-night custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredFormulas.map((formula) => (
              <div
                key={formula.id}
                className="bg-white dark:bg-nightCard p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-cerulean dark:hover:border-blue-500 shadow-2xs hover:shadow transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-gray-800 dark:text-slate-200 font-newsreader truncate" title={formula.name}>
                      {formula.name}
                    </span>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900 shrink-0 ml-1">
                      {formula.catName}
                    </span>
                  </div>
                  {/* Math Preview */}
                  <div className="h-14 flex items-center justify-center bg-paper dark:bg-nightInput rounded-lg my-1.5 p-1 border border-gray-100 dark:border-slate-800 overflow-hidden text-ink dark:text-slate-100">
                    <MathRenderer content={`$${formula.preview}$`} />
                  </div>
                  <div
                    className="text-[11px] font-mono text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/80 px-2 py-1 rounded truncate border border-gray-200 dark:border-slate-700"
                    title={formula.code}
                  >
                    {formula.code}
                  </div>
                </div>

                <div className="flex gap-1.5 mt-3 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleCopy(formula.code)}
                    className="flex-1 text-xs py-1 px-2 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold rounded font-newsreader transition cursor-pointer"
                  >
                    Sao chép
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsert(formula.code)}
                    className="flex-1 text-xs py-1 px-2 bg-cerulean hover:bg-blue-800 text-white font-bold rounded font-newsreader transition cursor-pointer"
                  >
                    Chèn
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFormulas.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-slate-500 font-newsreader">
              Không tìm thấy công thức nào phù hợp với từ khóa tra cứu.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 bg-white dark:bg-nightCard border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 shrink-0">
          <div className="text-xs text-gray-500 dark:text-slate-400 font-newsreader flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cerulean dark:bg-blue-400"></span>
            <span>
              Cú pháp: Dùng <code className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-300 rounded font-mono font-bold">$công thức$</code> để viết trong dòng, hoặc <code className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-300 rounded font-mono font-bold">$$công thức$$</code> cho khối riêng.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-newsreader font-bold text-sm cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
