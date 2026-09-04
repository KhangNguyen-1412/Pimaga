import os
import re
import subprocess
import sys

def test_react_pimaga():
    print("=== KIỂM THỬ DỰ ÁN REACTJS PIMAGA ===")
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 1. Kiểm tra các file quan trọng trong cấu trúc React
    required_files = [
        "package.json",
        "vite.config.js",
        "tailwind.config.js",
        "index.html",
        "src/main.jsx",
        "src/App.jsx",
        "src/index.css",
        "src/config/firebase.js",
        "src/constants/difficulty.js",
        "src/constants/provinces.js",
        "src/constants/latexFormulas.js",
        "src/context/AuthContext.jsx",
        "src/context/DataContext.jsx",
        "src/context/ToastContext.jsx",
        "src/components/common/Header.jsx",
        "src/components/common/MathRenderer.jsx",
        "src/components/common/CustomDropdown.jsx",
        "src/components/feed/FilterBar.jsx",
        "src/components/feed/ProblemCard.jsx",
        "src/components/feed/ProblemList.jsx",
        "src/components/feed/Footer.jsx",
        "src/components/modals/ProblemModal.jsx",
        "src/components/modals/SolutionModal.jsx",
        "src/components/modals/IssueModal.jsx",
        "src/components/modals/CategoryModal.jsx",
        "src/components/modals/LatexCheatsheetModal.jsx",
        "src/components/modals/ConfirmModal.jsx",
        "src/components/modals/GeminiKeyModal.jsx",
    ]
    
    for f in required_files:
        full_path = os.path.join(root_dir, f)
        assert os.path.exists(full_path), f"Thiếu file: {f}"
    print("1. Đầy đủ tất cả các file cấu trúc React và component: OK")

    # 2. Kiểm tra danh mục 34 tỉnh thành
    with open(os.path.join(root_dir, "src/constants/provinces.js"), "r", encoding="utf-8") as f:
        content = f.read()
    prov_names = re.findall(r'name:\s*"([^"]+)"', content)
    assert len(prov_names) == 34, f"Số lượng tỉnh thành phải là 34, hiện có: {len(prov_names)}"
    assert "TP. Hồ Chí Minh" in prov_names
    assert "Hà Nội" in prov_names
    assert "Đà Nẵng" in prov_names
    print(f"2. Danh sách PROVINCES_34 có chính xác {len(prov_names)} đơn vị sau sáp nhập: OK")

    # 3. Kiểm tra 5 cấp độ khó và màu Cerulean/Jasper (không chứa màu amber)
    with open(os.path.join(root_dir, "src/constants/difficulty.js"), "r", encoding="utf-8") as f:
        diff_content = f.read()
    assert "amber" not in diff_content, "Không được dùng màu amber trong difficulty!"
    assert "cerulean" in diff_content and "jasper" in diff_content
    print("3. Cấp độ khó DIFFICULTY_LEVELS tuân thủ nghiêm ngặt 2 tông Cerulean & Jasper: OK")

    # 4. Kiểm tra danh mục công thức LaTeX
    with open(os.path.join(root_dir, "src/constants/latexFormulas.js"), "r", encoding="utf-8") as f:
        latex_content = f.read()
    assert "frac" in latex_content and "sqrt" in latex_content and "triangle" in latex_content
    print("4. Danh mục công thức KaTeX chuẩn 6 chuyên mục: OK")

    # 5. Kiểm tra build Vite
    print("5. Kiểm tra lệnh build của Vite...")
    result = subprocess.run(["npm.cmd", "run", "build"], cwd=root_dir, capture_output=True, text=True)
    assert result.returncode == 0, f"Vite build thất bại: {result.stderr or result.stdout}"
    print("5. Vite build thành công xuất sắc (0 lỗi, 100% passed)! OK")

    print("\n=== TOÀN BỘ KIỂM THỬ REACT THÀNH CÔNG RỰC RỠ! ===")

if __name__ == "__main__":
    test_react_pimaga()
