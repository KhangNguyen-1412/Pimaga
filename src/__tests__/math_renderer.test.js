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
});
