import React, { useState, useRef, useEffect, useMemo } from 'react';

export default function CustomDropdown({
  label,
  icon,
  accentColor = 'cerulean', // 'cerulean' or 'jasper'
  selectedId,
  onSelect,
  items = [], // [{ id, name, count }]
  allOptionLabel = 'Tất cả',
  totalCount = 0,
  onManageClick,
  manageText = '+ Quản lý',
  addNewText = '+ Thêm mới',
  placeholderSearch = 'Tìm kiếm...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // Click outside to close
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
    return items.find((i) => i.id === selectedId);
  }, [items, selectedId]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((i) => (i.name || '').toLowerCase().includes(term));
  }, [items, searchTerm]);

  const isCerulean = accentColor === 'cerulean';
  const dotBg = isCerulean ? 'bg-cerulean' : 'bg-jasper';
  const textColor = isCerulean ? 'text-cerulean' : 'text-jasper';
  const borderColor = isCerulean ? 'border-cerulean' : 'border-jasper';
  const badgeBg = isCerulean ? 'bg-blue-50 text-cerulean border-blue-200' : 'bg-red-50 text-jasper border-red-200';
  const ringColor = isCerulean ? 'focus:ring-cerulean/20 focus:border-cerulean' : 'focus:ring-jasper/20 focus:border-jasper';

  return (
    <div className="flex flex-col flex-1 sm:max-w-xs relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-bold ${textColor} font-playfair uppercase tracking-widest flex items-center gap-1.5`}>
          {icon}
          {label}
        </span>
        {onManageClick && (
          <button
            type="button"
            onClick={onManageClick}
            className={`text-xs ${textColor} hover:underline font-bold flex items-center gap-0.5 cursor-pointer`}
          >
            <span>{manageText}</span>
          </button>
        )}
      </div>

      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 bg-white border border-gray-300 hover:${borderColor} ${ringColor} text-ink rounded-lg px-4 py-2.5 font-newsreader shadow-sm hover:shadow transition text-left cursor-pointer group`}
        >
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            <span className={`w-2.5 h-2.5 rounded-full ${dotBg} shrink-0 shadow-sm`}></span>
            <span className="font-bold text-base md:text-lg truncate text-gray-900">
              {selectedItem ? selectedItem.name : allOptionLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs ${badgeBg} font-bold px-2 py-0.5 rounded-full border`}>
              {selectedItem ? `${selectedItem.count ?? 0} bài` : 'Tất cả'}
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-paper border border-gray-300 rounded-xl shadow-2xl z-50 overflow-hidden animate-dropdownFade">
            <div className="px-3.5 py-2.5 bg-paperDark border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              <span className="font-playfair">Danh Mục</span>
              <span className={`${textColor} font-mono`}>{items.length} mục</span>
            </div>
            <div className="p-2 border-b border-gray-100 bg-white">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholderSearch}
                className={`w-full text-sm font-newsreader px-3 py-1.5 bg-paper border border-gray-200 rounded-md focus:outline-none focus:ring-2 ${isCerulean ? 'focus:ring-cerulean' : 'focus:ring-jasper'}`}
                autoFocus
              />
            </div>
            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100 p-1.5 font-newsreader">
              {/* Option: All */}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelect('');
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-left cursor-pointer ${
                    !selectedId
                      ? isCerulean
                        ? 'bg-blue-50 text-cerulean font-bold border-l-4 border-cerulean'
                        : 'bg-red-50 text-jasper font-bold border-l-4 border-jasper'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                      {!selectedId ? (
                        <svg className={`w-4 h-4 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      )}
                    </span>
                    <span className="text-base truncate italic font-medium">-- {allOptionLabel} --</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      !selectedId ? `${dotBg} text-white` : 'bg-gray-100 text-gray-600'
                    } font-semibold font-mono shrink-0`}
                  >
                    {totalCount} bài
                  </span>
                </button>
              </li>

              {/* Dynamic Items */}
              {filteredItems.map((item) => {
                const isSel = selectedId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item.id);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-left cursor-pointer ${
                        isSel
                          ? isCerulean
                            ? 'bg-blue-50 text-cerulean font-bold border-l-4 border-cerulean'
                            : 'bg-red-50 text-jasper font-bold border-l-4 border-jasper'
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-4 h-4 flex items-center justify-center shrink-0">
                          {isSel ? (
                            <svg className={`w-4 h-4 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          )}
                        </span>
                        <span className="text-base truncate">{item.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isSel ? `${dotBg} text-white` : 'bg-gray-100 text-gray-600'
                        } font-semibold font-mono shrink-0`}
                      >
                        {item.count ?? 0} bài
                      </span>
                    </button>
                  </li>
                );
              })}

              {filteredItems.length === 0 && (
                <li className="py-4 text-center text-xs text-gray-400 italic">
                  Không tìm thấy kết quả phù hợp.
                </li>
              )}
            </ul>

            {onManageClick && (
              <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs">
                <span className="text-gray-400 italic">Bấm để lọc bài</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onManageClick();
                  }}
                  className={`${textColor} hover:underline font-bold flex items-center gap-1 cursor-pointer`}
                >
                  {addNewText}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
