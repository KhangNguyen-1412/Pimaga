import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import MathRenderer from '../common/MathRenderer';
import LandingHeroCard from './LandingHeroCard';

export default function LandingPage({ onExploreFeed, onOpenLatexModal }) {
  const navigate = useNavigate();
  const { isRealUser } = useAuth();
  const { problems, issues, categories } = useData();

  return (
    <div className="landing-page-container font-newsreader text-ink dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section id="tong-quan" className="relative pt-6 sm:pt-12 pb-16 md:pb-24 overflow-hidden border-b border-gray-200/80 dark:border-slate-800 scroll-mt-20">
        {/* Solid paper and academic backdrop - strictly without gradients */}
        <div className="absolute inset-0 bg-paper dark:bg-night -z-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Prestigious badge with Cerulean + Jasper Dual Harmony */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-jasper dark:bg-rose-400 animate-pulse"></span>
                <span className="uppercase tracking-widest">
                  <span className="text-cerulean dark:text-blue-400">Hội Toán Học Việt Nam</span>
                  <span className="mx-1.5 text-gray-400">•</span>
                  <span className="text-jasper dark:text-rose-400">Tạp Chí Pi</span>
                </span>
              </div>

              {/* Majestic Headline */}
              <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-slate-100 tracking-tight leading-[1.15]">
                Diễn Đàn &amp; Kho Dữ Liệu{' '}
                <span className="text-cerulean dark:text-blue-400 italic">Toán Học</span>{' '}
                &amp; Tri Thức{' '}
                <span className="text-jasper dark:text-rose-400 italic">Đỉnh Cao</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Nền tảng số hóa chính thức lưu trữ các đề thi Olympic, chuyên đề học sinh giỏi và bài giải mẫu mực từ{' '}
                <span className="font-bold text-cerulean dark:text-blue-400">Tạp chí Pi</span> thuộc{' '}
                <span className="font-bold text-jasper dark:text-rose-400">Hội Toán học Việt Nam</span>. Tích hợp soạn thảo KaTeX trực tiếp, vẽ hình học TikZ và hệ thống xếp hạng học thuật.
              </p>

              {/* Action Buttons: 
                  - Khi chưa đăng nhập: Đăng Nhập Google (nổi bật với Đỏ Jasper) + Về Tạp Chí Pi (Xanh Cerulean)
                  - Khi đã đăng nhập: Vào Kho Đề (Xanh Cerulean) + Lịch Sử Số Pi (Đỏ Jasper)
              */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                {isRealUser ? (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate('/kho-de')}
                      className="px-6 py-3.5 rounded-xl bg-cerulean hover:bg-blue-800 text-white font-newsreader font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer group"
                    >
                      <span>Vào Kho Đề</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/lich-su-so-pi')}
                      className="px-5 py-3.5 rounded-xl bg-jasper hover:bg-red-700 text-white font-newsreader font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lịch Sử Số π</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate('/dang-nhap')}
                      className="px-6 py-3.5 rounded-xl bg-jasper hover:bg-red-700 text-white font-newsreader font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FFFFFF"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FFFFFF"/>
                      </svg>
                      <span>Đăng Nhập Google Để Khám Phá</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/tap-chi-pi')}
                      className="px-5 py-3.5 rounded-xl border-2 border-cerulean text-cerulean dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-newsreader font-bold text-base sm:text-lg shadow-2xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Về Tạp Chí Pi</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={onOpenLatexModal}
                  className="px-4 py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 bg-transparent text-gray-700 dark:text-slate-300 font-newsreader font-bold text-base transition flex items-center gap-2 cursor-pointer"
                  title="Mở Sổ tay tra cứu hơn 60 ký hiệu và cú pháp LaTeX"
                >
                  <span className="font-serif font-bold text-xs bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-slate-300">
                    TeX
                  </span>
                  <span>Sổ Tay</span>
                </button>
              </div>

              {/* Trust & editorial statement */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Chuẩn mực sư phạm</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-jasper dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>KaTeX &amp; TikZ SVG siêu tốc</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-cerulean dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Học thuật phi lợi nhuận</span>
                </span>
              </div>
            </div>

            {/* Right Hero: Live Interactive Math Card */}
            <div className="lg:col-span-5 flex justify-center">
              <LandingHeroCard />
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT & METRICS BAR - Dual Tone Cadence */}
      <section className="py-10 bg-paperDark/60 dark:bg-nightCard/60 border-b border-gray-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* Metric 1: Cerulean */}
            <div className="p-4 rounded-xl bg-white/70 dark:bg-nightInput/70 border border-gray-200/60 dark:border-slate-800 border-t-4 border-t-cerulean shadow-2xs">
              <div className="font-playfair font-black text-3xl sm:text-4xl text-cerulean dark:text-blue-400 mb-1">
                {problems.length > 0 ? `${problems.length}+` : '120+'}
              </div>
              <div className="font-newsreader font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-slate-200">
                Bài Toán Tuyển Chọn
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Phân cấp từ 1 đến 5 sao</p>
            </div>

            {/* Metric 2: Jasper */}
            <div className="p-4 rounded-xl bg-white/70 dark:bg-nightInput/70 border border-gray-200/60 dark:border-slate-800 border-t-4 border-t-jasper shadow-2xs">
              <div className="font-playfair font-black text-3xl sm:text-4xl text-jasper dark:text-rose-400 mb-1">
                {issues.length > 0 ? `${issues.length}` : '14'}
              </div>
              <div className="font-newsreader font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-slate-200">
                Kỳ Tạp Chí Phát Hành
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Lưu trữ các số báo Tạp chí Pi</p>
            </div>

            {/* Metric 3: Cerulean */}
            <div className="p-4 rounded-xl bg-white/70 dark:bg-nightInput/70 border border-gray-200/60 dark:border-slate-800 border-t-4 border-t-cerulean shadow-2xs">
              <div className="font-playfair font-black text-3xl sm:text-4xl text-cerulean dark:text-blue-400 mb-1">
                {categories.length > 0 ? `${categories.length}` : '8'}
              </div>
              <div className="font-newsreader font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-slate-200">
                Chuyên Mục Độc Quyền
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Thách thức, Cùng bạn giải toán...</p>
            </div>

            {/* Metric 4: Jasper */}
            <div className="p-4 rounded-xl bg-white/70 dark:bg-nightInput/70 border border-gray-200/60 dark:border-slate-800 border-t-4 border-t-jasper shadow-2xs">
              <div className="font-playfair font-black text-3xl sm:text-4xl text-jasper dark:text-rose-400 mb-1">
                4.000+
              </div>
              <div className="font-newsreader font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-slate-200">
                Năm Lịch Sử Số $\pi$
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Từ Archimedes đến kỷ nguyên số</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS & FEATURES */}
      <section id="tinh-nang" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-newsreader uppercase tracking-widest text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-red-200/70 dark:border-rose-900/50 shadow-2xs">
            Trụ Cột Công Nghệ &amp; Học Thuật
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-black text-ink dark:text-slate-100 tracking-tight mt-3 mb-4">
            Được Thiết Kế Chuyên Biệt Cho Người Yêu Toán
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
            Kết hợp sự nghiêm cẩn của một tạp chí toán học truyền thống với trải nghiệm tương tác số hóa hiện đại nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-nightCard border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-400 border border-cerulean/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-playfair font-bold text-xl text-ink dark:text-slate-100 mb-2.5">
              Kho Đề Phân Cấp &amp; Lọc Đa Chiều
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Dễ dàng tra cứu bài toán theo kỳ tạp chí, chuyên mục, thang độ khó từ 1 đến 5 sao, cùng thông tin tác giả và tỉnh thành đề xuất.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-nightCard border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-400 border border-jasper/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-playfair font-bold text-xl text-ink dark:text-slate-100 mb-2.5">
              Soạn Thảo KaTeX &amp; TikZ Trực Tiếp
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Không gian giải toán với thanh công cụ chèn ký hiệu nhanh và xem trước công thức tức thì mà không che khuất đề bài gốc.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-nightCard border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-400 border border-cerulean/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-playfair font-bold text-xl text-ink dark:text-slate-100 mb-2.5">
              Lời Giải Chuẩn &amp; Bình Luận Tòa Soạn
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Đối chiếu cách làm với lời giải chính thức từ Ban Biên Tập Pi, tiếp cận những góc nhìn sư phạm sắc bén và phương pháp mở rộng.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-nightCard border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-400 border border-jasper/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-playfair font-bold text-xl text-ink dark:text-slate-100 mb-2.5">
              Chuỗi Rèn Luyện &amp; Lưu Trữ Cá Nhân
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Duy trì chuỗi ngày rèn luyện liên tục (Streak), đánh dấu bài toán yêu thích và xem lại toàn bộ bài giải cá nhân mọi lúc.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-nightCard border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-cerulean dark:text-blue-400 border border-cerulean/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="font-playfair font-bold text-xl text-ink dark:text-slate-100 mb-2.5">
              Xuất Tuyển Tập Đa Định Dạng
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Kết xuất đề bài và bài giải cá nhân ra PDF in ấn, mã nguồn LaTeX <code className="font-mono text-xs">.tex</code>, Microsoft Word <code className="font-mono text-xs">.docx</code> và Markdown chuẩn học thuật.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-nightCard border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-400 border border-jasper/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-playfair font-bold text-xl text-ink dark:text-slate-100 mb-2.5">
              Sổ Tay 60+ Cú Pháp Toán LaTeX
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Tra cứu nhanh ký hiệu Đại số, Giải tích, Hình học, Ma trận, Tổ hợp. Nhấn để sao chép hoặc chèn trực tiếp vào khung soạn thảo.
            </p>
            </div>
          </div>

        {/* View all features link button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              navigate('/tinh-nang');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-xl bg-white dark:bg-nightInput hover:bg-red-50 dark:hover:bg-rose-950/40 border-2 border-jasper/50 text-jasper dark:text-rose-400 font-newsreader font-bold text-base shadow-2xs hover:shadow transition cursor-pointer inline-flex items-center gap-2 group"
          >
            <span>Khám Phá Toàn Diện 6 Tính Năng</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* 4. LỊCH SỬ HÌNH THÀNH CỦA SỐ PI */}
      <section id="lich-su-so-pi" className="py-16 md:py-24 bg-paperDark/40 dark:bg-nightCard/40 border-y border-gray-200/80 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold font-newsreader uppercase tracking-widest text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/50 px-3.5 py-1.5 rounded-full border border-jasper/30 dark:border-rose-900 shadow-2xs">
              Hằng Số Bất Hủ Của Vũ Trụ • π = 3.14159265...
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-black text-ink dark:text-slate-100 tracking-tight mt-3 mb-3">
              Lịch Sử Hình Thành Của <span className="text-cerulean dark:text-blue-400 italic">Hằng Số</span> <span className="text-jasper dark:text-rose-400 italic">π</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
              Bản trường ca 4.000 năm của trí tuệ loài người: từ phương pháp đa giác vét cạn của Archimedes, kỷ lục 800 năm của Tổ Xung Chi, đến các chuỗi vô hạn tuyệt mỹ của Euler và Ramanujan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
            {/* Milestone 1: Archimedes */}
            <div className="p-6 rounded-2xl bg-white dark:bg-nightCard border-2 border-cerulean shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold font-newsreader bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300 inline-block mb-3">
                  Hy Lạp Cổ Đại • 250 TCN
                </span>
                <h3 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
                  Archimedes xứ Syracuse
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader mb-4">
                  Dùng đa giác đều 96 cạnh kẹp chính xác giá trị số π giữa hai phân số hình học đầu tiên trong lịch sử.
                </p>
              </div>
              <div className="p-3 bg-paper dark:bg-nightInput rounded-xl border border-gray-200/80 dark:border-slate-800 text-sm font-mono text-center">
                <MathRenderer content="$$\\frac{223}{71} < \\pi < \\frac{22}{7}$$" />
              </div>
            </div>

            {/* Milestone 2: Tổ Xung Chi */}
            <div className="p-6 rounded-2xl bg-white dark:bg-nightCard border-2 border-jasper shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold font-newsreader bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300 inline-block mb-3">
                  Phương Đông • 480 SCN
                </span>
                <h3 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
                  Tổ Xung Chi (Zu Chongzhi)
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader mb-4">
                  Tìm ra phân số mật suất chính xác đến 7 chữ số thập phân, giữ kỷ lục thế giới suốt hơn 800 năm.
                </p>
              </div>
              <div className="p-3 bg-paper dark:bg-nightInput rounded-xl border border-gray-200/80 dark:border-slate-800 text-sm font-mono text-center">
                <MathRenderer content="$$\\pi \\approx \\frac{355}{113} = 3.1415929...$$" />
              </div>
            </div>

            {/* Milestone 3: Leonhard Euler */}
            <div className="p-6 rounded-2xl bg-white dark:bg-nightCard border-2 border-cerulean shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold font-newsreader bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300 inline-block mb-3">
                  Kỷ Nguyên Giải Tích • 1748
                </span>
                <h3 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
                  Leonhard Euler &amp; Đẳng Thức Euler
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader mb-4">
                  Chuẩn hóa ký hiệu π và tạo nên đẳng thức đẹp nhất toán học liên kết 5 hằng số cơ bản vũ trụ.
                </p>
              </div>
              <div className="p-3 bg-paper dark:bg-nightInput rounded-xl border border-gray-200/80 dark:border-slate-800 text-sm font-mono text-center">
                <MathRenderer content="$$e^{i\\pi} + 1 = 0$$" />
              </div>
            </div>
          </div>

          {/* Action button to full history page - Bold Jasper Red */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                navigate('/lich-su-so-pi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-7 py-3.5 rounded-xl bg-jasper hover:bg-red-700 text-white font-newsreader font-bold text-base shadow-md hover:shadow-lg transition cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>Khám Phá Toàn Bộ Lịch Sử 4000 Năm Số π</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 5. VỀ TẠP CHÍ PI — HỘI TOÁN HỌC VIỆT NAM */}
      <section id="tap-chi-pi" className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-nightCard border-2 border-jasper/30 dark:border-rose-800/80 shadow-xl text-left">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-3 flex justify-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-paper dark:bg-nightInput border-2 border-cerulean shadow-md flex items-center justify-center p-5 ring-2 ring-jasper/30">
                <img
                  src="/assets/pimaga-logo.svg"
                  alt="Tạp Chí Pi Emblem"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-9 space-y-4">
              <span className="text-xs font-bold text-cerulean dark:text-blue-400 uppercase tracking-widest font-newsreader bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-cerulean/30">
                Ấn Phẩm Chính Thức • Hội Toán Học Việt Nam
              </span>

              <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-black text-ink dark:text-slate-100">
                Tạp Chí <span className="text-cerulean dark:text-blue-400">Pi</span> — Sứ Mệnh Ươm Mầm <span className="text-jasper dark:text-rose-400">Trí Tuệ</span> &amp; Lan Tỏa Tình Yêu Toán Học
              </h2>

              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader">
                Tạp chí Pi được thành lập năm 2017 bởi Hội Toán học Việt Nam, khởi xướng bởi GS. Hà Huy Khoái, GS. Ngô Bảo Châu, GS. Trần Văn Nhung cùng đông đảo các nhà giáo tâm huyết trên toàn quốc. Tạp chí mở ra diễn đàn học thuật chuẩn mực, đưa vẻ đẹp của toán học đến gần với mọi độc giả.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/tap-chi-pi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl bg-cerulean hover:bg-blue-800 text-white font-newsreader font-bold text-base shadow-sm hover:shadow transition cursor-pointer inline-flex items-center gap-2 group"
                >
                  <span>Tìm Hiểu Thêm Về Tạp Chí Pi</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER - Jasper Red Anchor Section */}
      <section className="py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-jasper text-white p-8 sm:p-14 text-center shadow-xl border-2 border-red-900/60 dark:border-rose-800 overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-red-900/60 text-red-100 border border-red-300/30 text-xs font-bold uppercase tracking-widest font-newsreader shadow-2xs">
              Bắt Đầu Hành Trình Ngay Hôm Nay
            </span>

            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Sẵn Sàng Thử Thách Tư Duy Cùng Tạp Chí Pi?
            </h2>

            <p className="text-base sm:text-lg text-red-100 font-newsreader leading-relaxed">
              Gia nhập cùng hàng ngàn bạn đọc yêu toán trên khắp mọi miền đất nước. Khám phá kho đề thi, viết lời giải bằng công thức KaTeX và rèn luyện tư duy học thuật ngay bây giờ.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {isRealUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/kho-de')}
                    className="px-8 py-3.5 rounded-xl bg-white text-jasper hover:bg-paper font-newsreader font-bold text-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    Vào Kho Đề Bài
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/lich-su-so-pi')}
                    className="px-7 py-3.5 rounded-xl bg-cerulean hover:bg-blue-800 text-white border border-blue-400/30 font-newsreader font-bold text-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    Lịch Sử Số $\pi$
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/dang-nhap')}
                    className="px-8 py-3.5 rounded-xl bg-white text-jasper hover:bg-paper font-newsreader font-bold text-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    Đăng Nhập Tài Khoản
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/tap-chi-pi')}
                    className="px-7 py-3.5 rounded-xl bg-cerulean hover:bg-blue-800 text-white border border-blue-400/30 font-newsreader font-bold text-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    Về Tạp Chí Pi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
