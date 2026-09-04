import { describe, it, expect } from 'vitest';

const sample = `Số lượng số kỳ lạ là **vô hạn**.

Để chứng minh, ta sẽ chỉ ra rằng mọi số có dạng $N = m^3$ (với $m$ là số nguyên tố thỏa mãn $m \\equiv 2 \\pmod 3$) đều là số kỳ lạ. Vì theo định lý Dirichlet, có vô số số nguyên tố dạng $3k + 2$, nên tập hợp các số kỳ lạ chắc chắn là vô hạn.

**Bước 1: Giả sử tồn tại nghịch lý**
Giả sử ngược lại, tồn tại một số nguyên tố $m \\equiv 2 \\pmod 3$ sao cho $N = m^3$ *không* phải là số kỳ lạ. Theo định nghĩa, sẽ tồn tại các số nguyên $a > 1$ và $b > 1$ thỏa mãn:
$$a^3 + b^3 = c^3$$
Bold with math: **Đẳng thức $x + y = z$ luôn đúng**`;

describe('MathRenderer parser', () => {
  it('correctly parses tokens', () => {
    // Math regex: display mode $$...$$ or inline $...$
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$(?!\$)[^$\n]+?\$)/g;
    const INLINE_TOKEN_REGEX = /(\*\*\*[^*\n]+?\*\*\*|\*\*[^*\n]+?\*\*|(?<!\*)\*(?!\s)[^*\n]+?(?<!\s)\*(?!\*)|`[^`\n]+?`|~~[^~\n]+?~~)/g;

    const mathStore = [];
    const textWithPlaceholders = sample.replace(mathRegex, (match) => {
      const idx = mathStore.length;
      mathStore.push({
        display: match.startsWith('$$'),
        tex: match.startsWith('$$') ? match.slice(2, -2).trim() : match.slice(1, -1).trim(),
        raw: match
      });
      return `\uE000MATH_${idx}\uE001`;
    });

    expect(mathStore.length).toBe(10);
    expect(textWithPlaceholders).toContain('\uE000MATH_0\uE001');

    const lines = textWithPlaceholders.split('\n');
    expect(lines[0]).toBe('Số lượng số kỳ lạ là **vô hạn**.');

    // Check bold with math line:
    const boldWithMathLine = lines[lines.length - 1];
    expect(boldWithMathLine).toContain('**Đẳng thức \uE000MATH_9\uE001 luôn đúng**');

    const tokens = boldWithMathLine.split(INLINE_TOKEN_REGEX);
    expect(tokens).toContain('**Đẳng thức \uE000MATH_9\uE001 luôn đúng**');
  });

  it('correctly matches images and links in markdown', () => {
    const INLINE_MARKDOWN_REGEX = /(!\[[^\]]*?\]\([^)\s]+\)|(?<!!)\[[^\]]+?\]\(https?:\/\/[^\s)]+\)|\*\*\*[^*\n]+?\*\*\*|\*\*[^*\n]+?\*\*|(?<!\*)\*(?!\s)[^*\n]+?(?<!\s)\*(?!\*)|`[^`\n]+?`|~~[^~\n]+?~~)/g;
    const text = 'Xem hình: ![Tam giác ABC nội tiếp](https://firebasestorage.googleapis.com/v0/b/pimaga/o/diagram.png) và [Tạp chí Pi](https://pimaga.vn)';
    const parts = text.split(INLINE_MARKDOWN_REGEX);

    expect(parts).toContain('![Tam giác ABC nội tiếp](https://firebasestorage.googleapis.com/v0/b/pimaga/o/diagram.png)');
    expect(parts).toContain('[Tạp chí Pi](https://pimaga.vn)');
  });

  it('renders MathRenderer component without ReferenceError', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { default: MathRenderer } = await import('../components/common/MathRenderer');

    const element = React.createElement(MathRenderer, {
      content: `Số lượng số kỳ lạ là **vô hạn**.\n\n$N = m^3$\n\n*không* phải là.\n\n![Hình vẽ](https://example.com/hinh.png)\n\n\\begin{tikzpicture}\n\\draw (0,0) -- (1,1);\n\\end{tikzpicture}`
    });

    const html = renderToString(element);

    expect(html).toContain('font-bold');
    expect(html).toContain('vô hạn');
    expect(html).toContain('không');
    expect(html).toContain('img');
  });
});
