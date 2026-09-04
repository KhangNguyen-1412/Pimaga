import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginGate() {
  const { loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 animate-dropdownFade">
      <div className="w-full max-w-xl bg-white border border-gray-200/90 rounded-2xl shadow-xl p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Subtle decorative background accents */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cerulean via-blue-700 to-jasper"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-50 rounded-full blur-2xl pointer-events-none"></div>

        {/* Pimaga Logo Emblem */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-paper border-2 border-cerulean/30 shadow-md flex items-center justify-center p-3 group transition-transform hover:scale-105 duration-300">
            <img
              src="/assets/pimaga-logo.svg"
              alt="Tạp Chí Pi"
              className="w-full h-full object-contain select-none filter drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Academic Motto Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-jasper bg-red-50 border border-red-200/70 px-3 py-1 rounded-full uppercase tracking-widest font-newsreader shadow-2xs">
            Toán Học & Tuổi Trẻ
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-playfair text-3xl sm:text-4xl font-black text-ink tracking-tight mb-3">
          Cổng Tra Cứu & Giải Toán Pi
        </h2>

        {/* Introduction */}
        <p className="font-newsreader text-gray-600 text-lg sm:text-xl leading-relaxed mb-8 max-w-md mx-auto">
          Chào mừng bạn đến với chuyên trang đề thi và bài giải chính thức của Tạp chí Pi. Vui lòng đăng nhập để bắt đầu trải nghiệm.
        </p>

        {/* Highlights feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          <div className="p-3 bg-paper rounded-xl border border-gray-200/80 shadow-2xs">
            <div className="text-cerulean font-bold text-xs uppercase tracking-wider mb-1 font-newsreader">Kho Đề Thi</div>
            <p className="text-xs text-gray-600 font-newsreader">Đề toán Olympic và chuyên đề học sinh giỏi.</p>
          </div>
          <div className="p-3 bg-paper rounded-xl border border-gray-200/80 shadow-2xs">
            <div className="text-cerulean font-bold text-xs uppercase tracking-wider mb-1 font-newsreader">Soạn Thảo LaTeX</div>
            <p className="text-xs text-gray-600 font-newsreader">Tích hợp KaTeX và sổ tay 60+ công thức.</p>
          </div>
          <div className="p-3 bg-paper rounded-xl border border-gray-200/80 shadow-2xs">
            <div className="text-jasper font-bold text-xs uppercase tracking-wider mb-1 font-newsreader">Lời Giải Chuẩn</div>
            <p className="text-xs text-gray-600 font-newsreader">Đối chiếu bài làm cùng Ban Biên Tập Pi.</p>
          </div>
        </div>

        {/* Big Google Login CTA Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-6 bg-white hover:bg-gray-50 text-ink border-2 border-gray-300 hover:border-cerulean rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 font-newsreader font-bold text-base sm:text-lg cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <svg className="animate-spin h-5 w-5 text-cerulean" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <span>{isLoggingIn ? 'Đang kết nối Google...' : 'Đăng nhập với Google'}</span>
          </button>

          <p className="text-xs text-gray-500 font-newsreader">
            Xác thực an toàn qua Google OAuth 2.0 • Không thu thập dữ liệu riêng tư
          </p>
        </div>
      </div>
    </div>
  );
}
