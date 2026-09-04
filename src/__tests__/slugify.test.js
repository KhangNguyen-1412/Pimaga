import { describe, it, expect } from 'vitest';
import { slugify, findIssueBySlug, findCategoryBySlug, getProblemSlug } from '../utils/slugify';

describe('slugify utility', () => {
  it('chuyển đổi chuỗi tiếng Việt có dấu thành URL slug chuẩn', () => {
    expect(slugify('Số 1 - Tháng 9/2026')).toBe('so-1-thang-9-2026');
    expect(slugify('Vẻ đẹp Toán học')).toBe('ve-dep-toan-hoc');
    expect(slugify('Đại số & Giải tích')).toBe('dai-so-giai-tich');
    expect(slugify('Hình học thuần túy')).toBe('hinh-hoc-thuan-tuy');
  });

  it('xử lý chuỗi rỗng hoặc falsy một cách an toàn', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
  });

  it('loại bỏ các ký tự đặc biệt không hợp lệ và chuẩn hóa dấu gạch ngang', () => {
    expect(slugify('---Bài toán #1 @!---')).toBe('bai-toan-1');
  });
});

describe('findIssueBySlug utility', () => {
  const mockIssues = [
    { id: 'issue-1', name: 'Số 1 - Tháng 9/2026', issueNumber: '1' },
    { id: 'issue-2', name: 'Số Đặc Biệt Xuân', issueNumber: '2' },
  ];

  it('tìm thấy số phát hành theo ID chính xác', () => {
    const found = findIssueBySlug(mockIssues, 'issue-1');
    expect(found).toBeDefined();
    expect(found?.name).toBe('Số 1 - Tháng 9/2026');
  });

  it('tìm thấy số phát hành theo URL slug của tên', () => {
    const found = findIssueBySlug(mockIssues, 'so-dac-biet-xuan');
    expect(found).toBeDefined();
    expect(found?.id).toBe('issue-2');
  });

  it('tìm thấy số phát hành theo định dạng so-{issueNumber}', () => {
    const found = findIssueBySlug(mockIssues, 'so-1');
    expect(found).toBeDefined();
    expect(found?.id).toBe('issue-1');
  });

  it('trả về null nếu không tìm thấy hoặc input không hợp lệ', () => {
    expect(findIssueBySlug(mockIssues, 'khong-ton-tai')).toBeNull();
    expect(findIssueBySlug(null, 'so-1')).toBeNull();
  });
});

describe('findCategoryBySlug utility', () => {
  const mockCategories = [
    { id: 'cat-1', name: 'Vẻ đẹp Toán học' },
    { id: 'cat-2', name: 'Quán Toán' },
  ];

  it('tìm thấy chuyên mục theo slug tiếng Việt', () => {
    const found = findCategoryBySlug(mockCategories, 've-dep-toan-hoc');
    expect(found).toBeDefined();
    expect(found?.id).toBe('cat-1');
  });

  it('trả về null nếu chuyên mục không tồn tại', () => {
    expect(findCategoryBySlug(mockCategories, 'chuyen-muc-la')).toBeNull();
  });
});

describe('getProblemSlug utility', () => {
  it('tạo slug mã bài viết thường không khoảng trắng', () => {
    expect(getProblemSlug({ code: 'P12' })).toBe('p12');
    expect(getProblemSlug({ code: 'P 99' })).toBe('p99');
    expect(getProblemSlug({ id: 'problem-abc' })).toBe('problem-abc');
    expect(getProblemSlug(null)).toBe('');
  });
});
