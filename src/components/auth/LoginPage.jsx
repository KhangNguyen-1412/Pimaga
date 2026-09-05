import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import MathRenderer from '../common/MathRenderer';

export default function LoginPage() {
  const navigate = useNavigate();
  const { currentUser, isRealUser, loginWithGoogle, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setLoginError('');
      await loginWithGoogle();
      navigate('/kho-de');
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Đăng nhập không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-paper dark:bg-night text-ink dark:text-slate-100 font-newsreader transition-colors duration-200">
      {/* ========================================================
          LEFT HALF: ACADEMIC BRANDING & MATHEMATICAL SHOWCASE (Desktop)
          ======================================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white p-12 xl:p-16 flex-col justify-between overflow-hidden select-none border-r border-slate-800">
        {/* Subtle background decorative mathematical watermarks */}
        <div className="absolute top-12 -right-6 opacity-20 pointer-events-none text-right select-none">
          <div className="text-2xl text-blue-200">
            <MathRenderer content="$$\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$" />
          </div>
          <div className="text-xl text-blue-300 mt-3">
            <MathRenderer content="$$e^{i\\pi} + 1 = 0$$" />
          </div>
          <div className="text-lg text-blue-200 mt-3">
            <MathRenderer content="$$\\int_{-\\infty}^\\infty e^{-x^2} dx = \\sqrt{\\pi}$$" />
          </div>
        </div>

        {/* Left Top: Brand Identity Header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-paper dark:bg-nightInput border-2 border-cerulean/50 p-2 shadow-lg flex items-center justify-center">
            <img
              src="/assets/pimaga-logo.svg"
              alt="Pi"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h2 className="font-playfair font-black text-2xl tracking-tight text-white leading-none">
              Tạp Chí Pi
            </h2>
            <p className="text-xs uppercase tracking-widest text-blue-300 font-bold font-newsreader mt-0.5">
              Hội Toán Học Việt Nam
            </p>
          </div>
        </div>

        {/* Left Center: Academic Statement & Mathematical Elegance */}
        <div className="relative z-10 my-auto py-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-blue-200 uppercase tracking-widest backdrop-blur-xs">
            <span>Toán Học &amp; Tuổi Trẻ</span>
          </div>

          <h1 className="font-playfair text-3xl xl:text-4xl 2xl:text-5xl font-black leading-tight tracking-tight text-white">
            Nơi Khởi Nguồn Đam Mê &amp; Tư Duy Sâu Sắc
          </h1>

          <blockquote className="text-base xl:text-lg text-blue-100/90 italic font-newsreader leading-relaxed border-l-2 border-cerulean pl-4">
            &ldquo;Toán học là ngôn ngữ chung của tư duy logic. Mỗi bài toán được giải là một bước tiến của trí tuệ.&rdquo;
          </blockquote>

          {/* 3 Pillars List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-cerulean/30 border border-cerulean/40 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-playfair font-bold text-base text-white">
                  Kho Đề Olympic &amp; Chuyên Đề Tạp Chí
                </h4>
                <p className="text-xs xl:text-sm text-blue-200/80 font-newsreader">
                  Tuyển tập các bài toán chọn lọc từ các số báo Tạp chí Pi qua các năm.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-cerulean/30 border border-cerulean/40 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-playfair font-bold text-base text-white">
                  Soạn Thảo KaTeX &amp; TikZ SVG Trực Tiếp
                </h4>
                <p className="text-xs xl:text-sm text-blue-200/80 font-newsreader">
                  Soạn thảo công thức TeX và dựng hình học mượt mà theo thời gian thực.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-cerulean/30 border border-cerulean/40 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-playfair font-bold text-base text-white">
                  Chuỗi Rèn Luyện &amp; Cấp Bậc Học Thuật
                </h4>
                <p className="text-xs xl:text-sm text-blue-200/80 font-newsreader">
                  Tích lũy bài giải, thăng hạng từ Tập sự lên Đại Kiện Tướng danh giá.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Bottom: Footer note */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-blue-300/70 flex items-center justify-between">
          <span>© 2026 Tạp Chí Pi • Pimaga</span>
          <span>Hội Toán Học Việt Nam</span>
        </div>
      </div>

      {/* ========================================================
          RIGHT HALF: AUTHENTICATION FORM & ACCESS CONTROL
          ======================================================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 min-h-screen">
        {/* Right Top Bar: Navigation & Theme Toggle */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-bold font-newsreader text-gray-600 dark:text-slate-300 hover:text-cerulean dark:hover:text-blue-400 transition cursor-pointer group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Về Trang Chủ Giới Thiệu</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-nightCard text-gray-600 dark:text-blue-300 hover:text-cerulean dark:hover:text-blue-200 shadow-2xs transition cursor-pointer"
            title={isDark ? 'Chế độ Sáng' : 'Chế độ Tối'}
            aria-label="Chuyển đổi giao diện sáng/tối"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-cerulean dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-600 hover:text-cerulean" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Right Center: Authentication Panel */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          {/* Mobile Logo for small screens */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-paper dark:bg-nightInput border-2 border-cerulean/40 p-1.5 shadow-sm flex items-center justify-center">
              <img src="/assets/pimaga-logo.svg" alt="Pi" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-playfair font-black text-xl text-cerulean dark:text-blue-400">
                Tạp Chí Pi
              </span>
              <p className="text-2xs uppercase tracking-wider text-gray-500 font-bold font-newsreader">
                Hội Toán Học Việt Nam
              </p>
            </div>
          </div>

          <div>
            <span className="inline-block text-xs font-bold text-cerulean dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-cerulean/20 dark:border-blue-900/50 mb-3">
              Cổng Tra Cứu &amp; Học Tập
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-black text-ink dark:text-slate-100 tracking-tight">
              Đăng Nhập Tài Khoản
            </h2>
            <p className="text-base text-gray-600 dark:text-slate-300 font-newsreader mt-2 leading-relaxed">
              Chào mừng bạn đến với chuyên trang đề thi và lời giải chính thức của Tạp chí Pi.
            </p>
          </div>

          {/* If already logged in */}
          {isRealUser ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-nightCard border-2 border-cerulean/30 dark:border-blue-500/30 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border border-gray-300 dark:border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-cerulean/10 text-cerulean font-bold flex items-center justify-center text-lg">
                    {(currentUser.displayName || 'P').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-playfair font-bold text-base text-ink dark:text-slate-100">
                    {currentUser.displayName || 'Bạn Đọc Pi'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-0.5 text-2xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
                    Đang Đăng Nhập
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/kho-de')}
                  className="w-full py-3 px-4 rounded-xl bg-cerulean hover:bg-blue-800 text-white font-newsreader font-bold text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Truy Cập Kho Đề Toán</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/ho-so')}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-gray-300 dark:border-slate-700 hover:border-cerulean bg-paper dark:bg-nightInput font-newsreader font-bold text-sm text-ink dark:text-slate-200 transition cursor-pointer"
                  >
                    Xem Hồ Sơ Của Tôi
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="py-2.5 px-4 rounded-xl border border-red-200 dark:border-rose-900/60 hover:bg-red-50 dark:hover:bg-rose-950/40 text-jasper dark:text-rose-400 font-newsreader font-bold text-sm transition cursor-pointer"
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Login Action Form */
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-rose-950/50 border border-red-200 dark:border-rose-900 text-xs text-jasper dark:text-rose-300 font-newsreader">
                  {loginError}
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-nightCard hover:bg-gray-50 dark:hover:bg-slate-800 text-ink dark:text-slate-100 border-2 border-gray-300 dark:border-slate-700 hover:border-cerulean dark:hover:border-blue-500 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3.5 font-newsreader font-bold text-base sm:text-lg cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <svg className="animate-spin h-5 w-5 text-cerulean dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>{isLoggingIn ? 'Đang kết nối Google OAuth...' : 'Đăng nhập với Google'}</span>
              </button>

              {/* Security guarantee cards */}
              <div className="p-4 rounded-xl bg-paper dark:bg-nightInput border border-gray-200/80 dark:border-slate-800 space-y-2.5 text-xs text-gray-600 dark:text-slate-300 font-newsreader">
                <div className="flex items-center gap-2 text-cerulean dark:text-blue-400 font-bold">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Bảo mật &amp; Cam kết quyền riêng tư:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-gray-500 dark:text-slate-400">
                  <li>Xác thực qua chuẩn quốc tế Google OAuth 2.0.</li>
                  <li>Không lưu trữ mật khẩu hay thông tin nhạy cảm.</li>
                  <li>Tự động lưu trữ bài giải và đồng bộ chuỗi Streak học tập.</li>
                </ul>
              </div>

              {/* Login required note */}
              <div className="pt-2 text-center text-xs text-gray-500 dark:text-slate-400 font-newsreader italic">
                *Bạn cần đăng nhập tài khoản Google để truy cập kho đề bài, lời giải và không gian rèn luyện.
              </div>
            </div>
          )}
        </div>

        {/* Right Bottom Footer */}
        <div className="pt-8 border-t border-gray-200/80 dark:border-slate-800 text-center text-xs text-gray-400 dark:text-slate-500 font-newsreader">
          <span>© 2026 Tạp Chí Pi • Diễn đàn Toán học &amp; Tuổi trẻ Việt Nam</span>
        </div>
      </div>
    </div>
  );
}
