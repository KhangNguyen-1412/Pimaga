import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { currentUser, isRealUser, loginWithGoogle, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
        <div className="w-1/4 flex justify-end items-center gap-2 sm:gap-3 transition-all duration-300 shrink-0">
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
            <div className="flex items-center gap-2 sm:gap-2.5">
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-300 dark:border-slate-700 shadow-xs object-cover"
                />
              )}
              <div className="flex flex-col items-end">
                <span className="text-xs md:text-sm font-bold text-ink dark:text-slate-100 max-w-[100px] sm:max-w-[120px] truncate">
                  {currentUser.displayName || currentUser.email || 'Người dùng PI'}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[11px] text-jasper dark:text-red-400 hover:underline font-bold cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
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
