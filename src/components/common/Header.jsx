import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { currentUser, isRealUser, loginWithGoogle, logout } = useAuth();
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
      className={`sticky top-0 z-40 w-full bg-paper/95 backdrop-blur-md transition-all duration-300 border-b ${
        isScrolled
          ? 'shadow-lg border-slate-300/90 bg-paper/95'
          : 'border-ink/20'
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
            className={`text-xs font-bold text-gray-500 uppercase tracking-widest transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isScrolled ? 'max-h-0 opacity-0 m-0' : 'max-h-6 opacity-100'
            }`}
          >
            Toán Học & Tuổi Trẻ
          </p>
          <p
            className={`font-newsreader italic transition-all duration-300 whitespace-nowrap ${
              isScrolled ? 'text-xs text-slate-600 font-medium' : 'text-xs md:text-sm text-gray-600'
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
              className={`font-playfair font-black text-cerulean tracking-tight whitespace-nowrap transition-all duration-300 group-hover:text-blue-800 ${
                isScrolled
                  ? 'text-2xl sm:text-3xl leading-tight'
                  : 'text-4xl sm:text-5xl md:text-6xl'
              }`}
            >
              Tạp Chí Pi
            </h1>
          </button>
          <h2
            className={`font-playfair italic text-cerulean/85 transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isScrolled
                ? 'max-h-0 opacity-0 m-0 text-xs'
                : 'max-h-8 opacity-100 text-sm sm:text-base md:text-xl mt-1'
            }`}
          >
            Kho Đề Bài & Lời Giải Chuyên Đề
          </h2>
        </div>

        {/* Right: Auth UI */}
        <div className="w-1/4 flex justify-end items-center transition-all duration-300 shrink-0">
          {isRealUser ? (
            <div className="flex items-center gap-2.5">
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-300 shadow-xs object-cover"
                />
              )}
              <div className="flex flex-col items-end">
                <span className="text-xs md:text-sm font-bold text-ink max-w-[120px] truncate">
                  {currentUser.displayName || currentUser.email || 'Người dùng PI'}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[11px] text-jasper hover:underline font-bold cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              className="bg-white border border-gray-300 text-ink shadow-sm px-3.5 py-1.5 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-newsreader font-bold text-xs md:text-sm whitespace-nowrap cursor-pointer"
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
