import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import LoginPage from '../components/auth/LoginPage';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
    isRealUser: false,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/dang-nhap' }),
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

describe('LoginPage Component (Split-Screen Layout)', () => {
  it('renders split screen with left academic showcase and right login form for guests', () => {
    const element = React.createElement(LoginPage);
    const html = renderToString(element);

    // Left Half: Academic showcase
    expect(html).toContain('Tạp Chí Pi');
    expect(html).toContain('Hội Toán Học Việt Nam');
    expect(html).toContain('Kho Đề Olympic');
    expect(html).toContain('Soạn Thảo KaTeX');
    expect(html).toContain('Chuỗi Rèn Luyện');

    // Right Half: Auth form
    expect(html).toContain('Đăng Nhập Tài Khoản');
    expect(html).toContain('Đăng nhập với Google');
    expect(html).toContain('Về Trang Chủ Giới Thiệu');
    expect(html).toContain('Bạn cần đăng nhập tài khoản Google');
    expect(html).toContain('Bảo mật &amp; Cam kết quyền riêng tư');
  });
});
