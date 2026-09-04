# Kiến Trúc Hệ Thống & Quản Lý Dữ Liệu

Tài liệu này mô tả chi tiết kiến trúc kỹ thuật của dự án **Pimaga**, bao gồm tổ chức mã nguồn, luồng dữ liệu, hệ thống State Management và cấu hình phân quyền Firebase.

---

## 1. Công Nghệ Sử Dụng (Tech Stack)

- **Frontend Core**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (Hỗ trợ định tuyến URL thân thiện SEO cho đề thi và bộ lọc)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) + Custom Typography (`Playfair Display`, `Newsreader`, `JetBrains Mono`)
- **Hiển thị Toán học**: [KaTeX v0.16](https://katex.org/) (Render nhanh gấp 10-100 lần MathJax)
- **Backend & Cơ sở dữ liệu**: [Google Firebase v11](https://firebase.google.com/) (Authentication + Cloud Firestore)
- **Kiểm thử tự động**: [Vitest](https://vitest.dev/)

---

## 2. Cấu Trúc Thư Mục Mã Nguồn

```
Pimaga/
├── .github/workflows/      # Cấu hình CI/CD GitHub Actions
│   └── ci.yml
├── docs/                   # Tài liệu dự án & GitHub Wiki
│   ├── Home.md
│   ├── Huong-Dan-Latex.md
│   ├── Kien-Truc-He-Thong.md
│   └── Huong-Dan-Cai-Dat-Va-Deploy.md
├── public/                 # Tài nguyên tĩnh (Logo Pi, icons, font assets)
├── src/
│   ├── __tests__/          # Bộ Unit Tests (Vitest)
│   ├── components/
│   │   ├── auth/           # LoginGate (Màn hình cổng đăng nhập)
│   │   ├── common/         # Header, CustomDropdown, MathRenderer, SEOHead
│   │   ├── detail/         # ProblemDetailPage (Khu vực làm bài trực tiếp)
│   │   ├── feed/           # FilterBar, ProblemList, ProblemCard, Footer
│   │   └── modals/         # SolutionModal, ProblemModal, LatexCheatsheetModal,...
│   ├── config/             # Cấu hình Firebase
│   ├── constants/          # Độ khó, Tỉnh thành (34 tỉnh thành), Danh mục LaTeX
│   ├── context/            # Global State Contexts
│   │   ├── AuthContext.jsx
│   │   ├── DataContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── ToastContext.jsx
│   ├── utils/              # slugify.js, cache.js
│   ├── App.jsx             # Root layout, router listener, filter sync
│   ├── index.css           # Cấu hình Dark Mode, scrollbar & KaTeX styles
│   └── main.jsx            # Điểm khởi tạo ứng dụng
└── vite.config.js          # Cấu hình Vite & SPA 404 Fallback Plugin
```

---

## 3. Hệ Thống Quản Lý Trạng Thái (Context Architecture)

Pimaga sử dụng kiến trúc Context phân tầng rõ ràng:

1. **`ThemeContext`**:
   - Quản lý trạng thái theme (`light` / `dark`).
   - Lắng nghe và ưu tiên `localStorage` (`pimaga_theme`) hoặc cấu hình hệ điều hành `prefers-color-scheme`.
   - Tự động gán/hủy class `.dark` tại thẻ gốc `<html>`.

2. **`AuthContext`**:
   - Lắng nghe sự kiện đăng nhập/đăng xuất Google từ Firebase Auth (`onAuthStateChanged`).
   - Cung cấp biến `isRealUser` và `currentUser` để khóa các tính năng khi người dùng chưa đăng nhập.

3. **`DataContext`**:
   - Quản lý toàn bộ vòng đời dữ liệu bài toán (`problems`), số phát hành (`issues`), chuyên mục (`categories`).
   - Đồng bộ thời gian thực 2 chiều với Firestore (`onSnapshot`).
   - Sử dụng bộ đệm máy trạm [src/utils/cache.js](file:///c:/Users/nhpk1/Documents/Code/Pimaga/src/utils/cache.js) để tải tức thì khi mở app.
   - Quản lý `userSolutionsMap` lưu bài giải của chính người dùng đăng nhập.

4. **`ToastContext`**:
   - Điều khiển hệ thống thông báo góc màn hình nổi mượt mà, tự biến mất sau 4 giây.

---

## 4. Quy Tắc Phân Quyền Firestore (Security Rules)

Cấu trúc phân vùng dữ liệu an toàn trên Google Cloud Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. Phân quyền cho vùng dữ liệu chung (Public Đề bài)
    match /artifacts/{appId}/public/data/{collection}/{document} {
      allow read: if true;                     // Khách vãng lai & user đều đọc được đề bài
      allow write: if request.auth != null;    // Bắt buộc đăng nhập mới được thêm/sửa/xóa đề
    }

    // 2. Phân quyền cho vùng dữ liệu cá nhân (Users Lời giải)
    match /artifacts/{appId}/users/{userId}/{document=**} {
      // Chỉ user có uid khớp mới được đọc và ghi bài giải của chính họ
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
