import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MathRenderer from '../common/MathRenderer';
import { PI_DECIMALS } from '../../utils/piDigits';
import { useToast } from '../../context/ToastContext';

export default function PiHistoryPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 1. Archimedes Interactive Polygon State
  const [polygonSides, setPolygonSides] = useState(12);

  const archimedesCalculations = useMemo(() => {
    const N = polygonSides;
    const lower = N * Math.sin(Math.PI / N);
    const upper = N * Math.tan(Math.PI / N);

    let historicalFraction = '';
    if (N === 6) historicalFraction = '3.0000 < \\pi < 3.4641';
    else if (N === 12) historicalFraction = '3.1058 < \\pi < 3.2154';
    else if (N === 24) historicalFraction = '3.1326 < \\pi < 3.1597';
    else if (N === 48) historicalFraction = '3.1394 < \\pi < 3.1461';
    else if (N === 96) historicalFraction = '\\frac{223}{71} < \\pi < \\frac{22}{7} \\iff 3.14085 < \\pi < 3.14286';

    return {
      lower: lower.toFixed(5),
      upper: upper.toFixed(5),
      historicalFraction,
    };
  }, [polygonSides]);

  // Generate SVG polygon points for regular N-gon
  const polygonSvgPoints = useMemo(() => {
    const N = polygonSides;
    const cx = 130;
    const cy = 130;
    const R = 85;

    // Inscribed N-gon vertices
    const inscribedPoints = [];
    for (let i = 0; i < N; i++) {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      inscribedPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    // Circumscribed N-gon vertices (radius = R / cos(pi/N))
    const Rout = R / Math.cos(Math.PI / N);
    const circumscribedPoints = [];
    for (let i = 0; i < N; i++) {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      const x = cx + Rout * Math.cos(angle);
      const y = cy + Rout * Math.sin(angle);
      circumscribedPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return {
      cx,
      cy,
      R,
      inscribed: inscribedPoints.join(' '),
      circumscribed: circumscribedPoints.join(' '),
    };
  }, [polygonSides]);

  // 2. Birthday / Digit Finder in Pi
  const [birthdayQuery, setBirthdayQuery] = useState('1403');
  const [searchFeedback, setSearchFeedback] = useState(null);

  useEffect(() => {
    const clean = birthdayQuery.replace(/\D/g, '').slice(0, 6);
    if (!clean) {
      setSearchFeedback(null);
      return;
    }

    const pos = PI_DECIMALS.indexOf(clean);
    if (pos !== -1) {
      const index = pos + 1; // 1-indexed decimal place
      const start = Math.max(0, pos - 8);
      const end = Math.min(PI_DECIMALS.length, pos + clean.length + 8);
      const before = PI_DECIMALS.slice(start, pos);
      const match = PI_DECIMALS.slice(pos, pos + clean.length);
      const after = PI_DECIMALS.slice(pos + clean.length, end);

      setSearchFeedback({
        found: true,
        index,
        before,
        match,
        after,
        clean,
      });
    } else {
      setSearchFeedback({
        found: false,
        clean,
      });
    }
  }, [birthdayQuery]);

  // 3. Chronological Milestones
  const [activeMilestoneId, setActiveMilestoneId] = useState(null); // Unselected by default

  const timelineMilestones = [
    {
      id: 1,
      eraId: 'ancient',
      yearBadge: '~1900 TCN',
      shortYear: '1900 TCN',
      displayYear: '~1900 TCN',
      period: 'Lưỡng Hà & Sông Nile',
      eraName: 'Hình Học Thực Nghiệm',
      figures: 'Babylon & Cuộn Giấy Cói Rhind',
      shortFigure: 'Babylon / Rhind',
      methodType: 'Ước lượng thực nghiệm',
      precisionPill: '1 chữ số đúng (Sai số ~0.6%)',
      benchmarkValue: '3.125 & 3.1605',
      accentColor: 'border-cerulean',
      theme: 'cerulean',
      badgeBg: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      nodeColor: 'bg-cerulean text-white',
      summary: 'Những ước lượng hình học thực nghiệm đầu tiên về tỷ số giữa chu vi và đường kính.',
      details:
        'Trên các phiến đất sét Babylon, tỷ số này được ước lượng là $25/8 = 3.125$. Cuộn giấy cói Rhind (Ai Cập cổ đại, 1650 TCN) do thư lại Ahmes ghi chép đề xuất xấp xỉ diện tích hình tròn bằng $(16/9)^2 \\approx 3.1605$.',
      formula: '$$\\pi \\approx \\left(\\frac{16}{9}\\right)^2 = \\frac{256}{81} \\approx 3.16049...$$',
      curiosity:
        'Cuộn giấy cói Rhind cổ dài hơn 5 mét hiện được lưu giữ trang trọng tại Bảo tàng Anh (British Museum), ghi dấu bài toán tính diện tích hình tròn sớm nhất của nền văn minh nhân loại.',
    },
    {
      id: 2,
      eraId: 'ancient',
      yearBadge: '~250 TCN',
      shortYear: '250 TCN',
      displayYear: '~250 TCN',
      period: 'Hy Lạp Cổ Đại',
      eraName: 'Đa Giác Vét Cạn',
      figures: 'Archimedes xứ Syracuse',
      shortFigure: 'Archimedes',
      methodType: 'Đa giác vét cạn hình học',
      precisionPill: '3 chữ số (Sai số 0.02%)',
      benchmarkValue: '3.1418 (Phân số 22/7)',
      accentColor: 'border-jasper',
      theme: 'jasper',
      badgeBg: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      nodeColor: 'bg-jasper text-white',
      summary: 'Phát minh phương pháp đa giác vét cạn hình học chặt chẽ đầu tiên trong lịch sử.',
      details:
        'Archimedes kẹp số $\\pi$ giữa hai đa giác đều 96 cạnh nội tiếp và ngoại tiếp, chứng minh bằng toán học thuần túy rằng $\\pi$ nằm giữa hai phân số $223/71$ và $22/7$. Phân số $22/7$ đã trở thành chuẩn mực tính toán suốt 2.000 năm.',
      formula: '$$\\frac{223}{71} < \\pi < \\frac{22}{7} \\quad \\iff \\quad 3.14085 < \\pi < 3.14286$$',
      curiosity:
        'Tư duy kẹp giới hạn bằng đa giác 96 cạnh của Archimedes chính là viên gạch đặt nền móng sơ khai cho phép tính Vi tích phân phát triển rực rỡ gần 2 thiên niên kỷ sau đó.',
    },
    {
      id: 3,
      eraId: 'orient',
      yearBadge: 'Năm 263 – 480 SCN',
      shortYear: '480 SCN',
      displayYear: '480 SCN',
      period: 'Trung Hoa Cổ Đại',
      eraName: 'Cát Viên Thuật Đông Phương',
      figures: 'Lưu Huy & Tổ Xung Chi',
      shortFigure: 'Lưu Huy & Tổ Xung Chi',
      methodType: 'Cát viên thuật (Số học)',
      precisionPill: '7 chữ số (Kỷ lục 826 năm)',
      benchmarkValue: '3.1415926 (Mật suất 355/113)',
      accentColor: 'border-cerulean',
      theme: 'cerulean',
      badgeBg: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      nodeColor: 'bg-cerulean text-white',
      summary: 'Kỷ lục 7 chữ số thập phân và phân số mật suất 355/113 giữ vững suốt hơn 8 thế kỷ.',
      details:
        'Lưu Huy đề xuất "Cát viên thuật" với đa giác 3.072 cạnh. Sau đó, Tổ Xung Chi đã tính toán bằng que tính tre trên đa giác 24.576 cạnh để tìm ra $3.1415926 < \\pi < 3.1415927$ cùng phân số mật suất huyền thoại $\\frac{355}{113}$.',
      formula: '$$\\pi \\approx \\frac{355}{113} = 3.14159292... \\quad (\\text{Sai số } < 3 \\times 10^{-7})$$',
      curiosity:
        'Phân số 355/113 của Tổ Xung Chi chính xác đến mức nếu dùng nó để đo chu vi một vòng tròn có bán kính bằng cả Trái Đất, sai số thực tế chỉ chưa đầy vài mét!',
    },
    {
      id: 4,
      eraId: 'renaissance',
      yearBadge: 'Thế kỷ XIV – 1674 SCN',
      shortYear: '1674 SCN',
      displayYear: '1674 SCN',
      period: 'Khởi Đầu Kỷ Nguyên Giải Tích',
      eraName: 'Chuỗi Số Vô Hạn',
      figures: 'Madhava & Gottfried Leibniz',
      shortFigure: 'Leibniz',
      methodType: 'Chuỗi số vô hạn đan dấu',
      precisionPill: '11 chữ số (Giải tích)',
      benchmarkValue: 'Tổng chuỗi vô hạn',
      accentColor: 'border-jasper',
      theme: 'jasper',
      badgeBg: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      nodeColor: 'bg-jasper text-white',
      summary: 'Bước chuyển dịch mang tính thời đại: từ hình học sang chuỗi số vô hạn tuyệt mỹ.',
      details:
        'Madhava xứ Sangamagrama (Ấn Độ) và Gottfried Leibniz (Đức) độc lập khám phá ra rằng $\\pi$ có thể biểu diễn qua một chuỗi phân số đan dấu vô hạn, đưa nhân loại thoát ly khỏi sự phụ thuộc vào compa và thước kẻ.',
      formula: '$$\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\dots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{2n+1}$$',
      curiosity:
        'Chuỗi Leibniz tuy sở hữu vẻ đẹp đối xứng tuyệt hảo nhưng hội tụ rất chậm: để tính đúng 5 chữ số thập phân đầu tiên của $\\pi$, ta phải thực hiện phép cộng trừ tới 500.000 số hạng!',
    },
    {
      id: 5,
      eraId: 'renaissance',
      yearBadge: 'Năm 1706 – 1748 SCN',
      shortYear: '1748 SCN',
      displayYear: '1748 SCN',
      period: 'Kỷ Nguyên Khai Sáng',
      eraName: 'Chuẩn Hóa Ký Hiệu π Toàn Cầu',
      figures: 'William Jones & Leonhard Euler',
      shortFigure: 'Leonhard Euler',
      methodType: 'Giải tích phức & Bài toán Basel',
      precisionPill: '100+ chữ số & Định danh ký hiệu π',
      benchmarkValue: 'e^(iπ) + 1 = 0',
      accentColor: 'border-cerulean',
      theme: 'cerulean',
      badgeBg: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      nodeColor: 'bg-cerulean text-white',
      summary: 'Ký hiệu π chuẩn hóa toàn cầu và đẳng thức liên kết 5 hằng số vũ trụ.',
      details:
        'William Jones lần đầu dùng chữ cái Hy Lạp $\\pi$ vào năm 1706. Đến năm 1737, Leonhard Euler đưa ký hiệu này thành chuẩn mực học thuật quốc tế. Euler giải bài toán Basel $\\sum 1/n^2 = \\pi^2/6$ và công bố Đẳng thức Euler huyền thoại.',
      formula: '$$\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}, \\qquad e^{i\\pi} + 1 = 0$$',
      curiosity:
        'Đẳng thức Euler $e^{i\\pi} + 1 = 0$ được nhà vật lý đoạt giải Nobel Richard Feynman gọi là "công thức toán học vĩ đại nhất lịch sử" vì nó kết nối 5 hằng số cơ bản nhất của vũ trụ.',
    },
    {
      id: 6,
      eraId: 'modern',
      yearBadge: 'Năm 1761 & 1882 SCN',
      shortYear: '1882 SCN',
      displayYear: '1882 SCN',
      period: 'Bản Chất Số Học',
      eraName: 'Đại Số Trừu Tượng',
      figures: 'Johann Lambert & Ferdinand von Lindemann',
      shortFigure: 'Lindemann',
      methodType: 'Đại số trừu tượng',
      precisionPill: 'Chứng minh Vô Tỉ & Siêu Việt',
      benchmarkValue: 'π ∉ Q, π ∉ Q̄',
      accentColor: 'border-jasper',
      theme: 'jasper',
      badgeBg: 'bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300',
      nodeColor: 'bg-jasper text-white',
      summary: 'Chứng minh π là số vô tỉ và siêu việt, khép lại bài toán cổ đại 2.000 năm.',
      details:
        'Lambert chứng minh $\\pi$ là số vô tỉ (không thể viết dưới dạng phân số tối giản) năm 1761. Đến năm 1882, Lindemann chứng minh $\\pi$ là số siêu việt, chính thức khẳng định không thể "cầu phương hình tròn" bằng compa và thước kẻ.',
      formula: '$$\\pi \\notin \\mathbb{Q}, \\qquad \\pi \\notin \\overline{\\mathbb{Q}} \\quad (\\\\text{Transcendental})$$',
      curiosity:
        'Định lý Lindemann năm 1882 đã giải thoát hàng vạn học giả khỏi nỗ lực vô vọng suốt 22 thế kỷ tìm cách dựng hình vuông có diện tích bằng hình tròn chỉ bằng thước kẻ và compa.',
    },
    {
      id: 7,
      eraId: 'modern',
      yearBadge: 'Thế kỷ XX – Hiện Đại',
      shortYear: '2024 SCN',
      displayYear: '1914 – 2024 SCN',
      period: 'Kỷ Nguyên Siêu Điện Toán',
      eraName: 'Thuật Toán Siêu Tốc',
      figures: 'Srinivasa Ramanujan & Thuật toán Chudnovsky',
      shortFigure: 'Srinivasa Ramanujan',
      methodType: 'Chuỗi hội tụ siêu việt & Máy tính',
      precisionPill: '105+ nghìn tỷ chữ số (Kỷ lục 2024)',
      benchmarkValue: '105.000.000.000.000 số',
      accentColor: 'border-cerulean',
      theme: 'cerulean',
      badgeBg: 'bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300',
      nodeColor: 'bg-cerulean text-white',
      summary: 'Chuỗi hội tụ kỳ diệu của Ramanujan và bước nhảy vọt 105 nghìn tỷ chữ số.',
      details:
        'Năm 1914, Ramanujan công bố công thức chuỗi vô hạn kỳ diệu. Thuật toán Chudnovsky phát triển dựa trên nền tảng của Ramanujan sinh thêm 14 chữ số $\\pi$ sau mỗi số hạng. Năm 2024, siêu máy tính đã xác định chính xác hơn 105 nghìn tỷ chữ số.',
      formula: '$$\\frac{1}{\\pi} = \\frac{2\\sqrt{2}}{9801} \\sum_{k=0}^\\infty \\frac{(4k)!(1103 + 26390k)}{(k!)^4 396^{4k}}$$',
      curiosity:
        'Để in hết 105 nghìn tỷ chữ số của $\\pi$ ra giấy, tập tài liệu sẽ dày gấp hàng triệu lần khoảng cách từ Trái Đất tới Mặt Trăng! Dù vậy, NASA chỉ cần 15 chữ số để điều hướng tàu vũ trụ.',
    },
  ];

  const activeMilestone = useMemo(() => {
    if (!activeMilestoneId) return null;
    return timelineMilestones.find((m) => m.id === activeMilestoneId) || null;
  }, [activeMilestoneId, timelineMilestones]);

  const handleCopyFormula = async (formulaText, figureName) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formulaText);
      } else {
        const temp = document.createElement('textarea');
        temp.value = formulaText;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      showToast(`Đã sao chép công thức của ${figureName}!`, 'success');
    } catch (e) {
      showToast('Không thể sao chép: ' + e.message, 'error');
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-14 font-newsreader text-ink dark:text-slate-100 transition-colors">
      {/* 1. Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-14 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-jasper dark:bg-rose-400 animate-pulse"></span>
          <span className="text-cerulean dark:text-blue-400 font-bold">Hằng Số Toán Học Bất Hủ</span>
          <span className="text-gray-400">•</span>
          <span className="font-mono font-bold text-jasper dark:text-rose-400">π = 3.1415926535...</span>
        </div>

        <h1 className="font-playfair text-3xl sm:text-5xl font-black text-ink dark:text-slate-100 tracking-tight leading-tight">
          Lịch Sử Hình Thành Của <span className="text-cerulean dark:text-blue-400 italic">Hằng Số</span>{' '}
          <span className="text-jasper dark:text-rose-400 italic">π</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bản trường ca 4.000 năm của trí tuệ loài người: từ phương pháp đa giác vét cạn của Archimedes, kỷ lục 800 năm của Tổ Xung Chi, đến các chuỗi số vô hạn tuyệt mỹ của Euler và Ramanujan.
        </p>
      </div>

      {/* 2. Interactive Archimedes Polygon Approximation Widget */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="p-6 sm:p-9 rounded-3xl bg-white dark:bg-nightCard border-2 border-cerulean/50 dark:border-blue-700/70 shadow-lg text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-jasper dark:text-rose-400 font-newsreader">
                Mô Phỏng Hình Học Tương Tác • Hy Lạp 250 TCN
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-black text-ink dark:text-slate-100 mt-1">
                Phương Pháp Đa Giác Vét Cạn Archimedes
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-cerulean/30">
              Đa giác đều {polygonSides} cạnh
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* SVG Interactive Canvas */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-paper dark:bg-nightInput rounded-2xl border border-gray-200/80 dark:border-slate-800">
              <svg
                viewBox="0 0 260 260"
                className="w-56 h-56 sm:w-64 sm:h-64 transition-transform duration-300 select-none"
              >
                {/* Circumscribed Polygon (Jasper Red) */}
                <polygon
                  points={polygonSvgPoints.circumscribed}
                  fill="rgba(215, 59, 62, 0.08)"
                  stroke="#D73B3E"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Base Circle (Solid Reference) */}
                <circle
                  cx={polygonSvgPoints.cx}
                  cy={polygonSvgPoints.cy}
                  r={polygonSvgPoints.R}
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Inscribed Polygon (Cerulean Blue) */}
                <polygon
                  points={polygonSvgPoints.inscribed}
                  fill="rgba(42, 82, 190, 0.12)"
                  stroke="#2A52BE"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Center dot */}
                <circle cx={polygonSvgPoints.cx} cy={polygonSvgPoints.cy} r="3" fill="#1E293B" />
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs font-newsreader font-bold">
                <span className="flex items-center gap-1.5 text-cerulean dark:text-blue-400">
                  <span className="w-3 h-3 rounded-xs border border-cerulean bg-cerulean/20"></span>
                  Nội tiếp: {archimedesCalculations.lower}
                </span>
                <span className="flex items-center gap-1.5 text-jasper dark:text-rose-400">
                  <span className="w-3 h-3 rounded-xs border border-jasper bg-jasper/20"></span>
                  Ngoại tiếp: {archimedesCalculations.upper}
                </span>
              </div>
            </div>

            {/* Controls & Math Explanations */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2 font-newsreader">
                  Chọn số cạnh đa giác đều (N):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[6, 12, 24, 48, 96].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPolygonSides(n)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-newsreader font-bold transition cursor-pointer ${
                        polygonSides === n
                          ? 'bg-cerulean text-white shadow-sm ring-2 ring-cerulean/30'
                          : 'bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-cerulean'
                      }`}
                    >
                      N = {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-paper dark:bg-nightInput border border-gray-200/80 dark:border-slate-800 space-y-2 text-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-jasper dark:text-rose-400 font-newsreader">
                  Bất Đẳng Thức Kẹp Giá Trị Số π:
                </div>
                <div className="text-center font-mono py-1">
                  <MathRenderer content={`$$${archimedesCalculations.historicalFraction}$$`} />
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-400 font-newsreader leading-relaxed">
                  {polygonSides === 96
                    ? 'Archimedes đã vẽ thủ công đến đa giác 96 cạnh để tìm ra phân số 22/7 huyền thoại, được nhân loại sử dụng suốt nhiều thiên niên kỷ sau đó.'
                    : <MathRenderer content="Khi tăng số cạnh $N$, chu vi đa giác nội tiếp và ngoại tiếp co lại kẹp chặt giá trị thực của $\\pi \\approx 3.14159...$" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive "Find Your Birthday in Pi" Widget */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="p-6 sm:p-9 rounded-3xl bg-white dark:bg-nightCard border-2 border-jasper/50 dark:border-rose-800/70 shadow-lg text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-cerulean dark:text-blue-400 font-newsreader">
                Khám Phá Tính Toán Tương Tác
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-black text-ink dark:text-slate-100 mt-1">
                Tìm Ngày Sinh Của Bạn Trong Số π
              </h2>
            </div>
            <span className="text-xs font-newsreader text-gray-500 dark:text-slate-400 italic">
              Quét trong 2.500 chữ số thập phân đầu tiên
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 space-y-3">
              <label htmlFor="pi-birthday-input" className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 font-newsreader">
                Nhập ngày tháng sinh (hoặc số may mắn):
              </label>
              <div className="relative">
                <input
                  id="pi-birthday-input"
                  type="text"
                  maxLength={6}
                  value={birthdayQuery}
                  onChange={(e) => setBirthdayQuery(e.target.value)}
                  placeholder="Ví dụ: 1403, 1998, 2004..."
                  className="w-full px-4 py-3 rounded-xl bg-paper dark:bg-nightInput border-2 border-jasper/40 focus:border-jasper focus:outline-hidden font-mono font-bold text-lg text-ink dark:text-slate-100 transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setBirthdayQuery('1403')}
                  className="absolute right-2 top-2 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-300 text-xs font-newsreader font-bold border border-jasper/30 hover:bg-red-100 transition cursor-pointer"
                  title="Thử ngày số Pi (14 tháng 3)"
                >
                  Thử: 1403
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                Gợi ý: Nhập dạng ngày-tháng (VD: 1403 = ngày 14/3) hoặc năm sinh (VD: 1999).
              </p>
            </div>

            <div className="md:col-span-7">
              {searchFeedback ? (
                searchFeedback.found ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-paper dark:bg-nightInput border border-jasper/30 space-y-2.5 animate-dropdownFade">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-rose-950/60 text-jasper dark:text-rose-300 text-xs font-bold font-newsreader border border-jasper/30">
                      <span>✓ Đã tìm thấy chuỗi số</span>
                      <span>•</span>
                      <span>Chữ số thứ {searchFeedback.index} sau dấu phẩy</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-nightCard rounded-xl font-mono text-sm sm:text-base border border-gray-200 dark:border-slate-800 text-center select-all">
                      <span className="text-gray-400">...{searchFeedback.before}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-jasper text-white font-black mx-1">
                        {searchFeedback.match}
                      </span>
                      <span className="text-gray-400">{searchFeedback.after}...</span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-slate-400 font-newsreader leading-relaxed">
                      Các nhà toán học phỏng đoán số π là một <em>Số chuẩn (Normal Number)</em> — nghĩa là mọi dãy chữ số hữu hạn (như số điện thoại, ngày sinh của bạn) đều sẽ xuất hiện vô số lần trong nó!
                    </p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-paper dark:bg-nightInput border border-gray-200 dark:border-slate-800 text-center space-y-1">
                    <p className="text-sm font-newsreader text-gray-700 dark:text-slate-300 font-bold">
                      Chuỗi "{searchFeedback.clean}" chưa xuất hiện trong 2.500 chữ số đầu tiên.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-newsreader">
                      Vì số π vô hạn và không tuần hoàn, chuỗi này chắc chắn xuất hiện ở hàng chữ số xa hơn!
                    </p>
                  </div>
                )
              ) : (
                <div className="p-5 rounded-2xl bg-paper dark:bg-nightInput border border-gray-200 dark:border-slate-800 text-center text-xs text-gray-400 font-newsreader italic">
                  Nhập số vào ô bên trái để bắt đầu tra cứu vị trí trong số π.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHRONO-JOURNEY: HÀNH TRÌNH CHINH PHỤC HẰNG SỐ VŨ TRỤ */}
      <div id="hanh-trinh-pi" className="max-w-6xl mx-auto mb-20 px-4 scroll-mt-20">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/40 px-3.5 py-1 rounded-full border border-jasper/30 shadow-2xs">
              Biên Niên Sử 4.000 Năm
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-cerulean dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 rounded-full border border-cerulean/30 shadow-2xs">
              Trục Niên Đại Lịch Sử
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-5xl font-black text-ink dark:text-slate-100 mb-3 leading-tight">
            Hành Trình Chinh Phục <span className="text-cerulean dark:text-blue-400 italic">Hằng Số</span>{' '}
            <span className="text-jasper dark:text-rose-400 italic">Vũ Trụ</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-newsreader">
            Cuộc phiêu lưu 40 thế kỷ miệt mài kiếm tìm sự hoàn mỹ: từ những phiến đất sét Babylon, nhát gươm hình học của Archimedes, que tính tre của Tổ Xung Chi, ngòi bút giải tích của Euler, đến thuật toán siêu tốc và siêu máy tính ngày nay.
          </p>

          {/* Interactive Hint Indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper dark:bg-nightInput border border-gray-200 dark:border-slate-800 text-xs text-gray-700 dark:text-slate-300 font-newsreader font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-jasper animate-ping"></span>
            <span>Chạm hoặc rê chuột vào bất kỳ mốc năm nào trên trục thời gian để xem chi tiết; di chuột ra ngoài để trở về toàn cảnh</span>
          </div>
        </div>

        {/* 4.1 THE INTERACTIVE CHRONOLOGICAL YEAR AXIS */}
        <div
          onMouseLeave={() => setActiveMilestoneId(null)}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-nightCard border-2 border-gray-200/90 dark:border-slate-800 shadow-xl mb-10 text-left"
        >
          {/* Top Bar of the Timeline */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-jasper"></span>
                <span className="w-3 h-3 rounded-full bg-cerulean"></span>
              </div>
              <h3 className="font-playfair font-black text-base sm:text-lg text-ink dark:text-slate-100">
                Trục Niên Đại Lịch Sử Của Số π
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-newsreader bg-paper dark:bg-nightInput px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700">
              {activeMilestone ? (
                <>
                  <span className="text-gray-400">Đang hiển thị năm:</span>
                  <span className="font-bold text-ink dark:text-slate-100 font-mono">
                    {activeMilestone.displayYear}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span
                    className={`font-bold ${
                      activeMilestone.theme === 'cerulean'
                        ? 'text-cerulean dark:text-blue-400'
                        : 'text-jasper dark:text-rose-400'
                    }`}
                  >
                    {activeMilestone.shortFigure}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveMilestoneId(null)}
                    className="ml-2 text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-jasper transition cursor-pointer"
                    title="Về toàn cảnh"
                  >
                    ✕ Đóng
                  </button>
                </>
              ) : (
                <span className="text-gray-500 dark:text-slate-400 italic">
                  💡 Rê chuột hoặc chạm vào mốc năm để bắt đầu khám phá
                </span>
              )}
            </div>
          </div>

          {/* Timeline Rail & Nodes Container */}
          <div className="relative my-6 px-2 sm:px-4">
            {/* The Horizontal Spine Line */}
            <div className="hidden lg:block absolute top-[44px] left-8 right-8 h-1 bg-gray-200 dark:bg-slate-700 z-0 rounded-full"></div>

            {/* Active Progress Fill Line up to activeMilestone */}
            {activeMilestone && (
              <div
                className="hidden lg:block absolute top-[44px] left-8 h-1 z-0 rounded-full transition-all duration-300"
                style={{
                  width: `${((activeMilestone.id - 1) / (timelineMilestones.length - 1)) * 100}%`,
                  maxWidth: 'calc(100% - 4rem)',
                  backgroundColor: activeMilestone.theme === 'cerulean' ? '#2A52BE' : '#D73B3E',
                }}
              ></div>
            )}

            {/* 7 Year Nodes in a horizontal scroll rail on mobile, grid on sm+ */}
            <div className="flex overflow-x-auto snap-x no-scrollbar pb-3 sm:pb-0 sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 lg:gap-2 relative z-10">
              {timelineMilestones.map((m) => {
                const isActive = activeMilestoneId === m.id;
                const isCerulean = m.theme === 'cerulean';
                return (
                  <div
                    key={m.id}
                    onMouseEnter={() => setActiveMilestoneId(m.id)}
                    onClick={() => setActiveMilestoneId(m.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col items-center text-center relative select-none group min-w-[130px] sm:min-w-0 shrink-0 snap-center ${
                      isActive
                        ? isCerulean
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-2 border-cerulean shadow-md -translate-y-1.5'
                          : 'bg-red-50/80 dark:bg-rose-950/40 border-2 border-jasper shadow-md -translate-y-1.5'
                        : 'bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Milestone Dot/Node on Rail */}
                    <div className="relative mb-2.5 flex items-center justify-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-transform duration-200 ${
                          isActive
                            ? isCerulean
                              ? 'bg-cerulean text-white ring-4 ring-cerulean/25 scale-110'
                              : 'bg-jasper text-white ring-4 ring-jasper/25 scale-110'
                            : 'bg-paper dark:bg-nightInput border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 group-hover:scale-105'
                        }`}
                      >
                        #{m.id}
                      </div>
                      {isActive && (
                        <span
                          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                            isCerulean ? 'bg-cerulean' : 'bg-jasper'
                          } animate-ping`}
                        ></span>
                      )}
                    </div>

                    {/* Prominent Year Label */}
                    <div
                      className={`font-playfair font-black text-sm sm:text-base tracking-tight mb-1 transition-colors ${
                        isActive
                          ? isCerulean
                            ? 'text-cerulean dark:text-blue-300 scale-105'
                            : 'text-jasper dark:text-rose-300 scale-105'
                          : 'text-ink dark:text-slate-100 group-hover:text-cerulean'
                      }`}
                    >
                      {m.shortYear}
                    </div>

                    {/* Figure Name & Era */}
                    <div className="text-xs font-newsreader font-bold text-gray-700 dark:text-slate-300 line-clamp-1">
                      {m.shortFigure}
                    </div>

                    {/* Method Tag */}
                    <div className="text-[11px] font-newsreader text-gray-500 dark:text-slate-400 truncate mt-0.5 w-full">
                      {m.methodType}
                    </div>

                    {/* Hover indicator pill */}
                    <div
                      className={`mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full transition-opacity ${
                        isActive
                          ? isCerulean
                            ? 'bg-cerulean text-white'
                            : 'bg-jasper text-white'
                          : 'opacity-0 group-hover:opacity-100 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
                      }`}
                    >
                      {isActive ? 'Đang chọn' : 'Rê để xem'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4.2 INSTANT YEAR SHOWCASE PANEL (Hiển thị khi đã chọn hoặc rê chuột vào năm) */}
          {activeMilestone ? (
            <div
              className={`p-6 sm:p-8 rounded-2xl bg-paper dark:bg-nightInput border-2 transition-all duration-300 text-left mt-6 animate-dropdownFade ${
                activeMilestone.theme === 'cerulean' ? 'border-cerulean' : 'border-jasper'
              }`}
            >
              {/* Top Bar of the Year Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 dark:border-slate-800 pb-4 mb-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Large Year Stamp Banner */}
                  <div
                    className={`px-4 py-2 rounded-xl text-white font-playfair font-black text-base sm:text-lg shadow-xs flex items-center gap-2 ${
                      activeMilestone.theme === 'cerulean' ? 'bg-cerulean' : 'bg-jasper'
                    }`}
                  >
                    <span>NĂM {activeMilestone.displayYear}</span>
                  </div>

                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold font-newsreader bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200">
                    {activeMilestone.period}
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-newsreader ${
                      activeMilestone.theme === 'cerulean'
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                        : 'bg-red-100 text-red-900 dark:bg-rose-950 dark:text-rose-200'
                    }`}
                  >
                    {activeMilestone.precisionPill}
                  </span>
                </div>


              </div>

              {/* 2-Column Responsive Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Figures, Summary, Detailed Story & Curiosity Trivia */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 font-mono">
                      Nhân Vật Lịch Sử • Cột Mốc #0{activeMilestone.id}
                    </span>
                    <h3 className="font-playfair font-black text-2xl sm:text-4xl text-ink dark:text-slate-100 mt-1">
                      {activeMilestone.figures}
                    </h3>
                  </div>

                  <div className="text-base sm:text-lg text-gray-800 dark:text-slate-200 font-bold font-newsreader leading-snug">
                    <MathRenderer content={activeMilestone.summary} />
                  </div>

                  <div className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader">
                    <MathRenderer content={activeMilestone.details} />
                  </div>

                  {/* Curiosity / Historical Trivia Box */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-nightCard border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm font-newsreader text-gray-700 dark:text-slate-300 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-xs">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Góc nhìn học thuật &amp; Chuyện chưa kể của năm {activeMilestone.shortYear}:</span>
                    </div>
                    <p className="leading-relaxed pl-6 italic text-gray-600 dark:text-slate-300">
                      "{activeMilestone.curiosity}"
                    </p>
                  </div>
                </div>

                {/* Right: KaTeX Formula Card, Copy Button, Benchmark value */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
                    <div className="flex items-center justify-between text-xs font-newsreader border-b border-gray-200/70 dark:border-slate-800 pb-2">
                      <span className="font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Công Thức Đột Phá KaTeX
                      </span>
                      <span className="font-mono text-cerulean dark:text-blue-400 font-bold">
                        {activeMilestone.yearBadge}
                      </span>
                    </div>

                    <div className="p-4 bg-paper dark:bg-nightInput rounded-xl border border-gray-200 dark:border-slate-800 font-newsreader text-lg sm:text-xl overflow-x-auto">
                      <MathRenderer content={activeMilestone.formula} />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="text-left text-xs font-newsreader">
                        <span className="text-gray-400 block text-[10px] uppercase font-mono">
                          Giá trị số π đạt được:
                        </span>
                        <span className="font-mono font-bold text-ink dark:text-slate-100 text-xs sm:text-sm truncate block">
                          {activeMilestone.benchmarkValue}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyFormula(activeMilestone.formula, activeMilestone.figures)}
                        className={`px-3.5 py-2 rounded-xl text-white font-newsreader font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          activeMilestone.theme === 'cerulean'
                            ? 'bg-cerulean hover:bg-blue-800'
                            : 'bg-jasper hover:bg-red-800'
                        }`}
                        title="Sao chép mã LaTeX của công thức này"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        <span>Sao Chép LaTeX</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            /* 4.2 UNSELECTED STATE: BẢNG TOÀN CẢNH KHỞI ĐẦU CUỘC HÀNH TRÌNH */
            <div className="p-6 sm:p-10 rounded-2xl bg-paper dark:bg-nightInput border-2 border-dashed border-gray-300 dark:border-slate-700 text-left mt-6 transition-all animate-dropdownFade">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cerulean"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-jasper"></span>
                  <span className="text-xs font-mono uppercase tracking-widest font-bold text-gray-500 dark:text-slate-400">
                    Toàn Cảnh 40 Thế Kỷ • Trí Tuệ Nhân Loại
                  </span>
                </div>
                <span className="text-xs font-newsreader italic text-gray-500 dark:text-slate-400">
                  Rê chuột vào bất kỳ mốc năm nào ở trên để xem chi tiết
                </span>
              </div>

              <div className="max-w-3xl mb-8">
                <h3 className="font-playfair font-black text-2xl sm:text-3xl text-ink dark:text-slate-100 mb-2">
                  Chạm Vào Dòng Thời Gian Để Mở Khóa Bí Mật Số π
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 font-newsreader leading-relaxed">
                  Từ những phiến đất sét Babylon cổ xưa, nhát gươm hình học của Archimedes, que tính tre của Tổ Xung Chi, ngòi bút giải tích của Euler, đến siêu máy tính giải mã 105 nghìn tỷ chữ số. Hãy di chuột qua trục niên đại bên trên hoặc bấm vào 3 kỷ nguyên trụ cột dưới đây để bắt đầu:
                </p>
              </div>

              {/* 3 Major Epoch Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Epoch Pillar 1: Hình học cổ đại */}
                <button
                  type="button"
                  onClick={() => setActiveMilestoneId(2)}
                  onMouseEnter={() => setActiveMilestoneId(2)}
                  className="p-5 rounded-2xl bg-white dark:bg-nightCard border-2 border-cerulean text-left hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-newsreader bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300">
                        1900 TCN – 480 SCN
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-400">#01 – #03</span>
                    </div>
                    <h4 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 group-hover:text-cerulean transition-colors mb-1.5">
                      Kỷ Nguyên Đa Giác &amp; Hình Học
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-slate-300 font-newsreader leading-relaxed mb-3">
                      Archimedes kẹp đa giác 96 cạnh tìm ra phân số 22/7; Tổ Xung Chi và Lưu Huy dùng que tính tre đo đa giác 24.576 cạnh lập kỷ lục 800 năm.
                    </p>
                  </div>
                  <div className="text-xs font-bold font-newsreader text-cerulean dark:text-blue-400 flex items-center gap-1">
                    <span>Khám phá Archimedes (~250 TCN)</span>
                    <span>→</span>
                  </div>
                </button>

                {/* Epoch Pillar 2: Giải tích & Khai sáng */}
                <button
                  type="button"
                  onClick={() => setActiveMilestoneId(5)}
                  onMouseEnter={() => setActiveMilestoneId(5)}
                  className="p-5 rounded-2xl bg-white dark:bg-nightCard border-2 border-jasper text-left hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-newsreader bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300">
                        1674 – 1748 SCN
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-400">#04 – #05</span>
                    </div>
                    <h4 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 group-hover:text-jasper transition-colors mb-1.5">
                      Kỷ Nguyên Giải Tích &amp; Khai Sáng
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-slate-300 font-newsreader leading-relaxed mb-3">
                      Leibniz tìm ra chuỗi số vô hạn tuyệt mỹ; Leonhard Euler giải bài toán Basel, chuẩn hóa ký hiệu π và công bố Đẳng thức Euler huyền thoại.
                    </p>
                  </div>
                  <div className="text-xs font-bold font-newsreader text-jasper dark:text-rose-400 flex items-center gap-1">
                    <span>Khám phá Leonhard Euler (1748 SCN)</span>
                    <span>→</span>
                  </div>
                </button>

                {/* Epoch Pillar 3: Siêu máy tính & Ramanujan */}
                <button
                  type="button"
                  onClick={() => setActiveMilestoneId(7)}
                  onMouseEnter={() => setActiveMilestoneId(7)}
                  className="p-5 rounded-2xl bg-white dark:bg-nightCard border-2 border-cerulean text-left hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-newsreader bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300">
                        1882 – 2024 SCN
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-400">#06 – #07</span>
                    </div>
                    <h4 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 group-hover:text-cerulean transition-colors mb-1.5">
                      Kỷ Nguyên Siêu Điện Toán 2024
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-slate-300 font-newsreader leading-relaxed mb-3">
                      Lindemann chứng minh π là số siêu việt; công thức hội tụ thần kỳ của Srinivasa Ramanujan làm nền tảng cho siêu máy tính tìm ra 105 nghìn tỷ số.
                    </p>
                  </div>
                  <div className="text-xs font-bold font-newsreader text-cerulean dark:text-blue-400 flex items-center gap-1">
                    <span>Khám phá Ramanujan &amp; Siêu máy tính</span>
                    <span>→</span>
                  </div>
                </button>
              </div>

              {/* Bottom Interactive Hint */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-nightCard border border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs font-newsreader text-gray-500 dark:text-slate-400">
                <span className="flex items-center gap-2 font-bold text-ink dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-jasper animate-ping"></span>
                  Gợi ý tương tác:
                </span>
                <span>Rê chuột vào bất kỳ mốc năm nào trên thanh ray ở trên để hiển thị thông tin tức thì; di chuột ra ngoài dòng thời gian sẽ tự động trở về toàn cảnh</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 5. 3 Mathematical Wonders of Pi */}
      <div className="max-w-5xl mx-auto mb-16 px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-jasper dark:text-rose-400 bg-red-50 dark:bg-rose-950/40 px-3.5 py-1.5 rounded-full border border-jasper/30 shadow-2xs">
            Toán Học Diệu Kỳ
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-black text-ink dark:text-slate-100 mt-2">
            3 Bí Mật &amp; Kỳ Quan Của Số π
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Wonder 1: Euler Identity */}
          <div className="p-6 rounded-2xl bg-white dark:bg-nightCard border-2 border-cerulean shadow-sm flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-newsreader bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300 inline-block mb-3">
                Kỳ Quan 01 • Đẳng Thức Đẹp Nhất
              </span>
              <h3 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
                Đẳng Thức Euler
              </h3>
              <div className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader mb-4">
                <MathRenderer content="Liên kết 5 hằng số nền tảng của toán học: số vô tỉ $e$, đơn vị ảo $i$, hằng số hình học $\\pi$, số trung hòa nhân $1$ và số không $0$." />
              </div>
            </div>
            <div className="p-3 bg-paper dark:bg-nightInput rounded-xl border border-gray-200 dark:border-slate-800 text-center font-mono">
              <MathRenderer content="$$e^{i\\pi} + 1 = 0$$" />
            </div>
          </div>

          {/* Wonder 2: Buffon's Needle */}
          <div className="p-6 rounded-2xl bg-white dark:bg-nightCard border-2 border-jasper shadow-sm flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-newsreader bg-red-50 text-jasper dark:bg-rose-950/60 dark:text-rose-300 inline-block mb-3">
                Kỳ Quan 02 • Xác Suất Hình Học
              </span>
              <h3 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
                Bài Toán Kim Buffon (1777)
              </h3>
              <div className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader mb-4">
                <MathRenderer content="Nếu thả ngẫu nhiên một cây kim chiều dài $L$ lên mặt bàn có các đường song song cách nhau khoảng cách $D$, xác suất kim cắt đường kẻ là:" />
              </div>
            </div>
            <div className="p-3 bg-paper dark:bg-nightInput rounded-xl border border-gray-200 dark:border-slate-800 text-center font-mono">
              <MathRenderer content="$$P = \\frac{2L}{\\pi D}$$" />
            </div>
          </div>

          {/* Wonder 3: Feynman Point */}
          <div className="p-6 rounded-2xl bg-white dark:bg-nightCard border-2 border-cerulean shadow-sm flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-newsreader bg-blue-50 text-cerulean dark:bg-blue-950/60 dark:text-blue-300 inline-block mb-3">
                Kỳ Quan 03 • Hiện Tượng Hiếm Có
              </span>
              <h3 className="font-playfair font-bold text-lg text-ink dark:text-slate-100 mb-2">
                Điểm Feynman (Vị trí 762)
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed font-newsreader mb-4">
                Ở chữ số thứ 762 sau dấu phẩy của số π, bất ngờ xuất hiện liên tiếp sáu chữ số 9 liền nhau, một hiện tượng xác suất cực kỳ hiếm hoi.
              </p>
            </div>
            <div className="p-3 bg-paper dark:bg-nightInput rounded-xl border border-gray-200 dark:border-slate-800 text-center font-mono font-bold text-jasper">
              ...999999...
            </div>
          </div>
        </div>
      </div>

      {/* 6. Navigation and Call to Action - Jasper Red Master Card */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-jasper text-white text-center shadow-xl border-2 border-red-900/60 dark:border-rose-800">
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold mb-3">
            Khám Phá Thêm Về Tạp Chí Mang Tên Hằng Số Này
          </h3>
          <p className="text-red-100 font-newsreader max-w-xl mx-auto mb-6 text-base sm:text-lg leading-relaxed">
            Số π tượng trưng cho sự khám phá không ngừng nghỉ. Tạp chí Pi kế thừa ngọn lửa học thuật ấy để truyền cảm hứng tới bạn đọc yêu toán học trên khắp Việt Nam.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/tap-chi-pi')}
              className="px-6 py-3 rounded-xl bg-white text-jasper hover:bg-paper font-newsreader font-bold text-base shadow-md transition cursor-pointer"
            >
              Về Tạp Chí Pi →
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-cerulean hover:bg-blue-800 text-white border border-blue-400/30 font-newsreader font-bold text-base shadow-md transition cursor-pointer"
            >
              Trở Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
