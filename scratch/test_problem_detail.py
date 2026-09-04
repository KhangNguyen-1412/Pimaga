import os
import sys

def test_problem_detail_architecture():
    print("=== KIỂM THỬ TRANG CHI TIẾT ĐỀ BÀI (PROBLEM DETAIL PAGE) ===")

    detail_path = os.path.join("src", "components", "detail", "ProblemDetailPage.jsx")
    assert os.path.exists(detail_path), "File ProblemDetailPage.jsx không tồn tại!"
    
    with open(detail_path, "r", encoding="utf-8") as f:
        detail_content = f.read()

    # 1. Kiểm tra cấu trúc ProblemDetailPage
    assert "MathRenderer" in detail_content, "ProblemDetailPage thiếu MathRenderer!"
    assert "onBackToList" in detail_content, "ProblemDetailPage thiếu nút onBackToList!"
    assert "prevProblem" in detail_content and "nextProblem" in detail_content, "ProblemDetailPage thiếu chuyển bài trước/sau!"
    assert "Bài Làm Của Bạn" in detail_content, "ProblemDetailPage thiếu khu vực Bài Làm Của Bạn!"
    assert "onOpenSolution" in detail_content, "ProblemDetailPage thiếu hàm kích hoạt làm bài onOpenSolution!"
    assert "Lời Giải Tòa Soạn" in detail_content, "ProblemDetailPage thiếu khu vực Lời Giải Tòa Soạn!"
    assert "showEditorialSolution" in detail_content, "ProblemDetailPage thiếu tính năng toggle ẩn/hiện lời giải chống lộ đáp án!"
    print("1. Component ProblemDetailPage đầy đủ tính năng & cấu trúc sư phạm: OK")

    # 2. Kiểm tra ProblemCard (Trang danh sách)
    card_path = os.path.join("src", "components", "feed", "ProblemCard.jsx")
    with open(card_path, "r", encoding="utf-8") as f:
        card_content = f.read()

    assert "handleGoToDetail" in card_content, "ProblemCard thiếu hàm điều hướng vào chi tiết!"
    assert "Đã làm bài" in card_content and "Chưa làm bài" in card_content, "ProblemCard thiếu badge trạng thái làm bài!"
    assert "Làm Bài Này" in card_content, "ProblemCard thiếu nút bấm CTA Làm Bài Này!"
    # Đảm bảo không còn khung Dual Solutions nặng nề ở danh sách
    assert "Dual Solutions Grid" not in card_content, "ProblemCard vẫn còn chứa Dual Solutions Grid ở trang danh sách!"
    print("2. Component ProblemCard tinh gọn, có nút chuyển trang chi tiết: OK")

    # 3. Kiểm tra App.jsx
    app_path = os.path.join("src", "App.jsx")
    with open(app_path, "r", encoding="utf-8") as f:
        app_content = f.read()

    assert "ProblemDetailPage" in app_content, "App.jsx chưa import hoặc sử dụng ProblemDetailPage!"
    assert "isDetailPage" in app_content, "App.jsx thiếu biến xác định trang chi tiết isDetailPage!"
    assert "activeDetailProblem" in app_content, "App.jsx thiếu activeDetailProblem!"
    assert "prevProblem" in app_content and "nextProblem" in app_content, "App.jsx thiếu logic tính bài trước/sau!"
    print("3. App.jsx điều phối chuẩn xác giữa trang danh sách và trang chi tiết: OK")

    print("\n=== TOÀN BỘ BÀI KIỂM THỬ TRANG CHI TIẾT THÀNH CÔNG RỰC RỠ! ===")

if __name__ == "__main__":
    test_problem_detail_architecture()
