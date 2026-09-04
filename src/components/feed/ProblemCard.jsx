import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MathRenderer from '../common/MathRenderer';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';

export default function ProblemCard({
  problem,
  issueName = 'Không rõ Số',
  catName = 'Không rõ Chuyên mục',
  userSolution,
  isHighlighted = false,
  onEdit,
  onDelete,
  onOpenDetail,
}) {
  const { showToast } = useToast();
  const { isBookmarked, toggleBookmark } = useData();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const bookmarked = isBookmarked(problem.id);

  const diffData = DIFFICULTY_LEVELS.find((d) => d.level === problem.difficulty);
  const problemHeaderTitle = problem.code
    ? problem.code.startsWith('Bài')
      ? problem.code
      : `Bài ${problem.code}`
    : problem.title || 'Bài Toán';

  const problemAnchorId = problem.code
    ? `bai-toan-${problem.code.toLowerCase().replace(/\s+/g, '')}`
    : `bai-toan-${problem.id}`;

  const handleGoToDetail = () => {
    if (onOpenDetail) {
      onOpenDetail(problem);
    } else {
      const codeSlug = (problem.code || problem.id || '').toLowerCase().replace(/\s+/g, '');
      navigate(`/bai-toan/${codeSlug}`);
    }
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
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
      showToast(`Đã sao chép liên kết bài toán: ${fullUrl}`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Lỗi sao chép liên kết: ' + err.message, 'error');
    }
  };

  return (
    <article
      id={problemAnchorId}
      className={`problem-article bg-white dark:bg-nightCard p-6 md:p-10 rounded-xl shadow-sm border transition-all duration-300 relative group scroll-mt-28 ${
        isHighlighted
          ? 'border-cerulean ring-4 ring-cerulean/20 shadow-xl'
          : 'border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-md'
      }`}
      data-problem-id={problem.id}
    >
      {/* Top right actions: Bookmark + Share + Admin */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 sm:gap-2">
        {/* Bookmark Button */}
        <button
          type="button"
          onClick={() => toggleBookmark(problem.id)}
          className={`text-xs px-2.5 py-1.5 rounded-md transition shadow-2xs font-newsreader font-bold flex items-center gap-1 cursor-pointer border ${
            bookmarked
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
              : 'bg-gray-50 dark:bg-night hover:bg-amber-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-amber-600 border-gray-200 dark:border-slate-700'
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
          <span>{bookmarked ? 'Đã lưu' : 'Lưu bài'}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="text-xs bg-gray-50 dark:bg-night hover:bg-blue-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-cerulean dark:hover:text-blue-300 border border-gray-200 dark:border-slate-700 hover:border-cerulean/30 px-2.5 py-1.5 rounded-md transition shadow-2xs font-newsreader font-bold flex items-center gap-1.5 cursor-pointer"
          title="Sao chép đường dẫn thân thiện để chia sẻ bài toán"
        >
          {copied ? (
            <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )}
          <span>{copied ? 'Đã chép link' : 'Chia sẻ'}</span>
        </button>

        {/* Admin Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(problem);
            }}
            className="text-xs md:text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 px-3 py-1.5 rounded-md hover:bg-cerulean hover:text-white transition shadow-2xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Chỉnh sửa bài toán"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Sửa Đề</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(problem);
            }}
            className="text-xs md:text-sm bg-gray-100 dark:bg-slate-800 text-jasper px-3 py-1.5 rounded-md hover:bg-jasper hover:text-white transition shadow-2xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Xóa bài toán này"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Xóa Đề</span>
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="mb-6 pr-44">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          {problem.code && (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-cerulean text-white font-mono font-black text-sm tracking-wider shadow-xs border border-blue-900 select-none"
              title="Mã số bài toán"
            >
              {problem.code}
            </span>
          )}
          <span className="text-xs font-bold text-jasper dark:text-rose-400 tracking-widest uppercase">{catName}</span>
          <span className="text-gray-300 dark:text-slate-600 select-none">•</span>
          <span className="text-xs font-bold text-cerulean dark:text-blue-400 tracking-wider uppercase">{issueName}</span>
          {diffData && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-xs ${diffData.colorClass}`}
              title={`Mức độ: ${diffData.name} (${diffData.desc})`}
            >
              <span className={`${diffData.starColor} font-sans tracking-tighter text-xs leading-none`}>
                {diffData.stars}
              </span>
              <span className="font-playfair tracking-wide leading-none">{diffData.name}</span>
            </span>
          )}
        </div>

        {/* Clickable Title to Detail */}
        <button
          type="button"
          onClick={handleGoToDetail}
          className="text-left group/title cursor-pointer block bg-transparent border-none p-0"
        >
          <h3 className="text-3xl md:text-4xl font-playfair font-black text-ink dark:text-slate-100 leading-tight group-hover/title:text-cerulean dark:group-hover/title:text-blue-400 transition">
            {problemHeaderTitle}
          </h3>
        </button>

        {/* Author Line */}
        {(problem.author || problem.province) && (
          <div className="mt-2.5 flex items-center gap-1.5 text-gray-700 dark:text-slate-300 font-newsreader text-base md:text-lg">
            <svg className="w-4 h-4 text-cerulean dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>
              {problem.author && <span className="italic font-bold text-ink dark:text-slate-100">{problem.author}</span>}
              {problem.author && problem.province && <span className="text-gray-500 dark:text-slate-500 not-italic">, </span>}
              {problem.province && <span className="italic text-gray-700 dark:text-slate-300">{problem.province}</span>}
            </span>
          </div>
        )}
      </div>

      {/* Problem Content snippet/statement with KaTeX */}
      <div className="font-newsreader text-xl text-ink dark:text-slate-100 leading-relaxed mb-6 max-w-none">
        <MathRenderer content={problem.content} />
      </div>

      {/* Bottom Action Bar: Status + Go to Detail / Solve CTA */}
      <div className="pt-5 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Solution Status */}
        <div className="flex items-center gap-3">
          {userSolution ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cerulean dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 px-3 py-1.5 rounded-full shadow-2xs">
              <svg className="w-3.5 h-3.5 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Đã làm bài</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-full">
              <span>Chưa làm bài</span>
            </span>
          )}

          {problem.editorialSolution && (
            <span className="text-xs text-gray-500 dark:text-slate-400 font-newsreader italic hidden sm:inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-jasper dark:text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Có đáp án Tòa soạn</span>
            </span>
          )}
        </div>

        {/* Right: Primary Action Button */}
        <button
          type="button"
          onClick={handleGoToDetail}
          className="btn-primary text-xs md:text-sm px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition"
        >
          <span>{userSolution ? 'Xem Chi Tiết & Sửa Bài' : 'Làm Bài Này'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}

