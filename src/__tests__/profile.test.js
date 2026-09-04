import { describe, it, expect } from 'vitest';
import {
  getAcademicRank,
  calculateDifficultyStats,
  calculateCategoryStats,
  generateSolutionsLatex,
  generateSolutionsMarkdown,
  ACADEMIC_RANKS,
} from '../utils/profileUtils';

describe('profileUtils', () => {
  describe('getAcademicRank', () => {
    it('returns lowest rank for 0 solved problems', () => {
      const rank = getAcademicRank(0);
      expect(rank.title).toBe('Tập sự Toán học');
      expect(rank.progressPercent).toBe(0);
      expect(rank.neededForNext).toBe(5);
    });

    it('returns Pi Enthusiast rank for 5 solved problems', () => {
      const rank = getAcademicRank(5);
      expect(rank.title).toBe('Tín đồ Pi');
      expect(rank.progressPercent).toBe(0);
      expect(rank.neededForNext).toBe(10);
    });

    it('calculates progression percentage correctly', () => {
      const rank = getAcademicRank(10); // Between 5 and 15: 5/10 = 50%
      expect(rank.title).toBe('Tín đồ Pi');
      expect(rank.progressPercent).toBe(50);
      expect(rank.neededForNext).toBe(5);
    });

    it('handles Grandmaster rank for 30+ problems', () => {
      const rank = getAcademicRank(35);
      expect(rank.title).toBe('Đại kiện tướng Pi');
      expect(rank.progressPercent).toBe(100);
      expect(rank.neededForNext).toBe(0);
    });
  });

  describe('calculateDifficultyStats', () => {
    it('calculates group percentage correctly', () => {
      const problems = [
        { id: 'p1', difficulty: 1 },
        { id: 'p2', difficulty: 2 },
        { id: 'p3', difficulty: 3 },
        { id: 'p4', difficulty: 5 },
      ];
      const solutions = { p1: 'sol1', p3: 'sol3' };

      const stats = calculateDifficultyStats(problems, solutions);
      expect(stats.easy.total).toBe(2);
      expect(stats.easy.count).toBe(1);
      expect(stats.easy.percent).toBe(50);

      expect(stats.medium.total).toBe(1);
      expect(stats.medium.count).toBe(1);
      expect(stats.medium.percent).toBe(100);

      expect(stats.hard.total).toBe(1);
      expect(stats.hard.count).toBe(0);
      expect(stats.hard.percent).toBe(0);
    });
  });

  describe('calculateCategoryStats', () => {
    it('calculates stats per category and sorts by solved count', () => {
      const categories = [
        { id: 'cat1', name: 'Số học' },
        { id: 'cat2', name: 'Hình học' },
      ];
      const problems = [
        { id: 'p1', categoryId: 'cat1' },
        { id: 'p2', categoryId: 'cat2' },
        { id: 'p3', categoryId: 'cat2' },
      ];
      const solutions = { p2: 'sol2', p3: 'sol3' };

      const stats = calculateCategoryStats(problems, solutions, categories);
      expect(stats[0].name).toBe('Hình học');
      expect(stats[0].solved).toBe(2);
      expect(stats[0].percent).toBe(100);

      expect(stats[1].name).toBe('Số học');
      expect(stats[1].solved).toBe(0);
      expect(stats[1].percent).toBe(0);
    });
  });

  describe('generateSolutionsLatex and Markdown', () => {
    const user = { displayName: 'Nguyễn Văn A' };
    const items = [
      {
        problem: { code: 'P101', content: '$x + y = 2$' },
        solution: 'Ta có $x = 1, y = 1$',
        issueName: 'Số 50',
        categoryName: 'Đại số',
      },
    ];

    it('generates compilable LaTeX code with packages', () => {
      const latex = generateSolutionsLatex(user, items);
      expect(latex).toContain('\\documentclass');
      expect(latex).toContain('\\usepackage{amsmath,amssymb');
      expect(latex).toContain('Nguyễn Văn A');
      expect(latex).toContain('P101');
      expect(latex).toContain('Ta có $x = 1, y = 1$');
    });

    it('generates valid Markdown text', () => {
      const md = generateSolutionsMarkdown(user, items);
      expect(md).toContain('# Tập Bài Giải Toán Tạp Chí Pi');
      expect(md).toContain('Nguyễn Văn A');
      expect(md).toContain('[P101]');
      expect(md).toContain('Ta có $x = 1, y = 1$');
    });
  });
});
