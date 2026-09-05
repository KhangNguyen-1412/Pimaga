import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import BottomNavigationBar from '../components/common/BottomNavigationBar';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { displayName: 'Học giả Pi', photoURL: null },
    isRealUser: true,
  }),
}));

vi.mock('../context/DataContext', () => ({
  useData: () => ({
    bookmarks: ['p1', 'p2'],
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/kho-de' }),
}));

describe('BottomNavigationBar Component', () => {
  it('renders all 5 navigation elements correctly', () => {
    const html = renderToString(
      React.createElement(BottomNavigationBar, {
        onOpenCreateProblem: vi.fn(),
      })
    );

    expect(html).toContain('Trang Chủ');
    expect(html).toContain('Kho Đề');
    expect(html).toContain('Soạn Đề');
    expect(html).toContain('Số π');
    expect(html).toContain('Hồ Sơ');
  });

  it('displays the bookmarks counter badge when user has saved problems', () => {
    const html = renderToString(
      React.createElement(BottomNavigationBar, {
        onOpenCreateProblem: vi.fn(),
      })
    );

    // Bookmarks length is 2 in mock
    expect(html).toContain('2 bài đã lưu');
    expect(html).toContain('>2<');
  });

  it('contains floating classes and sm:hidden so it only appears floating on mobile viewports', () => {
    const html = renderToString(
      React.createElement(BottomNavigationBar, {
        onOpenCreateProblem: vi.fn(),
      })
    );

    expect(html).toContain('sm:hidden');
    expect(html).toContain('fixed bottom-3');
    expect(html).toContain('shadow-2xl');
    expect(html).toContain('rounded-2xl');
  });

  it('renders the sliding indicator pill positioned at active slot with spring easing', () => {
    const html = renderToString(
      React.createElement(BottomNavigationBar, {
        onOpenCreateProblem: vi.fn(),
      })
    );

    // Expect the sliding indicator pill to be present
    expect(html).toContain('data-testid="bottom-nav-sliding-pill"');
    // For /kho-de (now swapped to slot 3), left is calc(60% + 4px)
    expect(html).toContain('left:calc(60% + 4px)');
    // Active theme for /kho-de is Jasper
    expect(html).toContain('bg-jasper/15');
    expect(html).toContain('border-jasper/35');
    expect(html).toContain('cubic-bezier(0.34, 1.15, 0.64, 1)');

    // Verify ordering: Trang Chủ (slot 0) -> Số π (slot 1) -> Soạn Đề (slot 2) -> Kho Đề (slot 3) -> Hồ Sơ (slot 4)
    const homeIdx = html.indexOf('Trang Chủ');
    const piIdx = html.indexOf('Số π');
    const createIdx = html.indexOf('Soạn Đề');
    const feedIdx = html.indexOf('Kho Đề');
    const profileIdx = html.indexOf('Hồ Sơ');

    expect(homeIdx).toBeLessThan(piIdx);
    expect(piIdx).toBeLessThan(createIdx);
    expect(createIdx).toBeLessThan(feedIdx);
    expect(feedIdx).toBeLessThan(profileIdx);
  });

  it('hides the Footer on mobile viewports using hidden sm:flex', async () => {
    const { default: Footer } = await import('../components/feed/Footer');
    const html = renderToString(React.createElement(Footer));

    expect(html).toContain('hidden');
    expect(html).toContain('sm:flex');
  });
});
