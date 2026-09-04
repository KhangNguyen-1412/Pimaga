# Chào Mừng Đến Với Pimaga Wiki

**Pimaga** (Pi Magazine Archive & Solver) là nền tảng số hóa tài liệu đề bài và không gian làm bài giải tương tác dành cho độc giả yêu toán học của **Tạp chí Pi**.

Hệ thống được thiết kế với phong cách học thuật hiện đại, hỗ trợ gõ công thức toán học chuẩn LaTeX, đồng bộ đám mây thời gian thực và tích hợp chế độ ban đêm bảo vệ thị lực.

---

## 📌 Mục Lục Tài Liệu

- [Trang Chủ (Home)](Home)
- [Hướng Dẫn Soạn Thảo Toán Học LaTeX](Huong-Dan-Latex)
- [Kiến Trúc Hệ Thống & Quản Lý Dữ Liệu](Kien-Truc-He-Thong)
- [Hướng Dẫn Cài Đặt, Cấu Hình & Triển Khai](Huong-Dan-Cai-Dat-Va-Deploy)
- [Chính Sách Bảo Mật (Security Policy)](Bao-Mat)

---

## ✨ Các Tính Năng Cốt Lõi Của Pimaga

### 1. Kho Đề Toán Học Học Thuật
- **Phân loại thông minh**: Lọc bài toán linh hoạt theo **Số phát hành**, **Chuyên mục** (Đại số, Hình học, Tổ hợp, Số học,...), và **Cấp độ khó** (1 đến 5 sao theo bảng màu Cerulean & Jasper).
- **URL thân thiện & Tối ưu SEO**: Các liên kết định dạng chuẩn slug tiếng Việt không dấu (ví dụ: `/so/so-1/chuyen-muc/hinh-hoc`, `/bai-toan/p12`).

### 2. Trải Nghiệm Giải Toán Trực Tiếp (Inline Workspace)
- Làm bài ngay trên **Trang chi tiết đề bài**: Khu vực làm bài nằm ngay bên dưới phần đề, đảm bảo **đề bài luôn hiển thị 100% trong tầm mắt**, loại bỏ sự bất tiện của các popup che khuất đề.
- **Thanh công cụ toán học nhanh (Quick Math Toolbar)**: Chèn nhanh ký hiệu phân số, căn, ma trận, vector chỉ bằng một cú nhấp chuột.
- **Xem trước tức thời (Live KaTeX Preview)**: Kiểm tra công thức toán song song khi đang soạn thảo.

### 3. Giao Diện Ban Đêm Học Thuật (Nocturnal Dark Mode)
- Bảng màu tối cao cấp dịu mắt (`#0F141C` & `#161D28`), hạn chế mỏi mắt khi nghiên cứu toán học ban đêm.
- Tự động ghi nhớ tùy chọn qua `localStorage` và đồng bộ theo cài đặt hệ điều hành.

### 4. Đám Mây & Bảo Mật Dữ Liệu Cá Nhân
- **Public Data (Đề bài, chuyên mục, số phát hành)**: Mọi người đều có thể đọc dữ liệu đề bài.
- **Private Data (Bài làm cá nhân)**: Bài giải của mỗi người dùng được lưu trữ an toàn riêng biệt trong Firestore theo tài khoản Google, tự động đồng bộ tức thời giữa các thiết bị.

### 5. Chất Lượng Mã Nguồn & CI/CD
- Tích hợp kiểm thử tự động **Vitest** chạy siêu tốc.
- Pipeline **GitHub Actions** tự động kiểm tra cú pháp, chạy unit test và build production trước mỗi lần phát hành.
