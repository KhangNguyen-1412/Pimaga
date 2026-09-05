import React, { useState } from 'react';
import MathRenderer from '../common/MathRenderer';

export default function LandingHeroCard() {
  const [showInsight, setShowInsight] = useState(false);

  const sampleProblem = {
    code: 'P104',
    title: 'Bất đẳng thức đối xứng đa biến',
    category: 'Cùng Bạn Giải Toán',
    issue: 'Số 04/2024',
    author: 'Nguyễn Văn Minh (Hà Nội)',
    difficulty: 5,
    content: `Cho $a, b, c > 0$ thỏa mãn điều kiện $abc = 1$. Chứng minh rằng:
$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}$$
Đẳng thức xảy ra khi và chỉ khi nào?`,
    insight: `**Bình luận từ Ban Biên Tập Pi:**
Đặt $x = \\frac{1}{a}, y = \\frac{1}{b}, z = \\frac{1}{c} \\implies xyz = 1$. Khi đó:
$$\\frac{1}{a^3(b+c)} = \\frac{x^3}{\\frac{1}{y} + \\frac{1}{z}} = \\frac{x^2}{y+z}$$
Áp dụng bất đẳng thức Cauchy-Schwarz dạng Engel (BĐT Nesbitt mở rộng):
$$\\sum_{\\text{cyc}} \\frac{x^2}{y+z} \\ge \\frac{(x+y+z)^2}{2(x+y+z)} = \\frac{x+y+z}{2} \\ge \\frac{3\\sqrt[3]{xyz}}{2} = \\frac{3}{2}$$
Đẳng thức xảy ra khi và chỉ khi $x = y = z = 1 \\iff a = b = c = 1$.`,
  };

  return (
    <div className="relative group max-w-lg w-full mx-auto">
      <div className="relative bg-white dark:bg-nightCard border-2 border-cerulean/40 dark:border-blue-500/50 rounded-2xl shadow-xl p-6 sm:p-7 text-left transition-all duration-300">
        {/* Top badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cerulean text-white font-newsreader font-bold text-xs sm:text-sm tracking-wider shadow-2xs">
              {sampleProblem.code}
            </span>
            <span className="text-xs font-newsreader text-gray-500 dark:text-slate-400 font-medium">
              {sampleProblem.issue}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-amber-500 flex items-center" title="Độ khó 5 sao (Olympic)">
              {'★'.repeat(sampleProblem.difficulty)}
            </span>
            <span className="text-xs font-newsreader font-bold text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-red-200/60 dark:border-rose-900/60">
              {sampleProblem.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
          {sampleProblem.title}
        </h4>

        {/* KaTeX Content */}
        <div className="font-newsreader text-base text-gray-700 dark:text-slate-200 leading-relaxed mb-4 p-3 bg-paper dark:bg-nightInput rounded-xl border border-gray-200/70 dark:border-slate-800">
          <MathRenderer content={sampleProblem.content} />
        </div>

        {/* Author metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 font-newsreader italic mb-4">
          <span>Đề xuất: {sampleProblem.author}</span>
          <span className="text-cerulean dark:text-blue-400 font-medium not-italic">KaTeX 0.16 Live</span>
        </div>

        {/* Interactive toggle for Editorial Insight */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowInsight(!showInsight)}
            className="w-full py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-cerulean dark:text-blue-300 border border-cerulean/20 dark:border-blue-800 font-newsreader font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showInsight ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            <span>{showInsight ? 'Thu gọn Bình luận Tòa soạn' : 'Xem Định hướng & Bình luận Tòa soạn'}</span>
          </button>

          {showInsight && (
            <div className="mt-3 p-3.5 bg-red-50/70 dark:bg-rose-950/30 border border-jasper/30 dark:border-rose-900/50 rounded-xl text-xs sm:text-sm text-gray-800 dark:text-rose-100/90 font-newsreader animate-dropdownFade">
              <MathRenderer content={sampleProblem.insight} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
