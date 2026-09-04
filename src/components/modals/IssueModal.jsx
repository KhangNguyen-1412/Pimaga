import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';

export default function IssueModal({ isOpen, onClose, onRequestDelete }) {
  const { issues, problems, addIssue } = useData();

  const [issueNumber, setIssueNumber] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Auto calculate next issue number when opened
  useEffect(() => {
    if (isOpen) {
      let maxNum = 0;
      issues.forEach((i) => {
        if (i.issueNumber && !isNaN(parseInt(i.issueNumber, 10))) {
          maxNum = Math.max(maxNum, parseInt(i.issueNumber, 10));
        } else if (i.name) {
          const m = i.name.match(/(?:số\s*)(\d+)/i);
          if (m && m[1]) maxNum = Math.max(maxNum, parseInt(m[1], 10));
        }
      });
      setIssueNumber((maxNum > 0 ? maxNum + 1 : 1).toString());
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
      setError('');
    }
  }, [isOpen, issues]);

  const cleanNum = issueNumber.trim().toLowerCase().startsWith('số')
    ? issueNumber.trim()
    : `Số ${issueNumber.trim() || '1'}`;
  const previewName = `${cleanNum} - Tháng ${month}/${year}`;

  const problemCountMap = useMemo(() => {
    const map = {};
    problems.forEach((p) => {
      if (p.issueId) map[p.issueId] = (map[p.issueId] || 0) + 1;
    });
    return map;
  }, [problems]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      await addIssue({ num: issueNumber.trim(), month: parseInt(month, 10), year: parseInt(year, 10) });
      const next = parseInt(issueNumber, 10);
      setIssueNumber(!isNaN(next) ? (next + 1).toString() : '');
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm số phát hành');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 z-[100] flex justify-center items-center backdrop-blur-sm px-4">
      <div className="bg-paper p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg border-t-4 border-cerulean max-h-[90vh] flex flex-col animate-dropdownFade">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-ink">Quản Lý Số Phát Hành</h3>
            <p className="text-xs text-gray-500 font-newsreader mt-0.5">Tạo kỳ báo mới theo số, tháng và năm phát hành</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-ink text-2xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

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

        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <label className="block text-xs font-bold text-cerulean font-playfair uppercase tracking-wider mb-2">
            Thêm Kỳ Báo Mới
          </label>
          <div className="grid grid-cols-12 gap-2 mb-2">
            {/* Number */}
            <div className="col-span-4">
              <span className="block text-[11px] text-gray-500 font-bold mb-1">Số phát hành:</span>
              <input
                type="number"
                min="1"
                required
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                placeholder="1"
                className="w-full border border-gray-300 bg-paper rounded-lg px-3 py-2 font-mono font-bold text-base text-ink focus:outline-none focus:ring-2 focus:ring-cerulean"
              />
            </div>

            {/* Month */}
            <div className="col-span-4 relative">
              <span className="block text-[11px] text-gray-500 font-bold mb-1">Tháng:</span>
              <button
                type="button"
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                className="w-full border border-gray-300 bg-paper rounded-lg px-3 py-2 font-newsreader font-bold text-base text-ink flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cerulean cursor-pointer"
              >
                <span>Tháng {month}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMonthDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-paper border border-gray-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto p-1 font-newsreader animate-dropdownFade">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMonth(m);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm rounded-md transition cursor-pointer flex items-center justify-between ${
                        month === m ? 'bg-blue-50 text-cerulean font-bold' : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <span>Tháng {m}</span>
                      {month === m && (
                        <svg className="w-3.5 h-3.5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year */}
            <div className="col-span-4">
              <span className="block text-[11px] text-gray-500 font-bold mb-1">Năm:</span>
              <input
                type="number"
                min="1900"
                max="2100"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-gray-300 bg-paper rounded-lg px-3 py-2 font-mono font-bold text-base text-ink focus:outline-none focus:ring-2 focus:ring-cerulean"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-600 font-newsreader truncate max-w-[260px]">
              Tên hiển thị: <span className="font-bold text-cerulean">{previewName}</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cerulean text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition shadow-xs font-newsreader font-bold text-sm tracking-wide cursor-pointer disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-gray-500 font-playfair uppercase tracking-wider mb-2">
            Danh Sách Kỳ Báo Hiện Có ({issues.length})
          </h4>
          <ul className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs font-newsreader">
            {issues.map((issue) => {
              const probCount = problemCountMap[issue.id] || 0;
              const numBadge = issue.issueNumber ? `Số ${issue.issueNumber}` : '';
              const timeMeta = issue.month && issue.year ? `Tháng ${issue.month}/${issue.year}` : '';

              return (
                <li key={issue.id} className="py-3 px-3.5 flex justify-between items-center group hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    {numBadge && (
                      <span className="bg-blue-50 text-cerulean font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-blue-200 shrink-0 shadow-2xs">
                        {numBadge}
                      </span>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-newsreader font-bold text-base text-ink truncate">{issue.name}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {timeMeta && (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-cerulean shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {timeMeta}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>{probCount} bài toán liên kết</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onRequestDelete(
                        `Xóa số phát hành "${issue.name}"? Các bài toán liên quan sẽ không bị xóa.`,
                        issue.id
                      )
                    }
                    className="text-jasper opacity-0 group-hover:opacity-100 focus:opacity-100 transition text-xs font-bold bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 cursor-pointer"
                    title="Xóa số phát hành"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Xóa</span>
                  </button>
                </li>
              );
            })}
            {issues.length === 0 && (
              <li className="py-6 text-center text-gray-400 font-newsreader italic">
                Chưa có số phát hành nào. Hãy nhập thông tin phía trên để thêm mới.
              </li>
            )}
          </ul>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-newsreader font-bold text-sm cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
