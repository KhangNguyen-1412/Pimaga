import React, { useState, useRef, useEffect } from 'react';
import MathRenderer from '../common/MathRenderer';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';
import { uploadDiagramImage, insertImageMarkdown, extractImageFromClipboard } from '../../utils/imageUpload';

export default function ProblemDetailPage({
  problem,
  issueName = 'Không rõ Số',
  catName = 'Không rõ Chuyên mục',
  userSolution,
  onOpenSolution,
  onOpenLatexCheatsheet,
  onEditProblem,
  onDeleteProblem,
  onBackToList,
  prevProblem,
  nextProblem,
  onSelectProblem,
}) {
  const { showToast } = useToast();
  const { saveUserSolution, isBookmarked, toggleBookmark } = useData();
  const [copied, setCopied] = useState(false);
  const bookmarked = isBookmarked(problem?.id);
  // Default to false for spoiler protection unless user already solved it
  const [showEditorialSolution, setShowEditorialSolution] = useState(!!userSolution);

  // Inline solution editing state (Trực tiếp trên trang, không che đề bài)
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [solutionDraft, setSolutionDraft] = useState('');
  const [isSubmittingSolution, setIsSubmittingSolution] = useState(false);
  const [solutionError, setSolutionError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const inlineTextareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleProcessImage = async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    showToast('Đang xử lý và tải hình vẽ lên...', 'info');
    try {
      const res = await uploadDiagramImage(file);
      insertImageMarkdown(
        inlineTextareaRef.current,
        solutionDraft,
        setSolutionDraft,
        res.url,
        file.name || 'Hình vẽ lời giải'
      );
      showToast('Đã chèn hình vẽ thành công!', 'success');
    } catch (err) {
      showToast(err.message || 'Lỗi khi tải ảnh lên', 'error');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePaste = (e) => {
    const imageFile = extractImageFromClipboard(e);
    if (imageFile) {
      e.preventDefault();
      handleProcessImage(imageFile);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessImage(file);
    }
  };

  // Sync draft when userSolution or problem changes
  useEffect(() => {
    if (userSolution) {
      setSolutionDraft(userSolution);
      setShowEditorialSolution(true);
    } else {
      setSolutionDraft('');
    }
    setIsEditingSolution(false);
    setSolutionError('');
  }, [problem?.id, userSolution]);

  // Handle Ctrl+Enter to save inline
  useEffect(() => {
    if (!isEditingSolution) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSaveInlineSolution();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingSolution, solutionDraft, problem]);

  const handleStartEditing = () => {
    setSolutionDraft(userSolution || '');
    setSolutionError('');
    setIsEditingSolution(true);
    setTimeout(() => {
      if (inlineTextareaRef.current) {
        inlineTextareaRef.current.focus();
      }
    }, 80);
  };

  const handleCancelEditing = () => {
    setSolutionDraft(userSolution || '');
    setSolutionError('');
    setIsEditingSolution(false);
  };

  const insertMathToDraft = (snippet) => {
    const el = inlineTextareaRef.current;
    if (!el) {
      setSolutionDraft((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const text = el.value;
    const nextText = text.substring(0, start) + snippet + text.substring(end);
    setSolutionDraft(nextText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  const handleSaveInlineSolution = async () => {
    setSolutionError('');
    if (!solutionDraft.trim()) {
      setSolutionError('Vui lòng nhập nội dung bài làm trước khi lưu!');
      return;
    }

    try {
      setIsSubmittingSolution(true);
      await saveUserSolution(problem.id, solutionDraft);
      setIsEditingSolution(false);
      setShowEditorialSolution(true);
    } catch (err) {
      setSolutionError(err.message || 'Lỗi khi lưu bài làm');
    } finally {
      setIsSubmittingSolution(false);
    }
  };

  if (!problem) {
    return (
      <div className="bg-white dark:bg-nightCard rounded-2xl border border-gray-300 dark:border-slate-800 p-12 text-center my-8 shadow-sm">
        <h3 className="font-playfair text-2xl font-bold text-jasper dark:text-rose-400 mb-3">Không tìm thấy bài toán</h3>
        <p className="font-newsreader text-gray-600 dark:text-slate-300 text-lg mb-6">
          Bài toán bạn đang tìm kiếm không tồn tại hoặc đã được xóa.
        </p>
        <button
          type="button"
          onClick={onBackToList}
          className="btn-primary inline-flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Quay lại danh sách đề bài</span>
        </button>
      </div>
    );
  }

  const diffData = DIFFICULTY_LEVELS.find((d) => d.level === problem.difficulty);
  const problemHeaderTitle = problem.code
    ? problem.code.startsWith('Bài')
      ? problem.code
      : `Bài ${problem.code}`
    : problem.title || 'Bài Toán';

  const handleCopyLink = async () => {
    const codeSlug = (problem.code || problem.id || '').toLowerCase().replace(/\s+/g, '');
    const fullUrl = `${window.location.origin}/bai-toan/${codeSlug}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const temp = document.createElement('textarea');
        temp.value = fullUrl;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      setCopied(true);
      showToast(`Đã sao chép liên kết: ${fullUrl}`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      showToast('Lỗi sao chép: ' + e.message, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-dropdownFade pb-16">
      {/* Navigation & Breadcrumbs Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-paperDark dark:bg-nightCard p-4 md:px-6 rounded-xl border border-gray-200/80 dark:border-slate-800 shadow-2xs transition-colors">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm font-newsreader text-gray-600 dark:text-slate-400">
          <button
            type="button"
            onClick={onBackToList}
            className="hover:text-cerulean dark:hover:text-blue-400 hover:underline font-bold cursor-pointer transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Trang chủ</span>
          </button>
          <span className="text-gray-400 dark:text-slate-600 select-none">/</span>
          <span className="text-cerulean dark:text-blue-400 font-semibold">{issueName}</span>
          <span className="text-gray-400 dark:text-slate-600 select-none">/</span>
          <span className="text-jasper dark:text-rose-400 font-semibold">{catName}</span>
          <span className="text-gray-400 dark:text-slate-600 select-none">/</span>
          <span className="font-bold text-ink dark:text-slate-200">{problem.code || 'Chi tiết'}</span>
        </nav>

        {/* Back Button & Pager Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={onBackToList}
            className="text-xs md:text-sm bg-white dark:bg-nightInput hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title="Quay lại danh sách các bài toán"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Quay lại</span>
          </button>

          {/* Previous / Next Problem Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => prevProblem && onSelectProblem(prevProblem)}
              disabled={!prevProblem}
              className={`text-xs md:text-sm px-2.5 py-1.5 rounded-lg border font-bold flex items-center gap-1 transition ${
                prevProblem
                  ? 'bg-white dark:bg-nightInput text-ink dark:text-slate-200 hover:bg-cerulean dark:hover:bg-blue-600 hover:text-white border-gray-300 dark:border-slate-700 shadow-2xs cursor-pointer'
                  : 'bg-gray-100 dark:bg-slate-900/60 text-gray-400 dark:text-slate-600 border-gray-200 dark:border-slate-800 cursor-not-allowed'
              }`}
              title={prevProblem ? `Bài trước: ${prevProblem.code || prevProblem.title}` : 'Không có bài trước'}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden md:inline">Trước</span>
            </button>
            <button
              type="button"
              onClick={() => nextProblem && onSelectProblem(nextProblem)}
              disabled={!nextProblem}
              className={`text-xs md:text-sm px-2.5 py-1.5 rounded-lg border font-bold flex items-center gap-1 transition ${
                nextProblem
                  ? 'bg-white dark:bg-nightInput text-ink dark:text-slate-200 hover:bg-cerulean dark:hover:bg-blue-600 hover:text-white border-gray-300 dark:border-slate-700 shadow-2xs cursor-pointer'
                  : 'bg-gray-100 dark:bg-slate-900/60 text-gray-400 dark:text-slate-600 border-gray-200 dark:border-slate-800 cursor-not-allowed'
              }`}
              title={nextProblem ? `Bài tiếp: ${nextProblem.code || nextProblem.title}` : 'Không có bài kế tiếp'}
            >
              <span className="hidden md:inline">Sau</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Problem Statement Article */}
      <article className="bg-white dark:bg-nightCard p-6 sm:p-10 md:p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 relative transition-colors">
        {/* Top actions: Share + Admin */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            {problem.code && (
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-cerulean text-white font-mono font-black text-base tracking-wider shadow-xs border border-blue-900 select-none">
                {problem.code}
              </span>
            )}
            <span className="text-xs md:text-sm font-bold text-jasper dark:text-rose-400 tracking-widest uppercase">{catName}</span>
            <span className="text-gray-300 dark:text-slate-700 select-none">•</span>
            <span className="text-xs md:text-sm font-bold text-cerulean dark:text-blue-400 tracking-wider uppercase">{issueName}</span>
            {diffData && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border shadow-xs ${diffData.colorClass}`}
                title={`Mức độ: ${diffData.name} (${diffData.desc})`}
              >
                <span className={`${diffData.starColor} font-sans tracking-tighter text-xs leading-none`}>
                  {diffData.stars}
                </span>
                <span className="font-playfair tracking-wide leading-none">{diffData.name}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share link button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-xs md:text-sm bg-gray-50 dark:bg-nightInput hover:bg-blue-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-cerulean dark:hover:text-blue-400 border border-gray-200 dark:border-slate-700 hover:border-cerulean/30 px-3 py-1.5 rounded-lg transition shadow-2xs font-newsreader font-bold flex items-center gap-1.5 cursor-pointer"
              title="Sao chép đường dẫn bài toán"
            >
              {copied ? (
                <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
              <span>{copied ? 'Đã sao chép link' : 'Chia sẻ bài'}</span>
            </button>

            {/* Bookmark Button */}
            {problem?.id && (
              <button
                type="button"
                onClick={() => toggleBookmark(problem.id)}
                className={`text-xs md:text-sm px-3 py-1.5 rounded-lg transition shadow-2xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                  bookmarked
                    ? 'bg-red-50 dark:bg-rose-950/60 border-jasper/40 dark:border-rose-800 text-jasper dark:text-rose-300'
                    : 'bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-jasper dark:hover:text-rose-400 border-gray-200 dark:border-slate-700 hover:border-jasper/30'
                }`}
                title={bookmarked ? 'Bỏ lưu bài toán khỏi hồ sơ cá nhân' : 'Lưu bài toán vào hồ sơ cá nhân'}
              >
                <svg
                  className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : 'fill-none'}`}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span>{bookmarked ? 'Đã lưu bài' : 'Lưu bài'}</span>
              </button>
            )}

            {/* Admin Controls */}
            {onEditProblem && (
              <button
                type="button"
                onClick={() => onEditProblem(problem)}
                className="text-xs md:text-sm bg-gray-100 dark:bg-slate-800 hover:bg-cerulean dark:hover:bg-blue-600 hover:text-white text-gray-700 dark:text-slate-200 px-3 py-1.5 rounded-lg transition shadow-2xs font-bold flex items-center gap-1 cursor-pointer"
                title="Chỉnh sửa đề bài"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Sửa Đề</span>
              </button>
            )}
            {onDeleteProblem && (
              <button
                type="button"
                onClick={() => onDeleteProblem(problem)}
                className="text-xs md:text-sm bg-gray-100 dark:bg-slate-800 hover:bg-jasper dark:hover:bg-rose-600 hover:text-white text-jasper dark:text-rose-400 px-3 py-1.5 rounded-lg transition shadow-2xs font-bold flex items-center gap-1 cursor-pointer"
                title="Xóa bài toán"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Xóa Đề</span>
              </button>
            )}
          </div>
        </div>

        {/* Big Problem Header Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-black text-ink dark:text-slate-100 leading-tight mb-4">
          {problemHeaderTitle}
        </h1>

        {/* Author Line */}
        {(problem.author || problem.province) && (
          <div className="mb-8 flex items-center gap-2 text-gray-700 dark:text-slate-300 font-newsreader text-lg md:text-xl">
            <svg className="w-5 h-5 text-cerulean dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>
              {problem.author && <span className="italic font-bold text-ink dark:text-slate-100">{problem.author}</span>}
              {problem.author && problem.province && <span className="text-gray-500 dark:text-slate-500 not-italic">, </span>}
              {problem.province && <span className="italic text-gray-700 dark:text-slate-300">{problem.province}</span>}
            </span>
          </div>
        )}

        {/* Problem Statement Box */}
        <div className="bg-paper dark:bg-nightInput p-6 sm:p-8 rounded-xl border border-gray-200/90 dark:border-slate-800 shadow-inner font-newsreader text-xl sm:text-2xl text-ink dark:text-slate-100 leading-relaxed transition-colors">
          <MathRenderer content={problem.content} />
        </div>
      </article>

      {/* Solving & Solutions Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: User's Solution (BÀI LÀM CỦA BẠN - Focus Area / Inline Workspace) */}
        <div
          className={`bg-white dark:bg-nightCard rounded-2xl border-2 border-cerulean/60 dark:border-blue-500/60 shadow-md p-5 sm:p-7 flex flex-col justify-between transition-all ${
            isEditingSolution ? 'lg:col-span-2 ring-4 ring-cerulean/10 dark:ring-blue-500/20' : ''
          }`}
        >
          {isEditingSolution ? (
            /* --- INLINE EDITING MODE (Đề bài ở ngay phía trên, không bị che) --- */
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/70 text-cerulean dark:text-blue-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-cerulean dark:text-blue-400">Soạn Lời Giải Trực Tiếp</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                      Đề bài hiển thị đầy đủ ngay phía trên — không bị che khuất
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenSolution(problem)}
                    className="text-xs text-gray-600 dark:text-slate-300 hover:text-cerulean dark:hover:text-blue-400 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-cerulean transition font-newsreader flex items-center gap-1.5 cursor-pointer"
                    title="Mở trong cửa sổ popup lớn"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>Mở Cửa Sổ Lớn</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    className="text-xs text-gray-500 dark:text-slate-400 hover:text-ink dark:hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition font-newsreader cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>

              {/* Error message */}
              {solutionError && (
                <div className="p-3 rounded-xl border flex items-start gap-2.5 bg-red-50/95 dark:bg-rose-950/50 border-red-200 dark:border-rose-900 text-jasper dark:text-rose-400 text-sm font-newsreader">
                  <svg className="w-5 h-5 text-jasper dark:text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="flex-1">{solutionError}</span>
                </div>
              )}

              {/* Quick Math Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-blue-50/50 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 rounded-lg">
                <div className="flex flex-wrap gap-1 text-xs font-mono">
                  <button type="button" onClick={() => insertMathToDraft('$\\frac{a}{b}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">a/b</button>
                  <button type="button" onClick={() => insertMathToDraft('$x^2$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">x²</button>
                  <button type="button" onClick={() => insertMathToDraft('$x_1$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">x₁</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\sqrt{x}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">√x</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\triangle ABC$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">△ABC</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\widehat{A}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">∠A</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\vec{u}$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">v⃗</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\le$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">≤</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\ge$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">≥</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\neq$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">≠</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\perp$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">⊥</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\parallel$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">∥</button>
                  <button type="button" onClick={() => insertMathToDraft('$\\pi$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">π</button>
                  <button type="button" onClick={() => insertMathToDraft('$$\\dots$$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">$$...$$</button>
                  <button type="button" onClick={() => insertMathToDraft('$$\\begin{cases} x + y = 1 \\\\\\\\ x - y = 0 \\end{cases}$$')} className="px-2 py-0.5 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded hover:bg-blue-100 dark:hover:bg-slate-800 hover:text-cerulean dark:hover:text-blue-400 text-gray-800 dark:text-slate-200 font-bold">Hệ PT</button>
                </div>

                {onOpenLatexCheatsheet && (
                  <button
                    type="button"
                    onClick={() => onOpenLatexCheatsheet((snippet) => insertMathToDraft(snippet))}
                    className="px-2.5 py-1 bg-cerulean text-white hover:bg-blue-900 rounded font-bold text-xs flex items-center gap-1.5 transition shadow-2xs font-newsreader cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Tra Cứu LaTeX</span>
                  </button>
                )}
              </div>

              {/* Editor + Live Preview Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Input */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-cerulean dark:text-blue-400 font-playfair uppercase tracking-wider">
                      Nội dung bài giải ($ hoặc $$):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="px-2.5 py-0.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded hover:bg-blue-100/80 dark:hover:bg-blue-900/60 hover:border-cerulean dark:hover:border-blue-400 text-cerulean dark:text-blue-400 font-sans text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs"
                        title="Tải ảnh lên hoặc chụp màn hình rồi bấm Ctrl + V vào ô bên dưới để dán hình"
                      >
                        {isUploadingImage ? (
                          <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                        <span>{isUploadingImage ? 'Đang tải...' : 'Chèn hình'}</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n\n\\begin{tikzpicture}[scale=1.2]\n  \\tkzDefPoint(0,0){B}\n  \\tkzDefPoint(4,0){C}\n  \\tkzDefPoint(1,3){A}\n  \\tkzDrawPolygon[thick](A,B,C)\n  \\tkzDrawPoints(A,B,C)\n  \\tkzLabelPoints(B,C)\n  \\tkzLabelPoints[above](A)\n\\end{tikzpicture}\n\n`;
                          const el = inlineTextareaRef.current;
                          if (!el) {
                            setSolutionDraft((prev) => prev + snippet);
                            return;
                          }
                          const start = el.selectionStart ?? solutionDraft.length;
                          const end = el.selectionEnd ?? solutionDraft.length;
                          const next = solutionDraft.substring(0, start) + snippet + solutionDraft.substring(end);
                          setSolutionDraft(next);
                          setTimeout(() => {
                            el.focus();
                            el.setSelectionRange(start + snippet.length, start + snippet.length);
                          }, 50);
                        }}
                        className="px-2.5 py-0.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded hover:bg-blue-100/80 dark:hover:bg-blue-900/60 hover:border-cerulean dark:hover:border-blue-400 text-cerulean dark:text-blue-400 font-sans text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                        title="Chèn mẫu mã LaTeX TikZ để tự động vẽ hình hình học"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16h16L4 4z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13h4L8 9v4z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h2.5M4 10h3.5M4 16h2.5" />
                        </svg>
                        <span>Vẽ TikZ</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    ref={inlineTextareaRef}
                    value={solutionDraft}
                    onChange={(e) => setSolutionDraft(e.target.value)}
                    onPaste={handlePaste}
                    rows={8}
                    className="w-full flex-1 min-h-[180px] md:min-h-[220px] max-h-[360px] overflow-y-auto border border-cerulean/40 dark:border-blue-500/40 focus:border-cerulean focus:ring-2 focus:ring-cerulean/20 bg-blue-50/20 dark:bg-nightInput rounded-lg p-3 font-newsreader text-base text-ink dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 outline-none transition resize-y leading-relaxed custom-scrollbar"
                    placeholder="Nhập các bước lập luận, biến đổi toán học vào đây. Dùng $...$ cho công thức nằm trong dòng, $$...$$ cho công thức đứng riêng dòng, hoặc Ctrl + V để dán hình vẽ..."
                  />
                </div>

                {/* Right: Live Preview */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-cerulean dark:text-blue-400 font-playfair uppercase tracking-wider mb-1.5">
                    Xem trước trực tiếp (KaTeX Preview):
                  </label>
                  <div className="flex-1 min-h-[180px] md:min-h-[220px] max-h-[360px] overflow-y-auto p-3.5 bg-paper dark:bg-nightInput border border-gray-200 dark:border-slate-800 rounded-lg text-ink dark:text-slate-100 font-newsreader text-base leading-relaxed shadow-inner custom-scrollbar">
                    {solutionDraft.trim() ? (
                      <MathRenderer content={solutionDraft} />
                    ) : (
                      <p className="text-gray-400 dark:text-slate-500 italic text-sm">
                        Kết quả hiển thị công thức sẽ xuất hiện trực tiếp tại đây khi bạn nhập bài giải...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-slate-800 mt-1">
                <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                  Mẹo: Nhấn <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded font-mono text-xs text-gray-700 dark:text-slate-300 shadow-2xs">Ctrl + Enter</kbd> để lưu nhanh bài làm
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-newsreader font-bold text-sm cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInlineSolution}
                    disabled={isSubmittingSolution}
                    className="bg-cerulean text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-playfair font-bold text-sm shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{isSubmittingSolution ? 'Đang lưu...' : 'Lưu Bài Làm'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* --- VIEW MODE --- */
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/70 text-cerulean dark:text-blue-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-cerulean dark:text-blue-400">Bài Làm Của Bạn</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                      {userSolution ? 'Đã lưu lời giải cá nhân' : 'Chưa có lời giải'}
                    </p>
                  </div>
                </div>

                {/* Action button in header */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    className="btn-primary text-xs md:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>{userSolution ? 'Sửa Bài Làm' : 'Làm Bài Này'}</span>
                  </button>
                </div>
              </div>

              {/* Solution Content or Empty State */}
              {userSolution ? (
                <div>
                  <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-cerulean/20 dark:border-blue-800/50 p-5 rounded-xl font-newsreader text-lg text-ink dark:text-slate-100 leading-relaxed max-h-[420px] overflow-y-auto pr-3 custom-scrollbar">
                    <MathRenderer content={userSolution} />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleStartEditing}
                      className="text-xs font-bold text-cerulean dark:text-blue-400 hover:underline flex items-center gap-1 font-newsreader cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Tiếp tục chỉnh sửa bài làm</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-paper dark:bg-nightInput p-8 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-center flex flex-col items-center justify-center my-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-ink dark:text-slate-100 mb-1.5">Bạn chưa giải bài toán này</h4>
                  <p className="font-newsreader text-gray-500 dark:text-slate-400 text-base max-w-md mb-5">
                    Hãy thử sức tư duy, đặt bút giải và lưu lại bài làm của bạn để rèn luyện kỹ năng và đối chiếu với lời giải Tòa soạn!
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleStartEditing}
                      className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-base">Bắt Đầu Làm Bài</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Editorial Solution (LỜI GIẢI TÒA SOẠN - Anti-spoiler protected) */}
        <div className="bg-white dark:bg-nightCard rounded-2xl border border-gray-300 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-rose-950/60 text-jasper dark:text-rose-400 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-jasper dark:text-rose-400">Lời Giải Tòa Soạn</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">Đáp án & bình luận từ Ban Biên Tập Pi</p>
                </div>
              </div>

              {/* Toggle Spoiler Button */}
              {problem.editorialSolution && (
                <button
                  type="button"
                  onClick={() => setShowEditorialSolution((prev) => !prev)}
                  className={`text-xs md:text-sm px-3.5 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    showEditorialSolution
                      ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700'
                      : 'bg-red-50 dark:bg-rose-950/40 text-jasper dark:text-rose-400 border-jasper/40 dark:border-rose-900 hover:bg-red-100 dark:hover:bg-rose-900/60'
                  }`}
                >
                  {showEditorialSolution ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                      <span>Ẩn Lời Giải</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Hiện Lời Giải</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Editorial Solution Display */}
            {problem.editorialSolution ? (
              showEditorialSolution ? (
                <div className="bg-gray-50 dark:bg-nightInput border-l-4 border-jasper p-5 rounded-r-xl font-newsreader text-lg text-gray-900 dark:text-slate-100 leading-relaxed animate-dropdownFade max-h-[420px] overflow-y-auto pr-3 custom-scrollbar">
                  <MathRenderer content={problem.editorialSolution} />
                </div>
              ) : (
                <div className="bg-paper dark:bg-nightInput p-8 rounded-xl border border-gray-200 dark:border-slate-800 text-center flex flex-col items-center justify-center my-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-400 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-ink dark:text-slate-100 mb-1.5">Lời giải đang được ẩn</h4>
                  <p className="font-newsreader text-gray-500 dark:text-slate-400 text-base max-w-sm mb-4">
                    Để rèn luyện tư duy tốt nhất, hãy cố gắng tự tìm lời giải trước khi mở xem đáp án của Tòa soạn.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowEditorialSolution(true)}
                    className="btn-secondary text-xs md:text-sm px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Mở Xem Lời Giải Tòa Soạn
                  </button>
                </div>
              )
            ) : (
              <p className="italic text-gray-400 dark:text-slate-500 font-newsreader text-lg p-6 bg-paper dark:bg-nightInput rounded-xl text-center">
                Tòa soạn chưa cập nhật lời giải chính thức cho bài toán này.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
