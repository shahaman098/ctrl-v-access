# Devpost Submission — Ctrl+V Access

## Project Title
**Ctrl+V Access**

## Tagline
**Paste a bureaucratic denial. Get plain English, your rights, a checklist, and a draft appeal, read aloud if you want it.**

---

## Inspiration
Many people, especially those with disabilities, ADHD, autism, dyslexia, low literacy, or English as a second language, hit an "administrative wall." Letters from health services, disability benefit panels, universities and housing authorities are written in dense legal and bureaucratic language. On the four real-style notices I benchmarked, the Flesch–Kincaid reading level runs from grade 13 to 20.

Appeals work. According to [DWP PIP Official Statistics to April 2026](https://www.gov.uk/government/statistics/personal-independence-payment-statistics-to-april-2026/personal-independence-payment-official-statistics-to-april-2026) (Table 5Aii), 65% of PIP disability benefit decisions that reach a tribunal are overturned in the claimant's favour. Most people never get that far. The notice is hard to read, the deadline is buried, and the rule the decision rests on is never named.

The Ctrl+V Hackathon asks for technology that helps people reach what they need faster, the way Ctrl+V moves information instantly. So I asked: what if that shortcut were the equalizer? Copy the frightening letter, press Ctrl+V, and get something you can act on.

---

## What It Does
**Ctrl+V Access** turns the clipboard into an assistive bridge, in both directions: paste the letter in, then copy the appeal and form answers back out.

1. **Two ways in**
   - **Paste anywhere (Ctrl+V / ⌘+V):** a global paste listener picks up a notice pasted anywhere on the page. Pasting into other input fields still works normally.
   - **Rights search:** a curated set of 7 statutory entries you can search by condition, keyword or department. They cover NICE NG17, PIP regulations, Equality Act 2010 education duties, HUD Section 8 hearings, NHS FP92A prescription exemption, Access to Work and Warm Home Discount.
2. **Five layers of output**
   - **1 · Plain English:** a bottom line, short bullet takeaways and a jargon dictionary.
   - **2 · Rights:** the governing rules and citations, plus entitlements people often miss.
   - **3 · Checklist:** steps to take and evidence to gather, with a progress meter.
   - **4 · Appeal draft:** a formal reconsideration letter with the grounds filled in. One click copies it.
   - **5 · Smart Form Bridge:** explains what tricky portal questions are really asking, with a factual answer ready to paste back.
3. **Assistive controls** (always available)
   - **Bionic Focus:** bolds the first part of each word to guide the eye.
   - **Lexend typeface:** dyslexia-oriented, with extra letter and line spacing.
   - **High contrast:** a yellow-on-black mode designed to meet WCAG AAA contrast ratios. No third-party audit has been done.
   - **Read aloud:** Web Speech API narration at 0.85×, 1×, 1.25× or 1.5×.
   - **Language:** 10 output languages through the Gemini path. I checked that a Spanish request returns the full analysis in Spanish. Offline mode stays in English.

---

## How I Built It
- **Stack:** React 18, TypeScript, Vite and Tailwind on the front end, with a Node.js / Express 5 REST API (`server/index.ts`).
- **AI engine:** Google Gemini via the `@google/genai` SDK, using `gemini-3.5-flash-lite` by default (`gemini-3.8-flash` is selectable). Gemini reads any pasted notice and returns structured JSON covering all five layers in the chosen language. On a Blue Badge refusal letter that isn't one of the built-in cases, it returned an answer in a few seconds. It named the correct governing regulation, the Disabled Persons (Badges for Motor Vehicles) (England) Regulations 2000, and set out the 28-day review route. The server never trusts the model's own idea of how readable its answer is. It scores the result with the same Flesch–Kincaid function as the offline engine. Measured that way, the live AI took two unseen letters from grade 15.4 to 1.4–2.4 (a Blue Badge refusal) and from 13.5 to 5.5 (a Universal Credit sanction).
- **Fallback layers:** if there's no API key, or Gemini errors, the server uses a local rule-based engine. If the API itself is unreachable, the browser runs the same engine. That engine does Flesch–Kincaid scoring, jargon detection, category heuristics and appeal scaffolding. Its results are heuristic but always structured.
- **REST endpoints:**
  - `GET /api/health`: backend status and which engine is active.
  - `POST /api/analyze`: analyzes a notice with Gemini, falling back to the local engine.
  - `POST /api/rights/search`: searches the curated rights entries.
  - `POST /api/appeal/generate`: fills a reconsideration-letter template from the grounds and citation you supply.
  - `POST /api/adaption/dataset`: a static sample payload shaped like an Adaption Platform dataset response. It is a placeholder for a future integration, not a live connection.
- **Accessibility in the UI:** ARIA landmarks, polite live regions announcing clipboard actions, visible focus rings and native keyboard-operable controls. No automated WCAG conformance report is claimed.
- **Tooling:** Playwright and FFmpeg for the screenshots and the demo video.

---

## Challenges I Ran Into
- **Lots of information, low cognitive load:** legal and medical detail is dense. Splitting it into five progressive tabs kept each screen calm.
- **A paste listener that doesn't get in the way:** the global Ctrl+V trigger has to leave normal typing and pasting into form fields alone. That took careful event-target filtering.
- **Never leaving someone stuck:** someone with patchy internet or no API key still needs an answer. That led to three fallback layers: Gemini, the local engine on the server, and the local engine in the browser.

---

## Accomplishments I'm Proud Of
- **A measured benchmark of the reference answers.** The four built-in case studies (an NHS glucose-monitor denial, a PIP 0-points award, a university exam-adjustment refusal, a Section 8 voucher termination) have hand-checked plain-English reference answers. Compared with the original notices:
  - They are 60–74% shorter.
  - Flesch–Kincaid grade drops from 13.4–19.9 to 1.2–2.0 (checked independently with the `textstat` library).
  - Dale–Chall drops from 11.8–14.9 to 5.6–6.5.
  - Raw output is in `video/evidence/benchmark.txt`.
- **Live AI on letters it has never seen**, with three layers of graceful fallback, so the app always answers.
- **Comprehension and advocacy together:** the same paste explains the letter and drafts the appeal.

---

## What I Learned
Accessible design isn't only about colour contrast. It's about cognitive accessibility. A letter someone can't read is a right they can't use.

---

## What's Next for Ctrl+V Access
- Automatically retry when the live AI output still measures above the target reading grade.
- A browser extension for right-click "equalize this page."
- Local and open-source models for private, offline processing.
- A live Adaption Platform integration to expand the multilingual training data.
- Partnerships with legal aid and advocacy clinics to review the citations.

*Prototype, not legal advice. Citations are starting points; verify them before filing. The benchmark letters are realistic composites, not real case files.*

---

## Built With
- `react`
- `typescript`
- `node.js`
- `express`
- `google-gemini-api`
- `@google/genai`
- `vite`
- `tailwindcss`
- `lucide-react`
- `web-speech-api`
- `playwright`
- `ffmpeg`
