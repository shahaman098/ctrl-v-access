# Ctrl+V Access: Demo Video Narration Script

**Target length:** about 2:45, roughly 400 spoken words at a calm pace.
**What you record:** your voice only. I put the visuals on top: screen recording of the app, tech stack card, real terminal output, benchmark table, evidence and sponsor card.

## How to record

1. Read each scene's **NARRATION** block. Skip the headings and the bracketed notes.
2. After each scene, **pause for 2 full seconds** of silence. I use those gaps to cut the audio into scenes and match the visuals to your timing. Your pace can be anything.
3. If you stumble, pause 2 seconds and re-read the whole sentence. I'll cut out the bad take.
4. Record somewhere quiet. Phone voice memo or QuickTime is fine. Any of `.m4a`, `.wav`, `.mp3`, `.mov` or `.mp4` works.
5. Put the file in this `video/` folder, or give me its path.

Optional: if you also want your face in a corner bubble, record it as a video, and say so when you send it.

---

## Scene 1: The problem (about 0:00 to 0:20)
*On screen: the raw NHS glucose-monitor denial letter, scrolling. Overlay: "Grade 18+ reading level".*

**NARRATION**
> This is a real-style NHS funding denial. It's two hundred and seventeen words of legal language, at a reading level above university. If you have ADHD, dyslexia, a brain injury, or English is your second language, this letter is a wall. And appeals work. In the UK in 2023 to 24, more than four in ten disability benefit appeals that reached a tribunal decision were overturned. Most people never appeal, because they can't read the letter.

## Scene 2: One keystroke (about 0:20 to 0:40)
*On screen: copy the letter, press Ctrl+V on the Ctrl+V Access home page, and the analysis appears.*

**NARRATION**
> Ctrl+V Access turns the most familiar shortcut on any computer into an equalizer. Copy the letter. Press Ctrl+V anywhere on the page. That's it.

## Scene 3: Plain English, rights and a checklist (about 0:40 to 1:10)
*On screen: Tab 1 (bottom line, grade badge, jargon dictionary), then Tab 2 (legal rights), then Tab 3 (ticking checklist items).*

**NARRATION**
> First, plain English. The same letter becomes sixty-five words. "The NHS said no. You can ask them to look again. You have 28 days." The jargon is explained, word by word.
> Second, your rights. It finds the rules that apply, like NICE guideline NG17, so you know what to cite.
> Third, an action checklist with the exact evidence to collect, and a progress bar to track it.

## Scene 4: The appeal writes itself (about 1:10 to 1:30)
*On screen: Tab 4 (appeal letter, click "Copy Appeal Letter"), then Tab 5 (Smart Form Bridge).*

**NARRATION**
> Fourth, a complete formal appeal letter, with the legal grounds already written in. One click copies it.
> And fifth, the Smart Form Bridge. It explains what tricky portal questions are really asking, with a calm, factual answer you can paste back. Ctrl+V works in both directions.

## Scene 5: Built for how people actually read (about 1:30 to 1:50)
*On screen: toggle Bionic Focus, Dyslexia Font, High Contrast, then press play on audio narration.*

**NARRATION**
> Everything adapts to the reader. Bionic focus guides the eye. A dyslexia-friendly font. High contrast mode. And it reads the result out loud, at the speed you choose.

## Scene 6: Under the hood (about 1:50 to 2:15)
*On screen: tech stack card, then real terminal output from the API (health, analyze, rights search, appeal).*

**NARRATION**
> Under the hood, it's a React and TypeScript front end on Vite and Tailwind, with a Node and Express API. The four case studies are hand-checked reference answers. Paste any other letter and the analyze endpoint takes over. It uses Google Gemini through the GenAI SDK. With no key or no connection, like right here, it falls back to a local engine, so every request still answers in milliseconds, even on patchy internet.

## Scene 7: Benchmarks (about 2:15 to 2:35)
*On screen: benchmark table across all four case studies: word count, Flesch-Kincaid (app and textstat), Dale-Chall, engine time.*

**NARRATION**
> We measured it, not just claimed it. Across four case studies, in healthcare, disability benefits, university support and housing, letters get sixty to seventy-four percent shorter. Reading level drops from college or above to early primary, and an independent readability library confirms it. The local engine processes a letter in under a fifth of a millisecond.

## Scene 8: Sponsor and close (about 2:35 to 2:50)
*On screen: sponsor card thanking Adaption Platform and ADHAYAN, then the closing title with the GitHub link.*

**NARRATION**
> Thank you to ADHAYAN and to our sponsor, Adaption Platform, whose mission of access in every language is where this goes next.
> Ctrl+V Access. Paste the letter. Get your rights back.

---

## Notes for Aman (not read aloud)

**Where each on-screen number comes from:**

| Claim in the video | Source |
|---|---|
| 217 words, then 65 words (−70%); −60% to −74% across all four | `video/evidence/benchmark.txt` (word counts of `rawText` and `plainEnglish` in `src/data/scenarios.ts`) |
| Grade 18+ before, grades 1 to 2.2 after (the app's own Flesch-Kincaid) | Same file. The app's formula caps at 18. textstat gives 13.4 to 19.9 before and 1.2 to 2.0 after. |
| Dale-Chall 11.8 to 14.9 before, 5.6 to 6.5 after | Same file, from textstat 0.7.13. Dale-Chall 5.0–6.9 corresponds to roughly a US grade 5 to 8 reader. |
| Engine under 0.2 ms per letter | Same file: an average of 1,000 runs of `analyzePastedDocument`. |
| Requests answer in milliseconds | `video/evidence/terminal.txt`, real `curl` captures from `localhost:3001` (2 to 30 ms). |
| More than 4 in 10 UK disability benefit (PIP) appeals that reached a decision were overturned | A UK Parliament written answer gives FY2023-24 as 34,400 overturned out of 77,700 cleared, about 44% ([parallelparliament.co.uk](https://parallelparliament.co.uk/question/39207/personal-independence-payment-appeals)). Check the figure on that page before you submit. If it doesn't hold up, cut that sentence. |

**Things the video deliberately does not claim:**
- It doesn't say the Adaption Platform API is integrated. `/api/adaption/dataset` returns fixed sample data, so the sponsor is thanked, not claimed as a dependency.
- It doesn't show live Gemini output, because there is no API key in `.env`. The terminal truthfully shows `"source": "local-hybrid-nlp"`. If you want a real Gemini call on screen, give me a key, either in `.env` or by pasting it into the app yourself, and I'll recapture.
- It doesn't demo translation. The language picker only passes a preference to Gemini, so with no key nothing gets translated.
