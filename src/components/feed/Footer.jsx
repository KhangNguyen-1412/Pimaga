import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const navigate = useNavigate();
  const { isRealUser } = useAuth();

  return (
    <footer className="hidden sm:flex mt-8 mb-16 pt-10 border-t-2 border-gray-200/80 dark:border-slate-800 text-center flex-col items-center transition-colors">
      <div
        className="relative group cursor-pointer mb-4"
        onClick={() => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        title="Tạp Chí Pi - Trang chủ giới thiệu"
      >
        <div className="absolute -inset-1.5 bg-cerulean/20 dark:bg-blue-500/20 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-300"></div>
        <img
          src="/assets/pimaga-logo.svg"
          alt="Pimaga Emblem"
          className="relative w-14 h-14 rounded-full shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 select-none"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <h4 className="font-playfair text-xl font-bold text-ink dark:text-slate-100 tracking-wide uppercase">
        Tạp Chí Pi — Diễn Đàn Toán Học
      </h4>
      <p className="font-newsreader text-base text-gray-500 dark:text-slate-400 max-w-lg mt-1.5 leading-relaxed">
        Kho tài liệu đề bài toán học chọn lọc và lời giải chuyên đề dành cho học sinh, sinh viên và bạn đọc yêu Toán.
      </p>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-newsreader font-bold text-gray-600 dark:text-slate-300 mt-4">
        <button
          type="button"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-cerulean dark:hover:text-blue-400 transition cursor-pointer"
        >
          Giới Thiệu Tạp Chí Pi
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => navigate('/so-tay-latex')}
          className="hover:text-cerulean dark:hover:text-blue-400 transition cursor-pointer"
        >
          Sổ Tay LaTeX
        </button>
        {isRealUser ? (
          <>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                navigate('/kho-de');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-cerulean dark:hover:text-blue-400 transition cursor-pointer"
            >
              Kho Đề Toán
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                navigate('/ho-so');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-cerulean dark:hover:text-blue-400 transition cursor-pointer"
            >
              Hồ Sơ Học Thuật
            </button>
          </>
        ) : (
          <>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                navigate('/dang-nhap');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-cerulean dark:hover:text-blue-400 transition cursor-pointer"
            >
              Đăng Nhập
            </button>
          </>
        )}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-400 dark:text-slate-500 font-mono mt-5">
        <span>© 2026 Tạp Chí Pi</span>
        <span>•</span>
        <span className="text-cerulean dark:text-blue-400 font-bold">Pimaga React v2.0</span>
        <span>•</span>
        <span>Toán Học &amp; Tuổi Trẻ</span>
      </div>
    </footer>
  );
}
