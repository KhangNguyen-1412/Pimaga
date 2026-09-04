import os
import re
import subprocess
import sys

def test_seo_and_friendly_urls():
    print("=== KIỂM THỬ TÍCH HỢP SEO & FRIENDLY URLS ===")
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # 1. Kiểm tra index.html có đầy đủ thẻ meta SEO & Schema
    index_path = os.path.join(root_dir, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    seo_elements = [
        '<meta name="description"',
        '<meta name="keywords"',
        '<link rel="canonical"',
        '<meta property="og:title"',
        '<meta property="og:description"',
        '<meta property="og:image"',
        '<meta property="og:type"',
        '<meta property="og:site_name"',
        '<meta name="twitter:card"',
        '<meta name="twitter:title"',
        '<meta name="twitter:description"',
        '<meta name="twitter:image"',
        '<script type="application/ld+json"',
        'schema.org',
        'WebSite'
    ]

    for el in seo_elements:
        assert el in html_content, f"Thiếu thẻ SEO trong index.html: {el}"
    print("1. index.html chứa đầy đủ thẻ Meta SEO, Open Graph, Twitter Cards & JSON-LD: OK")

    # 2. Kiểm tra hàm slugify bằng Node.js
    node_test_code = """
    import { slugify, findIssueBySlug, findCategoryBySlug } from './src/utils/slugify.js';
    
    // Kiểm tra slugify tiếng Việt
    const s1 = slugify('Số 1 - Tháng 9/2026');
    if (s1 !== 'so-1-thang-9-2026') throw new Error('Slug 1 sai: ' + s1);

    const s2 = slugify('Vẻ đẹp Toán học');
    if (s2 !== 've-dep-toan-hoc') throw new Error('Slug 2 sai: ' + s2);

    const s3 = slugify('Trần Nam Dũng (TP. Hồ Chí Minh)');
    if (s3 !== 'tran-nam-dung-tp-ho-chi-minh') throw new Error('Slug 3 sai: ' + s3);

    // Kiểm tra tra cứu 2 chiều
    const issues = [{ id: 'iss-1', name: 'Số 1 - Tháng 9/2026', issueNumber: '1' }];
    const found = findIssueBySlug(issues, 'so-1-thang-9-2026');
    if (!found || found.id !== 'iss-1') throw new Error('findIssueBySlug sai');

    console.log('Slugify & Lookup Test Passed!');
    """
    node_result = subprocess.run(
        ["node", "--input-type=module", "-e", node_test_code],
        cwd=root_dir,
        capture_output=True,
        text=True
    )
    assert node_result.returncode == 0, f"Node test slugify thất bại: {node_result.stderr or node_result.stdout}"
    print("2. Tiện ích slugify tiếng Việt và tra cứu 2 chiều: OK")

    # 3. Kiểm tra SEOHead component
    seo_head_path = os.path.join(root_dir, "src/components/common/SEOHead.jsx")
    with open(seo_head_path, "r", encoding="utf-8") as f:
        seo_head_code = f.read()

    assert "document.title" in seo_head_code
    assert "schema-json-ld" in seo_head_code
    assert "og:title" in seo_head_code
    assert "canonical" in seo_head_code
    print("3. SEOHead component cập nhật động Title, Open Graph và Schema: OK")

    # 4. Kiểm tra nút chia sẻ liên kết trong ProblemCard
    problem_card_path = os.path.join(root_dir, "src/components/feed/ProblemCard.jsx")
    with open(problem_card_path, "r", encoding="utf-8") as f:
        pc_code = f.read()

    assert "handleCopyLink" in pc_code
    assert "/bai-toan/" in pc_code
    assert "Chia sẻ" in pc_code
    assert "isHighlighted" in pc_code
    print("4. ProblemCard hỗ trợ sao chép liên kết thân thiện và hiệu ứng highlight: OK")

    # 5. Kiểm tra routing và SEO trong App.jsx
    app_path = os.path.join(root_dir, "src/App.jsx")
    with open(app_path, "r", encoding="utf-8") as f:
        app_code = f.read()

    assert "useNavigate" in app_code and "useLocation" in app_code
    assert "SEOHead" in app_code
    assert "/bai-toan/" in app_code
    assert "/so/" in app_code
    assert "/chuyen-muc/" in app_code
    assert "LearningResource" in app_code
    print("5. App.jsx đồng bộ hoàn chỉnh Friendly URLs và SEO Schema: OK")

    # 6. Kiểm tra Vite build hoàn chỉnh
    print("6. Kiểm tra lại Vite production build...")
    build_result = subprocess.run(["npm.cmd", "run", "build"], cwd=root_dir, capture_output=True, text=True)
    assert build_result.returncode == 0, f"Vite build thất bại: {build_result.stderr or build_result.stdout}"
    print("6. Vite build thành công 100%! OK")

    print("\n=== TOÀN BỘ KIỂM THỬ SEO & FRIENDLY URLS THÀNH CÔNG RỰC RỠ! ===")

if __name__ == "__main__":
    test_seo_and_friendly_urls()
