import React, { useState, useMemo, useRef, useEffect } from 'react';
import CustomDropdown from '../common/CustomDropdown';
import SelectDropdown from '../common/SelectDropdown';
import { useData } from '../../context/DataContext';

export default function FilterBar({
  onSelectIssue,
  onSelectCategory,
  onOpenLatexModal,
  onOpenProblemModal,
  onOpenIssueModal,
  onOpenCategoryModal,
}) {
  const {
    issues,
    categories,
    problems,
    filterIssue,
    setFilterIssue,
    filterCategory,
    setFilterCategory,
    filterSearch,
    setFilterSearch,
    filterDifficulty,
    setFilterDifficulty,
    filterProvince,
    setFilterProvince,
    filterStatus,
    setFilterStatus,
    availableProvinces,
    activeFilterCount,
    resetFilters,
    problemCounts,
  } = useData();

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleIssueChange = onSelectIssue || setFilterIssue;
  const handleCategoryChange = onSelectCategory || setFilterCategory;

  // Keyboard shortcut '/' to focus search, and 'Escape' to blur/clear
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input, textarea, or contentEditable
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable;

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const issueItems = useMemo(() => {
    return issues.map((i) => ({
      id: i.id,
      name: i.name,
      count: problemCounts.issueCounts[i.id] || 0,
    }));
  }, [issues, problemCounts.issueCounts]);

  const categoryItems = useMemo(() => {
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      count: problemCounts.catCounts[c.id] || 0,
    }));
  }, [categories, problemCounts.catCounts]);

  // Options for Advanced Difficulty Dropdown
  const difficultyOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả mức độ khó' },
      { value: 'basic', label: 'Nhập môn (Mức 1 - 2 sao)' },
      { value: 'standard', label: 'Tiêu chuẩn (Mức 3 sao)' },
      { value: 'advanced', label: 'Nâng cao / HSG (Mức 4 - 5 sao)' },
      { value: '1', label: 'Mức 1 sao' },
      { value: '2', label: 'Mức 2 sao' },
      { value: '3', label: 'Mức 3 sao' },
      { value: '4', label: 'Mức 4 sao' },
      { value: '5', label: 'Mức 5 sao (Thách thức)' },
    ],
    []
  );

  // Options for Province Dropdown
  const provinceOptions = useMemo(() => {
    const list = [{ value: 'all', label: 'Tất cả tỉnh thành' }];
    availableProvinces.forEach((prov) => {
      list.push({ value: prov, label: prov });
    });
    return list;
  }, [availableProvinces]);

  // Options for Status Dropdown
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả trạng thái bài' },
      { value: 'solved', label: 'Bài đã giải (Đã có bài làm)' },
      { value: 'unsolved', label: 'Bài chưa giải' },
      { value: 'bookmarked', label: 'Bài đã lưu (Đánh dấu)' },
    ],
    []
  );

  const hasAnyFilterActive =
    Boolean(filterIssue) ||
    Boolean(filterCategory) ||
    Boolean(filterSearch.trim()) ||
    filterDifficulty !== 'all' ||
    filterProvince !== 'all' ||
    filterStatus !== 'all';

  return (
    <section className="mb-10 bg-paperDark dark:bg-nightCard p-6 md:p-7 rounded-xl border border-gray-200/80 dark:border-slate-700/80 shadow-inner transition-colors duration-200 space-y-5">
      {/* Row 1: Issue & Category Selectors + Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-end gap-6">
        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto flex-1">
          {/* Dropdown: Số Phát Hành */}
          <CustomDropdown
            label="Số Phát Hành"
            accentColor="cerulean"
            icon={
              <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
            selectedId={filterIssue}
            onSelect={handleIssueChange}
            items={issueItems}
            allOptionLabel="Tất cả các số"
            totalCount={problems.length}
            onManageClick={onOpenIssueModal}
            manageText="+ Quản lý"
            addNewText="+ Thêm số mới"
            placeholderSearch="Tìm số phát hành..."
          />

          {/* Dropdown: Chuyên Mục */}
          <CustomDropdown
            label="Chuyên Mục"
            accentColor="jasper"
            icon={
              <svg className="w-4 h-4 text-jasper dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            selectedId={filterCategory}
            onSelect={handleCategoryChange}
            items={categoryItems}
            allOptionLabel="Tất cả chuyên mục"
            totalCount={problems.length}
            onManageClick={onOpenCategoryModal}
            manageText="+ Quản lý"
            addNewText="+ Thêm mục mới"
            placeholderSearch="Tìm chuyên mục..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={onOpenLatexModal}
            className="w-full sm:w-auto bg-white dark:bg-night border border-cerulean dark:border-blue-400 text-cerulean dark:text-blue-400 font-playfair font-bold text-base px-4 py-2.5 md:py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            title="Mở danh mục tra cứu tất cả công thức toán LaTeX"
          >
            <svg className="w-5 h-5 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Sổ Tay LaTeX</span>
          </button>

          <button
            type="button"
            onClick={onOpenProblemModal}
            className="w-full sm:w-auto bg-ink dark:bg-cerulean text-white font-playfair font-bold text-lg px-7 py-2.5 md:py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-800 transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Soạn Đề Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search Bar with '/' Shortcut + Advanced Filter Toggle */}
      <div className="pt-2 border-t border-gray-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-newsreader">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <input
            ref={searchInputRef}
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Tìm theo mã bài (P1...), nội dung đề, tác giả, tỉnh thành... (Nhấn / để tìm)"
            className="w-full pl-9 pr-14 py-2 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cerulean placeholder-gray-400 dark:placeholder-slate-500 font-newsreader shadow-2xs"
          />
          {/* Search SVG icon */}
          <svg className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Quick Clear or Keyboard '/' Tag */}
          {filterSearch ? (
            <button
              type="button"
              onClick={() => {
                setFilterSearch('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-2.5 top-2 p-1 text-gray-400 hover:text-jasper dark:hover:text-rose-400 rounded-md transition cursor-pointer"
              title="Xóa từ khóa tìm kiếm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-2 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded select-none pointer-events-none">
              /
            </kbd>
          )}
        </div>

        {/* Toggle Advanced Filters Button */}
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-bold transition cursor-pointer font-newsreader shadow-2xs ${
            isAdvancedOpen || activeFilterCount > 0
              ? 'bg-blue-50 dark:bg-blue-950/60 border-cerulean text-cerulean dark:text-blue-300'
              : 'bg-white dark:bg-nightInput border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-cerulean'
          }`}
          title="Mở bảng bộ lọc nâng cao theo độ khó, tỉnh thành và trạng thái"
        >
          <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Bộ lọc nâng cao</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-cerulean text-white text-xs font-mono font-bold">
              {activeFilterCount}
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Quick Reset All Filters Button */}
        {hasAnyFilterActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/40 border border-jasper/30 dark:border-rose-900/60 rounded-lg hover:bg-red-100/70 dark:hover:bg-rose-900/40 transition cursor-pointer font-newsreader shadow-2xs whitespace-nowrap"
            title="Đặt lại toàn bộ các bộ lọc và từ khóa về mặc định"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* Collapsible Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="pt-3 border-t border-gray-200/70 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-fadeIn font-newsreader">
          {/* 1. Mức Độ Khó */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 font-newsreader">
              Mức Độ Khó:
            </label>
            <SelectDropdown
              value={filterDifficulty}
              onChange={setFilterDifficulty}
              options={difficultyOptions}
              accentColor="cerulean"
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              placeholder="Chọn độ khó..."
            />
          </div>

          {/* 2. Tỉnh Thành / Kỳ Thi */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 font-newsreader">
              Tỉnh Thành / Kỳ Thi:
            </label>
            <SelectDropdown
              value={filterProvince}
              onChange={setFilterProvince}
              options={provinceOptions}
              accentColor="jasper"
              searchable={true}
              placeholderSearch="Tìm tỉnh thành..."
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              placeholder="Chọn tỉnh thành..."
            />
          </div>

          {/* 3. Trạng Thái Giải Toán */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 font-newsreader">
              Trạng Thái Bài Toán:
            </label>
            <SelectDropdown
              value={filterStatus}
              onChange={setFilterStatus}
              options={statusOptions}
              accentColor="cerulean"
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              placeholder="Chọn trạng thái..."
            />
          </div>
        </div>
      )}
    </section>
  );
}
