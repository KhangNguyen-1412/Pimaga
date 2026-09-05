import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MathRenderer from '../common/MathRenderer';

export default function TapChiPiPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 1. Interactive Columns Explorer State
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);

  const columnsData = [
    {
      id: 'cung-ban-giai-toan',
      title: 'Cùng Bạn Giải Toán',
      tag: 'Tương Tác & Phổ Thông',
      color: 'border-cerulean',
      themeText: 'text-cerulean dark:text-blue-400',
      badgeBg: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      desc: 'Diễn đàn sôi nổi nhất của Tạp chí Pi dành cho bạn đọc học sinh, sinh viên và giáo viên cùng tranh luận, gửi các phương pháp giải mới mẻ, tự nhiên và độc đáo.',
      difficulty: 2,
      featuredProblem: {
        code: 'P101',
        title: 'Bất đẳng thức phân thức đối xứng',
        author: 'Nguyễn Văn Minh (Hà Nội)',
        content: `Cho $a, b, c > 0$ thỏa mãn $a + b + c = 3$. Chứng minh rằng:
$$\\frac{a}{1+b^2} + \\frac{b}{1+c^2} + \\frac{c}{1+a^2} \\ge \\frac{3}{2}$$`,
        editorialInsight: 'Kỹ thuật Cauchy ngược dấu kinh điển: biến đổi $\\frac{a}{1+b^2} = a - \\frac{ab^2}{1+b^2} \\ge a - \\frac{ab}{2}$. Phương pháp này mở ra cách tư duy tự nhiên mà không cần bất đẳng thức phức tạp.',
      },
    },
    {
      id: 'thach-thuc-toan-hoc',
      title: 'Thách Thức Toán Học',
      tag: 'Olympic & Chuyên Sâu',
      color: 'border-jasper',
      themeText: 'text-jasper dark:text-rose-400',
      badgeBg: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      desc: 'Tập hợp các bài toán Olympic đỉnh cao do các chuyên gia đầu ngành, giảng viên đại học và cựu thí sinh IMO đề xuất, đòi hỏi tư duy logic trừu tượng và kỹ thuật lập luận sắc bén.',
      difficulty: 5,
      featuredProblem: {
        code: 'P104',
        title: 'Bất đẳng thức Nesbitt mở rộng đa biến',
        author: 'Ban Biên Tập Pi',
        content: `Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:
$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}$$`,
        editorialInsight: 'Bằng phép đổi biến $x = 1/a, y = 1/b, z = 1/c$, bài toán quy về bất đẳng thức Cauchy-Schwarz dạng Engel: $\\sum \\frac{x^2}{y+z} \\ge \\frac{(x+y+z)^2}{2(x+y+z)} = \\frac{x+y+z}{2} \\ge \\frac{3}{2}$.',
      },
    },
    {
      id: 'toan-hoc-doi-song',
      title: 'Toán Học & Đời Sống',
      tag: 'Ứng Dụng Thực Tiễn',
      color: 'border-cerulean',
      themeText: 'text-cerulean dark:text-blue-400',
      badgeBg: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      desc: 'Cầu nối giữa toán học trừu tượng với các công nghệ đương đại: Trí tuệ nhân tạo (Machine Learning), Mật mã học Blockchain, Kinh tế lượng và Khí tượng học.',
      difficulty: 3,
      featuredProblem: {
        code: 'DS02',
        title: 'Thuật toán PageRank của Google & Ma trận ngẫu nhiên',
        author: 'TS. Lê Anh Tuấn (ĐHQG Hà Nội)',
        content: `Mô hình hóa mạng Internet thành một đồ thị có hướng với ma trận xác suất chuyển trạng thái $M$. Giá trị xếp hạng của trang web tương ứng với vector riêng ứng với giá trị riêng $\\lambda = 1$:
$$M \\cdot \\vec{r} = \\vec{r}$$`,
        editorialInsight: 'Định lý Perron-Frobenius đảm bảo tồn tại duy nhất một vector xác suất dừng, giải thích cơ sở toán học đứng sau cỗ máy tìm kiếm lớn nhất thế giới.',
      },
    },
    {
      id: 'quan-toan-thu-gian',
      title: 'Quán Toán & Góc Thư Giãn',
      tag: 'Nghịch Lý & Đố Vui',
      color: 'border-jasper',
      themeText: 'text-jasper dark:text-rose-400',
      badgeBg: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      desc: 'Những nghịch lý toán học dí dỏm, bài toán cờ vua, trò chơi logic và các giai thoại lịch sử giúp bạn đọc rèn luyện tư duy phản biện trong sự thư thái và niềm vui thích.',
      difficulty: 2,
      featuredProblem: {
        code: 'QT01',
        title: 'Nghịch lý ngày sinh (Birthday Paradox)',
        author: 'Quán Toán Pi',
        content: `Cần tối thiểu bao nhiêu người trong một căn phòng để xác suất có ít nhất hai người trùng ngày sinh lớn hơn $50\\%$?
$$P(n) = 1 - \\prod_{k=0}^{n-1} \\frac{365-k}{365} > 0.5$$`,
        editorialInsight: 'Con số bất ngờ chỉ là 23 người! Trực giác thông thường của chúng ta thường so sánh ngày sinh của một người với các cá nhân khác, thay vì đếm tổng số cặp ghép đôi $\\binom{23}{2} = 253$ cặp.',
      },
    },
  ];

  const currentColumn = columnsData[activeColumnIndex];

  // 2. Founders & Quotes
  const founders = [
    {
      name: 'GS. TSKH. Hà Huy Khoái',
      role: 'Chủ biên học thuật • Nguyên Viện trưởng Viện Toán học',
      quote: 'Toán học không phải là một môn học khô khan chỉ dành cho các kỳ thi. Toán học là nghệ thuật của tư duy, là ngôn ngữ của tự nhiên mà bất kỳ ai cũng có thể tìm thấy niềm vui khi chạm vào.',
      bio: 'Nhà toán học đầu ngành về Giải tích p-adic, người dành trọn cuộc đời cho phong trào phổ biến toán học và nâng tầm giáo dục phổ thông Việt Nam.',
      accentColor: 'border-cerulean',
      badgeClass: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      name: 'GS. Ngô Bảo Châu',
      role: 'Đồng sáng lập & Cố vấn • Huy chương Fields 2010',
      quote: 'Một tạp chí toán học tốt là nơi khơi gợi được sự tò mò thuần khiết của tuổi trẻ. Khi các em say mê đi tìm vẻ đẹp của những lập luận chặt chẽ, các em đang chuẩn bị cho mình hành trang tư duy độc lập quý báu nhất.',
      bio: 'Nhà toán học giải quyết Bổ đề cơ bản trong Chương trình Langlands, Giám đốc Khoa học Viện Nghiên cứu Cao cấp về Toán (VIASM).',
      accentColor: 'border-jasper',
      badgeClass: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
    },
    {
      name: 'GS. TSKH. Trần Văn Nhung',
      role: 'Đồng sáng lập • Tổng Thư ký Hội Toán học Việt Nam',
      quote: 'Chúng tôi mong muốn Tạp chí Pi là nhịp cầu nối các thế hệ: từ các giáo sư đầu ngành đến các em học sinh ở mọi vùng miền đất nước, cùng chung một tình yêu toán học.',
      bio: 'Nguyên Thứ trưởng Bộ GD&ĐT, nhà khoa học tiên phong thúc đẩy đổi mới phương pháp giảng dạy và kết nối Tạp chí Pi với các trường phổ thông.',
      accentColor: 'border-cerulean',
      badgeClass: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
    },
  ];

  // 3. 4-Step Editorial Lifecycle
  const editorialSteps = [
    {
      step: '01',
      title: 'Đề Xuất & Sáng Tác',
      desc: 'Các thầy cô giáo, nhà nghiên cứu và bạn đọc yêu toán trên toàn quốc gửi đề bài toán mới cùng lời giải gợi ý về Tòa soạn.',
      color: 'border-cerulean',
      badgeColor: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      step: '02',
      title: 'Thẩm Định & Sư Phạm Hóa',
      desc: 'Hội đồng chuyên môn phản biện, chuẩn hóa cú pháp KaTeX, chỉnh sửa cấu trúc sư phạm và chuẩn bị các bình luận mở rộng.',
      color: 'border-jasper',
      badgeColor: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
    },
    {
      step: '03',
      title: 'Tranh Tài & Thảo Luận',
      desc: 'Bài toán được xuất bản trên Tạp chí Pi và nền tảng Pimaga. Hàng ngàn bạn đọc cùng thi tài gửi lời giải cá nhân độc đáo.',
      color: 'border-cerulean',
      badgeColor: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      step: '04',
      title: 'Vinh Danh & Khai Phóng',
      desc: 'Những bài giải sáng tạo, ngắn gọn và xuất sắc nhất được vinh danh trên số báo kế tiếp cùng bình luận chuyên sâu từ Tòa soạn.',
      color: 'border-jasper',
      badgeColor: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
    },
  ];

  // 4. Featured Magazine Editions
  const featuredEditions = [
    {
      issue: 'Số 01 / 2017',
      label: 'Ấn Phẩm Ra Mắt Lịch Sử',
      color: 'border-cerulean',
      tagColor: 'text-cerulean bg-blue-50 dark:bg-blue-950/60',
      headline: 'Khởi nguồn diễn đàn Toán học & Tuổi trẻ Việt Nam',
      desc: 'Số báo đầu tiên đánh dấu sự ra đời của Tạp chí Pi với bài xã luận khai phóng của GS. Hà Huy Khoái và GS. Ngô Bảo Châu.',
    },
    {
      issue: 'Số 03 / 2024',
      label: 'Kỷ Niệm Ngày Số Pi (14/3)',
      color: 'border-jasper',
      tagColor: 'text-jasper bg-red-50 dark:bg-rose-950/60',
      headline: 'Trường ca hằng số bất hủ của vũ trụ',
      desc: 'Chuyên đề đặc biệt về 4.000 năm phát triển của số Pi, các thuật toán tính toán phân số mật suất và bí ẩn hằng số hình học.',
    },
    {
      issue: 'Số 07 / 2024',
      label: 'Mùa Hè Olympic Toán Quốc Tế',
      color: 'border-cerulean',
      tagColor: 'text-cerulean bg-blue-50 dark:bg-blue-950/60',
      headline: 'Tuyển tập các bài toán IMO tuyển chọn',
      desc: 'Phân tích đa chiều các bài toán hình học xạ ảnh, tổ hợp đa thức và lý thuyết số từ đấu trường Olympic quốc tế.',
    },
  ];

  return (
    <div className="min-h-screen py-8 md:py-14 font-newsreader text-ink dark:text-slate-100 transition-colors">
      {/* 1. Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-14 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-jasper dark:bg-rose-400 animate-pulse"></span>
          <span className="text-cerulean dark:text-blue-400 font-bold">Hội Toán Học Việt Nam</span>
          <span className="text-gray-400">•</span>
          <span className="text-jasper dark:text-rose-400 font-bold">Thành lập năm 2017</span>
        </div>

        <h1 className="font-playfair text-3xl sm:text-5xl font-black text-ink dark:text-slate-100 tracking-tight leading-tight">
          Về <span className="text-cerulean dark:text-blue-400 italic">Tạp Chí </span>
          <span className="text-jasper dark:text-rose-400 italic">Pi</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Ấn phẩm định kỳ chính thức của Hội Toán Học Việt Nam, ra đời với sứ mệnh kết nối tri thức, ươm mầm tài năng trẻ và lan tỏa vẻ đẹp thuần khiết của toán học đến mọi tầng lớp độc giả.
        </p>
      </div>

      {/* 2. Emblem & Core Mission Statement */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="p-7 sm:p-10 rounded-3xl bg-white dark:bg-nightCard border-2 border-jasper/30 dark:border-rose-800/80 shadow-lg text-left flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 shrink-0 rounded-full bg-paper dark:bg-nightInput border-2 border-cerulean p-3.5 shadow-md ring-2 ring-jasper/30 flex items-center justify-center">
            <img
              src="/assets/pimaga-logo.svg"
              alt="Tạp Chí Pi"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-jasper dark:text-rose-400 font-newsreader">
              Tôn Chỉ &amp; Sứ Mạng Học Thuật
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-ink dark:text-slate-100">
              Ươm Mầm <span className="text-jasper dark:text-rose-400">Trí Tuệ</span> — Khơi Nguồn{' '}
              <span className="text-cerulean dark:text-blue-400">Đam Mê</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-slate-300 leading-relaxed font-newsreader">
              Tạp chí Pi không chỉ là nơi quy tụ các bài toán Olympic đỉnh cao, mà trên hết là một diễn đàn học thuật cởi mở, nơi mọi câu hỏi về bản chất tư duy logic, vẻ đẹp của các cấu trúc trừu tượng và ứng dụng thực tiễn của khoa học đều được nâng niu và giải đáp chuẩn mực.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Columns Explorer (Khám Phá 4 Chuyên Mục Độc Quyền) */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-cerulean dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-cerulean/30 shadow-2xs">
            Cấu Trúc Tinh Hoa Của Tạp Chí
          </span>
          <h2 className="font-playfair text-2xl sm:text-4xl font-black text-ink dark:text-slate-100 mt-2">
            Khám Phá 4 Chuyên Mục Độc Quyền
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 max-w-xl mx-auto mt-2 font-newsreader">
            Nhấn chọn từng chuyên mục để xem định hướng bài viết và trích đoạn bài toán thực tế kèm công thức KaTeX.
          </p>

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-6">
            {columnsData.map((col, idx) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveColumnIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-newsreader font-bold transition cursor-pointer ${
                  activeColumnIndex === idx
                    ? idx % 2 === 0
                      ? 'bg-cerulean text-white shadow-sm'
                      : 'bg-jasper text-white shadow-sm'
                    : 'bg-white dark:bg-nightCard border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-400'
                }`}
              >
                {col.title}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Column Live Detail Card */}
        <div className={`p-6 sm:p-9 rounded-3xl bg-white dark:bg-nightCard border-2 ${currentColumn.color} shadow-lg text-left transition-all animate-dropdownFade`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4 mb-5">
            <div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-newsreader ${currentColumn.badgeBg}`}>
                {currentColumn.tag}
              </span>
              <h3 className="font-playfair font-bold text-2xl sm:text-3xl text-ink dark:text-slate-100 mt-2">
                {currentColumn.title}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold font-mono">
              <span>Độ khó:</span>
              <span>{'★'.repeat(currentColumn.difficulty)}</span>
            </div>
          </div>

          <p className="text-base text-gray-700 dark:text-slate-300 leading-relaxed font-newsreader mb-6">
            {currentColumn.desc}
          </p>

          {/* Sample Problem Box */}
          <div className="p-5 rounded-2xl bg-paper dark:bg-nightInput border border-gray-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-newsreader">
              <span className="font-bold text-cerulean dark:text-blue-400">
                Bài toán tiêu biểu: {currentColumn.featuredProblem.code} — {currentColumn.featuredProblem.title}
              </span>
              <span className="text-gray-500 dark:text-slate-400 italic">
                Tác giả: {currentColumn.featuredProblem.author}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-nightCard rounded-xl border border-gray-200 dark:border-slate-800 font-newsreader text-base text-gray-800 dark:text-slate-200">
              <MathRenderer content={currentColumn.featuredProblem.content} />
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-cerulean/20 text-xs sm:text-sm font-newsreader text-gray-800 dark:text-slate-200">
              <span className="font-bold text-cerulean dark:text-blue-300">Nhận xét sư phạm từ Tòa soạn: </span>
              <div className="mt-1">
                <MathRenderer content={currentColumn.featuredProblem.editorialInsight} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Voices of the Founders (Hội Đồng Sáng Lập) */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/40 px-3.5 py-1.5 rounded-full border border-jasper/30 shadow-2xs">
            Hội Đồng Sáng Lập
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-black text-ink dark:text-slate-100 mt-2">
            Những Trụ Cột Đặt Nền Móng Cho Tạp Chí Pi
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 max-w-xl mx-auto mt-2 font-newsreader">
            Tâm huyết và triết lý giáo dục của những nhà toán học hàng đầu Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {founders.map((person, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-7 rounded-2xl bg-white dark:bg-nightCard border-2 ${person.accentColor} shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left`}
            >
              <div className="space-y-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-newsreader inline-block ${person.badgeClass}`}>
                  Nhà sáng lập
                </span>

                <h3 className="font-playfair font-bold text-xl text-ink dark:text-slate-100">
                  {person.name}
                </h3>

                <div className="text-xs font-bold text-gray-500 dark:text-slate-400 font-newsreader leading-relaxed">
                  {person.role}
                </div>

                {/* Quote Box */}
                <blockquote className="p-3.5 rounded-xl bg-paper dark:bg-nightInput border-l-4 border-l-cerulean italic text-sm text-gray-700 dark:text-slate-300 font-newsreader leading-relaxed">
                  "{person.quote}"
                </blockquote>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400 font-newsreader leading-relaxed">
                {person.bio}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 4-Step Editorial Lifecycle (Vòng Đời Một Bài Toán) */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cerulean dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-cerulean/30 shadow-2xs">
            Quy Trình Chuẩn Mực
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-black text-ink dark:text-slate-100 mt-2">
            Vòng Đời Của Một Bài Toán Trên Tạp Chí Pi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {editorialSteps.map((s, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-white dark:bg-nightCard border-2 ${s.color} shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold font-newsreader ${s.badgeColor}`}>
                    Bước {s.step}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-400">0{idx + 1}/04</span>
                </div>
                <h4 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
                  {s.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 font-newsreader leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Featured Magazine Editions Showcase */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/40 px-3.5 py-1.5 rounded-full border border-jasper/30 shadow-2xs">
            Kho Tàng Tri Thức
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-black text-ink dark:text-slate-100 mt-2">
            Những Số Báo Tiêu Biểu Được Số Hóa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {featuredEditions.map((ed, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-white dark:bg-nightCard border-2 ${ed.color} shadow-sm flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-newsreader ${ed.tagColor} inline-block`}>
                  {ed.label}
                </span>
                <div className="font-mono text-xs font-bold text-gray-500 dark:text-slate-400">
                  {ed.issue}
                </div>
                <h4 className="font-playfair font-bold text-lg text-ink dark:text-slate-100">
                  {ed.headline}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 font-newsreader leading-relaxed">
                  {ed.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => navigate('/kho-de')}
                  className="w-full py-2 rounded-xl bg-paper dark:bg-nightInput hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-newsreader font-bold text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 transition cursor-pointer text-center"
                >
                  Xem bài toán số này trong Kho Đề →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Digital Platform Info: Pimaga */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="p-8 rounded-3xl bg-paperDark/70 dark:bg-nightCard/70 border-2 border-cerulean/30 dark:border-blue-800 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-cerulean dark:text-blue-400 font-newsreader">
            Dự Án Số Hóa Pimaga
          </span>
          <h3 className="font-playfair text-2xl sm:text-3xl font-black text-ink dark:text-slate-100 mt-1 mb-3">
            Đưa Tạp Chí Pi Lên Không Gian Trực Tuyến Đương Đại
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader mb-4">
            Nhằm giúp bạn đọc cả nước dễ dàng tra cứu, thảo luận và nộp bài giải trực tiếp, nền tảng <strong>Pimaga</strong> ra đời tích hợp công nghệ hiển thị công thức KaTeX sắc nét, hỗ trợ vẽ hình học trực tiếp và kết xuất bài giải ra PDF, LaTeX chuẩn in ấn.
          </p>
        </div>
      </div>

      {/* 8. CTA Box - Jasper Red Master */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-jasper text-white text-center shadow-xl border-2 border-red-900/60 dark:border-rose-800">
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold mb-3">
            Bắt Đầu Trải Nghiệm Các Tính Năng Của Nền Tảng
          </h3>
          <p className="text-red-100 font-newsreader max-w-xl mx-auto mb-6 text-base sm:text-lg leading-relaxed">
            Khám phá các công cụ hỗ trợ người yêu toán: bộ lọc đa chiều, sổ tay công thức KaTeX và không gian giải toán chuyên nghiệp.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/tinh-nang')}
              className="px-6 py-3 rounded-xl bg-white text-jasper hover:bg-paper font-newsreader font-bold text-base shadow-md transition cursor-pointer"
            >
              Khám Phá Tính Năng →
            </button>
            <button
              type="button"
              onClick={() => navigate('/lich-su-so-pi')}
              className="px-6 py-3 rounded-xl bg-cerulean hover:bg-blue-800 text-white border border-blue-400/30 font-newsreader font-bold text-base shadow-md transition cursor-pointer"
            >
              Đọc Lịch Sử Số π
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
