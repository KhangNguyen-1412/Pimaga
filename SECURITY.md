# Chính Sách Bảo Mật (Security Policy)

Dự án **Pimaga** (Pi Magazine Archive & Solver) cam kết bảo vệ an toàn thông tin người dùng, tính toàn vẹn của dữ liệu bài toán và sự riêng tư của các bài giải cá nhân.

---

## 1. Các Phiên Bản Được Hỗ Trợ (Supported Versions)

Chúng tôi chỉ cung cấp các bản vá và cập nhật bảo mật cho các phiên bản đang được duy trì tích cực:

| Phiên Bản | Trạng Thái Hỗ Trợ |
| :--- | :--- |
| **2.x (Hiện tại)** | :white_check_mark: Được hỗ trợ đầy đủ |
| 1.x (Legacy) | :x: Không còn hỗ trợ |

---

## 2. Kiến Trúc & Biện Pháp Bảo Mật Đang Áp Dụng

Hệ thống Pimaga được xây dựng dựa trên các tiêu chuẩn bảo mật đa lớp:

### A. Xác thực người dùng (Authentication)
- Sử dụng **Firebase Authentication** kết hợp với giao thức **Google OAuth 2.0**.
- Hệ thống không lưu trữ trực tiếp mật khẩu người dùng, loại bỏ nguy cơ rò rỉ thông tin đăng nhập.

### B. Phân quyền dữ liệu máy chủ (Firestore Security Rules)
- Mọi truy vấn đọc/ghi đều được thẩm định nghiêm ngặt tại tầng máy chủ Google Cloud Firestore:
  - **Dữ liệu công cộng (Public Problems/Issues/Categories)**: Chỉ cho phép chỉnh sửa khi đã xác thực tài khoản.
  - **Dữ liệu cá nhân (User Solutions)**: Áp dụng quy tắc `request.auth.uid == userId`, đảm bảo **chỉ chủ tài khoản** mới có quyền đọc, sửa hoặc xóa bài giải của chính mình.

### C. Phòng chống XSS (Cross-Site Scripting)
- Công thức toán học được xử lý và hiển thị thông qua thư viện **KaTeX** với các tùy chọn an toàn, vô hiệu hóa việc thực thi mã HTML/JavaScript độc hại nhúng trong đề bài hoặc lời giải.

### D. Quản lý Khóa API (API Key Hygiene)
- Các khóa dịch vụ bổ sung (như Google Gemini AI Key) được lưu trữ độc quyền trên `localStorage` máy khách hoặc quản lý qua biến môi trường (`.env`), tuyệt đối không được đưa trực tiếp vào kho mã nguồn công khai.

---

## 3. Quy Trình Báo Cáo Lỗ Hổng (Reporting a Vulnerability)

Nếu bạn phát hiện bất kỳ vấn đề hoặc lỗ hổng bảo mật nào trong Pimaga:

1. **Vui lòng KHÔNG công khai lỗ hổng** qua GitHub Issues hoặc các kênh thảo luận công cộng.
2. Hãy báo cáo bảo mật bảo mật riêng tư thông qua tính năng **[GitHub Private Vulnerability Reporting](https://github.com/KhangNguyen-1412/Pimaga/security/advisories/new)** của repository.
3. Hoặc liên hệ trực tiếp với người duy trì dự án qua email: **`nhpk1412@gmail.com`** (hoặc liên hệ qua tài khoản GitHub [@KhangNguyen-1412](https://github.com/KhangNguyen-1412)).

### Khi báo cáo, vui lòng cung cấp:
- Mô tả chi tiết về lỗ hổng và mức độ ảnh hưởng (Proof of Concept).
- Các bước tái hiện lỗi (Step-by-step reproduction).
- Môi trường thử nghiệm (Trình duyệt, hệ điều hành).

---

## 4. Cam Kết Xử Lý

- **Xác nhận tiếp nhận**: Trong vòng **24 - 48 giờ** kể từ khi nhận được báo cáo.
- **Đánh giá & Khắc phục**: Bản vá (hotfix) sẽ được triển khai trong thời gian sớm nhất tùy thuộc vào mức độ nghiêm trọng của lỗ hổng.
- **Ghi nhận đóng góp**: Chúng tôi trân trọng và sẽ ghi danh những người đóng góp phát hiện lỗi bảo mật có trách nhiệm trong phần ghi nhận của dự án.
