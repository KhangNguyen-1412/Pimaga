import { describe, it, expect } from 'vitest';
import { DIFFICULTY_LEVELS } from '../constants/difficulty';
import { PROVINCES_34 } from '../constants/provinces';

describe('DIFFICULTY_LEVELS constants', () => {
  it('định nghĩa chính xác 5 cấp độ khó từ 1 đến 5', () => {
    expect(DIFFICULTY_LEVELS).toHaveLength(5);
    const levels = DIFFICULTY_LEVELS.map((d) => d.level);
    expect(levels).toEqual([1, 2, 3, 4, 5]);
  });

  it('tuân thủ bảng màu Cerulean cho cấp 1-3 và Jasper cho cấp 4-5', () => {
    // Cấp 1-3 là Dễ, Trung bình, Khá -> Dùng Cerulean (Blue palette)
    [0, 1, 2].forEach((idx) => {
      expect(DIFFICULTY_LEVELS[idx].colorClass).toContain('cerulean');
      expect(DIFFICULTY_LEVELS[idx].starColor).toBe('text-cerulean');
    });

    // Cấp 4-5 là Khó, Rất khó -> Dùng Jasper (Red palette)
    [3, 4].forEach((idx) => {
      expect(DIFFICULTY_LEVELS[idx].colorClass).toContain('jasper');
      expect(DIFFICULTY_LEVELS[idx].starColor).toBe('text-jasper');
    });
  });

  it('mỗi cấp độ có đầy đủ tên, mô tả và số sao', () => {
    DIFFICULTY_LEVELS.forEach((d) => {
      expect(d.name).toBeTruthy();
      expect(d.desc).toBeTruthy();
      expect(d.stars).toHaveLength(5);
    });
  });
});

describe('PROVINCES_34 constants', () => {
  it('chứa chính xác 34 tỉnh thành sau sáp nhập', () => {
    expect(PROVINCES_34).toHaveLength(34);
  });

  it('bao gồm các đô thị trọng điểm', () => {
    const provinceNames = PROVINCES_34.map((p) => p.name);
    expect(provinceNames).toContain('Hà Nội');
    expect(provinceNames).toContain('TP. Hồ Chí Minh');
    expect(provinceNames).toContain('Đà Nẵng');
    expect(provinceNames).toContain('Cần Thơ');
    expect(provinceNames).toContain('Huế');
  });
});
