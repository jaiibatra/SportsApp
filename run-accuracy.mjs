// Runs the tester case sheet through the same matching code the app uses.
//   node run-accuracy.mjs                 -> summary + failures
//   node run-accuracy.mjs --all           -> every case
//   node run-accuracy.mjs tests/other.json
//
// Each case's inputs (moves, body areas, contact) were mapped by hand from the
// sheet's text descriptions, so they are a best guess at what a tester would
// tap in the app. "Likely (inferred)" symptoms count as yes, "Not reported" as
// not sure. These cases were also used to tune the matching, so the pass rate
// here overstates how the app would do on new cases.
import { readFileSync } from 'node:fs';
import { analyze, decideTier } from './src/triage.js';

const args = process.argv.slice(2);
const showAll = args.includes('--all');
const file = args.find(a => !a.startsWith('--')) || 'tests/cases-2026-11-15.json';
const cases = JSON.parse(readFileSync(file, 'utf8'));

const has = (names, pat) => names.some(n => new RegExp(pat, 'i').test(n));

let pass = 0;
const bySport = {};
for (const c of cases) {
  const { groups, topMatches } = analyze(c);
  const tier = decideTier({ redFlags: c.redFlags, weightBearing: c.weightBearing, topMatches });
  const first = groups[0]?.matches[0]?.injury_name || '(nothing)';
  const tops = topMatches.map(m => m.injury_name);
  const flagged = groups.flatMap(g => g.matches.filter((m, i) => i === 0 || m.together).map(m => m.injury_name));

  const { kind, patterns } = c.expect;
  let ok;
  if (kind === 'top') ok = patterns.some(p => new RegExp(p, 'i').test(first));
  else if (kind === 'both') ok = patterns.every(p => has(flagged, p));
  else ok = patterns.every(p => has(tops, p));

  if (ok) pass++;
  bySport[c.sport] ??= [0, 0];
  bySport[c.sport][0] += ok ? 1 : 0;
  bySport[c.sport][1] += 1;

  if (!ok || showAll) {
    console.log(`${ok ? 'PASS' : 'FAIL'} #${c.num} ${c.sport} - ${c.athlete}`);
    console.log(`   truth: ${c.truth}`);
    groups.forEach(g => {
      const list = g.matches.map(m => `${m.injury_name}${m.together ? ' [together]' : ''} (${m.score.toFixed(1)})`).join(', ');
      console.log(`   ${g.label}: ${list}`);
    });
    console.log(`   tier: ${tier}`);
  }
}

console.log(`\n${pass}/${cases.length} correct`);
for (const [s, [p, n]] of Object.entries(bySport)) console.log(`  ${s}: ${p}/${n}`);
