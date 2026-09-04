import React, { useMemo } from 'react';
import CustomDropdown from '../common/CustomDropdown';
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
    problemCounts,
  } = useData();

  const handleIssueChange = onSelectIssue || setFilterIssue;
  const handleCategoryChange = onSelectCategory || setFilterCategory;

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

  return (
    <section className="flex flex-col lg:flex-row justify-between items-stretch lg:items-end gap-6 mb-10 bg-paperDark p-6 md:p-7 rounded-xl border border-gray-200/80 shadow-inner">
      <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto flex-1">
        {/* Dropdown: Số Phát Hành */}
        <CustomDropdown
          label="Số Phát Hành"
          accentColor="cerulean"
          icon={
            <svg className="w-4 h-4 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg className="w-4 h-4 text-jasper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="w-full sm:w-auto bg-white border border-cerulean text-cerulean font-playfair font-bold text-base px-4 py-2.5 md:py-3 rounded-lg hover:bg-blue-50 transition shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          title="Mở danh mục tra cứu tất cả công thức toán LaTeX"
        >
          <svg className="w-5 h-5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Sổ Tay LaTeX</span>
        </button>

        <button
          type="button"
          onClick={onOpenProblemModal}
          className="w-full sm:w-auto bg-ink text-white font-playfair font-bold text-lg px-7 py-2.5 md:py-3 rounded-lg hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Soạn Đề Bài Mới</span>
        </button>
      </div>
    </section>
  );
}
