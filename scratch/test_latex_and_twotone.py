import re

html_path = r'c:\Users\nhpk1\Documents\Code\Pimaga\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

errors = []

# 1. Check problem title removal
if 'id="form-problem-title"' in content:
    errors.append('Found id="form-problem-title" in HTML!')

if "document.getElementById('form-problem-title')" in content:
    errors.append("Found document.getElementById('form-problem-title') in JS!")

# 2. Check problem title in renderArticleHtml
if 'problemHeaderTitle' not in content:
    errors.append('problemHeaderTitle logic missing in renderArticleHtml!')

# 3. Check saveProblem logic
if 'const title = `Bài ${code}`;' not in content:
    errors.append('title calculation missing in saveProblem!')

# 4. Check LaTeX cheatsheet modal
if 'id="modal-latex-cheatsheet"' not in content:
    errors.append('modal-latex-cheatsheet element missing!')

if 'id="latex-search-input"' not in content:
    errors.append('latex-search-input missing!')

if 'id="latex-formulas-grid"' not in content:
    errors.append('latex-formulas-grid missing!')

# 5. Check window.ui methods
required_methods = [
    'openLatexCheatsheet',
    'selectLatexCategory',
    'filterLatexCheatsheet',
    'renderLatexFormulas',
    'insertLatexSnippet',
    'copyLatexSnippet'
]
for m in required_methods:
    if f'{m}:' not in content:
        errors.append(f'Method ui.{m} missing!')

# 6. Check LaTeX trigger buttons
if "ui.openLatexCheatsheet('form-problem-content')" not in content:
    errors.append('Problem content LaTeX trigger button missing!')

if "ui.openLatexCheatsheet('form-problem-editorial')" not in content:
    errors.append('Editorial LaTeX trigger button missing!')

if "ui.openLatexCheatsheet('solution-content')" not in content:
    errors.append('User solution LaTeX trigger button missing!')

if "ui.openLatexCheatsheet()" not in content:
    errors.append('Main page LaTeX cheatsheet trigger button missing!')

# 7. Check 2-tone color adherence
forbidden_classes = ['bg-amber-', 'border-amber-', 'text-amber-', 'bg-emerald-', 'text-emerald-']
for fc in forbidden_classes:
    matches = re.findall(rf'\b{fc}\w*', content)
    if matches:
        errors.append(f'Forbidden color classes found: {matches}')

# 8. Check DIFFICULTY_LEVELS color classes
if 'bg-amber' in content or 'text-amber' in content:
    errors.append('Amber still present in content!')

if errors:
    print("FAILED with errors:")
    for err in errors:
        print(" - ", err)
    exit(1)
else:
    print("ALL TESTS PASSED! 100% compliant with user requirements.")
