import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function FeaturesPage({ onOpenLatexModal }) {
  const navigate = useNavigate();
  const { isRealUser } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const features = [
    {
      id: 1,
      title: 'Kho Đề Phân Cấp & Lọc Đa Chiều',
      tag: 'Cấu Trúc Dữ Liệu',
      color: 'border-cerulean',
      badgeClass: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      desc: 'Hệ thống số hóa toàn diện hàng trăm bài toán từ các kỳ Tạp chí Pi. Dễ dàng lọc theo từng kỳ phát hành, chuyên mục nghiên cứu, thang đo độ khó từ 1 đến 5 sao và tác giả gửi đề.',
      highlights: ['Lọc tức thì không tải lại trang', 'URL thân thiện theo chuẩn SEO', 'Hỗ trợ tìm kiếm từ khóa đề bài'],
    },
    {
      id: 2,
      title: 'Soạn Thảo KaTeX & TikZ Trực Tiếp',
      tag: 'Biên Soạn Học Thuật',
      color: 'border-jasper',
      badgeClass: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      desc: 'Không gian giải đề được thiết kế chuẩn mực với thanh công cụ chèn ký hiệu toán học nhanh và khung xem trước công thức KaTeX theo thời gian thực mà không che khuất đề bài gốc.',
      highlights: ['Xem trước song song với đề bài', 'Thanh công cụ ký hiệu 1-chạm', 'Khung vẽ hình học vector TikZ SVG'],
    },
    {
      id: 3,
      title: 'Lời Giải Chuẩn & Bình Luận Tòa Soạn',
      tag: 'Sư Phạm Chuẩn Mực',
      color: 'border-cerulean',
      badgeClass: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      desc: 'Mỗi bài toán sau kỳ hạn đều đi kèm lời giải chính thức và bình luận chuyên sâu từ Ban Biên Tập Tạp chí Pi, mở rộng phương pháp tư duy và các bài toán tương tự.',
      highlights: ['Góc nhìn sư phạm sâu sắc', 'Phân tích các hướng giải sai thường gặp', 'Gợi ý mở rộng bài toán'],
    },
    {
      id: 4,
      title: 'Chuỗi Ngày Rèn Luyện & Tiến Độ',
      tag: 'Động Lực Học Tập',
      color: 'border-jasper',
      badgeClass: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      desc: 'Cơ chế duy trì chuỗi học tập (Streak) khuyến khích bạn đọc rèn luyện tư duy toán học mỗi ngày, lưu trữ toàn bộ lịch sử nộp bài và các bài toán yêu thích.',
      highlights: ['Đếm chuỗi ngày liên tục', 'Thống kê tổng số bài đã giải', 'Kho bài toán đã đánh dấu lưu trữ'],
    },
    {
      id: 5,
      title: 'Xuất Tuyển Tập Đa Định Dạng',
      tag: 'Tài Liệu Học Tập',
      color: 'border-cerulean',
      badgeClass: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      desc: 'Kết xuất tức thì đề bài và bài giải cá nhân ra PDF in ấn chuẩn giáo khoa, mã nguồn LaTeX (.tex), tài liệu Microsoft Word (.docx) hoặc Markdown (.md).',
      highlights: ['Xuất mã nguồn LaTeX .tex', 'Xuất bản PDF chất lượng in ấn', 'Xuất file Word docx có công thức'],
    },
    {
      id: 6,
      title: 'Sổ Tay 60+ Cú Pháp Toán LaTeX',
      tag: 'Công Cụ Tra Cứu',
      color: 'border-jasper',
      badgeClass: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      desc: 'Bảng tra cứu toàn diện các ký hiệu Đại số, Giải tích, Hình học, Ma trận, Tổ hợp với nút sao chép và chèn trực tiếp vào khung soạn thảo chỉ với 1 cú nhấp chuột.',
      highlights: ['Phân loại theo chuyên đề', 'Sao chép cú pháp 1-chạm', 'Tích hợp sẵn trên mọi trang'],
    },
  ];

  return (
    <div className="min-h-screen py-8 md:py-14 font-newsreader text-ink dark:text-slate-100 transition-colors">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-14 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-jasper dark:bg-rose-400 animate-pulse"></span>
          <span className="text-cerulean dark:text-blue-400 font-bold">Công Nghệ &amp; Học Thuật</span>
          <span className="text-gray-400">•</span>
          <span className="text-jasper dark:text-rose-400 font-bold">Pimaga Platform</span>
        </div>

        <h1 className="font-playfair text-3xl sm:text-5xl font-black text-ink dark:text-slate-100 tracking-tight leading-tight">
          Tính Năng <span className="text-cerulean dark:text-blue-400 italic">Đột Phá</span> &amp; <span className="text-jasper dark:text-rose-400 italic">Học Thuật</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Được thiết kế chuyên biệt để mang lại trải nghiệm đọc đề, viết lời giải toán học bằng công thức KaTeX mượt mà và trực quan nhất.
        </p>
      </div>

      {/* 6 Features Grid */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((f) => (
          <div
            key={f.id}
            className={`p-7 rounded-2xl bg-white dark:bg-nightCard border-2 ${f.color} shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-newsreader ${f.badgeClass}`}>
                  {f.tag}
                </span>
                <span className="font-mono text-xs text-gray-400 dark:text-slate-500 font-bold">
                  Tính năng 0{f.id}
                </span>
              </div>

              <h3 className="font-playfair font-bold text-xl sm:text-2xl text-ink dark:text-slate-100 mb-3">
                {f.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed mb-5 font-newsreader">
                {f.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
              {f.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-newsreader">
                  <svg className="w-4 h-4 text-cerulean dark:text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LaTeX cheatsheet callout */}
      <div className="max-w-4xl mx-auto mb-16 px-4">
        <div className="p-7 sm:p-9 rounded-2xl bg-paperDark/70 dark:bg-nightCard/70 border-2 border-cerulean/30 dark:border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-jasper dark:text-rose-400 font-newsreader">
              Công Cụ Hỗ Trợ Độc Quyền
            </span>
            <h3 className="font-playfair text-2xl font-bold text-ink dark:text-slate-100">
              Sổ Tay Cú Pháp Toán TeX Tích Hợp
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 max-w-xl font-newsreader leading-relaxed">
              Bạn chưa quen với cú pháp viết phân số, căn thức, tích phân hay ma trận trong LaTeX? Hãy mở ngay sổ tay để tra cứu nhanh hơn 60 công thức mẫu.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenLatexModal}
            className="px-5 py-3 rounded-xl bg-cerulean hover:bg-blue-800 text-white font-newsreader font-bold text-base shadow-sm hover:shadow transition shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span className="font-serif font-bold text-sm bg-blue-900/60 px-2 py-0.5 rounded text-blue-100 tracking-tighter">
              TeX
            </span>
            <span>Mở Sổ Tay LaTeX</span>
          </button>
        </div>
      </div>

      {/* CTA Box - Jasper Red Master */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="p-8 rounded-2xl bg-jasper text-white text-center shadow-xl border-2 border-red-900/60 dark:border-rose-800">
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold mb-3">
            Sẵn Sàng Trải Nghiệm Nền Tảng Giải Đề?
          </h3>
          <p className="text-red-100 font-newsreader max-w-xl mx-auto mb-6 text-base sm:text-lg leading-relaxed">
            {isRealUser
              ? 'Tài khoản của bạn đã sẵn sàng. Truy cập ngay kho đề để giải toán và lưu trữ bài làm.'
              : 'Đăng nhập tài khoản Google để bắt đầu truy cập kho đề và lưu trữ bài giải của riêng bạn.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            {isRealUser ? (
              <button
                type="button"
                onClick={() => navigate('/kho-de')}
                className="px-6 py-3 rounded-xl bg-white text-jasper hover:bg-paper font-newsreader font-bold text-base shadow-md transition cursor-pointer"
              >
                Vào Kho Đề Bài →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/dang-nhap')}
                className="px-6 py-3 rounded-xl bg-white text-jasper hover:bg-paper font-newsreader font-bold text-base shadow-md transition cursor-pointer"
              >
                Đăng Nhập Tài Khoản
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/lich-su-so-pi')}
              className="px-6 py-3 rounded-xl bg-cerulean hover:bg-blue-800 text-white border border-blue-400/30 font-newsreader font-bold text-base shadow-md transition cursor-pointer"
            >
              Lịch Sử Số $\pi$
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
