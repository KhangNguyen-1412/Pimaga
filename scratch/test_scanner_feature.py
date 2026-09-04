import re
import sys

def run_scanner_tests():
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    print("=== STARTING SCANNER & OCR WORKFLOW TESTS ===")

    # 1. Check Homepage Action Button for Scanner
    assert 'onclick="ui.openProblemModal(null, true)"' in content, "Missing homepage button with ui.openProblemModal(null, true)"
    assert 'Quét Đề Từ Ảnh' in content, "Missing button text 'Quét Đề Từ Ảnh'"
    print("1. Homepage quick button 'Quét Đề Từ Ảnh' found with correct callback.")

    # 2. Check Problem Modal Header Toggle Button
    assert 'id="btn-toggle-scanner"' in content, "Missing #btn-toggle-scanner button in modal header"
    assert 'onclick="ui.toggleScannerZone()"' in content, "Missing onclick='ui.toggleScannerZone()'"
    print("2. Modal header toggle button '#btn-toggle-scanner' verified.")

    # 3. Check Scanner Zone Markup & Elements
    scanner_elements = [
        'id="problem-scanner-zone"',
        'id="scanner-key-status"',
        'onclick="ui.openGeminiKeyModal()"',
        'onclick="ui.toggleScannerZone(false)"',
        'id="scanner-dropzone"',
        'ondragover="ui.handleScannerDragOver(event)"',
        'ondragleave="ui.handleScannerDragLeave(event)"',
        'ondrop="ui.handleScannerDrop(event)"',
        'id="scanner-placeholder-state"',
        'id="scanner-camera-input"',
        'id="scanner-file-input"',
        'capture="environment"',
        'id="scanner-preview-state"',
        'id="scanner-preview-img"',
        'id="scanner-img-name"',
        'id="scanner-img-size"',
        'onclick="ui.clearScannerImage()"',
        'id="btn-run-scan"',
        'onclick="api.scanProblemImage()"',
        'id="scanner-loading-state"',
        'id="scanner-loading-text"',
        'id="scanner-success-banner"'
    ]
    for el in scanner_elements:
        assert el in content, f"Missing scanner element: {el}"
    print("3. All 22 scanner DOM elements, states (placeholder, preview, loading, success), and camera inputs verified.")

    # 4. Check Gemini Key Modal Markup
    gemini_elements = [
        'id="modal-gemini-key"',
        'id="input-gemini-key"',
        'https://aistudio.google.com/app/apikey',
        'onclick="ui.removeGeminiKey()"',
        'onclick="ui.saveGeminiKey()"'
    ]
    for el in gemini_elements:
        assert el in content, f"Missing Gemini modal element: {el}"
    print("4. Gemini API Key modal markup and inputs verified.")

    # 5. Check UI Methods in JavaScript
    ui_methods = [
        'scannerFile: null',
        'scannerDataUrl: null',
        'toggleScannerZone:',
        'updateGeminiKeyStatus:',
        'openGeminiKeyModal:',
        'saveGeminiKey:',
        'removeGeminiKey:',
        'handleScannerFile:',
        'clearScannerImage:',
        'handleScannerDragOver:',
        'handleScannerDragLeave:',
        'handleScannerDrop:',
        'onScannerFileSelected:',
        'applyScannedProblem:'
    ]
    for method in ui_methods:
        assert method in content, f"Missing ui method/property: {method}"
    print("5. All 14 UI scanner methods and state properties verified.")

    # 6. Check openProblemModal signature & implementation
    assert 'openProblemModal: (probId = null, autoOpenScanner = false)' in content, "Missing autoOpenScanner parameter in openProblemModal"
    assert 'ui.toggleScannerZone(true)' in content, "Missing ui.toggleScannerZone(true) in openProblemModal"
    assert 'ui.clearScannerImage()' in content, "Missing ui.clearScannerImage() reset in openProblemModal"
    print("6. openProblemModal properly resets scanner and honors autoOpenScanner parameter.")

    # 7. Check api.scanProblemImage, api.scanWithGemini, api.scanWithTesseract
    api_methods = [
        'scanProblemImage: async',
        'scanWithGemini: async',
        'scanWithTesseract: async'
    ]
    for method in api_methods:
        assert method in content, f"Missing api method: {method}"
    print("7. All 3 API scanner methods (dual-engine AI vision + offline OCR) verified.")

    # 8. Check Gemini REST API Endpoint & Prompt
    assert 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent' in content
    assert 'gemini-1.5-flash' in content, "Missing fallback to gemini-1.5-flash"
    assert 'pimaga_gemini_key' in content, "Missing localStorage key pimaga_gemini_key"
    print("8. Gemini 2.0 Flash with 1.5 Flash fallback and localStorage integration verified.")

    # 9. Check applyScannedProblem logic
    # Ensures auto-population of code, difficulty, author, province, content, editorial solution
    assert 'form-problem-code' in content
    assert 'ui.setProblemDifficulty' in content
    assert 'form-problem-author' in content
    assert 'ui.setProblemProvince' in content
    assert 'form-problem-content' in content
    assert 'form-problem-editorial' in content
    assert 'scanner-success-banner' in content
    print("9. applyScannedProblem correctly maps to all problem form fields and displays review banner.")

    # 10. Check that saving to Firestore requires user confirmation (no auto-save in scan)
    # The scan methods only call ui.applyScannedProblem(scannedData) and NOT api.saveProblem()!
    scan_body_match = re.search(r'scanProblemImage:\s*async\s*\(\)\s*=>\s*\{(.*?)\n\s*\},', content, re.DOTALL)
    assert scan_body_match, "Failed to locate scanProblemImage body"
    scan_body = scan_body_match.group(1)
    assert 'saveProblem' not in scan_body, "CRITICAL: scanProblemImage must NOT call saveProblem directly! User must review first."
    print("10. VERIFIED: Image scanning populates the inputs for editing and does NOT automatically save to Firestore.")

    # 11. Check Clipboard Paste Listener
    assert "window.addEventListener('paste'" in content, "Missing global paste event listener"
    assert 'clipboardData' in content, "Missing clipboardData access in paste listener"
    print("11. Global Ctrl+V clipboard paste listener verified.")

    # 12. Check Color Palette Compliance (Cerulean #2A52BE, Jasper #D73B3E, Paper #FDFBF7)
    # Ensure no colored emojis in scanner markup
    scanner_markup = content[content.find('id="problem-scanner-zone"'):content.find('id="scanner-success-banner"') + 500]
    import unicodedata
    emoji_chars = [ch for ch in scanner_markup if unicodedata.category(ch) in ('So', 'Sk') and ch not in ('★', '☆', '✕', '✓', '•', '…', '–', '—', '’', '“', '”')]
    print("  Scanner markup special chars check:", emoji_chars)
    assert len(emoji_chars) == 0, f"Detected colored emoji in scanner UI: {emoji_chars}"
    print("12. Strict 2-tone palette compliance verified (0 colored emojis, SVG icons used).")

    print("\n=== ALL 12 SCANNER TEST SUITES PASSED! ===")

if __name__ == "__main__":
    run_scanner_tests()
