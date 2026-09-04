def test_dropdown_floating():
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    print("=== Testing Modal Dropdown Floating & Stacking Implementation ===")

    # 1. Check z-[1000] class in all 5 modal dropdown menus
    dropdown_menu_ids = [
        'dropdown-issue-month-menu',
        'dropdown-modal-issue-menu',
        'dropdown-modal-category-menu',
        'dropdown-modal-difficulty-menu',
        'dropdown-modal-province-menu'
    ]
    for menu_id in dropdown_menu_ids:
        assert f'id="{menu_id}"' in content, f"Missing id={menu_id}"
        # Locate menu tag
        start_idx = content.find(f'id="{menu_id}"')
        tag_slice = content[start_idx:start_idx+200]
        assert 'z-[1000]' in tag_slice, f"Menu {menu_id} should have z-[1000] class in HTML"
        print(f"  -> Menu #{menu_id}: has z-[1000] high-layering class.")

    # 2. Check positionModalDropdown and activeModalDropdown in ui
    assert 'activeModalDropdown: null' in content, "Missing activeModalDropdown state"
    assert 'positionModalDropdown: (type) =>' in content, "Missing positionModalDropdown method"
    assert "menu.style.position = 'fixed'" in content, "positionModalDropdown must use fixed positioning"
    assert "menu.style.zIndex = '1000'" in content, "positionModalDropdown must set zIndex 1000"
    print("  -> ui.positionModalDropdown and fixed positioning: OK")

    # 3. Check positionIssueMonthDropdown in ui
    assert 'positionIssueMonthDropdown: () =>' in content, "Missing positionIssueMonthDropdown method"
    assert "ui.activeModalDropdown = 'issue-month'" in content
    print("  -> ui.positionIssueMonthDropdown and state sync: OK")

    # 4. Check closeModalDropdown cleanup
    assert "menu.style.position = ''" in content, "closeModalDropdown must reset inline style position"
    assert "if (ui.activeModalDropdown === type) ui.activeModalDropdown = null" in content
    print("  -> ui.closeModalDropdown inline style cleanup: OK")

    # 5. Check scroll and resize position synchronization listeners
    assert "window.addEventListener('resize'" in content
    assert "probModalScrollArea.addEventListener('scroll'" in content
    print("  -> Scroll and resize synchronization listeners: OK")

    print("\nALL MODAL DROPDOWN FLOATING & ZERO-CLIPPING TESTS PASSED 100%!")

if __name__ == '__main__':
    test_dropdown_floating()
