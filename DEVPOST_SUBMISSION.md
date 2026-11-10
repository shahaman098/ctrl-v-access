# Devpost Submission — Ctrl+V Access

## Project Title
**Ctrl+V Access**

## Tagline
**The Instant AI Equalizer: Paste Any Bureaucratic Notice to Get 5th-Grade Clarity, Rights, Audio, & Winning Appeals**

---

## Inspiration
Millions of individuals—particularly those living with disabilities, neurodivergence (ADHD, autism, dyslexia), low literacy, or non-native language backgrounds—face a debilitating "Administrative Wall." Routine communication from healthcare providers, disability support panels, universities, and public housing authorities is routinely written in dense, intimidating legal and bureaucratic language (Grade 14-16+ reading levels). 

Studies show that over 60% of first-round administrative denials are overturned on appeal, yet fewer than 15% of affected people challenge these decisions because the notices are opaque, stressful, and difficult to parse.

When we saw the **Ctrl+V Hackathon** prompt—transferring information fast to improve access to services, healthcare, education, and civil rights—we asked:  
*What if the most fundamental shortcut on every computer, **Ctrl+V (Paste)**, could act as an instant equalizer? What if any person could simply copy a frightening denial letter, press Ctrl+V, and immediately receive clarity, discover their legal rights, listen aloud, and get a ready-to-send winning appeal letter?*

---

## What It Does
**Ctrl+V Access** turns the clipboard into a universal assistive equalizing bridge:

1. **Global Keyboard Trigger (Ctrl+V / ⌘+V):** The user pastes an intimidating document or denial notice anywhere on screen.
2. **Dual-Input Architecture (Ctrl+V Paste + Instant Rights Search):**
   - **Global Clipboard Trigger:** The user pastes an intimidating document or denial notice anywhere on screen (`Ctrl+V` / `⌘+V`).
   - **Statutory Rights & Guidance Search Engine:** In addition to pasting documents, citizens can instantly search our curated statutory rights knowledge base (covering NICE medical guidelines, DWP PIP regulations, Equality Act educational accommodations, Section 8 HUD hearing procedures, NHS FP92A medical exemption prescriptions, and UK Access to Work grants) by condition, keyword, or government department.
3. **5-Tier Equalizer Architecture:**
   - **Level 1: 5th-Grade Plain English:** Strips bureaucratic posturing, provides a 30-second bottom-line summary, and features a demystified jargon dictionary.
   - **Level 2: Statutory Rights & Legal Protections:** Uncovers governing statutory protections, relevant regulations, and hidden entitlements (such as automatic stays of eviction, prescription exemptions, or travel concessions).
   - **Level 3: Action Roadmap & Progress Meter:** Provides an interactive checklist of exact steps to take, evidence to gather, and progress tracking.
   - **Level 4: Auto-Drafted Appeal Letter:** Generates a complete, formal procedural review letter citing relevant standards and rules, complete with a 1-click accessible copy button (`modern-web-guidance` compliant).
   - **Level 5: Smart Form Bridge:** Assists users in answering complex application portal questions with calibrated, clear responses ready to paste back.
3. **Assistive Accessibility Suite:**
   - **Bionic Focus:** Bolds word prefixes to guide eye movement and cut reading fatigue for neurodivergent and ADHD users.
   - **Dyslexia-Optimized Typography:** Uses Lexend typeface with enhanced letter spacing and line heights.
   - **WCAG AAA High Contrast:** 1-click high-contrast mode for visual clarity.
   - **Voice Audio Narration:** In-browser Web Speech API audio reader with playback speed controls (0.85x to 1.5x) and visual waveform feedback.
   - **Multilingual Support:** Instant language selection across 10 global languages.

---

## How We Built It
- **Frontend Core:** Built with React 18, TypeScript, and Vite for sub-second hot reloading and instant client-side performance.
- **Styling & Assistive UI:** Designed with Tailwind CSS, supporting dynamic font sizing, high-contrast themes, and responsive layouts.
- **Accessibility & UX:** Integrated WAI-ARIA 1.2 landmarks, polite live regions for clipboard status, and accessible button components adhering to web development guidance.
- **Document Analysis Engine:** Custom on-device NLP and readability heuristics that compute Flesch-Kincaid grade levels, detect time limits and jargon, and structure multi-tier outputs.
- **Tooling & Automation:** Screen captures and demo recording powered by Playwright and FFmpeg.

---

## Challenges We Ran Into
- **Designing True Accessibility Without Visual Clutter:** Balancing high-density legal and medical information with a calm, low-cognitive-load user experience required rigorous prototyping of progressive disclosure tabs.
- **Clipboard Permissions & Keyboard Accessibility:** Creating a robust global paste listener that respects active inputs while enabling one-touch `Ctrl+V` required careful event target filtering and fallback handling.

---

## Accomplishments We're Proud Of
- Transforming a 16th-grade college reading level medical notice into an accessible 5th-grade plain-English summary in under 100 milliseconds.
- Building a tool that provides both comprehension and immediate advocacy (the auto-drafted appeal letter).
- Achieving complete WCAG AAA contrast support, full keyboard navigability, and smooth Bionic reading integration.

---

## What We Learned
Accessible design isn't just about color contrast—it's about cognitive accessibility. Simplifying bureaucratic language directly empowers vulnerable individuals to assert their rights and access vital care and services.

---

## What's Next for Ctrl+V Access
- Native browser extension for 1-click page highlighting and right-click equalizing.
- Integration with local and open-source models for offline privacy-first local processing.
- Direct integration with public legal aid and community advocacy clinics.

---

## Built With
- `react`
- `typescript`
- `vite`
- `tailwindcss`
- `lucide-react`
- `web-speech-api`
- `playwright`
- `ffmpeg`
