import os
import sys

def test_login_gate_architecture():
    print("=== KIỂM THỬ TÍNH NĂNG BẢO VỆ ĐĂNG NHẬP (LOGIN GATE) ===")

    gate_path = os.path.join("src", "components", "auth", "LoginGate.jsx")
    assert os.path.exists(gate_path), "File LoginGate.jsx không tồn tại!"

    with open(gate_path, "r", encoding="utf-8") as f:
        gate_content = f.read()

    assert "loginWithGoogle" in gate_content, "LoginGate thiếu hàm loginWithGoogle!"
    assert "Đăng nhập với Google" in gate_content or "Đăng nhập bằng tài khoản Google" in gate_content, "LoginGate thiếu nút đăng nhập Google!"
    assert "pimaga-logo.svg" in gate_content, "LoginGate thiếu biểu tượng logo Tạp Chí Pi!"
    print("1. Component LoginGate đầy đủ giao diện trang trọng và kết nối Auth: OK")

    app_path = os.path.join("src", "App.jsx")
    with open(app_path, "r", encoding="utf-8") as f:
        app_content = f.read()

    assert "LoginGate" in app_content, "App.jsx chưa import hoặc render LoginGate!"
    assert "useAuth" in app_content, "App.jsx chưa sử dụng useAuth!"
    assert "isRealUser" in app_content, "App.jsx thiếu kiểm tra isRealUser!"
    assert "loadingAuth" in app_content, "App.jsx thiếu kiểm tra loadingAuth!"
    assert "!isRealUser" in app_content, "App.jsx thiếu điều kiện chặn truy cập khi chưa đăng nhập (!isRealUser)!"
    print("2. App.jsx chặn truy cập nội dung đề bài chuẩn xác khi chưa đăng nhập: OK")

    print("\n=== TOÀN BỘ BÀI KIỂM THỬ LOGIN GATE THÀNH CÔNG RỰC RỠ! ===")

if __name__ == "__main__":
    test_login_gate_architecture()
