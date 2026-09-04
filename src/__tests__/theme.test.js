import { describe, it, expect, beforeEach } from 'vitest';

describe('Dark Mode Theme Configuration & Logic', () => {
  let mockStorage = {};

  beforeEach(() => {
    mockStorage = {};
  });

  const getStoredTheme = (storage) => {
    const val = storage['pimaga_theme'];
    if (val === 'dark' || val === 'light') return val;
    return 'light';
  };

  const getIsDark = (theme) => theme === 'dark';

  it('lưu trữ và phân giải đúng theme từ storage', () => {
    mockStorage['pimaga_theme'] = 'dark';
    expect(getStoredTheme(mockStorage)).toBe('dark');

    mockStorage['pimaga_theme'] = 'light';
    expect(getStoredTheme(mockStorage)).toBe('light');

    mockStorage['pimaga_theme'] = 'invalid_theme';
    expect(getStoredTheme(mockStorage)).toBe('light');
  });

  it('xác định đúng trạng thái boolean isDark dựa trên theme string', () => {
    expect(getIsDark('dark')).toBe(true);
    expect(getIsDark('light')).toBe(false);
    expect(getIsDark('')).toBe(false);
  });

  it('chuyển đổi (toggle) chính xác giữa light và dark', () => {
    const toggleTheme = (curr) => (curr === 'dark' ? 'light' : 'dark');
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });
});

