import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LandingHeader({ onOpenLatexModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isRealUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/gioi-thieu')) return true;
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Tổng quan', path: '/', color: 'cerulean' },
    { label: 'Tính năng', path: '/tinh-nang', color: 'cerulean' },
    { label: 'Lịch sử số π', path: '/lich-su-so-pi', color: 'jasper' },
    { label: 'Tạp chí Pi', path: '/tap-chi-pi', color: 'jasper' },
  ];

  return (
    <header
      id="landing-header"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-nightCard/95 backdrop-blur-xl shadow-lg shadow-cerulean/10 dark:shadow-black/60 border-b border-gray-200/90 dark:border-slate-700/80 py-2.5'
          : 'bg-white/92 dark:bg-nightCard/92 backdrop-blur-xl border-b border-gray-200/70 dark:border-slate-700/60 py-3.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Emblem with Dual Cerulean + Jasper Harmony */}
        <button
          type="button"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer text-left select-none bg-transparent border-none p-0 shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full group-hover:scale-105 transition-all flex items-center justify-center drop-shadow-xs shrink-0">
            <img
              src="/assets/pimaga-logo.svg"
              alt="Pi"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-playfair font-black text-lg sm:text-2xl leading-tight">
              <span className="text-cerulean dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                Tạp Chí{' '}
              </span>
              <span className="text-jasper dark:text-rose-400 group-hover:text-red-700 dark:group-hover:text-rose-300 transition-colors">
                Pi
              </span>
            </span>
            <span className="font-newsreader text-[10px] sm:text-2xs uppercase tracking-widest text-gray-500 dark:text-slate-400 font-bold hidden sm:inline-block">
              Hội Toán Học Việt Nam
            </span>
          </div>
        </button>

        {/* Center: Multi-Page Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-newsreader font-bold">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const isJasperTheme = item.color === 'jasper';
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-all duration-200 cursor-pointer px-3 py-1.5 rounded-xl active:scale-95 ${
                  active
                    ? isJasperTheme
                      ? 'text-jasper dark:text-rose-300 font-bold bg-jasper/15 dark:bg-jasper/30 border border-jasper/35 dark:border-rose-400/40 shadow-xs'
                      : 'text-cerulean dark:text-blue-300 font-bold bg-cerulean/15 dark:bg-cerulean/30 border border-cerulean/35 dark:border-blue-400/40 shadow-xs'
                    : isJasperTheme
                    ? 'text-gray-600 dark:text-slate-300 hover:text-jasper dark:hover:text-rose-300 hover:bg-jasper/10 dark:hover:bg-jasper/20 font-medium'
                    : 'text-gray-600 dark:text-slate-300 hover:text-cerulean dark:hover:text-blue-300 hover:bg-cerulean/10 dark:hover:bg-cerulean/20 font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions & CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-cerulean/15 dark:bg-cerulean/30 border border-cerulean/35 dark:border-blue-400/40 text-cerulean dark:text-blue-300 hover:bg-cerulean/25 dark:hover:bg-cerulean/40 shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            title={isDark ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
            aria-label="Chuyển đổi giao diện sáng/tối"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-cerulean dark:text-blue-300 transform transition-transform hover:rotate-45" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-cerulean dark:text-blue-300 transform transition-transform hover:-rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Sổ tay LaTeX button */}
          <button
            type="button"
            onClick={onOpenLatexModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cerulean/35 dark:border-blue-400/40 bg-white/92 dark:bg-nightCard/92 text-xs font-newsreader font-bold text-cerulean dark:text-blue-300 hover:bg-cerulean/15 dark:hover:bg-cerulean/30 shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Sổ tay tra cứu công thức LaTeX"
          >
            <span className="font-serif font-bold text-2xs opacity-90 tracking-tighter">TeX</span>
            <span>Sổ Tay</span>
          </button>

          {/* Action Buttons: 
              - Chưa đăng nhập: KHÔNG CÓ nút vào kho đề, CHỈ CÓ nút Đăng nhập (với tone Đỏ Jasper nổi bật, cân bằng với xanh Cerulean)
              - Đã đăng nhập: CHỈ CÓ nút Kho Đề (Xanh Cerulean)
          */}
          {isRealUser ? (
            <button
              type="button"
              onClick={() => {
                navigate('/kho-de');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-cerulean hover:bg-blue-800 text-white font-newsreader font-bold text-xs sm:text-sm shadow-xs hover:shadow active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer group"
            >
              <span>Kho Đề</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/dang-nhap')}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-jasper hover:bg-red-700 text-white text-xs sm:text-sm font-newsreader font-bold shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FFFFFF"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FFFFFF"/>
              </svg>
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:text-cerulean transition cursor-pointer"
            aria-label="Mở menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-nightCard/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 font-newsreader font-bold text-sm text-gray-700 dark:text-slate-200 animate-dropdownFade shadow-lg">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left py-3 px-3.5 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-between active:scale-95 ${
                    active
                      ? item.color === 'jasper'
                        ? 'bg-jasper/15 dark:bg-jasper/30 text-jasper dark:text-rose-300 font-bold border border-jasper/35 dark:border-rose-400/40 shadow-xs'
                        : 'bg-cerulean/15 dark:bg-cerulean/30 text-cerulean dark:text-blue-300 font-bold border border-cerulean/35 dark:border-blue-400/40 shadow-xs'
                      : item.color === 'jasper'
                      ? 'hover:bg-jasper/10 dark:hover:bg-jasper/20 hover:text-jasper dark:hover:text-rose-300 text-gray-700 dark:text-slate-300 font-medium'
                      : 'hover:bg-cerulean/10 dark:hover:bg-cerulean/20 hover:text-cerulean dark:hover:text-blue-300 text-gray-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color === 'jasper' ? 'bg-jasper' : 'bg-cerulean'}`}></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-200/90 dark:border-slate-700/80 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLatexModal();
              }}
              className="w-full text-left py-2.5 px-3.5 rounded-xl hover:bg-cerulean/10 dark:hover:bg-cerulean/20 transition-all flex items-center gap-2 cursor-pointer text-cerulean dark:text-blue-300 min-h-[44px] active:scale-95"
            >
              <span className="font-serif font-bold text-xs opacity-90 tracking-tighter bg-cerulean/15 dark:bg-cerulean/30 border border-cerulean/35 px-1.5 py-0.5 rounded">TeX</span>
              <span>Sổ tay công thức LaTeX</span>
            </button>
            {isRealUser ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/kho-de');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 px-4 rounded-xl bg-cerulean hover:bg-blue-800 text-white font-bold text-center flex items-center justify-center gap-2 cursor-pointer transition shadow-sm min-h-[44px]"
              >
                <span>Vào Kho Đề Bài</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dang-nhap');
                }}
                className="w-full py-3 px-4 rounded-xl bg-jasper hover:bg-red-700 text-white font-bold text-center flex items-center justify-center gap-2 cursor-pointer transition shadow-sm min-h-[44px]"
              >
                <span>Đăng Nhập Tài Khoản</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
