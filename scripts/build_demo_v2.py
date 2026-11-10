"""v2 cut: a real video, not a slideshow.

- App scenes are re-recorded live with a visible cursor, smooth scrolling and clicks timed to the presenter's words.
- Cards keep moving (slow push-in, staged reveals) and never freeze.
- The presenter appears full-screen at key moments (intro, chapter openers, outro) and as a bubble elsewhere.
- Scenes dissolve into each other.

  python3 scripts/build_demo_v2.py TAKE.mov "start,b1,...,b7,end" words.json
"""
import json, os, re, sys, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import build_demo_video as v1
from build_demo_video import BUILD, CARDS, W, H, APP, CHROME, N_SCENES, ff, duration

LEAD, TAIL, XF = 0.4, 0.6, 0.35
FULL_CROP = os.environ.get('FULL_CROP', '1360:765:60:120')  # wide camera shot, framed to keep the background clear

# Presenter full-screen windows, in take time (source seconds): (scene index, start, end, lower-third id or None)
FULL_WINDOWS = json.loads(os.environ['FULL_WINDOWS']) if os.environ.get('FULL_WINDOWS') else [(0, None, 5.4, 'intro'), (4, 100.0, 104.6, 'read'), (6, None, 148.6, 'bench'), (7, None, None, 'outro')]


# ---------------------------------------------------------------- NHS.UK palette for every graphic (matches the restyled app)

NHS_SWAP = {'#020617': '#f0f4f5', '#e2e8f0': '#212b32', '#f8fafc': '#212b32', '#cbd5e1': '#212b32', '#818cf8': '#005eb8', '#a5b4fc': '#005eb8',
            '#f87171': '#d5281b', '#34d399': '#007f3b', '#64748b': '#4c6272', '#94a3b8': '#4c6272', '#1e293b': '#d8dde0', '#334155': '#d8dde0',
            'rgba(15,23,42,.85)': '#ffffff', '#0f172a': '#ffffff'}
NHS_CARD_CSS = ("html,body{font-family:Arial,sans-serif!important}.glow{display:none}.letter{background:#fff!important;color:#212b32!important;border:1px solid #d8dde0;box-shadow:none!important}.chip{background:#f0f4f5!important}"
                ".kicker{color:#005eb8!important}.logo{background:none!important;-webkit-background-clip:initial!important;color:#005eb8!important}")

def nhsify(html_doc, terminal=False):
    if terminal:  # the terminal window stays dark; only its page background changes
        return html_doc.replace('background:#020617', 'background:#f0f4f5', 1).replace('</style>', '.glow{display:none}</style>', 1)
    for a, b in NHS_SWAP.items():
        html_doc = re.sub(re.escape(a), b, html_doc, flags=re.I)
    return html_doc.replace('</style>', NHS_CARD_CSS + '</style>', 1)

LABEL_JS = v1.LABEL_JS.replace('background:rgba(2,6,23,.88);', 'background:#005eb8;').replace('border:1px solid #6366f1;color:#e0e7ff', 'border:2px solid #fff;color:#fff')
KEYCAP_JS = v1.KEYCAP_JS.replace('rgba(79,70,229,.95)', '#005eb8').replace('rgba(79,70,229,.55)', 'rgba(0,48,135,.45)')

# ---------------------------------------------------------------- timeline helpers

def scene_ranges(words, bounds):
    return [v1.speech_ranges(words, bounds[k], bounds[k + 1]) for k in range(N_SCENES)]

def to_local(src, ranges):
    """Map a take timestamp into the scene's compressed timeline (including the lead-in)."""
    acc = 0.0
    for s, e in ranges:
        if src <= e:
            return LEAD + acc + max(0.0, src - s)
        acc += e - s
    return LEAD + acc

def word_time(words, pat, a, b):
    for w in words:
        if a <= w['s'] < b and re.search(pat, re.sub(r'[^a-z]', '', w['w'].lower())):
            return w['s']
    raise SystemExit(f'cue word {pat!r} not found between {a} and {b}')

# ---------------------------------------------------------------- live app recording with cursor

CURSOR_JS = """()=>{if(document.getElementById('__cur'))return;const c=document.createElement('div');c.id='__cur';
c.innerHTML='<svg width="30" height="30" viewBox="0 0 24 24"><path d="M4 2l15 11-6.6 1.2L16 21l-3 1.4-3.6-6.9L4 20z" fill="#fff" stroke="#0f172a" stroke-width="1.3" stroke-linejoin="round"/></svg>';
c.style.cssText='position:fixed;left:900px;top:520px;z-index:100000;pointer-events:none;transition:left .7s cubic-bezier(.45,.05,.25,1),top .7s cubic-bezier(.45,.05,.25,1);filter:drop-shadow(0 3px 6px rgba(0,0,0,.45))';
document.body.appendChild(c);
window.__move=(x,y,d)=>{c.style.transitionDuration=d+'s';c.style.left=(x-4)+'px';c.style.top=(y-3)+'px';};
window.__ripple=(x,y)=>{const r=document.createElement('div');r.style.cssText=`position:fixed;left:${x-22}px;top:${y-22}px;width:44px;height:44px;border-radius:50%;border:3px solid #005eb8;z-index:99999;pointer-events:none;opacity:.9;transform:scale(.3);transition:all .45s ease-out`;
document.body.appendChild(r);requestAnimationFrame(()=>{r.style.transform='scale(1.4)';r.style.opacity=0});setTimeout(()=>r.remove(),500);};
window.__scroll=(y,d)=>{const s=scrollY,t0=performance.now();const f=n=>{const p=Math.min(1,(n-t0)/(d*1000));const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;scrollTo(0,s+(y-s)*e);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f);};
const st=document.createElement('style');st.textContent='html{scroll-behavior:auto!important}';document.head.appendChild(st);}"""

TOAST_JS = """(t)=>{const e=document.createElement('div');e.textContent=t;e.style.cssText='position:fixed;right:40px;top:90px;z-index:99999;padding:14px 22px;border-radius:12px;background:#065f46;color:#ecfdf5;font:600 18px -apple-system,Helvetica,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.4);transform:translateY(-10px);opacity:0;transition:all .3s';document.body.appendChild(e);requestAnimationFrame(()=>{e.style.opacity=1;e.style.transform='none'});setTimeout(()=>{e.style.opacity=0},2200);setTimeout(()=>e.remove(),2600);}"""

class Driver:
    def __init__(self, pg, t0):
        self.pg, self.t0 = pg, t0
        pg.evaluate(CURSOR_JS)

    def at(self, t):  # wait until local scene time t
        d = self.t0 + t - time.time()
        if d > 0:
            time.sleep(d)

    def center(self, sel):
        loc = self.pg.locator(sel).first
        b = loc.bounding_box()
        return b['x'] + b['width'] / 2, b['y'] + b['height'] / 2

    def glide(self, sel=None, xy=None, dur=0.7):
        x, y = xy if xy else self.center(sel)
        self.pg.evaluate('([x,y,d])=>window.__move(x,y,d)', [x, y, dur]); time.sleep(dur)
        return x, y

    def click(self, sel, at=None, dur=0.7):
        if at is not None:
            self.at(at - dur)
        x, y = self.glide(sel, dur=dur)
        self.pg.evaluate('([x,y])=>window.__ripple(x,y)', [x, y])
        self.pg.locator(sel).first.click()

    def scroll_to(self, sel, offset=150, dur=1.2):
        y = self.pg.evaluate('([s,o])=>{const e=document.querySelector(s)||[...document.querySelectorAll("*")].find(n=>n.textContent.trim().startsWith(s));return e.getBoundingClientRect().top+scrollY-o}', [sel, offset])
        self.pg.evaluate('([y,d])=>window.__scroll(y,d)', [y, dur]); time.sleep(dur + 0.1)

    def scroll_by(self, dy, dur=1.4):
        self.pg.evaluate('([dy,d])=>window.__scroll(scrollY+dy,d)', [dy, dur]); time.sleep(dur + 0.1)

    def text_xy(self, text):
        b = self.pg.get_by_text(text, exact=False).first.bounding_box()
        return b['x'] + min(b['width'], 300) / 2, b['y'] + b['height'] / 2

TAB = lambda t: f"button:has-text('{t}')"

def drive_scene(name, d, cues, end):
    pg, lbl = d.pg, (lambda t: pg.evaluate(LABEL_JS, t))
    if name == 's2_paste':
        d.glide(xy=(640, 260), dur=1.5); d.at(2.5); d.glide(xy=(760, 330), dur=2.5)
        d.at(cues['copy'] - 0.2); pg.evaluate(TOAST_JS, '📋  Letter copied to clipboard'); lbl('Copy any letter → press Ctrl+V anywhere')
        d.glide('#document-paste-area', dur=0.6)
        d.at(cues['press'] + 0.2); pg.evaluate(KEYCAP_JS); time.sleep(.5)
        pg.evaluate("(t)=>{const dt=new DataTransfer();dt.setData('text/plain',t);window.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true}))}", d.raw)
        time.sleep(1.6); lbl('Equalized in one keystroke'); d.glide(xy=(700, 420), dur=1.2)
    elif name == 's3_levels':
        lbl('Level 1 · Plain English'); d.glide(xy=d.text_xy('30-Second Bottom Line'), dur=1.0)
        d.at(LEAD + 2.0); d.scroll_by(260, 2.0); d.glide(xy=(520, 420), dur=1.5); d.glide(xy=(900, 470), dur=2.0)
        d.at(cues['every'] - 1.0); lbl('Level 1 · Jargon, explained word by word'); d.scroll_to('Demystified', 160, 1.4)
        d.glide(xy=(420, 330), dur=1.0); d.glide(xy=(980, 360), dur=1.4)
        d.at(cues['second'] - 2.2); d.scroll_to('#analysis-section', 70, 1.0)
        d.click(TAB('2. Your Legal Rights'), at=cues['second'] + 0.3); lbl('Level 2 · Statutory rights (NICE NG17, NHS Constitution)')
        time.sleep(0.8); d.scroll_by(240, 1.8); d.glide(xy=d.text_xy('NICE Guideline NG17'), dur=1.0)
        d.at(cues['third'] - 2.0); d.scroll_to('#analysis-section', 70, 1.0)
        d.click(TAB('3. Action Checklist'), at=cues['third'] + 0.3); lbl('Level 3 · Action checklist with progress')
        time.sleep(0.6); d.scroll_by(200, 1.2)
        d.click('text=Download the Auto-Drafted Appeal Letter below', at=cues['evidence'])
        d.click('text=Contact your Consultant Endocrinologist', at=cues['evidence'] + 1.4)
        d.click('text=Export your 14-day or 30-day', at=cues['progress'])
    elif name == 's4_appeal':
        d.click(TAB('4. Auto-Drafted Appeal'), at=LEAD + 0.4); lbl('Level 4 · Formal appeal letter, legal grounds included')
        time.sleep(0.6); d.scroll_by(320, 2.4); d.glide(xy=(560, 520), dur=1.2); d.scroll_by(180, 1.6)
        d.at(cues['one'] - 2.2); d.scroll_to('#analysis-section', 70, 1.0)
        d.click("button:has-text('Copy Appeal Letter')", at=cues['one'] + 0.4)
        d.click(TAB('5. Smart Form Bridge'), at=cues['fifth'] + 0.3); lbl('Level 5 · Smart Form Bridge for portal questions')
        time.sleep(0.6); d.scroll_by(260, 2.2); d.glide(xy=(600, 470), dur=1.4); d.scroll_by(220, 2.0); d.glide(xy=(900, 520), dur=1.6)
    elif name == 's5_assist':
        d.scroll_to('#analysis-section', 70, 0.8); pg.click(TAB('1. Plain English')); time.sleep(.3)
        d.scroll_to('What This Document Actually Means', 230, 0.8)
        d.click("button:has-text('Bionic Focus')", at=cues['bionic'] + 0.2); lbl('Bionic Focus')
        d.glide(xy=(520, 470), dur=1.2)
        d.click("button:has-text('Dyslexia Font')", at=cues['font']); lbl('Dyslexia-friendly font')
        d.click("button[title*='High Contrast']", at=cues['contrast'] - 0.1); lbl('WCAG AAA high contrast')
        d.click("button[title*='High Contrast']", at=cues['listen'] + 1.6, dur=0.4)
        d.click("button[aria-label='Play audio narration of document summary']", at=cues['listen'] + 2.6); lbl('Listen aloud · adjustable speed')
    d.at(end)

def record_app_scenes(cue_table, targets):
    from playwright.sync_api import sync_playwright
    raw = json.loads((BUILD / 'scen.json').read_text())[0]['raw']
    offsets = json.loads((BUILD / 'offsets.json').read_text())
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        for name, cues in cue_table.items():
            tmp = BUILD / f'tmp_{name}'; tmp.mkdir(exist_ok=True)
            for f in tmp.glob('*.webm'):
                f.unlink()
            vp = {'width': 1280, 'height': 720}
            ctx = browser.new_context(viewport=vp, record_video_dir=str(tmp), record_video_size=vp)
            t_open = time.time(); pg = ctx.new_page(); pg.goto(APP); pg.wait_for_selector('text=Paste from Clipboard'); time.sleep(.8)
            if name != 's2_paste':
                pg.evaluate("(t)=>{const dt=new DataTransfer();dt.setData('text/plain',t);window.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true}))}", raw)
                time.sleep(1.5); pg.evaluate("document.getElementById('analysis-section').scrollIntoView()"); time.sleep(.6)
                pg.evaluate("window.scrollBy(0,-70)"); time.sleep(.3)
            t0 = time.time(); d = Driver(pg, t0); d.raw = raw
            drive_scene(name, d, cues, targets[name] + 1.0)
            ctx.close()
            vid = next(tmp.glob('*.webm')); vid.replace(BUILD / f'{name}.webm'); tmp.rmdir()
            offsets[name] = round(t0 - t_open, 2)
            print(f'  recorded {name}: {targets[name]:.1f}s scene, live-timed to {len(cues)} cue(s)')
        browser.close()
    (BUILD / 'offsets.json').write_text(json.dumps(offsets, indent=2))

# ---------------------------------------------------------------- moving cards

PUSH_CSS = ".wrap,.c,.term{animation:push var(--dur) linear forwards;transform-origin:50% 45%}@keyframes push{from{transform:scale(1)}to{transform:scale(1.045)}}"

def record_cards(lengths):
    from playwright.sync_api import sync_playwright
    offsets = json.loads((BUILD / 'offsets.json').read_text())
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        for name, length in lengths.items():
            html_doc, _ = CARDS[name]()
            extra = PUSH_CSS.replace('var(--dur)', f'{length:.1f}s')
            if name == 's1_problem':  # jargon lights up in the letter while it scrolls
                extra += ".jg{background:transparent;transition:background .5s,color .5s;border-radius:4px;padding:0 2px}.jg.on{background:#fecaca;color:#991b1b}"
                for term in ['adjudicate', 'clinical exceptionalism', 'nocturnal hypoglycaemic excursions', 'titrated to maximum clinical', 'pursuant to', 'hereby REFUSED', 'substantive procedural defects']:
                    html_doc = re.sub(f'({re.escape(term)})', r"<span class='jg'>\1</span>", html_doc, count=1, flags=re.I)
                html_doc = html_doc.replace('</script>', "document.querySelectorAll('.jg').forEach((e,i)=>setTimeout(()=>e.classList.add('on'),1500+i*1700));</script>")
            html_doc = nhsify(html_doc, terminal=(name == 's6b_terminal'))
            html_doc = html_doc.replace('</style>', extra + '</style>', 1)
            f = BUILD / f'{name}.html'; f.write_text(html_doc)
            tmp = BUILD / f'tmp_{name}'; tmp.mkdir(exist_ok=True)
            for x in tmp.glob('*.webm'):
                x.unlink()
            ctx = browser.new_context(viewport={'width': W, 'height': H}, record_video_dir=str(tmp), record_video_size={'width': W, 'height': H})
            t_open = time.time(); pg = ctx.new_page(); pg.goto(f.as_uri()); ready = time.time(); time.sleep(length); ctx.close()
            next(tmp.glob('*.webm')).replace(BUILD / f'{name}.webm'); tmp.rmdir()
            offsets[name] = round(ready - t_open, 2)
            print(f'  recorded {name}: {length:.1f}s with push-in')
        browser.close()
    (BUILD / 'offsets.json').write_text(json.dumps(offsets, indent=2))

# ---------------------------------------------------------------- overlays and compositing

LT_HTML = {
    'intro': ("Ctrl+V Access", "Ctrl+V Hackathon 2026 · AI equalizer for bureaucratic letters"),
    'read': ("Built for how people actually read", "Bionic focus · dyslexia font · high contrast · read aloud"),
    'bench': ("Benchmarks", "Measured, not claimed"),
}

def render_lower_thirds():
    from playwright.sync_api import sync_playwright
    css = ("html,body{margin:0;width:1920px;height:1080px;background:transparent;font-family:Arial,sans-serif}"
           ".lt{position:absolute;left:90px;bottom:90px;padding:26px 40px 28px;border-radius:4px;background:#005eb8;"
           "box-shadow:0 12px 40px rgba(0,0,0,.35)}.t{font-size:52px;font-weight:700;color:#fff;letter-spacing:-.01em}.s{font-size:28px;color:#fff;margin-top:6px;opacity:.92}"
           ".logo{color:#fff}")
    pages = {k: f"<div class='lt'><div class='t{' logo' if k == 'intro' else ''}'>{t}</div><div class='s'>{s}</div></div>" for k, (t, s) in LT_HTML.items()}
    pages['outro'] = ("<div class='lt' style='left:90px;right:90px;bottom:70px;display:flex;align-items:center;justify-content:space-between'>"
                      "<div><div class='t logo' style='font-size:64px'>Ctrl+V Access</div><div class='s'>Paste the letter. Get your rights back.</div>"
                      "<div class='s' style='font-size:22px;font-family:Menlo,monospace'>github.com/shahaman098/ctrl-v-access</div></div>"
                      "<div style='text-align:right'><div class='s' style='font-size:20px;letter-spacing:.14em'>THANK YOU</div>"
                      "<div class='t' style='font-size:34px'>ADHAYAN</div><div class='s' style='font-size:24px'>Prize sponsor · Adaption Platform</div></div></div>")
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME, headless=True); pg = b.new_page(viewport={'width': W, 'height': H})
        for k, body in pages.items():
            pg.set_content(f"<html><head><style>{css}</style></head><body>{body}</body></html>")
            pg.screenshot(path=str(BUILD / f'lt_{k}.png'), omit_background=True)
        b.close()

def face_clips(mov, ranges):
    """Full-frame face clip per scene, cut from the same ranges as the bubble so both stay in sync with the voice."""
    for k, rs in enumerate(ranges):
        fv = ''.join(f'[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS,crop={FULL_CROP},scale={W}:{H}:flags=lanczos,fps=30[v{i}];' for i, (s, e) in enumerate(rs))
        fv += ''.join(f'[v{i}]' for i in range(len(rs))) + f'concat=n={len(rs)}:v=1:a=0[fv]'
        ff('-i', str(mov), '-filter_complex', fv, '-map', '[fv]', '-c:v', 'libx264', '-crf', '18', '-an', str(BUILD / f'facefull{k+1}.mp4'))

def compose_scene(k, target, windows, lts):
    """windows: [(a,b)] local seconds where the presenter is full-screen; lts: [(png, a, b)] lower thirds."""
    en = '+'.join(f'between(t,{a:.3f},{b:.3f})' for a, b in windows) or '0'
    r = v1.BUBBLE / 2; R = v1.BUBBLE / 2 + v1.RING
    disc = lambda rad: f"geq=lum='p(X,Y)':cb='p(X,Y)':cr='p(X,Y)':a='if(lte(hypot(X-W/2,Y-H/2),{rad}),255,0)'"
    x, y = W - v1.BUBBLE - 2 * v1.RING - v1.MARGIN, H - v1.BUBBLE - 2 * v1.RING - v1.MARGIN
    fc = (f"[1:v]format=yuva444p,{disc(r - 1)},tpad=start_duration={LEAD}:start_mode=clone:stop_duration={TAIL + 1}:stop_mode=clone[f];"
          f"color=c=0x005eb8:s={v1.BUBBLE + 2 * v1.RING}x{v1.BUBBLE + 2 * v1.RING},format=yuva444p,{disc(R - 1)}[ring];"
          f"[0:v][ring]overlay={x}:{y}:shortest=1:enable='not({en})'[b];[b][f]overlay={x + v1.RING}:{y + v1.RING}:eof_action=repeat:enable='not({en})'[c];"
          f"[2:v]tpad=start_duration={LEAD}:start_mode=clone:stop_duration={TAIL + 1}:stop_mode=clone[F];"
          f"[c][F]overlay=0:0:eof_action=repeat:enable='{en}'[d0];")
    last = 'd0'
    for i, (png, a, b) in enumerate(lts):
        fc += (f"[{4 + i}:v]format=rgba,fade=t=in:st={a + 0.3:.3f}:d=0.45:alpha=1,fade=t=out:st={max(a + 0.8, b - 0.5):.3f}:d=0.45:alpha=1[l{i}];"
               f"[{last}][l{i}]overlay=0:0:shortest=1[d{i + 1}];")
        last = f'd{i + 1}'
    fc += f"[{last}]format=yuv420p,fps=30[v];[3:a]adelay={int(LEAD * 1000)}|{int(LEAD * 1000)},apad[a]"
    args = ['-i', str(BUILD / f'v{k+1}.mp4'), '-i', str(BUILD / f'face{k+1}.mp4'), '-i', str(BUILD / f'facefull{k+1}.mp4'), '-i', str(BUILD / f'nar{k+1}.wav')]
    for png, _, _ in lts:
        args += ['-loop', '1', '-t', f'{target + 1:.2f}', '-i', str(png)]
    out = BUILD / f'seg{k+1}.mp4'
    ff(*args, '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-t', f'{target:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
       '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', str(out))
    return out

def build_visual(k, vis, target, offsets, pre=0.0):
    """Fit scene visuals to target; `pre` seconds of the card's first frame are held while the presenter is full-screen."""
    out = BUILD / f'v{k+1}.mp4'
    if len(vis) == 2:
        a = 6.0
        v1.fit(BUILD / f'{vis[0]}.webm', offsets[vis[0]], a, BUILD / f'v{k+1}a.mp4', 1.0)
        v1.fit(BUILD / f'{vis[1]}.webm', offsets[vis[1]], target - a, BUILD / f'v{k+1}b.mp4', 1.0)
        (BUILD / 'c.txt').write_text(f"file 'v{k+1}a.mp4'\nfile 'v{k+1}b.mp4'\n")
        ff('-f', 'concat', '-safe', '0', '-i', str(BUILD / 'c.txt'), '-c', 'copy', str(out))
    elif pre > 0:
        v1.fit(BUILD / f'{vis[0]}.webm', offsets[vis[0]], target - pre, BUILD / f'v{k+1}x.mp4', 1.0)
        ff('-i', str(BUILD / f'v{k+1}x.mp4'), '-vf', f'tpad=start_duration={pre:.3f}:start_mode=clone', '-c:v', 'libx264', '-crf', '18', str(out))
    else:
        v1.fit(BUILD / f'{vis[0]}.webm', offsets[vis[0]], target, out, 1.0)

def crossfade_all(segs, out):
    durs = [duration(s) for s in segs]
    args, fc, off = [], '', 0.0
    for s in segs:
        args += ['-i', str(s)]
    vl, al = '[0:v]', '[0:a]'
    for i in range(1, len(segs)):
        off += durs[i - 1] - XF
        fc += f"{vl}[{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[xv{i}];{al}[{i}:a]acrossfade=d={XF}[xa{i}];"
        vl, al = f'[xv{i}]', f'[xa{i}]'
    ff(*args, '-filter_complex', fc.rstrip(';'), '-map', vl, '-map', al, '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
       '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out))

# ---------------------------------------------------------------- main

def main(mov, bounds, words_json):
    words = json.loads(Path(words_json).read_text())
    ranges = scene_ranges(words, bounds)
    targets = [sum(e - s for s, e in rs) + LEAD + TAIL for rs in ranges]
    loc = lambda k, pat: to_local(word_time(words, pat, bounds[k], bounds[k + 1]), ranges[k])
    cue_table = {
        's2_paste': {'copy': loc(1, '^copy'), 'press': loc(1, '^press')},
        's3_levels': {'every': loc(2, '^every$'), 'second': loc(2, '^second'), 'third': loc(2, '^third'), 'evidence': loc(2, '^evidence'), 'progress': loc(2, '^progress')},
        's4_appeal': {'one': loc(3, '^one$'), 'fifth': loc(3, '^fifth')},
        's5_assist': {'bionic': loc(4, '^bionic'), 'font': loc(4, 'font'), 'contrast': loc(4, '^contrast'), 'listen': loc(4, '^listen')},
    }
    app_targets = {n: targets[i + 1] for i, n in enumerate(cue_table)}
    print('scene targets:', [round(t, 1) for t in targets])
    if '--skip-record' not in sys.argv:
        print('1/4 voice + face clips'); v1.split_presenter(mov, bounds, words_json); face_clips(mov, ranges)
        print('2/4 live app scenes'); record_app_scenes(cue_table, app_targets)
        print('3/4 moving cards')
        record_cards({'s1_problem': targets[0] + 2, 's6a_stack': 8, 's6b_terminal': targets[5] - 4, 's7_bench': targets[6] + 2, 's8_close': targets[7] + 2})
        render_lower_thirds()
    print('4/4 compose')
    offsets = json.loads((BUILD / 'offsets.json').read_text())
    segs = []
    for k, vis in enumerate(v1.SCENE_VISUALS):
        wins, lts, pre = [], [], 0.0
        for (sk, a, b, lt) in FULL_WINDOWS:
            if sk != k:
                continue
            la = 0.0 if a is None else to_local(a, ranges[k])
            lb = targets[k] if b is None else to_local(b, ranges[k])
            wins.append((la, lb))
            if lt:
                lts.append((BUILD / f'lt_{lt}.png', la, lb))
            if la == 0.0 and vis[0] in CARDS and lb < targets[k] - 1.0:  # a fully covered scene needs no hold
                pre = lb
        build_visual(k, vis, targets[k], offsets, pre)
        segs.append(compose_scene(k, targets[k], wins, lts))
        print(f'  scene {k+1}: {targets[k]:.1f}s, full-screen {[(round(a, 1), round(b, 1)) for a, b in wins]}')
    out = v1.ROOT / 'video' / 'ctrl-v-access-final.mp4'
    crossfade_all(segs, out)
    print(f'Wrote {out.relative_to(v1.ROOT)} ({duration(out):.1f}s)')

if __name__ == '__main__':
    main(sys.argv[1], [float(x) for x in sys.argv[2].split(',')], sys.argv[3])
