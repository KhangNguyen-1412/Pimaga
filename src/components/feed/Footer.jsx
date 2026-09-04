import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8 mb-16 pt-10 border-t-2 border-gray-200/80 dark:border-slate-800 text-center flex flex-col items-center transition-colors">
      <div className="relative group cursor-pointer mb-4">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-cerulean to-jasper rounded-full blur opacity-25 group-hover:opacity-60 transition duration-300"></div>
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
