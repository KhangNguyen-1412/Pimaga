/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành URL slug thân thiện
 * Ví dụ: "Số 1 - Tháng 9/2026" -> "so-1-thang-9-2026"
 *        "Vẻ đẹp Toán học" -> "ve-dep-toan-hoc"
 */
export function slugify(str) {
  if (!str) return '';

  let slug = str.toString().toLowerCase();

  // Đổi dấu gạch chéo thành gạch ngang (cho ngày tháng: 9/2026 -> 9-2026)
  slug = slug.replace(/[/\\]/g, '-');

  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');

  // Xóa các ký tự đặc biệt, thay bằng gạch ngang
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  slug = slug.replace(/[\s_]+/g, '-');
  slug = slug.replace(/-+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}

/**
 * Tìm số phát hành theo slug hoặc id
 */
export function findIssueBySlug(issues, slugOrId) {
  if (!slugOrId || !Array.isArray(issues)) return null;
  const target = slugOrId.toLowerCase().trim();
  return (
    issues.find((i) => i.id === slugOrId) ||
    issues.find((i) => slugify(i.name) === target) ||
    issues.find((i) => i.issueNumber && `so-${i.issueNumber}` === target) ||
    null
  );
}

/**
 * Tìm chuyên mục theo slug hoặc id
 */
export function findCategoryBySlug(categories, slugOrId) {
  if (!slugOrId || !Array.isArray(categories)) return null;
  const target = slugOrId.toLowerCase().trim();
  return (
    categories.find((c) => c.id === slugOrId) ||
    categories.find((c) => slugify(c.name) === target) ||
    null
  );
}

/**
 * Tạo URL thân thiện cho bài toán
 * Ví dụ: Mã P1 -> /bai-toan/p1
 */
export function getProblemSlug(problem) {
  if (!problem) return '';
  const code = (problem.code || problem.id || '').toLowerCase().replace(/\s+/g, '');
  return code;
}
