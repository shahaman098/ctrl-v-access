import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('screenshots', exist_ok=True)
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:4173')
    time.sleep(2)

    # 1. Main Hero
    page.screenshot(path='screenshots/01-hero-paste.png', full_page=False)
    print("Captured 01-hero-paste.png")

    # 2. Search Mode & Filter
    page.click("button:has-text('Search Rights & Guidance')")
    time.sleep(1)
    page.fill("#rights-search-input", "prescription")
    time.sleep(1)
    page.screenshot(path='screenshots/07-search-rights.png', full_page=False)
    print("Captured 07-search-rights.png")

    # Click Equalize & Load on Prescription
    page.click("button:has-text('Equalize & Load') >> nth=0")
    time.sleep(1)

    # 3. Scroll to Analysis
    page.evaluate("document.getElementById('analysis-section').scrollIntoView()")
    time.sleep(1)
    page.screenshot(path='screenshots/02-analysis-overview.png', full_page=False)
    print("Captured 02-analysis-overview.png")

    # 4. Tab 2: Legal Rights
    page.click("button:has-text('2. Your Legal Rights')")
    time.sleep(1)
    page.screenshot(path='screenshots/03-legal-rights.png', full_page=False)
    print("Captured 03-legal-rights.png")

    # 5. Tab 4: Auto-Drafted Appeal
    page.click("button:has-text('4. Auto-Drafted Appeal')")
    time.sleep(1)
    page.screenshot(path='screenshots/04-appeal-draft.png', full_page=False)
    print("Captured 04-appeal-draft.png")

    # 6. Enable Bionic Reading
    page.click("button:has-text('Bionic Focus')")
    page.click("button:has-text('1. Plain English')")
    time.sleep(1)
    page.screenshot(path='screenshots/05-bionic-reading.png', full_page=False)
    print("Captured 05-bionic-reading.png")

    # 7. Tab 5: Smart Form Bridge
    page.click("button:has-text('5. Smart Form Bridge')")
    time.sleep(1)
    page.screenshot(path='screenshots/06-smart-form-bridge.png', full_page=False)
    print("Captured 06-smart-form-bridge.png")

    browser.close()
    print("All screenshots successfully captured!")
