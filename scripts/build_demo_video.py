"""Build the narrated Ctrl+V Access demo video.

  python3 scripts/build_demo_video.py visuals          # record cards + app scenes -> video/build/scene*.webm
  python3 scripts/build_demo_video.py assemble AUDIO   # cut narration into 8 scenes, fit visuals, mux -> video/ctrl-v-access-final.mp4
  python3 scripts/build_demo_video.py presenter TAKE.mov BOUNDS words.json   # camera take: voice + face bubble, scenes cut at BOUNDS

Needs: backend on :3001 (npm run server) and the built app on :4173 (npm run build && npm run preview).
AUDIO may be one file with ~2s pauses between scenes, or a folder holding scene1.* ... scene8.*.
"""
import html, json, os, re, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / 'video' / 'build'
EVID = ROOT / 'video' / 'evidence'
W, H = 1920, 1080
APP = 'http://localhost:4173'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
N_SCENES = 8

# Narration word counts per scene (from video/DEMO_SCRIPT.md), used only as a fallback for splitting audio.
SCENE_WORDS = [76, 24, 67, 46, 28, 73, 56, 31]

BASE_CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#020617;color:#e2e8f0;
 font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif}
.glow{position:absolute;inset:0;background:radial-gradient(900px 500px at 15% 10%,rgba(99,102,241,.22),transparent 60%),
 radial-gradient(800px 500px at 90% 95%,rgba(16,185,129,.14),transparent 60%)}
.wrap{position:relative;padding:90px 120px;height:100%}
.kicker{font-size:26px;letter-spacing:.18em;text-transform:uppercase;color:#818cf8;font-weight:700}
h1{font-size:76px;line-height:1.05;font-weight:800;letter-spacing:-.02em;margin-top:18px;color:#f8fafc}
.fade{opacity:0;transform:translateY(18px);animation:in .7s ease forwards}
@keyframes in{to{opacity:1;transform:none}}
.mono{font-family:'SF Mono',Menlo,Monaco,monospace}
.src{position:absolute;left:120px;bottom:50px;font-size:20px;color:#64748b}
"""

def page(body, css='', js=''):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{BASE_CSS}{css}</style></head><body><div class='glow'></div>{body}<script>{js}</script></body></html>"

def d(i):  # animation delay helper
    return f"style='animation-delay:{i}s'"

# ---------------------------------------------------------------- cards

def card_problem():
    scen = json.loads((BUILD / 'scen.json').read_text())[0]
    letter = html.escape(scen['raw'])
    css = """.cols{display:grid;grid-template-columns:1.25fr 1fr;gap:70px;margin-top:36px;height:800px}
    .letter{background:#f8fafc;color:#1e293b;border-radius:14px;padding:44px 50px;font-family:Georgia,serif;font-size:21px;line-height:1.55;
      white-space:pre-wrap;overflow:hidden;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.5)}
    .letter .inner{animation:scroll 32s linear forwards}
    @keyframes scroll{to{transform:translateY(-55%)}}
    .stat{margin-bottom:26px}.big{font-size:96px;font-weight:800;line-height:1;color:#f87171}
    .lbl{font-size:26px;color:#cbd5e1;margin-top:6px}.green{color:#34d399}"""
    body = f"""<div class='wrap'><div class='kicker fade'>The administrative wall</div>
    <div class='cols'><div class='letter fade' {d(.3)}><div class='inner'>{letter}</div></div>
    <div><div class='stat fade' {d(1.2)}><div class='big'>217</div><div class='lbl'>words of legal &amp; clinical language</div></div>
    <div class='stat fade' {d(2.4)}><div class='big'>18+</div><div class='lbl'>Flesch-Kincaid grade, above university level<br><span style='color:#64748b;font-size:22px'>textstat independent check: 19.9</span></div></div>
    <div class='stat fade' {d(3.6)}><div class='big green'>65%</div><div class='lbl'>of UK disability benefit (PIP) decisions heard at tribunal are overturned<br><span style='color:#64748b;font-size:22px'>DWP PIP Official Statistics to April 2026, Table 5Aii · initial decisions Jan 2021–Dec 2025</span></div></div>
    </div></div></div>"""
    return page(body, css), 34

def card_stack():
    groups = [
        ('Frontend', ['React 18', 'TypeScript 5.7', 'Vite 6', 'Tailwind CSS', 'Lucide icons']),
        ('Backend', ['Node.js', 'Express 5', 'REST API · 5 endpoints', 'CORS', 'tsx']),
        ('AI engine', ['Google Gemini via @google/genai', 'Local Flesch-Kincaid NLP fallback', 'JSON-schema prompting']),
        ('Accessibility', ['Web Speech API (TTS)', 'Async Clipboard API', 'WAI-ARIA live regions', 'WCAG AAA contrast mode', 'Lexend dyslexia font']),
        ('Tooling', ['Playwright', 'FFmpeg', 'textstat (benchmarks)']),
    ]
    css = """.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:28px;margin-top:70px}
    .g{background:rgba(15,23,42,.85);border:1px solid #1e293b;border-radius:18px;padding:32px 28px;min-height:520px}
    .g h3{font-size:28px;color:#a5b4fc;margin-bottom:26px}.chip{font-size:24px;padding:14px 16px;margin-bottom:14px;border-radius:10px;
    background:#0f172a;border:1px solid #334155;color:#e2e8f0}"""
    cols = ''.join(f"<div class='g fade' {d(.4+i*.35)}><h3>{n}</h3>" + ''.join(f"<div class='chip'>{c}</div>" for c in cs) + '</div>'
                   for i, (n, cs) in enumerate(groups))
    body = f"<div class='wrap'><div class='kicker fade'>Under the hood</div><h1 class='fade' {d(.15)}>Tech stack</h1><div class='grid'>{cols}</div></div>"
    return page(body, css), 10

def card_terminal():
    text = (EVID / 'terminal.txt').read_text()
    blocks = [b.strip('\n') for b in re.split(r'\n(?=\$ )', text.strip())]
    data = json.dumps([{'cmd': b.split('\n', 1)[0][2:], 'out': b.split('\n', 1)[1] if '\n' in b else ''} for b in blocks])
    css = """.term{position:absolute;left:70px;right:390px;top:60px;bottom:60px;background:#0b1020;border:1px solid #1e293b;border-radius:16px;
    box-shadow:0 30px 90px rgba(0,0,0,.6);overflow:hidden}.bar{height:54px;background:#111827;display:flex;align-items:center;padding:0 22px;gap:12px}
    .dot{width:16px;height:16px;border-radius:50%}.title{margin-left:20px;color:#94a3b8;font-size:20px}
    #s{padding:24px 30px;font-size:21px;line-height:1.42;white-space:pre-wrap;color:#cbd5e1;height:calc(100% - 54px);overflow:hidden}
    .p{color:#34d399}.c{color:#f8fafc}.k{color:#93c5fd}.v{color:#fbbf24}.cm{color:#64748b}.hl{color:#f472b6;font-weight:700}"""
    body = """<div class='term mono'><div class='bar'><div class='dot' style='background:#ef4444'></div><div class='dot' style='background:#f59e0b'></div>
    <div class='dot' style='background:#22c55e'></div><div class='title'>ctrl-v-access — live API capture · localhost:3001</div></div><div id='s'></div></div>"""
    js = f"""const B={data};const s=document.getElementById('s');
    const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
    const col=l=>{{if(l.startsWith('#'))return `<span class='cm'>${{esc(l)}}</span>`;
      let h=esc(l).replace(/(&quot;|")([^"]+)("\\s*:)/g,"<span class='k'>\\"$2\\"</span>:").replace(/:\\s*("[^"]*"|[\\d.]+|true|false)/g,(m,v)=>': <span class=\\'v\\'>'+v+'</span>');
      return h.replace(/(local-hybrid-nlp|rule-based-nlp-v2|HTTP 200)/g,"<span class='hl'>$1</span>");}};
    async function run(){{for(const b of B){{const line=document.createElement('div');s.appendChild(line);line.innerHTML="<span class='p'>$ </span>";
      const c=document.createElement('span');c.className='c';line.appendChild(c);
      for(const ch of b.cmd){{c.textContent+=ch;await new Promise(r=>setTimeout(r,14));}}
      await new Promise(r=>setTimeout(r,350));
      for(const l of b.out.split('\\n')){{const o=document.createElement('div');o.innerHTML=col(l)||'&nbsp;';s.appendChild(o);s.scrollTop=s.scrollHeight;await new Promise(r=>setTimeout(r,55));}}
      s.appendChild(document.createElement('br'));s.scrollTop=s.scrollHeight;await new Promise(r=>setTimeout(r,900));}}}}
    setTimeout(run,400);"""
    return page(body, css, js), 28

def card_bench():
    rows = []
    for line in (EVID / 'benchmark.txt').read_text().splitlines():
        m = re.match(r'(\S+)\s+(\d+) -> (\d+)\s*\(-(\d+)%\)\s+([\d.]+) -> ([\d.]+)\s+([\d.]+) -> ([\d.]+)\s+([\d.]+) -> ([\d.]+)\s+([\d.]+) ms', line)
        if m:
            rows.append(m.groups())
    names = {'healthcare-denial': 'NHS glucose monitor denial', 'disability-pip': 'PIP 0-points award',
             'university-dsa': 'University exam support denial', 'housing-assistance': 'Housing voucher termination'}
    css = """table{width:100%;border-collapse:collapse;margin-top:56px;font-size:28px}
    th{text-align:left;color:#94a3b8;font-weight:600;font-size:22px;letter-spacing:.06em;text-transform:uppercase;padding:0 18px 18px;border-bottom:2px solid #334155}
    td{padding:26px 18px;border-bottom:1px solid #1e293b}.a{color:#f87171}.b{color:#34d399;font-weight:700}.n{color:#f8fafc;font-weight:600}
    .bar{height:12px;border-radius:6px;background:#1e293b;margin-top:10px;width:260px;overflow:hidden}.bar i{display:block;height:100%;background:#34d399;width:0;animation:grow 1.4s ease forwards}
    @keyframes grow{to{width:var(--w)}}"""
    trs = ''
    for i, r in enumerate(rows):
        fk_cap = '18+' if float(r[4]) >= 18 else r[4]
        trs += (f"<tr class='fade' {d(.8+i*.5)}><td class='n'>{names.get(r[0], r[0])}</td>"
                f"<td><span class='a'>{r[1]}</span> → <span class='b'>{r[2]}</span> <span style='color:#94a3b8'>(−{r[3]}%)</span>"
                f"<div class='bar'><i style='--w:{r[3]}%;animation-delay:{1+i*.5}s'></i></div></td>"
                f"<td><span class='a'>{fk_cap}</span> → <span class='b'>{r[5]}</span></td><td><span class='a'>{r[6]}</span> → <span class='b'>{r[7]}</span></td>"
                f"<td><span class='a'>{r[8]}</span> → <span class='b'>{r[9]}</span></td><td class='mono'>{r[10]} ms</td></tr>")
    body = f"""<div class='wrap'><div class='kicker fade'>Benchmarks · measured, not claimed</div><h1 class='fade' {d(.15)}>Original notice → Ctrl+V Access</h1>
    <table><tr><th>Case study</th><th>Words</th><th>FK grade (app)</th><th>FK grade (textstat)</th><th>Dale-Chall</th><th>Local engine</th></tr>{trs}</table>
    <div class='src'>Flesch-Kincaid via the app's own engine and the independent textstat 0.7.13 library · engine time = mean of 1,000 runs · raw output: video/evidence/benchmark.txt</div></div>"""
    return page(body, css), 28

def card_close():
    css = """.c{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center}
    .sp{display:flex;gap:40px;margin:46px 0 80px}.box{padding:30px 54px;border-radius:18px;border:1px solid #334155;background:rgba(15,23,42,.85)}
    .box small{display:block;font-size:20px;color:#94a3b8;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}.box b{font-size:44px;color:#f8fafc}
    .logo{font-size:120px;font-weight:900;letter-spacing:-.03em;background:linear-gradient(90deg,#a5b4fc,#34d399);-webkit-background-clip:text;color:transparent}
    .tag{font-size:42px;color:#e2e8f0;margin-top:14px}.url{font-size:28px;color:#94a3b8;margin-top:40px}"""
    body = f"""<div class='c'><div class='kicker fade'>Thank you</div><div class='sp'>
    <div class='box fade' {d(.4)}><small>Organiser</small><b>ADHAYAN</b></div><div class='box fade' {d(.8)}><small>Prize sponsor</small><b>Adaption Platform</b></div></div>
    <div class='logo fade' {d(2.6)}>Ctrl+V Access</div><div class='tag fade' {d(3.2)}>Paste the letter. Get your rights back.</div>
    <div class='url mono fade' {d(3.8)}>github.com/shahaman098/ctrl-v-access · Ctrl+V Hackathon 2026</div></div>"""
    return page(body, css), 18

CARDS = {'s1_problem': card_problem, 's6a_stack': card_stack, 's6b_terminal': card_terminal, 's7_bench': card_bench, 's8_close': card_close}

# ---------------------------------------------------------------- app scenes

LABEL_JS = """(t)=>{let e=document.getElementById('__lbl');if(!e){e=document.createElement('div');e.id='__lbl';
e.style.cssText='position:fixed;left:28px;bottom:28px;z-index:99999;padding:12px 20px;border-radius:12px;background:rgba(2,6,23,.88);'+
'border:1px solid #6366f1;color:#e0e7ff;font:600 18px -apple-system,Helvetica,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5);transition:opacity .3s';
document.body.appendChild(e);}e.textContent=t;e.style.opacity=t?1:0;}"""

KEYCAP_JS = """()=>{const e=document.createElement('div');e.innerHTML='<span>Ctrl</span> + <span>V</span>';
e.style.cssText='position:fixed;left:50%;top:42%;transform:translate(-50%,-50%) scale(.8);z-index:99999;font:800 64px -apple-system,Helvetica,sans-serif;'+
'color:#fff;padding:26px 46px;border-radius:22px;background:rgba(79,70,229,.95);box-shadow:0 20px 60px rgba(79,70,229,.55);opacity:0;transition:all .25s';
document.body.appendChild(e);requestAnimationFrame(()=>{e.style.opacity=1;e.style.transform='translate(-50%,-50%) scale(1)'});
setTimeout(()=>{e.style.opacity=0},1300);setTimeout(()=>e.remove(),1700);}"""

def scene_app(page, name, raw_letter):
    lbl = lambda t: page.evaluate(LABEL_JS, t)
    tab = lambda t: page.click(f"button:has-text('{t}')")
    to_analysis = lambda: page.evaluate("document.getElementById('analysis-section').scrollIntoView({behavior:'smooth'})")
    if name == 's2_paste':
        lbl('Copy any letter → press Ctrl+V anywhere'); time.sleep(2.5)
        page.evaluate(KEYCAP_JS); time.sleep(.6)
        page.evaluate("(t)=>{const dt=new DataTransfer();dt.setData('text/plain',t);window.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true}))}", raw_letter)
        time.sleep(3.5); lbl('Equalized in one keystroke'); time.sleep(3)
    elif name == 's3_levels':
        to_analysis(); lbl('Level 1 · Plain English + jargon dictionary'); time.sleep(3)
        page.mouse.wheel(0, 380); time.sleep(3.5); page.mouse.wheel(0, 380); time.sleep(3)
        to_analysis(); time.sleep(1); tab('2. Your Legal Rights'); lbl('Level 2 · Statutory rights (NICE NG17, NHS Constitution)'); time.sleep(4.5)
        page.mouse.wheel(0, 300); time.sleep(2.5)
        to_analysis(); time.sleep(1); tab('3. Action Checklist'); lbl('Level 3 · Action checklist with progress'); time.sleep(2)
        for t in ['Download the Auto-Drafted Appeal Letter below', 'Contact your Consultant Endocrinologist', 'Export your 14-day or 30-day']:
            page.click(f"text={t}"); time.sleep(1.3)
        time.sleep(1.5)
    elif name == 's4_appeal':
        to_analysis(); time.sleep(.8); tab('4. Auto-Drafted Appeal'); lbl('Level 4 · Formal appeal letter, legal grounds included'); time.sleep(3)
        page.mouse.wheel(0, 350); time.sleep(2.5); page.click("button:has-text('Copy Appeal Letter')"); time.sleep(2.5)
        to_analysis(); time.sleep(.8); tab('5. Smart Form Bridge'); lbl('Level 5 · Smart Form Bridge for portal questions'); time.sleep(3.5)
        page.mouse.wheel(0, 350); time.sleep(3)
    elif name == 's5_assist':
        to_analysis(); time.sleep(.8); tab('1. Plain English'); time.sleep(.8)
        page.evaluate("window.scrollTo({top:0,behavior:'smooth'})"); time.sleep(1)
        lbl('Bionic Focus'); page.click("button:has-text('Bionic Focus')"); time.sleep(.4); to_analysis(); time.sleep(2.2)
        page.evaluate("window.scrollTo({top:0,behavior:'smooth'})"); time.sleep(.8)
        lbl('Dyslexia-friendly font'); page.click("button:has-text('Dyslexia Font')"); time.sleep(.4); to_analysis(); time.sleep(2)
        page.evaluate("window.scrollTo({top:0,behavior:'smooth'})"); time.sleep(.8)
        lbl('WCAG AAA high contrast'); page.click("button[title*='High Contrast']"); time.sleep(2.2)
        page.click("button[title*='High Contrast']"); time.sleep(.6)
        to_analysis(); time.sleep(1); lbl('Listen aloud · adjustable speed')
        page.click("button[aria-label='Play audio narration of document summary']"); time.sleep(4)

APP_SCENES = ['s2_paste', 's3_levels', 's4_appeal', 's5_assist']

def record_visuals():
    from playwright.sync_api import sync_playwright
    BUILD.mkdir(parents=True, exist_ok=True)
    subprocess.run(['npx', 'tsx', str(ROOT / 'scripts' / 'dump_scenarios.ts')], cwd=ROOT, check=True, stdout=open(BUILD / 'scen.json', 'w'))
    raw_letter = json.loads((BUILD / 'scen.json').read_text())[0]['raw']
    offsets = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True, args=['--autoplay-policy=no-user-gesture-required'])
        def rec(name, viewport, scale, fn):
            tmp = BUILD / f'tmp_{name}'
            tmp.mkdir(exist_ok=True)
            for f in tmp.glob('*.webm'):
                f.unlink()
            ctx = browser.new_context(viewport=viewport, device_scale_factor=scale, record_video_dir=str(tmp), record_video_size=viewport)
            t0 = time.time(); pg = ctx.new_page()
            ready = fn(pg) - t0
            hold_until = time.time()
            ctx.close()
            vid = next(tmp.glob('*.webm')); out = BUILD / f'{name}.webm'; vid.replace(out); tmp.rmdir()
            offsets[name] = round(ready, 2)
            print(f'  recorded {name} ({hold_until - t0 - ready:.1f}s usable)')
        only = set(sys.argv[2:])
        for name, fn in CARDS.items():
            if only and name not in only:
                continue
            html_doc, dur = fn()
            f = BUILD / f'{name}.html'; f.write_text(html_doc)
            def show(pg, f=f, dur=dur):
                pg.goto(f.as_uri()); r = time.time(); time.sleep(dur); return r
            rec(name, {'width': W, 'height': H}, 1, show)
        for name in APP_SCENES:
            if only and name not in only:
                continue
            def drive(pg, name=name):
                pg.goto(APP); pg.wait_for_selector("text=Paste from Clipboard"); time.sleep(.8)
                if name != 's2_paste':  # later scenes start with the NHS letter already equalized
                    pg.evaluate("(t)=>{const dt=new DataTransfer();dt.setData('text/plain',t);window.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true}))}", raw_letter)
                    time.sleep(1.5); pg.evaluate("document.getElementById('analysis-section').scrollIntoView()"); time.sleep(.5)
                r = time.time(); scene_app(pg, name, raw_letter); time.sleep(1); return r
            rec(name, {'width': 1280, 'height': 720}, 1, drive)
        browser.close()
    prev = json.loads((BUILD / 'offsets.json').read_text()) if (BUILD / 'offsets.json').exists() else {}
    (BUILD / 'offsets.json').write_text(json.dumps({**prev, **offsets}, indent=2))

# ---------------------------------------------------------------- assembly

def ff(*args):
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', *args], check=True)

def duration(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(path)],
                                capture_output=True, text=True, check=True).stdout)

def split_narration(audio):
    """Return per-scene WAVs. Uses the 7 longest pauses as scene boundaries; falls back to word-count proportions."""
    audio = Path(audio)
    if audio.is_dir():
        files = sorted(audio.glob('scene[1-8].*'), key=lambda f: int(re.search(r'scene(\d)', f.name).group(1)))
        assert len(files) == N_SCENES, f'expected scene1..scene8 in {audio}, found {[f.name for f in files]}'
        outs = []
        for i, f in enumerate(files):
            o = BUILD / f'nar{i+1}.wav'; ff('-i', str(f), '-ac', '2', '-ar', '48000', str(o)); outs.append(o)
        return outs
    full = BUILD / 'narration.wav'
    ff('-i', str(audio), '-vn', '-ac', '2', '-ar', '48000', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', str(full))
    total = duration(full)
    if os.environ.get('CUTS'):  # manual escape hatch: CUTS="12.3,40.1,..." (7 scene boundaries in seconds)
        cuts = [float(x) for x in os.environ['CUTS'].split(',')]
        assert len(cuts) == N_SCENES - 1, 'CUTS needs 7 comma-separated timestamps'
        print(f'  mode: manual CUTS {cuts}')
        return cut_and_override(full, [0, *cuts, total], audio)
    if os.environ.get('WHISPER_PYTHON'):
        try:
            print('  mode: transcript (whisper word timestamps)')
            return apply_overrides(split_by_transcript(full, total), audio)
        except Exception as e:
            print(f'  transcript split failed ({e}); falling back to pause detection')
    print('  mode: pause detection')
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(full), '-af', 'silencedetect=noise=-38dB:d=1.1', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    gaps = [(e - s, (s + e) / 2) for s, e in zip(starts, ends) if s > 1 and e < total - 1]
    if len(gaps) >= N_SCENES - 1:
        cuts = sorted(m for _, m in sorted(gaps, reverse=True)[:N_SCENES - 1])
        print(f'  split on pauses at {[round(c, 1) for c in cuts]}')
    else:
        acc, tw, cuts = 0, sum(SCENE_WORDS), []
        for w in SCENE_WORDS[:-1]:
            acc += w; cuts.append(total * acc / tw)
        print(f'  only {len(gaps)} pauses found; split by word count at {[round(c, 1) for c in cuts]}')
    return cut_and_override(full, [0, *cuts, total], audio)

def apply_overrides(outs, audio):
    """If scene3.m4a (etc.) sits next to the main narration file, it replaces that scene's audio."""
    for i in range(N_SCENES):
        for f in Path(audio).parent.glob(f'scene{i+1}.*'):
            if f.suffix.lower() in ('.wav', '.m4a', '.mp3', '.aiff', '.mov', '.mp4', '.aac', '.caf') and f.resolve() != Path(audio).resolve():
                ff('-i', str(f), '-vn', '-ac', '2', '-ar', '48000', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', str(outs[i]))
                print(f'  scene {i+1}: replaced by {f.name}')
                break
    return outs

def cut_and_override(full, bounds, audio):
    outs = []
    for i in range(N_SCENES):
        o = BUILD / f'nar{i+1}.wav'
        ff('-ss', f'{bounds[i]:.3f}', '-to', f'{bounds[i+1]:.3f}', '-i', str(full), str(o)); outs.append(o)
    return apply_overrides(outs, audio)

WHISPER_SNIPPET = r"""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
# decode with ffmpeg ourselves (sidesteps PyAV version mismatches): 16 kHz mono float32
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
segs, _ = WhisperModel(sys.argv[2], device='cpu', compute_type='int8').transcribe(audio, word_timestamps=True, language='en', vad_filter=False)
print(json.dumps([{'w': w.word, 's': w.start, 'e': w.end} for s in segs for w in s.words]))
"""

NUMS = dict(zip('0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20'.split(),
                'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split()))

def norm(w):
    w = re.sub(r'[^a-z0-9]', '', w.lower())
    w = {'1st': 'first', '2nd': 'second', '3rd': 'third', '4th': 'fourth', '5th': 'fifth'}.get(w, w)
    return {'ctrl': 'control'}.get(w, NUMS.get(w, w))

def script_scenes():
    """Narration text for each scene, read from video/DEMO_SCRIPT.md."""
    t = (ROOT / 'video' / 'DEMO_SCRIPT.md').read_text().split('## Notes')[0]
    out = []
    for block in re.split(r'^## Scene \d.*$', t, flags=re.M)[1:]:
        out.append([' '.join(l[1:].strip() for l in block.split('**NARRATION**')[1].splitlines() if l.startswith('>'))])
    return [o[0] for o in out]

def find_all(words, phrase, lo, hi, thresh=0.72):
    """Start indices in words[lo:hi] where the transcript best matches the first words of phrase (one per local peak)."""
    import difflib
    phrase = re.sub(r'(?i)ctrl\s*\+\s*v', 'control plus v', phrase)  # how speech-to-text spells it
    key = [norm(x) for x in phrase.split()[:5] if norm(x)]
    n = len(key)
    score = {}
    for i in range(lo, max(lo, hi - n + 1)):
        cand = [norm(words[j]['w']) for j in range(i, i + n)]
        if difflib.SequenceMatcher(None, key[0], cand[0]).ratio() < 0.8:
            continue  # the take must start on the sentence's first word
        r = difflib.SequenceMatcher(None, ' '.join(key), ' '.join(cand)).ratio()
        if r >= thresh:
            score[i] = r
    hits = []
    for i in sorted(score):
        if hits and i - hits[-1] < n:
            if score[i] > score[hits[-1]]:
                hits[-1] = i
            continue
        hits.append(i)
    return hits

def split_by_transcript(full, total):
    """Cut scenes at each scene's opening words (last take wins) and drop earlier takes of repeated sentences."""
    model = os.environ.get('WHISPER_MODEL', 'base.en')
    words = json.loads(subprocess.run([os.environ['WHISPER_PYTHON'], '-I', '-c', WHISPER_SNIPPET, str(full), model],
                                      capture_output=True, text=True, check=True).stdout)
    (BUILD / 'transcript.json').write_text(json.dumps(words, indent=1))
    print('  transcript:', ' '.join(w['w'].strip() for w in words)[:300], '...')
    scenes = script_scenes()
    first, last, lo = [], [], 0
    for k, text in enumerate(scenes):
        nxt = find_all(words, scenes[k + 1], lo + 1, len(words)) if k + 1 < len(scenes) else []
        hits = find_all(words, text, lo, nxt[0] if nxt else len(words))
        assert hits, f'could not find the start of scene {k+1} ("{text[:40]}...") in the transcript; send scene1..scene8 as separate files instead'
        first.append(hits[0]); last.append(hits[-1]); lo = hits[-1] + 1
    # a scene runs from its last restart to the next scene's first attempt; anything between is a false start
    starts = last
    ends = first[1:] + [len(words)]
    outs = []
    for k in range(N_SCENES):
        a, b = starts[k], ends[k]
        cuts = []  # [from_idx, to_idx) ranges of bad takes inside this scene
        for sent in re.split(r'(?<=[.!?])\s+', scenes[k]):
            hits = find_all(words, sent, a, b)
            if len(hits) > 1:
                cuts.append((hits[0], hits[-1]))
        keep, cur = [], a
        for c0, c1 in sorted(cuts):
            if c0 > cur:
                keep.append((cur, c0))
            cur = max(cur, c1)
        keep.append((cur, b))
        ranges = [(max(0, words[i]['s'] - 0.12), min(total, words[j - 1]['e'] + 0.3)) for i, j in keep if j > i]
        o = BUILD / f'nar{k+1}.wav'
        if len(ranges) == 1:
            ff('-ss', f'{ranges[0][0]:.3f}', '-to', f'{ranges[0][1]:.3f}', '-i', str(full), str(o))
        else:
            fc = ''.join(f'[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS[a{i}];' for i, (s, e) in enumerate(ranges))
            fc += ''.join(f'[a{i}]' for i in range(len(ranges))) + f'concat=n={len(ranges)}:v=0:a=1[out]'
            ff('-i', str(full), '-filter_complex', fc, '-map', '[out]', str(o))
        dropped = sum(words[c1]['s'] - words[c0]['s'] for c0, c1 in cuts)
        print(f'  scene {k+1}: {ranges[0][0]:.1f}s → {ranges[-1][1]:.1f}s' + (f', removed {len(cuts)} retake(s), {dropped:.1f}s' if cuts else ''))
        outs.append(o)
    return outs

SCENE_VISUALS = [['s1_problem'], ['s2_paste'], ['s3_levels'], ['s4_appeal'], ['s5_assist'], ['s6a_stack', 's6b_terminal'], ['s7_bench'], ['s8_close']]
VF = f'scale={W}:{H}:flags=lanczos,fps=30,format=yuv420p'

APP_INSET = os.environ.get('APP_INSET') == '1'
VF_INSET = 'scale=1540:866:flags=lanczos,pad=1544:870:2:2:color=0x334155,pad=1920:1080:28:105:color=0x020617,fps=30,format=yuv420p'

def fit(src, start, target, out, max_speed=1.6):
    """Trim the recording's load-in, then speed up (max 1.6x) or freeze the last frame to land exactly on target seconds."""
    avail = duration(src) - start
    speed = min(max(avail / target, 1.0), max_speed)
    vf = VF_INSET if APP_INSET and Path(src).stem in APP_SCENES else VF
    ff('-ss', f'{start:.2f}', '-i', str(src), '-an', '-vf', f'setpts=PTS/{speed:.4f},{vf},tpad=stop_mode=clone:stop_duration={target + 1:.2f}',
       '-t', f'{target:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', str(out))

def assemble(audio):
    assemble_scenes(split_narration(audio))

# ---------------------------------------------------------------- presenter mode (voice + face bubble from one camera take)

BUBBLE, RING, MARGIN = 300, 8, 18
FACE_CROP = os.environ.get('FACE_CROP', '860:860:420:20')  # w:h:x:y square around the face in the camera frame

def speech_ranges(words, a, b, max_gap=1.1, keep_gap=0.55):
    """Spoken stretches inside [a, b): pauses longer than max_gap shrink to keep_gap."""
    ws = [w for w in words if w['s'] >= a - 0.05 and w['e'] <= b + 0.05]
    out = []
    for w in ws:
        s, e = max(a, w['s'] - keep_gap / 2), min(b, w['e'] + keep_gap / 2)
        if out and w['s'] - out[-1][2] <= max_gap:
            out[-1][1] = max(out[-1][1], min(b, w['e'] + keep_gap / 2)); out[-1][2] = w['e']
        else:
            out.append([s, e, w['e']])
    return [(s, e) for s, e, _ in out]

def split_presenter(mov, bounds, words_json):
    """Cut the camera take into per-scene narration WAVs and matching face clips (same ranges, so lips stay in sync)."""
    words = json.loads(Path(words_json).read_text())
    clean = BUILD / 'voice_clean.wav'
    ff('-i', str(mov), '-vn', '-ac', '2', '-ar', '48000', '-af', 'highpass=f=80,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11', str(clean))
    nars, faces = [], []
    for k in range(N_SCENES):
        a, b = bounds[k], bounds[k + 1]
        rs = speech_ranges(words, a, b)
        n = len(rs)
        fv = ''.join(f'[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS,crop={FACE_CROP},scale={BUBBLE}:{BUBBLE},fps=30[v{i}];' for i, (s, e) in enumerate(rs))
        fa = ''.join(f'[1:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS[a{i}];' for i, (s, e) in enumerate(rs))
        cat = ''.join(f'[v{i}][a{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=1[fv][fa]'
        face, nar = BUILD / f'face{k+1}.mp4', BUILD / f'nar{k+1}.wav'
        ff('-i', str(mov), '-i', str(clean), '-filter_complex', fv + fa + cat, '-map', '[fv]', '-c:v', 'libx264', '-crf', '18', '-an', str(face),
           '-map', '[fa]', str(nar))
        spoken = sum(e - s for s, e in rs)
        print(f'  scene {k+1}: {a:.1f}–{b:.1f}s of the take → {spoken:.1f}s ({n} spoken stretch{"es" if n > 1 else ""})')
        nars.append(nar); faces.append(face)
    return nars, faces

def bubble_filter(lead, tail):
    r = BUBBLE / 2; R = BUBBLE / 2 + RING
    disc = lambda rad: f"geq=lum='p(X,Y)':cb='p(X,Y)':cr='p(X,Y)':a='if(lte(hypot(X-W/2,Y-H/2),{rad}),255,0)'"
    x, y = W - BUBBLE - 2 * RING - MARGIN, H - BUBBLE - 2 * RING - MARGIN
    return (f"[1:v]format=yuva444p,{disc(r - 1)},tpad=start_duration={lead}:start_mode=clone:stop_duration={tail + 1}:stop_mode=clone[f];"
            f"color=c=0x6366f1:s={BUBBLE + 2 * RING}x{BUBBLE + 2 * RING},format=yuva444p,{disc(R - 1)}[ring];"
            f"[0:v][ring]overlay={x}:{y}:shortest=1[b];[b][f]overlay={x + RING}:{y + RING}:eof_action=repeat,format=yuv420p[v]")

def assemble_scenes(nars, faces=None):
    offsets = json.loads((BUILD / 'offsets.json').read_text())
    lead, tail = 0.4, 0.6  # breathing room around each scene's narration
    parts = []
    for i, (nar, vis) in enumerate(zip(nars, SCENE_VISUALS)):
        target = duration(nar) + lead + tail
        if len(vis) == 1:
            fit(BUILD / f'{vis[0]}.webm', offsets[vis[0]], target, BUILD / f'v{i+1}.mp4', 1.0 if vis[0] in CARDS else 1.6)
        else:  # tech stack card for 6s, terminal for the rest
            a = min(6.0, target * .3)
            fit(BUILD / f'{vis[0]}.webm', offsets[vis[0]], a, BUILD / f'v{i+1}a.mp4', 1.0)
            fit(BUILD / f'{vis[1]}.webm', offsets[vis[1]], target - a, BUILD / f'v{i+1}b.mp4', 1.0)
            (BUILD / 'c.txt').write_text(f"file 'v{i+1}a.mp4'\nfile 'v{i+1}b.mp4'\n")
            ff('-f', 'concat', '-safe', '0', '-i', str(BUILD / 'c.txt'), '-c', 'copy', str(BUILD / f'v{i+1}.mp4'))
        seg = BUILD / f'seg{i+1}.mp4'
        audio_f = f'[{2 if faces else 1}:a]adelay={int(lead*1000)}|{int(lead*1000)},apad[a]'
        if faces:
            ff('-i', str(BUILD / f'v{i+1}.mp4'), '-i', str(faces[i]), '-i', str(nar), '-filter_complex', bubble_filter(lead, tail) + ';' + audio_f,
               '-map', '[v]', '-map', '[a]', '-t', f'{target:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-r', '30',
               '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', str(seg))
        else:
            ff('-i', str(BUILD / f'v{i+1}.mp4'), '-i', str(nar), '-filter_complex', audio_f, '-map', '0:v', '-map', '[a]', '-t', f'{target:.3f}',
               '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', str(seg))
        parts.append(seg)
        print(f'  scene {i+1}: {target:.1f}s')
    (BUILD / 'parts.txt').write_text(''.join(f"file '{p.name}'\n" for p in parts))
    out = ROOT / 'video' / 'ctrl-v-access-final.mp4'
    ff('-f', 'concat', '-safe', '0', '-i', str(BUILD / 'parts.txt'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out))
    print(f'Wrote {out.relative_to(ROOT)} ({duration(out):.1f}s)')

if __name__ == '__main__':
    if sys.argv[1:2] == ['visuals']:
        record_visuals()
    elif sys.argv[1:2] == ['assemble'] and len(sys.argv) == 3:
        assemble(sys.argv[2])
    elif sys.argv[1:2] == ['presenter'] and len(sys.argv) == 5:  # presenter TAKE.mov "start,b1,...,b7,end" words.json
        bounds = [float(x) for x in sys.argv[3].split(',')]
        assert len(bounds) == N_SCENES + 1, 'need 9 timestamps: start, 7 scene boundaries, end'
        APP_INSET = True
        assemble_scenes(*split_presenter(sys.argv[2], bounds, sys.argv[4]))
    else:
        print(__doc__)
