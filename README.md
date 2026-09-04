# Pimaga — Tạp Chí Pi: Kho Đề Toán & Lời Giải Tòa Soạn

[![CI Workflow](https://github.com/KhangNguyen-1412/Pimaga/actions/workflows/ci.yml/badge.svg)](https://github.com/KhangNguyen-1412/Pimaga/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-729B1B.svg?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Nền tảng trực tuyến lưu trữ, quản lý và trình bày đề toán cùng lời giải tòa soạn dành cho **Tạp chí Pi** (Hội Toán học Việt Nam). Ứng dụng mang phong cách tạp chí cổ điển kết hợp công nghệ web hiện đại.

---

## 🌟 Tính Năng Nổi Bật

- **Giao diện Tạp chí Cổ điển**: Phối màu 2 tone chủ đạo Cerulean Blue (`#2A52BE`) và Jasper Red (`#D73B3E`) trên nền giấy ngà hoài niệm (`#FCFBF7`), phông chữ học thuật **Newsreader** & **Playfair Display**.
- **Hiển thị Toán học Chuẩn KaTeX**: Hỗ trợ gõ và render công thức toán học nhanh, đẹp mắt với thanh công cụ ký hiệu toán học trực quan.
- **Hệ thống Phân loại Đầy đủ**:
  - 5 cấp độ khó từ Dễ đến Olympic.
  - Phân loại theo số phát hành và chuyên mục.
  - 34 tỉnh / thành phố sau sáp nhập.
- **SEO & Friendly URLs**: Định tuyến URL thân thiện (`/bai-toan/p1`, `/so-1-thang-9-2026`, `/chuyen-muc/ve-dep-toan-hoc`).
- **Xác thực An toàn**: Cổng bảo vệ Login Gate với Firebase Authentication & Firestore Security Rules.
- **CI/CD Tự Động Hóa với GitHub Actions**: Tự động chạy Unit Test và kiểm tra Build mỗi khi có commit hoặc Pull Request.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, React Router v7, Tailwind CSS v3
- **Toán học & Soạn thảo**: KaTeX 0.16
- **Backend & Lưu trữ**: Firebase Authentication & Cloud Firestore
- **Build Tool**: Vite 6
- **Kiểm thử (Unit Testing)**: Vitest
- **Tự động hóa (CI/CD)**: GitHub Actions

---

## 🚀 Khởi Chạy Dự Án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Truy cập: [http://localhost:5173](http://localhost:5173)

### 3. Chạy kiểm thử tự động (Unit Test)
```bash
npm test
```

### 4. Đóng gói bản Production (Build)
```bash
npm run build
```

---

## 🔄 Quy Trình CI/CD trên GitHub Actions

Dự án tuân thủ quy trình CI chuyên nghiệp theo 5 bước:

1. **Viết mã nguồn & Unit Test**: Code tính năng và test song song tại thư mục `src/__tests__/`.
2. **Cấu hình CI (`.github/workflows/ci.yml`)**: Tự động tải code (`actions/checkout`), thiết lập Node.js 20 (`actions/setup-node`), cài đặt thư viện (`npm install`), chạy kiểm thử (`npm test`) và kiểm tra build (`npm run build`).
3. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git add .
   git commit -m "feat: integrate unit testing and GitHub Actions CI workflow"
   git push origin main
   ```
4. **GitHub Actions Tự Động Kích Hoạt**: Server ảo Ubuntu thực thi toàn bộ pipeline.
5. **Nhận kết quả Tích Xanh (Passed)**: Badge trạng thái tự động cập nhật màu xanh trên README.
