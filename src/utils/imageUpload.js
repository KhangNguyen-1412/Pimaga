import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Nén và thu nhỏ ảnh (đặc biệt phù hợp cho ảnh chụp màn hình GeoGebra, hình vẽ)
 * Giúp tối ưu dung lượng và tốc độ tải trang
 */
export async function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) {
  // Nếu là file SVG thì giữ nguyên định dạng vector
  if (file.type === 'image/svg+xml') {
    return file;
  }

  // Nếu file đã rất nhỏ (< 80KB) thì không cần nén thêm
  if (file.size < 80 * 1024 && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Giới hạn kích thước tối đa mà vẫn giữ đúng tỷ lệ hình
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Nền trắng cho ảnh trong suốt nếu chuyển sang JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Ưu tiên WebP, nếu trình duyệt không hỗ trợ thì dùng JPEG
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' }));
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Chuyển đổi File/Blob sang Base64 data URL
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Tải ảnh hình vẽ lên Firebase Storage (với fallback Base64 nếu Storage chưa cấu hình rules)
 */
export async function uploadDiagramImage(file) {
  try {
    const compressed = await compressImage(file);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = compressed.type === 'image/webp' ? 'webp' : (compressed.name.split('.').pop() || 'png');
    const storagePath = `diagrams/${timestamp}_${randomSuffix}.${extension}`;

    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, compressed, {
      contentType: compressed.type || 'image/png',
      cacheControl: 'public, max-age=31536000',
    });

    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL, isFallback: false };
  } catch (error) {
    console.warn('Firebase Storage upload error, falling back to base64 data URL:', error);
    try {
      const compressed = await compressImage(file, 1200, 1200, 0.75);
      const base64Url = await fileToBase64(compressed);
      return { success: true, url: base64Url, isFallback: true };
    } catch (fallbackErr) {
      console.error('Fallback image conversion error:', fallbackErr);
      throw new Error('Không thể tải hoặc xử lý hình ảnh này.');
    }
  }
}

/**
 * Chèn cú pháp ảnh Markdown ![alt](url) vào vị trí con trỏ chuột trong textarea
 */
export function insertImageMarkdown(textareaEl, currentText, setText, imageUrl, altText = 'Hình vẽ minh họa') {
  const snippet = `\n\n![${altText}](${imageUrl})\n\n`;

  if (!textareaEl) {
    setText((prev) => (prev ? `${prev}${snippet}` : snippet.trim()));
    return;
  }

  const start = textareaEl.selectionStart ?? currentText.length;
  const end = textareaEl.selectionEnd ?? currentText.length;
  const nextText = currentText.substring(0, start) + snippet + currentText.substring(end);
  setText(nextText);

  setTimeout(() => {
    textareaEl.focus();
    const cursor = start + snippet.length;
    textareaEl.setSelectionRange(cursor, cursor);
  }, 50);
}

/**
 * Trích xuất file ảnh từ sự kiện Paste Clipboard (Ctrl + V)
 */
export function extractImageFromClipboard(e) {
  if (!e.clipboardData || !e.clipboardData.items) return null;
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      return items[i].getAsFile();
    }
  }
  return null;
}
