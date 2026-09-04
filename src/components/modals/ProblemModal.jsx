import React, { useState, useEffect, useRef, useMemo } from 'react';
import MathRenderer from '../common/MathRenderer';
import { useData } from '../../context/DataContext';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';
import { PROVINCES_34 } from '../../constants/provinces';

export default function ProblemModal({
  isOpen,
  editingProblem,
  onClose,
  onOpenIssueModal,
  onOpenCategoryModal,
  onOpenLatexCheatsheet,
}) {
  const { issues, categories, problems, filterIssue, filterCategory, saveProblem } = useData();

  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [issueId, setIssueId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState(2);
  const [author, setAuthor] = useState('');
  const [province, setProvince] = useState('');
  const [content, setContent] = useState('');
  const [editorialSolution, setEditorialSolution] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown visibility states
  const [isIssueDropdownOpen, setIsIssueDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDiffDropdownOpen, setIsDiffDropdownOpen] = useState(false);
  const [isProvDropdownOpen, setIsProvDropdownOpen] = useState(false);

  // Dropdown search terms
  const [issueSearch, setIssueSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [provSearch, setProvSearch] = useState('');

  // Refs for textareas to insert math at cursor
  const contentRef = useRef(null);
  const editorialRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (editingProblem) {
        setId(editingProblem.id || '');
        setCode(editingProblem.code ? editingProblem.code.replace(/^[pP]/, '') : '');
        setIssueId(editingProblem.issueId || '');
        setCategoryId(editingProblem.categoryId || '');
        setDifficulty(editingProblem.difficulty || 2);
        setAuthor(editingProblem.author || '');
        setProvince(editingProblem.province || '');
        setContent(editingProblem.content || '');
        setEditorialSolution(editingProblem.editorialSolution || '');
      } else {
        setId('');
        // Auto calculate next problem code (P + [max + 1])
        let maxNum = 0;
        problems.forEach((p) => {
          if (p.code) {
            const m = p.code.match(/^P(\d+)$/i);
            if (m) {
              const n = parseInt(m[1], 10);
              if (!isNaN(n) && n > maxNum) maxNum = n;
            }
          }
        });
        setCode((maxNum > 0 ? maxNum + 1 : problems.length + 1).toString());
        setIssueId(filterIssue || (issues[0]?.id || ''));
        setCategoryId(filterCategory || (categories[0]?.id || ''));
        setDifficulty(2);
        setAuthor('');
        setProvince('');
        setContent('');
        setEditorialSolution('');
      }
    }
  }, [isOpen, editingProblem, filterIssue, filterCategory, problems, issues, categories]);

  // Insert math at cursor
  const insertMath = (targetField, snippet) => {
    const el = targetField === 'content' ? contentRef.current : editorialRef.current;
    if (!el) {
      if (targetField === 'content') setContent((prev) => prev + snippet);
      else setEditorialSolution((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const text = el.value;
    const nextText = text.substring(0, start) + snippet + text.substring(end);
    if (targetField === 'content') setContent(nextText);
    else setEditorialSolution(nextText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  // Filtered dropdown lists
  const filteredIssues = useMemo(() => {
    if (!issueSearch.trim()) return issues;
    return issues.filter((i) => i.name.toLowerCase().includes(issueSearch.toLowerCase()));
  }, [issues, issueSearch]);

  const filteredCategories = useMemo(() => {
    if (!catSearch.trim()) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()));
  }, [categories, catSearch]);

  const filteredProvinces = useMemo(() => {
    if (!provSearch.trim()) return PROVINCES_34;
    const term = provSearch.toLowerCase();
    return PROVINCES_34.filter(
      (p) => p.name.toLowerCase().includes(term) || (p.mergedFrom && p.mergedFrom.toLowerCase().includes(term))
    );
  }, [provSearch]);

  const selectedIssue = issues.find((i) => i.id === issueId);
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedDiff = DIFFICULTY_LEVELS.find((d) => d.level === difficulty) || DIFFICULTY_LEVELS[1];

  if (!isOpen) return null;

  const handleSave = async () => {
    setError('');
    try {
      setIsSubmitting(true);
      await saveProblem({
        id,
        code,
        difficulty,
        author,
        province,
        content,
        editorialSolution,
        issueId,
        categoryId,
      });
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu bài toán');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 z-[100] flex justify-center items-center backdrop-blur-sm px-4">
      <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-6xl xl:max-w-7xl h-[92vh] max-h-[880px] flex flex-col border border-gray-300 overflow-hidden animate-dropdownFade">
        {/* Header */}
        <div className="px-6 py-3.5 bg-paperDark border-b border-gray-200 flex justify-between items-center shrink-0">
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
              <h3 className="font-playfair text-2xl font-bold text-ink leading-none">
                {id ? 'Chỉnh Sửa Đề Bài' : 'Soạn Đề Bài Mới'}
              </h3>
              <p className="text-xs text-gray-500 font-newsreader mt-0.5">
                Tạp chí Pi — Soạn thảo đề bài và lời giải tòa soạn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-ink w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200/60 transition text-2xl font-bold leading-none cursor-pointer"
            title="Đóng"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl border flex items-start gap-2.5 shadow-xs font-newsreader text-sm transition-all mb-3 bg-red-50/95 border-red-200 text-jasper border-l-4 border-jasper">
              <svg className="w-5 h-5 text-jasper shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="font-bold font-playfair leading-tight">Lỗi:</p>
                <p className="text-ink mt-0.5">{error}</p>
              </div>
              <button type="button" onClick={() => setError('')} className="text-gray-400 hover:text-ink text-lg font-bold">&times;</button>
            </div>
          )}

          {/* Metadata Box */}
          <div className="bg-white p-3.5 md:p-4 rounded-xl border border-gray-200 shadow-sm shrink-0 relative z-30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-start">
              {/* 1. Số Phát Hành */}
              <div className="lg:col-span-3 relative z-30">
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-xs font-bold text-cerulean font-playfair uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Số Phát Hành <span className="text-jasper font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={onOpenIssueModal}
                    className="text-xs text-cerulean hover:underline font-bold cursor-pointer"
                  >
                    + Quản lý
                  </button>
                </div>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsIssueDropdownOpen(!isIssueDropdownOpen);
                      setIsCategoryDropdownOpen(false);
                      setIsDiffDropdownOpen(false);
                      setIsProvDropdownOpen(false);
                    }}
                    className="w-full h-10 flex items-center justify-between gap-2 bg-paper border border-gray-300 hover:border-cerulean focus:border-cerulean focus:ring-2 focus:ring-cerulean/20 text-ink rounded-lg px-3 font-newsreader shadow-2xs hover:shadow transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="w-2.5 h-2.5 rounded-full bg-cerulean shrink-0 shadow-xs"></span>
                      <span className="font-bold text-sm truncate text-gray-900">
                        {selectedIssue ? selectedIssue.name : '-- Chọn số phát hành --'}
                      </span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isIssueDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isIssueDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-paper border border-gray-300 rounded-xl shadow-2xl z-[1000] overflow-hidden min-w-[260px] animate-dropdownFade">
                      <div className="p-2 border-b border-gray-100 bg-white">
                        <input
                          type="text"
                          value={issueSearch}
                          onChange={(e) => setIssueSearch(e.target.value)}
                          placeholder="Tìm số phát hành..."
                          className="w-full text-xs md:text-sm font-newsreader px-2.5 py-1.5 bg-paper border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cerulean"
                        />
                      </div>
                      <ul className="max-h-56 overflow-y-auto divide-y divide-gray-100 p-1 font-newsreader">
                        {filteredIssues.map((iss) => (
                          <li key={iss.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setIssueId(iss.id);
                                setIsIssueDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm rounded-lg transition cursor-pointer flex items-center justify-between ${
                                issueId === iss.id ? 'bg-blue-50 text-cerulean font-bold' : 'hover:bg-gray-100 text-gray-800'
                              }`}
                            >
                              <span>{iss.name}</span>
                              {issueId === iss.id && (
                                <svg className="w-4 h-4 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Chuyên Mục */}
              <div className="lg:col-span-3 relative z-20">
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-xs font-bold text-jasper font-playfair uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-jasper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Chuyên Mục <span className="text-jasper font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={onOpenCategoryModal}
                    className="text-xs text-jasper hover:underline font-bold cursor-pointer"
                  >
                    + Quản lý
                  </button>
                </div>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                      setIsIssueDropdownOpen(false);
                      setIsDiffDropdownOpen(false);
                      setIsProvDropdownOpen(false);
                    }}
                    className="w-full h-10 flex items-center justify-between gap-2 bg-paper border border-gray-300 hover:border-jasper focus:border-jasper focus:ring-2 focus:ring-jasper/20 text-ink rounded-lg px-3 font-newsreader shadow-2xs hover:shadow transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="w-2.5 h-2.5 rounded-full bg-jasper shrink-0 shadow-xs"></span>
                      <span className="font-bold text-sm truncate text-gray-900">
                        {selectedCategory ? selectedCategory.name : '-- Chọn chuyên mục --'}
                      </span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-paper border border-gray-300 rounded-xl shadow-2xl z-[1000] overflow-hidden min-w-[260px] animate-dropdownFade">
                      <div className="p-2 border-b border-gray-100 bg-white">
                        <input
                          type="text"
                          value={catSearch}
                          onChange={(e) => setCatSearch(e.target.value)}
                          placeholder="Tìm chuyên mục..."
                          className="w-full text-xs md:text-sm font-newsreader px-2.5 py-1.5 bg-paper border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-jasper"
                        />
                      </div>
                      <ul className="max-h-56 overflow-y-auto divide-y divide-gray-100 p-1 font-newsreader">
                        {filteredCategories.map((c) => (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setCategoryId(c.id);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm rounded-lg transition cursor-pointer flex items-center justify-between ${
                                categoryId === c.id ? 'bg-red-50 text-jasper font-bold' : 'hover:bg-gray-100 text-gray-800'
                              }`}
                            >
                              <span>{c.name}</span>
                              {categoryId === c.id && (
                                <svg className="w-4 h-4 text-jasper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Mã Bài (P + số) */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-cerulean font-playfair uppercase tracking-wider mb-1.5 h-5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Mã Bài <span className="text-jasper font-bold">*</span>
                </label>
                <div className="w-full h-10 flex items-center border border-gray-300 bg-paper rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cerulean focus-within:border-cerulean transition shadow-2xs">
                  <span className="h-full px-3 flex items-center justify-center bg-blue-50/90 text-cerulean font-mono font-black border-r border-gray-300 select-none text-sm tracking-wider">
                    P
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="1"
                    className="w-full h-full px-2.5 py-0 border-0 bg-transparent font-bold font-mono text-ink outline-none text-sm md:text-base leading-normal"
                  />
                </div>
              </div>

              {/* 4. Mức Độ Khó */}
              <div className="lg:col-span-3 relative z-10">
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-xs font-bold text-ink font-playfair uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Mức Độ Khó <span className="text-jasper font-bold">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-newsreader italic">5 cấp độ</span>
                </div>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDiffDropdownOpen(!isDiffDropdownOpen);
                      setIsIssueDropdownOpen(false);
                      setIsCategoryDropdownOpen(false);
                      setIsProvDropdownOpen(false);
                    }}
                    className="w-full h-10 flex items-center justify-between gap-2 bg-paper border border-gray-300 hover:border-cerulean focus:border-cerulean focus:ring-2 focus:ring-cerulean/20 text-ink rounded-lg px-3 font-newsreader shadow-2xs hover:shadow transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className={`w-2.5 h-2.5 rounded-full ${selectedDiff.dotClass} shrink-0 shadow-xs`}></span>
                      <span className={`${selectedDiff.starColor} text-xs sm:text-sm tracking-tighter shrink-0 font-sans font-bold`}>
                        {selectedDiff.stars}
                      </span>
                      <span className="font-bold text-xs sm:text-sm truncate text-gray-900">
                        {selectedDiff.name} ({selectedDiff.desc})
                      </span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDiffDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDiffDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-paper border border-gray-300 rounded-xl shadow-2xl z-[1000] overflow-hidden min-w-[260px] animate-dropdownFade">
                      <ul className="divide-y divide-gray-100 p-1 font-newsreader">
                        {DIFFICULTY_LEVELS.map((d) => {
                          const isSel = difficulty === d.level;
                          return (
                            <li key={d.level}>
                              <button
                                type="button"
                                onClick={() => {
                                  setDifficulty(d.level);
                                  setIsDiffDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-left cursor-pointer ${
                                  isSel ? (d.level >= 4 ? 'bg-red-50 text-jasper font-bold' : 'bg-blue-50 text-cerulean font-bold') : 'hover:bg-gray-100 text-gray-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className={`w-2.5 h-2.5 rounded-full ${d.dotClass} shrink-0 shadow-xs`}></span>
                                  <span className="font-bold text-sm text-gray-900">{d.name}</span>
                                  <span className="text-xs text-gray-500 italic">({d.desc})</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`${d.starColor} text-xs font-mono font-bold tracking-tighter`}>{d.stars}</span>
                                  {isSel && (
                                    <svg className={`w-4 h-4 ${d.level >= 4 ? 'text-jasper' : 'text-cerulean'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Tác Giả & Tỉnh Thành */}
            <div className="border-t border-gray-100 my-3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              {/* Tác giả */}
              <div>
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-xs font-bold text-cerulean font-playfair uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Tác Giả Đề Bài
                  </label>
                  <span className="text-[11px] text-gray-400 font-newsreader italic">In nghiêng</span>
                </div>
                <div className="w-full h-10 flex items-center border border-gray-300 bg-paper rounded-lg px-3 focus-within:ring-2 focus-within:ring-cerulean focus-within:border-cerulean transition shadow-2xs">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ví dụ: Trần Nam Dũng, Nguyễn Văn A..."
                    className="w-full h-full border-0 bg-transparent font-newsreader text-ink outline-none text-sm md:text-base leading-normal"
                  />
                </div>
              </div>

              {/* Tỉnh thành 34 sau sáp nhập */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-xs font-bold text-jasper font-playfair uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-jasper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tỉnh / Thành Phố <span className="text-[11px] font-normal font-newsreader lowercase text-gray-500">(sau sáp nhập)</span>
                  </label>
                  <span className="text-[11px] text-jasper font-newsreader font-bold">34 tỉnh thành</span>
                </div>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProvDropdownOpen(!isProvDropdownOpen);
                      setIsIssueDropdownOpen(false);
                      setIsCategoryDropdownOpen(false);
                      setIsDiffDropdownOpen(false);
                    }}
                    className="w-full h-10 flex items-center justify-between gap-2 bg-paper border border-gray-300 hover:border-jasper focus:border-jasper focus:ring-2 focus:ring-jasper/20 text-ink rounded-lg px-3 font-newsreader shadow-2xs hover:shadow transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="w-2.5 h-2.5 rounded-full bg-jasper shrink-0 shadow-xs"></span>
                      <span className={`text-sm truncate ${province ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>
                        {province || '-- Chọn tỉnh / thành phố --'}
                      </span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProvDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProvDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-paper border border-gray-300 rounded-xl shadow-2xl z-[1000] overflow-hidden min-w-[280px] animate-dropdownFade">
                      <div className="p-2 border-b border-gray-100 bg-white">
                        <input
                          type="text"
                          value={provSearch}
                          onChange={(e) => setProvSearch(e.target.value)}
                          placeholder="Tìm nhanh tỉnh thành (hoặc tỉnh cũ)..."
                          className="w-full text-xs md:text-sm font-newsreader px-2.5 py-1.5 bg-paper border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-jasper"
                        />
                      </div>
                      <ul className="max-h-56 overflow-y-auto divide-y divide-gray-100 p-1 font-newsreader">
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              setProvince('');
                              setIsProvDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition cursor-pointer flex items-center justify-between ${
                              !province ? 'bg-red-50 text-jasper font-bold' : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span className="italic text-gray-500">-- Không chọn tỉnh thành --</span>
                          </button>
                        </li>
                        {filteredProvinces.map((prov) => (
                          <li key={prov.name}>
                            <button
                              type="button"
                              onClick={() => {
                                setProvince(prov.name);
                                setIsProvDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm rounded-lg transition cursor-pointer flex items-center justify-between ${
                                province === prov.name ? 'bg-red-50 text-jasper font-bold' : 'hover:bg-gray-100 text-gray-800'
                              }`}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className={`text-sm font-semibold truncate ${province === prov.name ? 'text-jasper font-bold' : 'text-gray-900'}`}>
                                  {prov.name}
                                </span>
                                {prov.mergedFrom ? (
                                  <span className="text-[11px] text-gray-500 italic truncate">Gồm: {prov.mergedFrom}</span>
                                ) : (
                                  <span className="text-[11px] text-gray-400 italic">Giữ nguyên</span>
                                )}
                              </div>
                              {prov.mergedFrom && (
                                <span className="text-[10px] bg-red-50 text-jasper border border-red-200 px-1.5 py-0.5 rounded font-mono shrink-0 ml-1">
                                  Sáp nhập
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-side Editors: Đề Bài & Lời Giải Tòa Soạn */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Problem Content */}
            <div className="bg-white p-4 rounded-xl border border-cerulean/20 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-1.5 shrink-0">
                <label className="text-xs font-bold text-cerulean font-playfair uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cerulean"></span>
                  Đề Bài Toán ($ và $$) <span className="text-jasper font-bold">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => onOpenLatexCheatsheet((snippet) => insertMath('content', snippet))}
                  className="px-2.5 py-1 bg-cerulean text-white hover:bg-blue-900 rounded-md font-bold text-xs flex items-center gap-1.5 transition shadow-2xs font-newsreader cursor-pointer"
                  title="Mở danh mục tra cứu tất cả công thức toán LaTeX"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Tra Cứu LaTeX</span>
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 mb-2 p-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono shrink-0">
                <button type="button" onClick={() => insertMath('content', '$\\frac{a}{b}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">a/b</button>
                <button type="button" onClick={() => insertMath('content', '$x^2$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">x²</button>
                <button type="button" onClick={() => insertMath('content', '$x_1$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">x₁</button>
                <button type="button" onClick={() => insertMath('content', '$\\sqrt{x}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">√x</button>
                <button type="button" onClick={() => insertMath('content', '$\\triangle ABC$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">△ABC</button>
                <button type="button" onClick={() => insertMath('content', '$\\widehat{A}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">∠A</button>
                <button type="button" onClick={() => insertMath('content', '$\\vec{u}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">v⃗</button>
                <button type="button" onClick={() => insertMath('content', '$\\le$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">≤</button>
                <button type="button" onClick={() => insertMath('content', '$\\ge$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">≥</button>
                <button type="button" onClick={() => insertMath('content', '$\\neq$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">≠</button>
                <button type="button" onClick={() => insertMath('content', '$\\perp$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">⊥</button>
                <button type="button" onClick={() => insertMath('content', '$\\parallel$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">∥</button>
                <button type="button" onClick={() => insertMath('content', '$\\pi$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">π</button>
                <button type="button" onClick={() => insertMath('content', '$$\\dots$$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">$$...$$</button>
                <button type="button" onClick={() => insertMath('content', '$$\\begin{cases} x + y = 1 \\\\\\\\ x - y = 0 \\end{cases}$$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-cerulean font-bold">Hệ PT</button>
              </div>

              <textarea
                ref={contentRef}
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung đề bài tại đây... (Dùng $ để viết công thức toán)"
                className="w-full border border-gray-300 bg-paper rounded-lg p-2.5 font-newsreader text-base focus:outline-none focus:ring-2 focus:ring-cerulean transition h-28 md:h-32 resize-y mb-2"
              />

              <div className="p-2.5 bg-blue-50/30 border border-blue-100 rounded-lg text-sm font-newsreader">
                <div className="text-[11px] font-bold text-cerulean uppercase tracking-wider mb-1 flex items-center gap-1">
                  <svg className="w-3 h-3 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem trước đề bài:
                </div>
                <div className="min-h-[44px] max-h-[110px] overflow-y-auto text-ink leading-relaxed">
                  <MathRenderer content={content} />
                </div>
              </div>
            </div>

            {/* Right: Editorial Solution */}
            <div className="bg-white p-4 rounded-xl border border-jasper/20 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-1.5 shrink-0">
                <label className="text-xs font-bold text-jasper font-playfair uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-jasper"></span>
                  Lời Giải Tòa Soạn (Editorial)
                </label>
                <button
                  type="button"
                  onClick={() => onOpenLatexCheatsheet((snippet) => insertMath('editorial', snippet))}
                  className="px-2.5 py-1 bg-jasper text-white hover:bg-red-800 rounded-md font-bold text-xs flex items-center gap-1.5 transition shadow-2xs font-newsreader cursor-pointer"
                  title="Mở danh mục tra cứu tất cả công thức toán LaTeX"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Tra Cứu LaTeX</span>
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 mb-2 p-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono shrink-0">
                <button type="button" onClick={() => insertMath('editorial', '$\\frac{a}{b}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">a/b</button>
                <button type="button" onClick={() => insertMath('editorial', '$x^2$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">x²</button>
                <button type="button" onClick={() => insertMath('editorial', '$x_1$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">x₁</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\sqrt{x}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">√x</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\triangle ABC$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">△ABC</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\widehat{A}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">∠A</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\vec{u}$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">v⃗</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\le$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">≤</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\ge$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">≥</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\neq$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">≠</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\perp$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">⊥</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\parallel$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">∥</button>
                <button type="button" onClick={() => insertMath('editorial', '$\\pi$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">π</button>
                <button type="button" onClick={() => insertMath('editorial', '$$\\dots$$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">$$...$$</button>
                <button type="button" onClick={() => insertMath('editorial', '$$\\begin{cases} x + y = 1 \\\\\\\\ x - y = 0 \\end{cases}$$')} className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-jasper font-bold">Hệ PT</button>
              </div>

              <textarea
                ref={editorialRef}
                rows={4}
                value={editorialSolution}
                onChange={(e) => setEditorialSolution(e.target.value)}
                placeholder="Nhập lời giải chính thức từ tòa soạn... (Có thể bổ sung sau)"
                className="w-full border border-gray-300 bg-paper rounded-lg p-2.5 font-newsreader text-base focus:outline-none focus:ring-2 focus:ring-jasper transition h-28 md:h-32 resize-y mb-2"
              />

              <div className="p-2.5 bg-red-50/30 border border-red-100 rounded-lg text-sm font-newsreader">
                <div className="text-[11px] font-bold text-jasper uppercase tracking-wider mb-1 flex items-center gap-1">
                  <svg className="w-3 h-3 text-jasper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem trước lời giải tòa soạn:
                </div>
                <div className="min-h-[44px] max-h-[110px] overflow-y-auto text-ink leading-relaxed">
                  <MathRenderer content={editorialSolution} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-paperDark border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-xs text-gray-500 font-newsreader flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cerulean"></span>
            <span>
              Nhấn <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-xs text-gray-700 shadow-xs">Ctrl + Enter</kbd> để lưu nhanh bài toán
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-newsreader font-bold text-sm cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-ink text-white px-7 py-2 rounded-lg hover:bg-gray-800 transition font-playfair font-bold text-base shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Lưu Bài Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
