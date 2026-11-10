import os
import time
import subprocess
from playwright.sync_api import sync_playwright

os.makedirs('video', exist_ok=True)
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

print("Starting automated video recording of Ctrl+V Access demo...")

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    # Record video with high quality 1280x720 16:9 HD resolution
    context = browser.new_context(
        viewport={'width': 1280, 'height': 720},
        record_video_dir='video/',
        record_video_size={'width': 1280, 'height': 720}
    )
    page = context.new_page()

    # Step 1: Open the App
    page.goto('http://localhost:4173')
    time.sleep(3)

    # Step 2: Hover over Hero & Paste Box
    page.hover("button:has-text('Paste from Clipboard')")
    time.sleep(2)

    # Step 3: Scroll smoothly down to the Analysis Equalizer Section
    page.evaluate("document.getElementById('analysis-section').scrollIntoView({ behavior: 'smooth' })")
    time.sleep(4)

    # Step 4: Explore Tab 1: Plain English and Jargon Dictionary
    page.hover("text=The 30-Second Bottom Line")
    time.sleep(3)
    page.hover("text=Demystified Jargon Dictionary")
    time.sleep(3)

    # Step 5: Toggle Bionic Reading Focus
    page.click("button:has-text('Bionic Focus')")
    time.sleep(4)

    # Step 6: Toggle Dyslexia Font
    page.click("button:has-text('Dyslexia Font')")
    time.sleep(3)

    # Step 7: Test High Contrast Mode
    page.click("button:has-text('Contrast')")
    time.sleep(3)
    page.click("button:has-text('Contrast')") # toggle back
    time.sleep(2)

    # Step 8: Tab 2: Your Legal Rights
    page.click("button:has-text('2. Your Legal Rights')")
    time.sleep(4)
    page.hover("text=NICE Guideline NG17")
    time.sleep(3)

    # Step 9: Tab 3: Action Checklist
    page.click("button:has-text('3. Action Checklist')")
    time.sleep(3)
    # Click checklist items to demonstrate interactive progress
    page.click("text=Download the Auto-Drafted Appeal Letter below")
    time.sleep(1.5)
    page.click("text=Contact your Consultant Endocrinologist")
    time.sleep(2)

    # Step 10: Tab 4: Auto-Drafted Appeal Letter
    page.click("button:has-text('4. Auto-Drafted Appeal')")
    time.sleep(3)
    # Click the Copy Button
    page.click("button:has-text('Copy Appeal Letter')")
    time.sleep(3)

    # Step 11: Tab 5: Smart Form Bridge
    page.click("button:has-text('5. Smart Form Bridge')")
    time.sleep(4)
    page.hover("text=Reason for Exceptionalism")
    time.sleep(3)

    # Step 12: Scroll back to top to demonstrate switching scenarios
    page.evaluate("window.scrollTo({ top: 0, behavior: 'smooth' })")
    time.sleep(3)

    # Step 13: Click Scenario 2: Disability Assessment (PIP) 0 Points
    page.click("text=Disability Assessment (PIP)")
    time.sleep(3)

    # Scroll to see equalized results for Scenario 2
    page.evaluate("document.getElementById('analysis-section').scrollIntoView({ behavior: 'smooth' })")
    time.sleep(4)
    page.click("button:has-text('2. Your Legal Rights')")
    time.sleep(3)
    page.click("button:has-text('4. Auto-Drafted Appeal')")
    time.sleep(3)

    # Step 14: Demonstrate Search Rights & Guidance Engine
    page.evaluate("window.scrollTo({ top: 0, behavior: 'smooth' })")
    time.sleep(2)
    page.click("button:has-text('Search Rights & Guidance')")
    time.sleep(2)
    page.fill("#rights-search-input", "prescription")
    time.sleep(2)
    page.click("button:has-text('Equalize & Load') >> nth=0")
    time.sleep(2)
    page.evaluate("document.getElementById('analysis-section').scrollIntoView({ behavior: 'smooth' })")
    time.sleep(3)
    page.click("button:has-text('2. Your Legal Rights')")
    time.sleep(3)

    # Final wrap-up view
    time.sleep(2)
    context.close()
    browser.close()

print("Browser session closed. Video file written.")

# Locate newest .webm file and convert to MP4
video_files = [f for f in os.listdir('video') if f.endswith('.webm')]
if video_files:
    latest_webm = max([os.path.join('video', f) for f in video_files], key=os.path.getmtime)
    output_mp4 = 'video/ctrl-v-access-demo.mp4'
    print(f"Converting {latest_webm} to {output_mp4}...")
    cmd = [
        'ffmpeg', '-y', '-i', latest_webm,
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '22',
        '-pix_fmt', 'yuv420p',
        output_mp4
    ]
    subprocess.run(cmd, check=True)
    print(f"Successfully generated {output_mp4}!")

