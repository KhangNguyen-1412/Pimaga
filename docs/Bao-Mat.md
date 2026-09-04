# Chính Sách & Kiến Trúc Bảo Mật (Security Policy)

Hệ thống **Pimaga** (Pi Magazine Archive & Solver) áp dụng mô hình bảo mật nhiều lớp nhằm bảo vệ tối đa dữ liệu của người dùng và tính toàn vẹn của kho đề toán học thuật.

---

## 1. Các Phiên Bản Được Hỗ Trợ (Supported Versions)

| Phiên Bản | Trạng Thái Hỗ Trợ |
| :--- | :--- |
| **2.x (Hiện tại)** | :white_check_mark: Được hỗ trợ đầy đủ |
| 1.x (Legacy) | :x: Không còn hỗ trợ |

---

## 2. Các Lớp Bảo Mật Trong Pimaga

### A. Xác thực người dùng (Google OAuth 2.0)
- Sử dụng dịch vụ **Firebase Authentication**.
- Mọi phiên đăng nhập đều được mã hóa và xác thực qua Google Token, không lưu trữ thông tin mật khẩu nhạy cảm trên máy chủ trung gian.

### B. Quy tắc bảo mật Firestore (Server-Side Rules)
Hệ thống phân tách ranh giới rõ ràng giữa dữ liệu dùng chung và dữ liệu cá nhân:
```javascript
// 1. Vùng dữ liệu công cộng: Đề bài, chuyên mục, số phát hành
match /artifacts/{appId}/public/data/{collection}/{document} {
  allow read: if true;
  allow write: if request.auth != null;
}

// 2. Vùng dữ liệu cá nhân: Bài giải của người dùng
match /artifacts/{appId}/users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```
*Đảm bảo 100% không một người dùng nào có thể đọc hoặc sửa bài giải của người khác.*

### C. An toàn hiển thị công thức toán học (Anti-XSS)
- Bộ phân tích cú pháp và hiển thị **KaTeX** hoạt động ở chế độ nghiêm ngặt, ngăn chặn chèn các thẻ script hoặc mã HTML nguy hiểm thông qua nội dung đề bài hoặc bài giải.

### D. Bảo vệ API Key & Khóa Dịch Vụ
- Khóa Gemini API Key được người dùng tự cấu hình sẽ chỉ được lưu trữ cục bộ trong trình duyệt (`localStorage`) của thiết bị đó, không bao giờ gửi về máy chủ bên thứ ba.

---

## 3. Quy Trình Báo Cáo Lỗ Hổng Bảo Mật

Nếu bạn phát hiện bất kỳ vấn đề bảo mật nào, vui lòng thực hiện theo các bước:

1. **Không mở Issue công khai** trên GitHub.
2. Gửi báo cáo thông qua kênh bảo mật riêng tư: **[GitHub Security Advisories](https://github.com/KhangNguyen-1412/Pimaga/security/advisories/new)** hoặc gửi email trực tiếp tới quản trị viên dự án: `nhpk1412@gmail.com`.
3. Đội ngũ phát triển sẽ phản hồi trong vòng **24 - 48 giờ** và nhanh chóng phát hành bản vá bảo mật.
