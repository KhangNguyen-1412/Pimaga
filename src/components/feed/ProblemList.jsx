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
  const { problems, issues, categories, userSolutionsMap, filterIssue, filterCategory, isDataLoaded } = useData();
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Fast maps
  const issueMap = useMemo(() => new Map(issues.map((i) => [i.id, i.name])), [issues]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  // Filtered and sorted problems
  const filteredProblems = useMemo(() => {
    const list = problems.filter((p) => {
      const matchIssue = filterIssue ? p.issueId === filterIssue : true;
      const matchCat = filterCategory ? p.categoryId === filterCategory : true;
      return matchIssue && matchCat;
    });

    // Sort by code number ascending: P1, P2, P3...
    return list.sort((a, b) => {
      const numA = parseInt((a.code || '').replace(/^[pP]/i, ''), 10) || 0;
      const numB = parseInt((b.code || '').replace(/^[pP]/i, ''), 10) || 0;
      return numA - numB;
    });
  }, [problems, filterIssue, filterCategory]);

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
  }, [filterIssue, filterCategory, highlightedProblemId]);

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
    <section className="bg-paper border border-gray-300 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-16">
      {/* Header bar */}
      <div className="px-6 py-3.5 bg-paperDark border-b border-gray-200 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/pimaga-logo.svg"
            alt="Pi"
            className="w-6 h-6 rounded-full shadow-xs shrink-0 select-none"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h3 className="font-playfair font-bold text-ink text-base md:text-lg tracking-wide uppercase">
            Danh Sách Tài Liệu Đề Bài
          </h3>
          <span className="text-xs bg-white text-cerulean font-bold px-2.5 py-0.5 rounded-full border border-blue-200 font-mono shadow-xs">
            {filteredProblems.length} bài
          </span>
        </div>
        <div className="text-xs text-gray-500 font-newsreader italic hidden sm:flex items-center gap-1.5">
          <svg className="w-4 h-4 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Cuộn danh sách bên dưới để đọc toàn bộ tài liệu đề</span>
        </div>
      </div>

      {/* Scrollable Container */}
      <main
        ref={containerRef}
        id="problems-container"
        className="max-h-[78vh] min-h-[500px] overflow-y-auto p-4 md:p-8 space-y-10 custom-scrollbar scroll-smooth overscroll-contain"
      >
        {/* Loading Skeleton */}
        {!isDataLoaded && problems.length === 0 && (
          <div className="space-y-6">
            <div className="animate-pulse bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-100 rounded w-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-11/12"></div>
                <div className="h-4 bg-gray-100 rounded w-4/5"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="h-28 bg-gray-50 border-l-4 border-gray-200 rounded p-4"></div>
                <div className="h-28 bg-gray-50 border-l-4 border-gray-200 rounded p-4"></div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isDataLoaded && filteredProblems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-6">
            <img
              src="/assets/pimaga-logo.svg"
              alt="Pimaga Emblem"
              className="w-16 h-16 rounded-full opacity-60 mb-4 select-none filter grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h3 className="font-playfair text-2xl text-gray-500 mb-2">Chưa có bài toán nào</h3>
            <p className="font-newsreader text-gray-400">Hãy là người đầu tiên soạn đề bài cho chuyên mục này.</p>
          </div>
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
              className="bg-white hover:bg-blue-50/70 border-2 border-cerulean text-cerulean px-8 py-3 rounded-xl font-playfair font-bold text-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
            >
              <span>Xem Thêm Bài Toán</span>
              <span className="text-xs bg-blue-100 text-cerulean font-sans font-bold px-2.5 py-1 rounded-full border border-blue-200">
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
            <span className="text-xs text-gray-400 font-newsreader mt-2.5">
              Đang hiển thị {visibleItems.length} trên tổng số {filteredProblems.length} bài toán
            </span>
            <div ref={sentinelRef} className="w-full h-2"></div>
          </div>
        )}

        {!hasMore && filteredProblems.length > 10 && (
          <div className="text-center py-6 text-gray-400 text-sm font-newsreader italic border-t border-gray-200">
            Đã hiển thị toàn bộ {filteredProblems.length} bài toán.
          </div>
        )}
      </main>
    </section>
  );
}
