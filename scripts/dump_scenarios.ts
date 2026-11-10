// Prints the benchmark scenarios as JSON for scripts/build_demo_video.py.
import { SCENARIOS } from '../src/data/scenarios';
import { analyzePastedDocument } from '../src/utils/analyzer';
console.log(JSON.stringify(SCENARIOS.map((s) => {
  const t0 = performance.now();
  for (let i = 0; i < 1000; i++) analyzePastedDocument(s.rawText);
  return { id: s.id, title: s.title, raw: s.rawText, plain: s.level1Summary.plainEnglish,
    appOrig: s.readingGradeOriginal, appPlain: s.readingGradeSimplified, ms: (performance.now() - t0) / 1000 };
})));
