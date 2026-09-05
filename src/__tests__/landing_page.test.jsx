import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import LandingHeroCard from '../components/landing/LandingHeroCard';
import LandingPage from '../components/landing/LandingPage';
import LandingHeader from '../components/landing/LandingHeader';
import { ACADEMIC_RANKS } from '../utils/profileUtils';

import PiHistoryPage from '../components/landing/PiHistoryPage';
import TapChiPiPage from '../components/landing/TapChiPiPage';
import FeaturesPage from '../components/landing/FeaturesPage';

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, toggleTheme: vi.fn() }),
}));

// Mock các hooks của context để test server-side render mà không cần full DOM providers
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
    isRealUser: false,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('../context/DataContext', () => ({
  useData: () => ({
    problems: [
      { id: '1', code: 'P101', title: 'Bài toán mẫu 1', difficulty: 3 },
      { id: '2', code: 'P102', title: 'Bài toán mẫu 2', difficulty: 4 },
    ],
    issues: [{ id: 'iss1', name: 'Số 01/2024' }],
    categories: [{ id: 'cat1', name: 'Cùng Bạn Giải Toán' }],
    userProfile: { streak: { current: 3 } },
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

describe('Landing Page Components', () => {
  it('renders LandingHeroCard with problem details and KaTeX content', () => {
    const element = React.createElement(LandingHeroCard);
    const html = renderToString(element);

    expect(html).toContain('P104');
    expect(html).toContain('Bất đẳng thức đối xứng đa biến');
    expect(html).toContain('Cùng Bạn Giải Toán');
    expect(html).toContain('katex');
  });

  it('renders LandingPage with Lịch Sử Số Pi, Tạp Chí Pi and without Cấp Bậc Pi', () => {
    const element = React.createElement(LandingPage, {
      onExploreFeed: vi.fn(),
      onOpenLatexModal: vi.fn(),
    });
    const html = renderToString(element);

    // 1. Hero Section (Khi chưa đăng nhập: Không có nút Vào Kho Đề, chỉ có Đăng Nhập Google)
    expect(html).toContain('Hội Toán Học Việt Nam');
    expect(html).toContain('Tạp Chí Pi');
    expect(html).not.toContain('Vào Kho Đề');
    expect(html).toContain('Đăng Nhập Google');
    expect(html).not.toContain('Hồ Sơ Của Tôi');

    // 2. Metrics Bar
    expect(html).toContain('Bài Toán Tuyển Chọn');
    expect(html).toContain('Kỳ Tạp Chí Phát Hành');
    expect(html).toContain('Chuyên Mục Độc Quyền');

    // 3. Core Pillars
    expect(html).toContain('Kho Đề Phân Cấp');
    expect(html).toContain('Soạn Thảo KaTeX');
    expect(html).toContain('Lời Giải Chuẩn');
    expect(html).toContain('Xuất Tuyển Tập Đa Định Dạng');

    // 4. Lịch Sử Hình Thành Của Số Pi (thay cho Bài toán mẫu)
    expect(html).toContain('Lịch Sử Hình Thành Của');
    expect(html).toContain('Archimedes xứ Syracuse');
    expect(html).toContain('Tổ Xung Chi');
    expect(html).toContain('Leonhard Euler');

    // 5. Tạp Chí Pi - Hội Toán Học Việt Nam (thay cho Về tạp chí)
    expect(html).toContain('Sứ Mệnh Ươm Mầm');
    expect(html).toContain('Hà Huy Khoái');
    expect(html).toContain('Ngô Bảo Châu');

    // 6. XÓA HOÀN TOÀN CẤP BẬC PI KHỎI TRANG LANDING
    expect(html).not.toContain('Hệ Thống Phân Hạng Học Thuật');
    expect(html).not.toContain('Hệ Thống Cấp Bậc Pi');
    expect(html).not.toContain('Cấp Bậc Học Thuật');

    // 7. Call To Action Banner
    expect(html).toContain('Sẵn Sàng Thử Thách Tư Duy Cùng Tạp Chí Pi?');
  });

  it('renders LandingHeader với 4 nút dẫn đến 4 trang riêng biệt và kiểm soát quyền', () => {
    const element = React.createElement(LandingHeader, {
      onOpenLatexModal: vi.fn(),
    });
    const html = renderToString(element);

    // 4 nút trên header đến 4 trang:
    expect(html).toContain('Tổng quan');
    expect(html).toContain('Tính năng');
    expect(html).toContain('Lịch sử số π');
    expect(html).toContain('Tạp chí Pi');

    // Tuyệt đối không còn mục cấp bậc pi trên header:
    expect(html).not.toContain('Cấp Bậc');
    expect(html).not.toContain('Cấp bậc');

    // Chưa đăng nhập: chỉ có Đăng nhập, KHÔNG có nút Kho Đề, KHÔNG có nút Hồ sơ
    expect(html).toContain('Đăng nhập');
    expect(html).not.toContain('<span>Kho Đề</span>');
    expect(html).not.toContain('Hồ sơ:');
  });

  it('renders PiHistoryPage với bộ mô phỏng Archimedes, tìm ngày sinh và các mốc lịch sử', () => {
    const element = React.createElement(PiHistoryPage);
    const html = renderToString(element);

    expect(html).toContain('Lịch Sử Hình Thành Của');
    expect(html).toContain('Phương Pháp Đa Giác Vét Cạn Archimedes');
    expect(html).toContain('Tìm Ngày Sinh Của Bạn Trong Số');
    expect(html).toContain('Archimedes');
    expect(html).toContain('Lưu Huy');
    expect(html).toContain('Tổ Xung Chi');
    expect(html).toContain('Leonhard Euler');
    expect(html).toContain('Srinivasa Ramanujan');
    expect(html).toContain('3 Bí Mật &amp; Kỳ Quan Của Số');
  });

  it('renders TapChiPiPage với Khám phá Chuyên mục, Hội Đồng Sáng Lập và Quy trình 4 bước', () => {
    const element = React.createElement(TapChiPiPage);
    const html = renderToString(element);

    expect(html).toContain('Khám Phá 4 Chuyên Mục Độc Quyền');
    expect(html).toContain('Hội Đồng Sáng Lập');
    expect(html).toContain('Hà Huy Khoái');
    expect(html).toContain('Ngô Bảo Châu');
    expect(html).toContain('Trần Văn Nhung');
    expect(html).toContain('Cùng Bạn Giải Toán');
    expect(html).toContain('Thách Thức Toán Học');
    expect(html).toContain('Vòng Đời Của Một Bài Toán Trên Tạp Chí Pi');
    expect(html).toContain('Những Số Báo Tiêu Biểu Được Số Hóa');
  });

  it('renders FeaturesPage riêng biệt với 6 tính năng đột phá', () => {
    const element = React.createElement(FeaturesPage, { onOpenLatexModal: vi.fn() });
    const html = renderToString(element);

    expect(html).toContain('Tính Năng');
    expect(html).toContain('Kho Đề Phân Cấp');
    expect(html).toContain('Soạn Thảo KaTeX &amp; TikZ Trực Tiếp');
    expect(html).toContain('Sổ Tay 60+ Cú Pháp Toán LaTeX');
  });

  it('xác định chính xác các đường dẫn độc lập trong hệ thống', () => {
    const isLandingHeaderRoute = (pathname) =>
      pathname === '/' ||
      pathname === '/gioi-thieu' ||
      pathname === '/tinh-nang' ||
      pathname === '/lich-su-so-pi' ||
      pathname === '/tap-chi-pi';

    expect(isLandingHeaderRoute('/')).toBe(true);
    expect(isLandingHeaderRoute('/tinh-nang')).toBe(true);
    expect(isLandingHeaderRoute('/lich-su-so-pi')).toBe(true);
    expect(isLandingHeaderRoute('/tap-chi-pi')).toBe(true);
    expect(isLandingHeaderRoute('/kho-de')).toBe(false);
    expect(isLandingHeaderRoute('/bai-toan/p101')).toBe(false);
    expect(isLandingHeaderRoute('/ho-so')).toBe(false);
  });
});
