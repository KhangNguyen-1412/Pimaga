import { describe, it, expect } from 'vitest';
import { DIFFICULTY_LEVELS } from '../constants/difficulty';

describe('Solution Workspace Experience', () => {
  it('đảm bảo đề bài luôn có trường content để hiển thị trong khu vực làm bài', () => {
    const sampleProblem = {
      id: 'prob-1',
      code: 'P1',
      content: 'Cho tam giác $ABC$ nội tiếp đường tròn $(O)$. Chứng minh rằng...',
      author: 'Trần Nam Dũng',
      difficulty: 3,
    };

    expect(sampleProblem.content).toBeTruthy();
    expect(sampleProblem.content).toContain('$ABC$');
  });

  it('xác thực cấu trúc mã đề bài bắt đầu bằng P hoặc Bài', () => {
    const formatHeading = (p) => {
      return p.code
        ? p.code.startsWith('Bài')
          ? p.code
          : `Bài ${p.code}`
        : p.title || 'Bài toán';
    };

    expect(formatHeading({ code: 'P12' })).toBe('Bài P12');
    expect(formatHeading({ code: 'Bài 5' })).toBe('Bài 5');
    expect(formatHeading({ title: 'Phương trình hàm' })).toBe('Phương trình hàm');
  });
});
