import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isRealUser, loginWithGoogle, logout } = useAuth();
  const { userProfile } = useData();
  const { isDark, toggleTheme } = useTheme();
  const { isOnline } = useNetworkStatus();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    // Format Vietnamese date
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const raw = new Date().toLocaleDateString('vi-VN', dateOptions);
    setDateString(raw.charAt(0).toUpperCase() + raw.slice(1));

    // Scroll listener for sticky header
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const winY = window.scrollY || window.pageYOffset || 0;
          const container = document.getElementById('problems-container');
          const containerY = container ? container.scrollTop : 0;
          const scrollY = Math.max(winY, containerY);

          setIsScrolled((prev) => {
            // Hysteresis deadband: compact past 35px, expand back when < 15px
            if (!prev && scrollY > 35) return true;
            if (prev && scrollY < 15) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, []);

  const scrollToTop = () => {
    if (location.pathname === '/ho-so' || location.pathname === '/profile') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const container = document.getElementById('problems-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full bg-paper/95 dark:bg-night/95 backdrop-blur-md transition-all duration-300 border-b ${
        isScrolled
          ? 'shadow-lg border-slate-300/90 dark:border-slate-800 bg-paper/95 dark:bg-night/95'
          : 'border-ink/20 dark:border-slate-800/80'
      }`}
    >
      <div
        id="header-inner"
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 flex items-center justify-between gap-4 ${
          isScrolled ? 'py-2 md:py-2.5' : 'py-5 md:py-6'
        }`}
      >
        {/* Left: Metadata (Date & Journal Motto) */}
        <div className="w-1/4 text-left hidden sm:flex flex-col justify-center transition-all duration-300 shrink-0">
          <p
            className={`text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isScrolled ? 'max-h-0 opacity-0 m-0' : 'max-h-6 opacity-100'
            }`}
          >
            Toán Học & Tuổi Trẻ
          </p>
          <p
            className={`font-newsreader italic transition-all duration-300 whitespace-nowrap ${
              isScrolled ? 'text-xs text-slate-600 dark:text-slate-400 font-medium' : 'text-xs md:text-sm text-gray-600 dark:text-slate-300'
            }`}
          >
            {dateString}
          </p>
        </div>

        {/* Center: Brand Title */}
        <div className="flex-1 flex flex-col items-center justify-center text-center transition-all duration-300 min-w-0">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center justify-center group cursor-pointer select-none bg-transparent border-none p-0"
            title="Tạp Chí Pi - Bấm để cuộn lên đầu"
          >
            <h1
              className={`font-playfair font-black text-cerulean dark:text-blue-400 tracking-tight whitespace-nowrap transition-all duration-300 group-hover:text-blue-800 dark:group-hover:text-blue-300 ${
                isScrolled
                  ? 'text-2xl sm:text-3xl leading-tight'
                  : 'text-4xl sm:text-5xl md:text-6xl'
              }`}
            >
              Tạp Chí Pi
            </h1>
          </button>
          <h2
            className={`font-playfair italic text-cerulean/85 dark:text-blue-300/85 transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isScrolled
                ? 'max-h-0 opacity-0 m-0 text-xs'
                : 'max-h-8 opacity-100 text-sm sm:text-base md:text-xl mt-1'
            }`}
          >
            Kho Đề Bài & Lời Giải Chuyên Đề
          </h2>
        </div>

        {/* Right: Auth UI & Theme Toggle */}
        <div className="w-auto flex justify-end items-center gap-1.5 sm:gap-2.5 transition-all duration-300 shrink-0">
          {/* Offline Mode Indicator */}
          {!isOnline && (
            <div
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs font-newsreader font-bold shadow-xs animate-pulse"
              title="Đang làm việc ngoại tuyến với dữ liệu bộ nhớ đệm (Cache)"
            >
              <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
              </svg>
              <span className="hidden sm:inline">Ngoại tuyến</span>
            </div>
          )}

          {/* Gamification Streak Counter Badge */}
          {isRealUser && (
            <button
              type="button"
              onClick={() => navigate('/ho-so')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-jasper/30 dark:border-rose-900/60 text-jasper dark:text-rose-300 text-xs font-newsreader font-bold shadow-2xs hover:bg-rose-100/70 transition cursor-pointer"
              title={`Chuỗi học tập liên tục: ${userProfile?.streak?.current || 1} ngày. Nhấn để xem hồ sơ.`}
            >
              <svg className="w-3.5 h-3.5 text-jasper dark:text-rose-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.173 1.559-1.874 2.257-.905.903-1.847 1.846-2.316 3.018-.46 1.15-.46 2.378-.052 3.518.397 1.11 1.18 2.052 2.122 2.684.945.635 2.062.98 3.197.98 1.135 0 2.252-.345 3.197-.98.942-.632 1.725-1.574 2.122-2.684.408-1.14.408-2.368-.052-3.518-.469-1.172-1.411-2.115-2.316-3.018-.701-.698-1.347-1.437-1.874-2.257a3.834 3.834 0 01-.291-.492zM10 14a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{userProfile?.streak?.current || 1} ngày</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-nightCard text-gray-600 dark:text-amber-300 hover:text-cerulean dark:hover:text-amber-200 hover:border-cerulean dark:hover:border-amber-400/50 shadow-2xs hover:shadow transition-all duration-200 flex items-center justify-center cursor-pointer"
            title={isDark ? 'Chuyển sang Chế độ Sáng (Light Mode)' : 'Chuyển sang Chế độ Tối (Dark Mode)'}
            aria-label="Chuyển đổi giao diện sáng/tối"
          >
            {isDark ? (
              /* Sun Icon */
              <svg className="w-4 h-4 text-amber-300 transform transition-transform hover:rotate-45" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              /* Moon Icon */
              <svg className="w-4 h-4 text-slate-600 hover:text-cerulean transform transition-transform hover:-rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {isRealUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => navigate('/ho-so')}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-cerulean dark:hover:border-blue-500 bg-white/80 dark:bg-nightCard/80 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition cursor-pointer group shadow-2xs text-left"
                title="Truy cập Trang cá nhân & Hồ sơ học thuật"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Avatar"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 dark:border-slate-700 shadow-xs object-cover group-hover:border-cerulean transition"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cerulean/10 text-cerulean dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                    {(currentUser.displayName || 'P').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-ink dark:text-slate-100 max-w-[85px] sm:max-w-[110px] truncate group-hover:text-cerulean dark:group-hover:text-blue-400 font-newsreader transition">
                    {currentUser.displayName || currentUser.email || 'Người dùng PI'}
                  </span>
                  <span className="text-xs text-cerulean dark:text-blue-400 font-bold font-newsreader flex items-center gap-0.5">
                    <span>Hồ sơ</span>
                    <svg className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-jasper dark:text-rose-400 hover:underline font-bold cursor-pointer px-1 py-1 font-newsreader shrink-0"
                title="Đăng xuất khỏi tài khoản"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              className="bg-white dark:bg-nightCard border border-gray-300 dark:border-slate-700 text-ink dark:text-slate-200 shadow-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition flex items-center gap-2 font-newsreader font-bold text-xs md:text-sm whitespace-nowrap cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
