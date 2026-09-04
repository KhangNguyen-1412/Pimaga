# Hướng Dẫn Cài Đặt, Cấu Hình & Triển Khai

Tài liệu này hướng dẫn chi tiết cách thiết lập môi trường phát triển cục bộ, cấu hình Firebase và triển khai ứng dụng **Pimaga** lên các dịch vụ máy chủ tĩnh (GitHub Pages / Vercel).

---

## 1. Yêu Cầu Hệ Thống

- **Node.js**: Phiên bản 18.0 trở lên (khuyến nghị Node.js 20 LTS).
- **npm** (đi kèm Node.js) hoặc **pnpm** / **yarn**.
- **Tài khoản Firebase**: Đã kích hoạt dịch vụ Authentication (Google Sign-In) và Firestore Database.

---

## 2. Cài Đặt Môi Trường Cục Bộ (Local Setup)

1. **Clone repository**:
   ```bash
   git clone https://github.com/KhangNguyen-1412/Pimaga.git
   cd Pimaga
   ```

2. **Cài đặt các gói thư viện**:
   ```bash
   npm install
   ```

3. **Cấu hình Firebase**:
   - Mở tệp `src/config/firebase.js`.
   - Điền thông tin cấu hình `firebaseConfig` lấy từ trang quản trị Firebase Console của bạn.

4. **Khởi chạy máy chủ phát triển**:
   ```bash
   npm run dev
   ```
   Trình duyệt sẽ tự động mở tại địa chỉ `http://localhost:5173`.

---

## 3. Chạy Kiểm Thử Tự Động (Unit Testing)

Pimaga sử dụng Vitest để kiểm thử toàn diện:
```bash
# Chạy toàn bộ các bài test
npm test

# Chạy test ở chế độ theo dõi (Watch mode)
npx vitest
```

Các bộ kiểm thử bao gồm:
- Xử lý slug tiếng Việt có dấu (`slugify.test.js`)
- Bảng màu mức độ khó và danh sách tỉnh thành (`difficulty.test.js`)
- Cấu trúc dữ liệu bài làm (`solution_workspace.test.js`)
- Cơ chế lưu trữ và chuyển đổi giao diện Dark Mode (`theme.test.js`)

---

## 4. Đóng Gói Sản Phẩm (Build Production)

Chạy lệnh:
```bash
npm run build
```

Kết quả đóng gói sẽ nằm trong thư mục `dist/`.

### 💡 Giải Pháp Tránh Lỗi 404 Khi Tải Lại Trang Trên SPA (Single Page Application):
Khi triển khai trên GitHub Pages hoặc các web server tĩnh không có cơ chế rewrite URL máy chủ, việc người dùng truy cập trực tiếp vào các đường dẫn sâu như `/so/so-1` hoặc `/bai-toan/p12` sẽ bị lỗi 404.

Pimaga đã được tích hợp sẵn plugin `spaFallbackPlugin` trong `vite.config.js`:
- Khi chạy `npm run build`, hệ thống sẽ tự động nhân bản tệp `dist/index.html` thành `dist/404.html`.
- Nhờ đó, GitHub Pages sẽ dùng `404.html` điều hướng mượt mà mọi route về ứng dụng React mà không làm mất liên kết của người dùng.

---

## 5. Tự Động Hóa CI/CD Với GitHub Actions

Mọi commit được đẩy lên nhánh `main` hoặc `master` sẽ tự động kích hoạt workflow `.github/workflows/ci.yml`:
1. Tự động khởi tạo máy ảo Ubuntu.
2. Cài đặt Node.js 20 và dependencies.
3. Chạy toàn bộ bộ test `npm test`.
4. Đóng gói kiểm tra tính toàn vẹn với `npm run build`.
