"""Capture real API responses from the running backend (:3001) into video/evidence/terminal.txt."""
import json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
raw = json.loads(subprocess.run(['npx', 'tsx', 'scripts/dump_scenarios.ts'], cwd=ROOT, capture_output=True, text=True, check=True).stdout)[0]['raw']

def run(method, path, body=None):
    cmd = ['curl', '-s', '-w', '\n%{http_code} %{time_total}', '-X', method, 'localhost:3001' + path, '-H', 'Content-Type: application/json']
    if body is not None:
        cmd += ['-d', json.dumps(body)]
    b, meta = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.rsplit('\n', 1)
    code, t = meta.split()
    return json.loads(b), f'# HTTP {code} · {float(t) * 1000:.1f} ms'

out = []
j, m = run('GET', '/api/health')
out += ['$ curl -s localhost:3001/api/health | jq', json.dumps(j, indent=2), m, '']
j, m = run('POST', '/api/analyze', {'text': raw}); d = j['data']
keys = ['category', 'urgencyLevel', 'daysRemaining', 'readingGradeOriginal', 'readingGradeSimplified', 'jargonTermsCount']
out += ["$ curl -s -X POST localhost:3001/api/analyze -d @nhs_cgm_denial.json | jq '{source, model, data: {" + ', '.join(keys) + "}}'",
        json.dumps({'source': j['source'], 'model': j['model'], 'data': {k: d.get(k) for k in keys}}, indent=2), m, '']
j, m = run('POST', '/api/rights/search', {'query': 'pip'})
out += ["$ curl -s -X POST localhost:3001/api/rights/search -d '{\"query\":\"pip\"}' | jq '{count, titles: [.results[].title]}'",
        json.dumps({'count': j['count'], 'titles': [x['title'] for x in j['results']]}, indent=2), m, '']
j, m = run('POST', '/api/appeal/generate', {'recipient': 'ICB Appeals Panel'})
out += ["$ curl -s -X POST localhost:3001/api/appeal/generate -d '{\"recipient\":\"ICB Appeals Panel\"}' | jq -r .letter | head -5",
        '\n'.join(j['letter'].splitlines()[:5]), m]
(ROOT / 'video' / 'evidence' / 'terminal.txt').write_text('\n'.join(out) + '\n')
print('\n'.join(out))
