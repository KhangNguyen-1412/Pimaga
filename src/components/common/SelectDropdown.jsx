import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Dropdown chuẩn hóa đồng bộ với hệ thống giao diện Pimaga
 */
export default function SelectDropdown({
  value,
  onChange,
  options = [], // [{ value, label, count }] hoặc ['string1', 'string2']
  placeholder = 'Chọn một mục...',
  allOptionLabel = null, // Nếu có thì hiển thị option "Tất cả"
  icon = null,
  accentColor = 'cerulean', // 'cerulean' | 'jasper'
  searchable = false,
  placeholderSearch = 'Tìm kiếm...',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // Chuẩn hóa options thành [{ value, label, count }]
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value ?? opt.id ?? '',
          label: opt.label ?? opt.name ?? String(opt.value ?? ''),
          count: opt.count,
        };
      }
      return {
        value: String(opt),
        label: String(opt),
        count: undefined,
      };
    });
  }, [options]);

  // Click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedItem = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const q = searchTerm.toLowerCase();
    return normalizedOptions.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [normalizedOptions, searchTerm]);

  const isCerulean = accentColor === 'cerulean';
  const dotColor = isCerulean ? 'bg-cerulean dark:bg-blue-400' : 'bg-jasper dark:bg-rose-400';
  const textColor = isCerulean ? 'text-cerulean dark:text-blue-400' : 'text-jasper dark:text-rose-400';
  const borderColorHover = isCerulean
    ? 'hover:border-cerulean dark:hover:border-blue-500'
    : 'hover:border-jasper dark:hover:border-rose-500';
  const focusRing = isCerulean
    ? 'focus:ring-2 focus:ring-cerulean/20 focus:border-cerulean'
    : 'focus:ring-2 focus:ring-jasper/20 focus:border-jasper';
  const badgeClass = isCerulean
    ? 'bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-300 border-blue-200 dark:border-blue-900'
    : 'bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-300 border-red-200 dark:border-rose-900';
  const activeItemClass = isCerulean
    ? 'bg-blue-50 dark:bg-blue-950/70 text-cerulean dark:text-blue-300 font-bold border-l-4 border-cerulean'
    : 'bg-red-50 dark:bg-rose-950/70 text-jasper dark:text-rose-300 font-bold border-l-4 border-jasper';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 bg-white dark:bg-nightInput border border-gray-300 dark:border-slate-700 ${borderColorHover} rounded-lg px-3 py-1.5 text-sm font-newsreader text-gray-800 dark:text-slate-200 shadow-2xs hover:shadow-xs transition cursor-pointer text-left`}
      >
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          {icon ? (
            <span className={`shrink-0 ${textColor}`}>{icon}</span>
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`}></span>
          )}
          <span className="truncate font-semibold">
            {selectedItem ? selectedItem.label : allOptionLabel || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {selectedItem?.count !== undefined && (
            <span className={`px-1.5 py-0.2 rounded-full ${badgeClass} text-[10px] font-mono border`}>
              {selectedItem.count}
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 min-w-[180px] bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-dropdownFade">
          {searchable && (
            <div className="p-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/50">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholderSearch}
                className={`w-full text-xs font-newsreader px-2.5 py-1 bg-white dark:bg-nightInput border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-md focus:outline-none ${focusRing} placeholder-gray-400 dark:placeholder-slate-500`}
                autoFocus
              />
            </div>
          )}

          <ul className="max-h-56 overflow-y-auto divide-y divide-gray-100/70 dark:divide-slate-800/80 p-1 font-newsreader text-sm custom-scrollbar">
            {allOptionLabel && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer ${
                    !value
                      ? activeItemClass
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate italic">-- {allOptionLabel} --</span>
                  {!value && (
                    <svg className={`w-3.5 h-3.5 ${textColor} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            )}

            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-center text-[11px] text-gray-400 italic">
                Không tìm thấy kết quả
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer ${
                        isSelected
                          ? activeItemClass
                          : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {opt.count !== undefined && (
                          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">
                            {opt.count} bài
                          </span>
                        )}
                        {isSelected && (
                          <svg className={`w-3.5 h-3.5 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
