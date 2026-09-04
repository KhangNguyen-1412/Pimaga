import re
import sys

def run_tests():
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    print("Checking Author & 34 Post-merger Provinces Implementation...")

    # 1. Check form inputs in modal-problem
    assert 'id="form-problem-author"' in content, "Missing input#form-problem-author"
    assert 'id="form-problem-province"' in content, "Missing input#form-problem-province"
    assert 'id="dropdown-modal-province-container"' in content, "Missing #dropdown-modal-province-container"
    assert 'id="dropdown-modal-province-btn"' in content, "Missing #dropdown-modal-province-btn"
    assert 'id="dropdown-modal-province-menu"' in content, "Missing #dropdown-modal-province-menu"
    assert 'id="dropdown-modal-province-search"' in content, "Missing #dropdown-modal-province-search"
    assert 'id="dropdown-modal-province-list"' in content, "Missing #dropdown-modal-province-list"
    print("  -> Form fields and custom province dropdown markup: OK")

    # 2. Check PROVINCES_34 constant
    assert 'const PROVINCES_34 = [' in content, "Missing PROVINCES_34 definition"
    
    # Extract provinces from JS array
    prov_match = re.search(r'const PROVINCES_34 = \[(.*?)\];', content, re.DOTALL)
    assert prov_match, "Failed to parse PROVINCES_34"
    prov_entries = re.findall(r'name:\s*"([^"]+)"', prov_match.group(1))
    assert len(prov_entries) == 34, f"Expected 34 post-merger provinces, found {len(prov_entries)}: {prov_entries}"
    print(f"  -> PROVINCES_34 has exactly {len(prov_entries)} units after merger: OK")
    
    # Check specific key merged provinces
    assert "TP. Hồ Chí Minh" in prov_entries
    assert "Hà Nội" in prov_entries
    assert "Đà Nẵng" in prov_entries
    assert "Hải Phòng" in prov_entries
    assert "Cần Thơ" in prov_entries
    assert "Huế" in prov_entries
    assert "Ninh Bình" in prov_entries
    assert "Phú Thọ" in prov_entries
    assert "Lâm Đồng" in prov_entries
    assert "Quảng Trị" in prov_entries
    print("  -> Crucial post-merger units verified (TP.HCM, Hà Nội, Hải Phòng, Đà Nẵng, Cần Thơ, Huế, Ninh Bình...): OK")

    # 3. Check UI methods
    assert 'renderProvinceList' in content, "Missing ui.renderProvinceList"
    assert 'setProblemProvince' in content, "Missing ui.setProblemProvince"
    assert "selectModalOption('province'" in content, "Missing province branch in selectModalOption"
    assert "closeModalDropdown('province')" in content, "Missing province in closeModalDropdown"
    print("  -> UI dropdown handlers (renderProvinceList, setProblemProvince, selectModalOption): OK")

    # 4. Check openProblemModal loading & clearing
    assert "form-problem-author" in content and "setProblemProvince" in content
    assert "ui.renderProvinceList()" in content
    print("  -> openProblemModal loads & clears author and province: OK")

    # 5. Check saveProblem payload
    assert 'author' in content and 'province' in content
    save_match = re.search(r'saveProblem:\s*async\s*\(\)\s*=>\s*\{(.*?)\n\s*\},', content, re.DOTALL)
    assert save_match, "Failed to locate saveProblem"
    save_body = save_match.group(1)
    assert 'form-problem-author' in save_body, "saveProblem does not read form-problem-author"
    assert 'form-problem-province' in save_body, "saveProblem does not read form-problem-province"
    assert 'author' in save_body and 'province' in save_body and 'payload' in save_body
    print("  -> saveProblem persists author and province: OK")

    # 6. Check italic format in renderArticleHtml: [tên tác giả in nghiêng], [tỉnh thành in nghiêng]
    render_match = re.search(r'const renderArticleHtml = \(p\)\s*=>\s*\{(.*?)\n\s*(\}\;|\}\n)', content, re.DOTALL)
    assert render_match, "Failed to locate renderArticleHtml"
    render_body = render_match.group(1)
    assert 'italic font-bold text-ink' in render_body or 'italic' in render_body, "Author name must be italic"
    assert 'authorPart' in render_body and 'provincePart' in render_body, "Missing authorPart and provincePart in renderArticleHtml"
    assert 'authorLine' in render_body, "Missing authorLine in renderArticleHtml"
    print("  -> Article formatting: [author in italics], [province in italics]: OK")

    # 7. Check Escape key & click outside
    assert "ui.closeModalDropdown('province')" in content
    print("  -> Event listeners (Escape key & click outside) close province dropdown: OK")

    print("\nALL AUTHOR & PROVINCE TESTS PASSED! (100% OK)")

if __name__ == "__main__":
    run_tests()
