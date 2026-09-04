import { useEffect } from 'react';

export default function SEOHead({
  title = 'Tạp Chí Pi - Kho Đề Toán & Bài Giải Chuyên Đề',
  description = 'Diễn đàn và kho đề thi học sinh giỏi, toán Olympic, bài tập toán chọn lọc kèm lời giải chi tiết từ Tạp chí Pi. Hỗ trợ soạn thảo và hiển thị công thức KaTeX.',
  keywords = 'tạp chí pi, đề thi toán, giải toán, lời giải toán, toán học tuổi trẻ, olympic toán, học sinh giỏi toán, katex',
  ogImage = '/assets/pimaga-logo.svg',
  canonicalPath = '/',
  structuredData = null,
}) {
  useEffect(() => {
    // 1. Cập nhật Title
    document.title = title;

    // Helper cập nhật hoặc tạo thẻ meta
    const setMetaTag = (attrName, attrVal, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Cập nhật Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 3. Cập nhật Open Graph (Facebook, Zalo)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Tạp Chí Pi');
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${canonicalPath}`;
      setMetaTag('property', 'og:url', fullUrl);

      // Canonical link
      let linkEl = document.querySelector('link[rel="canonical"]');
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'canonical');
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute('href', fullUrl);
    }

    // 4. Cập nhật Twitter Card
    setMetaTag('name', 'twitter:card', 'summary');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Cập nhật Structured Data (JSON-LD)
    if (structuredData) {
      let scriptEl = document.getElementById('schema-json-ld');
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'schema-json-ld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogImage, canonicalPath, structuredData]);

  return null;
}
