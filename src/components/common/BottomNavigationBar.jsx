import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function BottomNavigationBar({ onOpenCreateProblem }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRealUser, currentUser } = useAuth();
  const { bookmarks } = useData();

  const pathname = location.pathname;

  // Active state determinations
  const isHomeActive =
    pathname === '/' ||
    pathname === '/gioi-thieu' ||
    pathname === '/about' ||
    pathname === '/landing' ||
    pathname === '/tinh-nang' ||
    pathname === '/tap-chi-pi';

  const isPiHistoryActive = pathname === '/lich-su-so-pi';

  const isFeedActive =
    pathname === '/kho-de' ||
    pathname.startsWith('/bai-toan') ||
    pathname.startsWith('/so/') ||
    pathname.startsWith('/chuyen-muc/');

  const isProfileActive =
    pathname === '/ho-so' ||
    pathname === '/profile' ||
    pathname === '/dang-nhap';

  // Calculate target slot index: 0 = Home, 1 = Pi, 2 = Create (center), 3 = Feed, 4 = Profile
  const targetIndex = isHomeActive
    ? 0
    : isPiHistoryActive
    ? 1
    : isFeedActive
    ? 3
    : isProfileActive
    ? 4
    : -1;

  const [activeSlot, setActiveSlot] = useState(targetIndex);

  // Sync state if navigation occurs from outside bottom bar (browser back/forward, in-page links)
  useEffect(() => {
    setActiveSlot(targetIndex);
  }, [targetIndex]);

  // Handle immediate visual response on button press
  const handleNavigation = (index, path) => {
    setActiveSlot(index);
    navigate(path);
  };

  const isCeruleanTheme = activeSlot === 0 || activeSlot === 1;

  return (
    <nav
      aria-label="Thanh điều hướng di động lơ lửng"
      className="sm:hidden fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-40 bg-white/92 dark:bg-nightCard/92 backdrop-blur-xl rounded-2xl border border-gray-200/90 dark:border-slate-700/80 shadow-2xl shadow-cerulean/15 dark:shadow-black/70 transition-all duration-300 select-none px-2 py-1"
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="relative grid grid-cols-5 items-center h-14 max-w-md mx-auto">
        {/* Sliding Gliding Indicator Pill */}
        <div
          aria-hidden="true"
          data-testid="bottom-nav-sliding-pill"
          className={`absolute top-1.5 bottom-1.5 rounded-xl pointer-events-none z-0 transition-all duration-300 ${
            activeSlot === -1 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          } ${
            isCeruleanTheme
              ? 'bg-cerulean/15 dark:bg-cerulean/30 border border-cerulean/35 dark:border-blue-400/40'
              : 'bg-jasper/15 dark:bg-jasper/30 border border-jasper/35 dark:border-rose-400/40'
          }`}
          style={{
            left: activeSlot !== -1 ? `calc(${activeSlot * 20}% + 4px)` : '4px',
            width: 'calc(20% - 8px)',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.15, 0.64, 1)',
            boxShadow: isCeruleanTheme
              ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.5), 0 2px 8px 0 rgba(42, 82, 190, 0.15)'
              : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.5), 0 2px 8px 0 rgba(215, 59, 62, 0.15)',
          }}
        />

        {/* 1. Trang Chủ (Slot 0) */}
        <button
          type="button"
          onClick={() => handleNavigation(0, '/')}
          className={`relative z-10 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors duration-200 cursor-pointer group active:scale-95 ${
            activeSlot === 0
              ? 'text-cerulean dark:text-blue-300 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-cerulean dark:hover:text-blue-300 hover:bg-cerulean/10 dark:hover:bg-cerulean/20 font-medium'
          }`}
          title="Trang chủ Tạp chí Pi"
        >
          <div className="relative flex items-center justify-center">
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                activeSlot === 0 ? 'scale-110' : 'group-hover:scale-105'
              }`}
              fill={activeSlot === 0 ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={activeSlot === 0 ? '2' : '1.8'}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span className="text-[11px] font-newsreader mt-0.5 tracking-tight">Trang Chủ</span>
        </button>

        {/* 2. Lịch Sử Số Pi (Slot 1 - Đổi vị trí với Kho Đề) */}
        <button
          type="button"
          onClick={() => handleNavigation(1, '/lich-su-so-pi')}
          className={`relative z-10 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors duration-200 cursor-pointer group active:scale-95 ${
            activeSlot === 1
              ? 'text-cerulean dark:text-blue-300 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-cerulean dark:hover:text-blue-300 hover:bg-cerulean/10 dark:hover:bg-cerulean/20 font-medium'
          }`}
          title="Khám phá lịch sử 4.000 năm số Pi"
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`font-serif text-lg leading-none transition-transform duration-200 ${
                activeSlot === 1 ? 'scale-115 font-black text-cerulean dark:text-blue-300' : 'group-hover:scale-105'
              }`}
            >
              π
            </span>
          </div>
          <span className="text-[11px] font-newsreader mt-0.5 tracking-tight">Số π</span>
        </button>

        {/* 3. Soạn Đề (Slot 2 - Raised Floating Center Action Button) */}
        <div className="relative z-20 flex flex-col items-center justify-center -mt-5">
          <button
            type="button"
            onClick={onOpenCreateProblem}
            className="w-11 h-11 rounded-full bg-cerulean hover:bg-blue-800 active:bg-blue-900 text-white shadow-lg border-2 border-white dark:border-nightCard flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cerulean/50 ring-2 ring-cerulean/20"
            title="Soạn đề bài mới"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <span className="text-[10px] font-bold text-gray-700 dark:text-slate-300 font-newsreader mt-0.5 tracking-tight">
            Soạn Đề
          </span>
        </div>

        {/* 4. Kho Đề (Slot 3 - Đổi vị trí với Số Pi) */}
        <button
          type="button"
          onClick={() => handleNavigation(3, '/kho-de')}
          className={`relative z-10 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors duration-200 cursor-pointer group active:scale-95 ${
            activeSlot === 3
              ? 'text-jasper dark:text-rose-300 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-jasper dark:hover:text-rose-300 hover:bg-jasper/10 dark:hover:bg-jasper/20 font-medium'
          }`}
          title="Kho đề bài và lời giải Tạp chí Pi"
        >
          <div className="relative flex items-center justify-center">
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                activeSlot === 3 ? 'scale-110' : 'group-hover:scale-105'
              }`}
              fill={activeSlot === 3 ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={activeSlot === 3 ? '2' : '1.8'}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <span className="text-[11px] font-newsreader mt-0.5 tracking-tight">Kho Đề</span>
        </button>

        {/* 5. Hồ Sơ Cá Nhân (Slot 4) */}
        <button
          type="button"
          onClick={() => handleNavigation(4, isRealUser ? '/ho-so' : '/dang-nhap')}
          className={`relative z-10 flex flex-col items-center justify-center py-1 px-1 min-h-[44px] rounded-xl transition-colors duration-200 cursor-pointer group active:scale-95 ${
            activeSlot === 4
              ? 'text-jasper dark:text-rose-300 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-jasper dark:hover:text-rose-300 hover:bg-jasper/10 dark:hover:bg-jasper/20 font-medium'
          }`}
          title={isRealUser ? 'Hồ sơ học thuật & Bài giải cá nhân' : 'Đăng nhập'}
        >
          <div className="relative flex items-center justify-center">
            {isRealUser && currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Avatar'}
                className={`w-5 h-5 rounded-full object-cover border transition-transform duration-200 ${
                  activeSlot === 4
                    ? 'scale-110 border-jasper dark:border-rose-400 ring-1 ring-jasper'
                    : 'border-gray-300 dark:border-slate-600 group-hover:scale-105'
                }`}
              />
            ) : (
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  activeSlot === 4 ? 'scale-110' : 'group-hover:scale-105'
                }`}
                fill={activeSlot === 4 ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={activeSlot === 4 ? '2' : '1.8'}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}

            {/* Bookmarks Counter Badge */}
            {bookmarks.length > 0 && (
              <span
                className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-jasper text-white text-[9px] font-mono font-bold flex items-center justify-center leading-none"
                title={`${bookmarks.length} bài đã lưu`}
              >
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </div>
          <span className="text-[11px] font-newsreader mt-0.5 tracking-tight">
            {isRealUser ? 'Hồ Sơ' : 'Tài Khoản'}
          </span>
        </button>
      </div>
    </nav>
  );
}
