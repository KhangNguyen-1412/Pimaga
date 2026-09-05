import React, { useState, useMemo, useEffect, useRef } from 'react';
import ProblemCard from './ProblemCard';
import { useData } from '../../context/DataContext';

export default function ProblemList({
  highlightedProblemId,
  onEditProblem,
  onDeleteProblem,
  onOpenSolution,
  onOpenDetail,
}) {
  const {
    problems,
    issues,
    categories,
    userSolutionsMap,
    filterIssue,
    filterCategory,
    filterSearch,
    filterDifficulty,
    filterProvince,
    filterStatus,
    isBookmarked,
    resetFilters,
    activeFilterCount,
    isDataLoaded,
  } = useData();
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Fast maps
  const issueMap = useMemo(() => new Map(issues.map((i) => [i.id, i.name])), [issues]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  // Filtered and sorted problems
  const filteredProblems = useMemo(() => {
    const q = (filterSearch || '').trim().toLowerCase();

    const list = problems.filter((p) => {
      // 1. Issue filter
      if (filterIssue && p.issueId !== filterIssue) return false;

      // 2. Category filter
      if (filterCategory && p.categoryId !== filterCategory) return false;

      // 3. Search query filter (matches code, title, content, author, province)
      if (q) {
        const codeMatch = (p.code || '').toLowerCase().includes(q);
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const contentMatch = (p.content || '').toLowerCase().includes(q);
        const authorMatch = (p.author || '').toLowerCase().includes(q);
        const provinceMatch = (p.province || '').toLowerCase().includes(q);
        if (!codeMatch && !titleMatch && !contentMatch && !authorMatch && !provinceMatch) {
          return false;
        }
      }

      // 4. Difficulty filter
      if (filterDifficulty && filterDifficulty !== 'all') {
        const diff = parseInt(p.difficulty, 10) || 2;
        if (filterDifficulty === 'basic') {
          if (diff > 2) return false;
        } else if (filterDifficulty === 'standard') {
          if (diff !== 3) return false;
        } else if (filterDifficulty === 'advanced') {
          if (diff < 4) return false;
        } else {
          const targetDiff = parseInt(filterDifficulty, 10);
          if (diff !== targetDiff) return false;
        }
      }

      // 5. Province filter
      if (filterProvince && filterProvince !== 'all') {
        if ((p.province || '').trim().toLowerCase() !== filterProvince.trim().toLowerCase()) {
          return false;
        }
      }

      // 6. Status filter
      if (filterStatus && filterStatus !== 'all') {
        const hasSol = Boolean(userSolutionsMap[p.id]);
        if (filterStatus === 'solved' && !hasSol) return false;
        if (filterStatus === 'unsolved' && hasSol) return false;
        if (filterStatus === 'bookmarked' && !isBookmarked(p.id)) return false;
      }

      return true;
    });

    // Sort by code number ascending: P1, P2, P3...
    return list.sort((a, b) => {
      const numA = parseInt((a.code || '').replace(/^[pP]/i, ''), 10) || 0;
      const numB = parseInt((b.code || '').replace(/^[pP]/i, ''), 10) || 0;
      return numA - numB;
    });
  }, [
    problems,
    filterIssue,
    filterCategory,
    filterSearch,
    filterDifficulty,
    filterProvince,
    filterStatus,
    userSolutionsMap,
    isBookmarked,
  ]);

  // If a problem is highlighted (direct link), ensure visibleCount includes it
  useEffect(() => {
    if (highlightedProblemId) {
      const idx = filteredProblems.findIndex((p) => p.id === highlightedProblemId);
      if (idx >= 0 && idx >= visibleCount) {
        setVisibleCount(idx + 5);
      }
    }
  }, [highlightedProblemId, filteredProblems, visibleCount]);

  // Smooth scroll to highlighted problem card
  useEffect(() => {
    if (highlightedProblemId) {
      const target = filteredProblems.find((p) => p.id === highlightedProblemId);
      if (target) {
        const codeSlug = (target.code || target.id).toLowerCase().replace(/\s+/g, '');
        const el = document.getElementById(`bai-toan-${codeSlug}`);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 200);
        }
      }
    }
  }, [highlightedProblemId, filteredProblems]);

  // Reset pagination on filter change (unless a problem is highlighted)
  useEffect(() => {
    if (!highlightedProblemId) {
      setVisibleCount(10);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [
    filterIssue,
    filterCategory,
    filterSearch,
    filterDifficulty,
    filterProvince,
    filterStatus,
    highlightedProblemId,
  ]);

  const visibleItems = useMemo(() => {
    return filteredProblems.slice(0, visibleCount);
  }, [filteredProblems, visibleCount]);

  const hasMore = filteredProblems.length > visibleCount;
  const remaining = filteredProblems.length - visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // IntersectionObserver for auto-loading on scroll
  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { root: containerRef.current, rootMargin: '300px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <section className="bg-paper dark:bg-nightCard border border-gray-300 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-16 transition-colors duration-200">
      {/* Header bar */}
      <div className="px-6 py-3.5 bg-paperDark dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/pimaga-logo.svg"
            alt="Pi"
            className="w-6 h-6 rounded-full shadow-xs shrink-0 select-none"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h3 className="font-playfair font-bold text-ink dark:text-slate-100 text-base md:text-lg tracking-wide uppercase">
            Danh Sách Tài Liệu Đề Bài
          </h3>
          <span className="text-xs bg-white dark:bg-blue-950/70 text-cerulean dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900 font-mono shadow-xs">
            {filteredProblems.length} bài
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-slate-400 font-newsreader italic hidden sm:flex items-center gap-1.5">
          <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Cuộn danh sách bên dưới để đọc toàn bộ tài liệu đề</span>
        </div>
      </div>

      {/* Scrollable Container */}
      <main
        ref={containerRef}
        id="problems-container"
        className="max-h-[82vh] min-h-[400px] overflow-y-auto p-2.5 sm:p-4 md:p-8 space-y-4 sm:space-y-8 md:space-y-10 custom-scrollbar scroll-smooth overscroll-contain"
      >
        {/* Loading Skeleton */}
        {!isDataLoaded && problems.length === 0 && (
          <div className="space-y-6">
            <div className="animate-pulse bg-white dark:bg-nightCard p-6 md:p-10 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-3/4 mb-6"></div>
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-11/12"></div>
                <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-4/5"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                <div className="h-28 bg-gray-50 dark:bg-nightInput border-l-4 border-gray-200 dark:border-slate-700 rounded p-4"></div>
                <div className="h-28 bg-gray-50 dark:bg-nightInput border-l-4 border-gray-200 dark:border-slate-700 rounded p-4"></div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isDataLoaded && filteredProblems.length === 0 && (
          (activeFilterCount > 0 || Boolean(filterSearch) || Boolean(filterIssue) || Boolean(filterCategory)) ? (
            <div className="text-center py-16 bg-white dark:bg-nightCard rounded-xl border border-dashed border-gray-300 dark:border-slate-800 flex flex-col items-center justify-center p-6 space-y-3.5 font-newsreader">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900 shadow-2xs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-gray-800 dark:text-slate-200">
                Không tìm thấy bài toán phù hợp
              </h3>
              <p className="font-newsreader text-sm text-gray-500 dark:text-slate-400 max-w-md">
                Không có bài toán nào khớp với từ khóa tìm kiếm hoặc các tiêu chí bộ lọc đã chọn. Hãy thử nới lỏng hoặc đặt lại các bộ lọc.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 bg-cerulean hover:bg-blue-800 text-white rounded-lg font-bold text-sm transition cursor-pointer shadow-xs font-newsreader flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Xóa tất cả bộ lọc</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-nightCard rounded-xl border border-dashed border-gray-300 dark:border-slate-800 flex flex-col items-center justify-center p-6">
              <img
                src="/assets/pimaga-logo.svg"
                alt="Pimaga Emblem"
                className="w-16 h-16 rounded-full opacity-60 mb-4 select-none filter grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h3 className="font-playfair text-2xl text-gray-500 dark:text-slate-300 mb-2">Chưa có bài toán nào</h3>
              <p className="font-newsreader text-gray-400 dark:text-slate-500">Hãy là người đầu tiên soạn đề bài cho chuyên mục này.</p>
            </div>
          )
        )}

        {/* Problem Cards */}
        {visibleItems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            issueName={issueMap.get(problem.issueId) || 'Không rõ Số'}
            catName={categoryMap.get(problem.categoryId) || 'Không rõ Chuyên mục'}
            userSolution={userSolutionsMap[problem.id]}
            isHighlighted={problem.id === highlightedProblemId}
            onEdit={onEditProblem}
            onDelete={onDeleteProblem}
            onOpenSolution={onOpenSolution}
            onOpenDetail={onOpenDetail}
          />
        ))}

        {/* Pagination / Infinite Scroll Actions */}
        {hasMore && (
          <div className="flex flex-col items-center justify-center pt-8 pb-12">
            <button
              type="button"
              onClick={loadMore}
              className="bg-white dark:bg-nightInput hover:bg-blue-50/70 dark:hover:bg-slate-800 border-2 border-cerulean dark:border-blue-500 text-cerulean dark:text-blue-400 px-8 py-3 rounded-xl font-playfair font-bold text-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
            >
              <span>Xem Thêm Bài Toán</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-950 text-cerulean dark:text-blue-300 font-sans font-bold px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                Còn {remaining} bài
              </span>
              <svg
                className="w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <span className="text-xs text-gray-400 dark:text-slate-500 font-newsreader mt-2.5">
              Đang hiển thị {visibleItems.length} trên tổng số {filteredProblems.length} bài toán
            </span>
            <div ref={sentinelRef} className="w-full h-2"></div>
          </div>
        )}

        {!hasMore && filteredProblems.length > 10 && (
          <div className="text-center py-6 text-gray-400 dark:text-slate-500 text-sm font-newsreader italic border-t border-gray-200 dark:border-slate-800">
            Đã hiển thị toàn bộ {filteredProblems.length} bài toán.
          </div>
        )}
      </main>
    </section>
  );
}
