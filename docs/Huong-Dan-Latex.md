# Hướng Dẫn Soạn Thảo Toán Học LaTeX Trong Pimaga

Hệ thống **Pimaga** sử dụng thư viện **KaTeX** siêu tốc để hiển thị các công thức toán học sắc nét trên cả giao diện sáng lẫn tối.

---

## 1. Cú Pháp Cơ Bản

### A. Công thức trong dòng (Inline Math)
Dùng một cặp dấu đô la `$...$`. Công thức sẽ nằm cùng dòng với văn bản thông thường.
- **Ví dụ**: `Cho tam giác $ABC$ vuông tại $A$, có đường cao $AH$.`
- **Kết quả**: Cho tam giác $ABC$ vuông tại $A$, có đường cao $AH$.

### B. Công thức hiển thị khối (Display / Block Math)
Dùng hai cặp dấu đô la `$$...$$`. Công thức sẽ được đưa ra giữa dòng riêng biệt và phóng to kích thước chuẩn biểu thức toán.
- **Ví dụ**:
  ```latex
  $$\int_{0}^{\pi} \sin(x) \, dx = 2$$
  ```
- **Kết quả**: Biểu thức tích phân sẽ nằm độc lập ở chính giữa trang.

---

## 2. Bảng Tra Cứu Các Công Thức Phổ Biến

### Phân số và Căn thức
| Ký hiệu | Cú pháp LaTeX | Ví dụ kết quả |
| :--- | :--- | :--- |
| Phân số | `\frac{a}{b}` | $\frac{a}{b}$ |
| Căn bậc hai | `\sqrt{x}` | $\sqrt{x}$ |
| Căn bậc $n$ | `\sqrt[n]{x}` | $\sqrt[n]{x}$ |
| Chỉ số trên/dưới | `x^{2}_{k}` | $x^{2}_{k}$ |

### Ký hiệu Hình Học & Vector
| Ký hiệu | Cú pháp LaTeX | Ý nghĩa |
| :--- | :--- | :--- |
| Góc | `\widehat{ABC}` hoặc `\angle ABC` | Góc $\widehat{ABC}$ |
| Vector | `\vec{v}` hoặc `\overrightarrow{AB}` | Vector $\overrightarrow{AB}$ |
| Đoạn thẳng | `AB` | Độ dài đoạn thẳng $AB$ |
| Vuông góc | `\perp` | $d_1 \perp d_2$ |
| Song song | `\parallel` | $d_1 \parallel d_2$ |
| Tam giác | `\triangle ABC` | $\triangle ABC$ |

### Đại Số, Giải Tích & Chuỗi
| Ký hiệu | Cú pháp LaTeX | Ý nghĩa |
| :--- | :--- | :--- |
| Tổng Sigma | `\sum_{i=1}^{n} a_i` | Tổng từ 1 đến $n$ |
| Tích | `\prod_{i=1}^{n} x_i` | Tích từ 1 đến $n$ |
| Tích phân | `\int_{a}^{b} f(x)dx` | Tích phân từ $a$ đến $b$ |
| Giới hạn | `\lim_{x \to 0} \frac{\sin x}{x}` | Giới hạn hàm số |
| Vô cực | `\infty` | $\infty$ |

### Chữ Cái Hy Lạp
| Ký hiệu | Cú pháp | Ký hiệu | Cú pháp |
| :--- | :--- | :--- | :--- |
| $\alpha$ | `\alpha` | $\beta$ | `\beta` |
| $\pi$ | `\pi` | $\theta$ | `\theta` |
| $\Delta$ | `\Delta` | $\Omega$ | `\Omega` |

---

## 3. Ma Trận và Hệ Phương Trình

### Hệ phương trình (Cases):
```latex
$$\begin{cases}
2x + 3y = 7 \\
x - y = 1
\end{cases}$$
```

### Ma trận (Matrix):
```latex
$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}$$
```

---

## 4. Các Mẹo Hữu Ích Khi Làm Bài Trên Pimaga

1. **Dùng nút tra cứu LaTeX nhanh**: Ngay trên thanh công cụ của khung soạn thảo có nút **"Sổ tay LaTeX"** (`/so-tay-latex`). Bạn có thể mở ra và nhấn vào bất kỳ công thức mẫu nào để chèn trực tiếp vào vị trí con trỏ.
2. **Xuống dòng trong bài giải**: Bạn chỉ cần gõ Enter xuống dòng bình thường. Trình hiển thị `MathRenderer` của Pimaga tự động giữ nguyên ngắt dòng và khoảng trắng trực quan.
3. **Phím tắt**: Nhấn tổ hợp phím **`Ctrl + Enter`** (hoặc `Cmd + Enter` trên macOS) để lưu bài giải nhanh chóng mà không cần di chuột bấm nút Lưu.
