import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight,
  Clock, CircleCheck, History, HeartPulse, Info, Plus, RotateCcw, ShieldAlert,
  Stethoscope, Trash2, User, Zap,
} from 'lucide-react';

import {
  BODY_GROUPS, BODY_AREAS, SYMPTOM_FIELDS, CONTACT_OPTIONS,
  movesForSport, recognizeAreas, recognizeMoves, areaLabels,
  analyze, decideTier,
} from './triage.js';

const SPORTS = ['Basketball', 'Baseball', 'Football', 'Soccer'];

const SPORT_META = {
  Basketball: { icon: Activity, blurb: 'Landing, cutting, and jump shots' },
  Baseball: { icon: Zap, blurb: 'Throwing, swinging, and base running' },
  Football: { icon: ShieldAlert, blurb: 'Contact, tackling, and sprints' },
  Soccer: { icon: HeartPulse, blurb: 'Sprinting, cutting, and striking' },
};

const RED_FLAGS = [
  { key: 'collapse', short: 'Collapse, chest pain, or trouble breathing',
    text: 'Did they collapse or pass out without a hit to the head, or have chest pain or trouble breathing?',
    firstAid: "Call 911 (or your local emergency number) now. If they're unresponsive and not breathing normally, start CPR and send someone for the nearest AED." },
  { key: 'deformity', short: 'Visible deformity', text: 'Does the area look visibly out of place, bent, or deformed?',
    firstAid: "Don't try to straighten it or pop it back in. Keep it still in the position you found it." },
  { key: 'nerve', short: 'Numbness or color change', text: 'Any numbness, tingling, or a change in skin color below the injury?',
    firstAid: "If the neck or back could be hurt, don't move them. Keep the head and neck still until help arrives." },
  { key: 'wound', short: 'Open wound or exposed bone', text: 'Is there an open wound, or is bone visible?',
    firstAid: "Cover the wound with a clean cloth and press gently around (not on) any bone. Don't push anything back in." },
  { key: 'loc', short: 'Head hit with blackout or confusion', text: 'Was there a hit to the head with loss of consciousness or confusion?',
    firstAid: 'No more play today. Stay with them and get help fast if headache, vomiting, drowsiness, or confusion gets worse.' },
];

const TIERS = {
  emergency: {
    label: 'Get emergency care now',
    time: 'Right now',
    color: '#B42318',
    bg: '#FDECEA',
    Icon: AlertTriangle,
    copy: "One or more answers point to something that needs immediate medical attention. Head to an emergency room or call your campus's emergency line. Don't wait this one out.",
  },
  urgent: {
    label: 'Get seen today',
    time: 'Within hours',
    color: '#B4540A',
    bg: '#FEF0E1',
    Icon: Zap,
    copy: "This pattern is consistent with something that shouldn't wait. Stop playing and get an athletic trainer or urgent care to look at it today.",
  },
  clinician: {
    label: 'See a clinician soon',
    time: 'Next 1 to 2 days',
    color: '#4A3BA8',
    bg: '#ECEAFB',
    Icon: Stethoscope,
    copy: "Worth a proper look, but it doesn't read as an emergency. Book a visit with a doctor or athletic trainer in the next day or two.",
  },
  selfcare: {
    label: 'Likely fine to self-manage',
    time: 'Monitor at home',
    color: '#0B7A5C',
    bg: '#DDFAF1',
    Icon: CircleCheck,
    copy: "Nothing here points to a serious injury. Rest, ice, and keep an eye on it. See a clinician if it isn't improving in a few days or gets worse.",
  },
};

/* ---------------------------------------------------------------
   PERSISTENCE
   Each finished report is saved to localStorage with everything
   the person entered plus what the matcher returned, so Past
   history can replay exactly what was reported. Re-finishing the
   same report (after going back to edit) updates it in place.
--------------------------------------------------------------- */
const REPORTS_KEY = 'sideline_reports_v1';

function getSavedReports() {
  try {
    const raw = window.localStorage.getItem(REPORTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) =>
      new Date(b.savedAt || b.date || 0).getTime() - new Date(a.savedAt || a.date || 0).getTime()
    );
  } catch {
    return [];
  }
}

function upsertReport(record) {
  try {
    const existing = getSavedReports().filter(r => r.id !== record.id);
    existing.unshift(record);
    window.localStorage.setItem(REPORTS_KEY, JSON.stringify(existing));
  } catch {
    // localStorage unavailable (private window, blocked site data): skip saving
  }
}

function clearReports() {
  try {
    window.localStorage.removeItem(REPORTS_KEY);
  } catch {
    // nothing to clear
  }
}

function formatWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

const ANSWER_LABEL = { yes: 'Yes', no: 'No', unsure: 'Not sure' };

/* ---------------------------------------------------------------
   DESIGN TOKENS + GLOBAL CSS
--------------------------------------------------------------- */
const C = {
  purple: '#5B4BC4',
  purpleDeep: '#4A3BA8',
  ink: '#2B2370',
  muted: '#6B6799',
  mint: '#2EE6B6',
  mintDeep: '#12B58C',
  mintTint: '#DDFAF1',
  lav: '#DAD8F8',
  paper: '#F4F3FC',
  line: '#DCD9F3',
  white: '#FFFFFF',
};

const SHADOW = '0 6px 18px rgba(74,59,168,0.10)';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
html, body { margin: 0 !important; padding: 0 !important; display: block !important; background: ${C.lav} !important; color-scheme: light; }
#root { width: auto !important; max-width: none !important; margin: 0 !important; border: none !important; text-align: left !important; display: block !important; min-height: 0 !important; }
.sl-outer { min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 28px 16px; background: ${C.lav}; color: ${C.ink}; font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; text-align: left; line-height: 1.45; position: relative; overflow: hidden; }
.sl-outer, .sl-outer *, .sl-outer *::before, .sl-outer *::after { box-sizing: border-box; }
.sl-outer button { font-family: inherit; cursor: pointer; }
.sl-outer h1, .sl-outer h2, .sl-outer h3, .sl-outer p { margin: 0; }
.sl-circle { position: fixed; border-radius: 50%; background: rgba(255,255,255,0.5); pointer-events: none; }
.sl-device { position: relative; width: 100%; max-width: 400px; min-height: 760px; border-radius: 36px; background: ${C.paper}; overflow: hidden; box-shadow: 0 24px 60px rgba(74,59,168,0.22); }
.sl-device.splash { background: ${C.purple}; }
.sl-blob { position: absolute; border-radius: 50%; background: ${C.purple}; pointer-events: none; }
.sl-content { position: relative; z-index: 1; padding: 26px 22px 34px; min-height: 760px; display: flex; flex-direction: column; }
@media (max-width: 480px) {
  .sl-outer { padding: 0; }
  .sl-device { max-width: none; border-radius: 0; min-height: 100vh; box-shadow: none; }
  .sl-content { min-height: 100vh; }
}
.sl-press { transition: transform .12s ease, border-color .12s ease, background .12s ease; }
.sl-press:hover { transform: translateY(-1px); }
.sl-outer button:focus-visible, .sl-press:focus-visible { outline: 3px solid ${C.mintDeep}; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .sl-press { transition: none; }
  .sl-press:hover { transform: none; }
}
`;

/* ---------------------------------------------------------------
   UI PRIMITIVES
--------------------------------------------------------------- */
function Shell({ children, tone = 'plain' }) {
  return (
    <div className="sl-outer">
      <style>{CSS}</style>
      <div className="sl-circle" style={{ width: 380, height: 380, top: -140, left: -120 }} />
      <div className="sl-circle" style={{ width: 460, height: 460, bottom: -200, right: -160 }} />
      <div className={`sl-device ${tone === 'splash' ? 'splash' : ''}`}>
        {tone === 'home' && (
          <>
            <div className="sl-blob" style={{ width: 270, height: 270, top: 250, right: -100 }} />
            <div className="sl-blob" style={{ width: 320, height: 320, bottom: -130, left: -120 }} />
          </>
        )}
        {tone === 'plain' && (
          <div className="sl-blob" style={{ width: 220, height: 220, top: -90, right: -70, background: '#E7E5FA' }} />
        )}
        <div className="sl-content">{children}</div>
      </div>
    </div>
  );
}

function TopBar({ title, subtitle, onBack }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {onBack ? (
          <button
            aria-label="Back"
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', padding: 0,
              background: C.white, boxShadow: SHADOW,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} color={C.purple} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        <h1 style={{ fontSize: 21, fontWeight: 700, color: C.purple, textAlign: 'center' }}>{title}</h1>
        <div style={{ width: 36 }} />
      </div>
      {subtitle && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <p style={{ fontSize: 12.5, color: C.ink, maxWidth: 300, margin: '0 auto' }}>{subtitle}</p>
          <div style={{ width: 34, height: 3, borderRadius: 2, background: C.mint, margin: '8px auto 0' }} />
        </div>
      )}
    </div>
  );
}

function Card({ children, onClick, active, style }) {
  const interactive = !!onClick;
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      } : undefined}
      onClick={onClick}
      className={interactive ? 'sl-press' : ''}
      style={{
        background: active ? C.mintTint : C.white,
        border: `2px solid ${active ? C.mintDeep : 'transparent'}`,
        borderRadius: 18, padding: '16px 18px', boxShadow: SHADOW,
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Tile({ icon: Icon, label, onClick }) {
  return (
    <Card
      onClick={onClick}
      style={{
        padding: '22px 12px 18px', textAlign: 'center', minHeight: 132,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}
    >
      <Icon size={38} strokeWidth={1.5} color={C.purple} />
      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{label}</div>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: C.mint }} />
    </Card>
  );
}

const BUTTON_VARIANTS = {
  mint: { background: C.mint, color: C.ink, border: '2px solid transparent' },
  purple: { background: C.purple, color: C.white, border: '2px solid transparent' },
  ghost: { background: C.white, color: C.purple, border: `2px solid ${C.line}` },
  outlineMint: { background: 'transparent', color: C.mint, border: `2px solid ${C.mint}` },
};

function Button({ children, onClick, disabled, variant = 'mint', style }) {
  const v = BUTTON_VARIANTS[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v,
        ...(disabled ? { background: '#E4E2F5', color: '#8C89B5', border: '2px solid transparent', cursor: 'not-allowed' } : {}),
        width: '100%', borderRadius: 14, padding: '13px 20px', fontSize: 15, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function YesNoUnsure({ value, onChange }) {
  const opts = [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {opts.map(([v, label]) => {
        const on = value === v;
        return (
          <button
            key={v}
            aria-pressed={on}
            onClick={() => onChange(v)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 13.5, fontWeight: 600,
              border: `2px solid ${on ? C.purple : C.line}`,
              background: on ? C.purple : C.white,
              color: on ? C.white : C.ink,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const H2 = { fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 4 };
const SUB = { fontSize: 12.5, color: C.muted, marginBottom: 16 };

/* ---------------------------------------------------------------
   SCREENS
--------------------------------------------------------------- */
function Welcome({ onStart, onReport }) {
  const marks = [
    { Icon: Plus, top: '4%', left: '8%', size: 28 },
    { Icon: HeartPulse, top: '8%', left: '72%', size: 34 },
    { Icon: Plus, top: '22%', left: '86%', size: 22 },
    { Icon: HeartPulse, top: '30%', left: '-4%', size: 38 },
    { Icon: Plus, top: '56%', left: '88%', size: 28 },
    { Icon: HeartPulse, top: '52%', left: '2%', size: 30 },
  ];
  return (
    <Shell tone="splash">
      {marks.map(({ Icon, top, left, size }, i) => (
        <Icon
          key={i}
          aria-hidden="true"
          size={size}
          strokeWidth={1.4}
          color={C.mint}
          style={{ position: 'absolute', top, left, opacity: 0.35, pointerEvents: 'none' }}
        />
      ))}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: C.mint, margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HeartPulse size={34} color={C.ink} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 26 }}>Sideline</div>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: C.white, lineHeight: 1.15 }}>
          Find out what your injury needs
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 280, margin: '14px auto 0' }}>
          Describe what happened and how it feels. Get a first read on how urgent it is.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="mint" onClick={onStart}>Get started</Button>
        <Button variant="outlineMint" onClick={onReport}>Report an injury</Button>
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 6 }}>
          Not a diagnosis. A starting point before you see a clinician.
        </p>
      </div>
    </Shell>
  );
}

function Home({ go, onBack }) {
  return (
    <Shell tone="home">
      <TopBar
        title="Sideline"
        subtitle="Answer a few questions about what happened and how it feels to get a sense of how serious it might be."
        onBack={onBack}
      />

      <Card
        onClick={() => go('report')}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, marginBottom: 16 }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 16, background: C.mint, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Plus size={26} color={C.ink} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Report an injury</div>
          <div style={{ fontSize: 12.5, color: C.muted }}>Takes about two minutes</div>
        </div>
        <ChevronRight size={20} color={C.purple} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Tile icon={History} label="Past history" onClick={() => go('history')} />
        <Tile icon={RotateCcw} label="Return to play" onClick={() => go('return')} />
        <Tile icon={User} label="My data" onClick={() => go('data')} />
        <Tile icon={ShieldAlert} label="Emergency" onClick={() => go('emergency')} />
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />

      <Card style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '14px 16px' }}>
        <Info size={16} color={C.purple} style={{ marginTop: 2, flexShrink: 0 }} />
        <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
          Not a diagnosis. Sideline gives a starting point built from reported injury patterns.
          A licensed clinician makes the actual call.
        </p>
      </Card>
    </Shell>
  );
}

function Placeholder({ title, desc, onBack }) {
  return (
    <Shell>
      <TopBar title={title} onBack={onBack} />
      <Card style={{ padding: '28px 22px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', width: 44, height: 44, borderRadius: '50%',
          background: C.mintTint, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
        }}>
          <Info size={20} color={C.mintDeep} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Coming soon</div>
        <div style={{ fontSize: 13, color: C.muted, maxWidth: 300, margin: '0 auto' }}>{desc}</div>
      </Card>
    </Shell>
  );
}

const PLACEHOLDER_COPY = {
  return: 'Once an injury is logged, this will track your recovery day by day against the expected timeline.',
  data: 'A body map showing where you’ve been hurt over time, built from your reported injuries.',
};

function EmergencyScreen({ onBack }) {
  return (
    <Shell>
      <TopBar
        title="Emergency"
        subtitle="If any of these are true, stop playing and get help right away."
        onBack={onBack}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {RED_FLAGS.map(f => (
          <Card key={f.key} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px' }}>
            <AlertTriangle size={20} color={TIERS.emergency.color} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{f.text}</div>
          </Card>
        ))}
      </div>
      <div style={{ background: TIERS.emergency.bg, borderRadius: 18, padding: '16px 18px' }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: TIERS.emergency.color, marginBottom: 4 }}>
          Go to an emergency room or call 911
        </div>
        <p style={{ fontSize: 13, color: C.ink }}>
          You can also call your campus emergency line. Don't wait to see if it settles down.
        </p>
      </div>
    </Shell>
  );
}

/* ---------------------------------------------------------------
   REPORT FLOW
--------------------------------------------------------------- */
function CheckDot() {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%', background: C.mint, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Check size={15} color={C.ink} strokeWidth={3} />
    </div>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button
      aria-pressed={on}
      onClick={onClick}
      style={{
        padding: '9px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        border: `2px solid ${on ? C.purple : C.line}`,
        background: on ? C.purple : C.white,
        color: on ? C.white : C.ink,
      }}
    >
      {on && <Check size={13} strokeWidth={3} />}
      {children}
    </button>
  );
}

// Free-text box with live feedback on what the app understood.
function OtherBox({ value, onChange, placeholder, recognized, emptyNote }) {
  const has = value.trim().length > 0;
  return (
    <div style={{ marginBottom: 6 }}>
      <input
        type="text"
        value={value}
        autoFocus
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14,
          borderRadius: 12, border: `2px solid ${C.line}`, background: C.white, color: C.ink, outline: 'none',
        }}
      />
      {has && recognized.length > 0 && (
        <div style={{ fontSize: 12.5, color: '#0B7A5C', marginTop: 8, fontWeight: 600 }}>
          Understood as: {recognized.join(', ')}
        </div>
      )}
      {has && recognized.length === 0 && (
        <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>{emptyNote}</div>
      )}
    </div>
  );
}

function ReportFlow({ onExit, onHistory }) {
  const [step, setStep] = useState(0);
  const [sport, setSport] = useState(null);
  const [redFlags, setRedFlags] = useState({});
  const [moveIds, setMoveIds] = useState([]);
  const [moveOther, setMoveOther] = useState(null);      // null = "Other" not chosen, string = chosen
  const [areaIds, setAreaIds] = useState([]);
  const [areaOther, setAreaOther] = useState(null);
  const [contact, setContact] = useState(null);
  const [weightBearing, setWeightBearing] = useState(null);
  const [symptoms, setSymptoms] = useState({});

  // Every new step starts at the top of the page.
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const moves = useMemo(() => (sport ? movesForSport(sport) : []), [sport]);
  const redFlagTriggered = Object.values(redFlags).some(v => v === 'yes');

  // What the app understood from the free-text "Other" boxes
  const otherMoveIds = useMemo(() => (moveOther && sport ? recognizeMoves(moveOther, sport) : []), [moveOther, sport]);
  const otherAreaIds = useMemo(() => (areaOther ? recognizeAreas(areaOther) : []), [areaOther]);
  const allMoveIds = useMemo(() => [...new Set([...moveIds, ...otherMoveIds])], [moveIds, otherMoveIds]);
  const allAreaIds = useMemo(() => [...new Set([...areaIds, ...otherAreaIds])], [areaIds, otherAreaIds]);

  const toggleIn = (setter) => (id) => setter(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  const toggleMove = toggleIn(setMoveIds);
  const toggleArea = toggleIn(setAreaIds);

  // Ranked separately per body area, so more than one injury can show up.
  const analysis = useMemo(() => {
    if (!sport) return { groups: [], topMatches: [] };
    return analyze({ sport, moveIds: allMoveIds, areaIds: allAreaIds, symptoms, contact, redFlags, weightBearing });
  }, [sport, allMoveIds, allAreaIds, symptoms, contact, redFlags, weightBearing]);

  const tierKey = useMemo(() => {
    if (!sport) return null;
    return decideTier({ redFlags, weightBearing, topMatches: analysis.topMatches });
  }, [redFlags, weightBearing, analysis, sport]);

  // Save (or update) this report each time the results screen is reached.
  const savedIdRef = useRef(null);
  useEffect(() => {
    if (step !== 4 || !tierKey) return;
    if (!savedIdRef.current) savedIdRef.current = Date.now();
    const moveNames = allMoveIds
      .map(id => (moves.find(m => m.move_id === id) || {}).move_name)
      .filter(Boolean);
    upsertReport({
      id: savedIdRef.current,
      savedAt: new Date().toISOString(),
      sport,
      moveIds: allMoveIds,
      moveNames,
      moveOther: moveOther && moveOther.trim() ? moveOther.trim() : null,
      bodyParts: areaLabels(allAreaIds),
      bodyPartOther: areaOther && areaOther.trim() ? areaOther.trim() : null,
      contact,
      symptoms,
      weightBearing,
      redFlags,
      redFlagTriggered,
      tier: tierKey,
      matches: analysis.groups.flatMap(g => g.matches.map((r, i) => ({
        name: r.injury_name,
        area: g.label,
        bodyPart: r.body_part,
        rank: i,
        together: !!r.together,
        severity: r.severity ? r.severity.severity : null,
        recoveryWeeks: r.severity ? r.severity.recovery_time_avg : null,
      }))),
    });
  }, [step]);

  const STEPS = ['sport', 'redflags', 'mechanism', 'symptoms', 'results'];
  const total = STEPS.length - 1;

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => {
    if (step === 0) onExit();
    else setStep(s => s - 1);
  };

  const allRedFlagsAnswered = RED_FLAGS.every(f => redFlags[f.key]);
  const allSymptomsAnswered = SYMPTOM_FIELDS.every(f => symptoms[f.key]) && weightBearing;

  return (
    <Shell>
      <TopBar title="Report an injury" onBack={back} />

      {step < 4 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ height: 5, flex: 1, borderRadius: 3, background: i <= step ? C.purple : '#D9D6F2' }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            Step {step + 1} of {total}
          </div>
        </div>
      )}

      {redFlagTriggered && (step === 2 || step === 3) && <EmergencyReminder redFlags={redFlags} />}

      {step === 0 && (
        <div>
          <h2 style={{ ...H2, marginBottom: 14 }}>Which sport?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {SPORTS.map(s => {
              const meta = SPORT_META[s];
              const Icon = meta.icon;
              return (
                <Card
                  key={s}
                  active={sport === s}
                  onClick={() => { setSport(s); setStep(1); }}
                  style={{ textAlign: 'center', padding: '20px 12px' }}
                >
                  <Icon size={30} strokeWidth={1.5} color={C.purple} />
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>{s}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{meta.blurb}</div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 style={H2}>Quick safety check</h2>
          <p style={SUB}>Answer these first. They matter more than anything else.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {RED_FLAGS.map(f => (
              <Card key={f.key} style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 10 }}>{f.text}</div>
                <YesNoUnsure
                  value={redFlags[f.key]}
                  onChange={v => setRedFlags(r => ({ ...r, [f.key]: v }))}
                />
              </Card>
            ))}
          </div>
          <Button
            disabled={!allRedFlagsAnswered}
            onClick={next}
          >
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={H2}>What were you doing?</h2>
          <p style={SUB}>Pick everything that fits, or describe it in your own words under "Other".</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            {moves.map(m => {
              const on = moveIds.includes(m.move_id);
              return (
                <Card
                  key={m.move_id}
                  active={on}
                  onClick={() => toggleMove(m.move_id)}
                  style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.move_name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{m.move_description}</div>
                  </div>
                  {on && <CheckDot />}
                </Card>
              );
            })}
            <Card
              active={moveOther !== null}
              onClick={() => setMoveOther(v => (v === null ? '' : null))}
              style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Other</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Something else, describe it below</div>
              </div>
              {moveOther !== null && <CheckDot />}
            </Card>
          </div>
          {moveOther !== null && (
            <OtherBox
              value={moveOther}
              onChange={setMoveOther}
              placeholder="e.g. landed awkwardly after a dunk"
              recognized={otherMoveIds.map(id => (moves.find(m => m.move_id === id) || {}).move_name).filter(Boolean)}
              emptyNote="We didn't match that to a known movement, so it won't change the ranking. You can still continue and it will be saved with your report."
            />
          )}

          <h2 style={{ ...H2, marginTop: 22 }}>Was there contact?</h2>
          <p style={{ ...SUB, marginBottom: 10 }}>Did it happen when you hit, or were hit by, someone or something?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            {CONTACT_OPTIONS.map(o => (
              <Chip key={o.key} on={contact === o.key} onClick={() => setContact(o.key)}>{o.label}</Chip>
            ))}
          </div>

          <h2 style={{ ...H2, marginTop: 22 }}>Where does it hurt?</h2>
          <p style={{ ...SUB, marginBottom: 10 }}>Select every spot that hurts, even if they're in different places. Pick the most specific spot you can.</p>
          {BODY_GROUPS.map(g => (
            <div key={g} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>{g}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BODY_AREAS.filter(a => a.group === g).map(a => (
                  <Chip key={a.id} on={areaIds.includes(a.id)} onClick={() => toggleArea(a.id)}>{a.label}</Chip>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <Chip on={areaOther !== null} onClick={() => setAreaOther(v => (v === null ? '' : null))}>Other</Chip>
          </div>
          {areaOther !== null && (
            <OtherBox
              value={areaOther}
              onChange={setAreaOther}
              placeholder="e.g. top of my foot near the heel"
              recognized={areaLabels(otherAreaIds)}
              emptyNote="We didn't recognize a body part in that, so it won't change the ranking. Try a plainer word like foot, shin, or hamstring."
            />
          )}

          <div style={{ height: 10 }} />
          <Button
            disabled={
              !contact ||
              (allMoveIds.length === 0 && !(moveOther || '').trim()) ||
              (allAreaIds.length === 0 && !(areaOther || '').trim())
            }
            onClick={next}
          >
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={H2}>How does it feel?</h2>
          <p style={SUB}>"Not sure" is a fine answer. It's better than guessing.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
            {SYMPTOM_FIELDS.map(f => (
              <Card key={f.key} style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{f.label}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>{f.hint}</div>
                <YesNoUnsure value={symptoms[f.key]} onChange={v => setSymptoms(s => ({ ...s, [f.key]: v }))} />
              </Card>
            ))}
            <Card style={{ padding: '14px 16px', border: `2px solid ${C.line}` }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Can you bear weight on it or keep playing right now?</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>
                Be honest. Pushing through matters here.
              </div>
              <YesNoUnsure value={weightBearing} onChange={setWeightBearing} />
            </Card>
          </div>
          <Button disabled={!allSymptomsAnswered} onClick={next}>
            See what it might be <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 4 && tierKey && (
        <ResultsScreen
          tierKey={tierKey}
          redFlags={redFlags}
          groups={analysis.groups}
          onHistory={onHistory}
          onRestart={() => {
            savedIdRef.current = null;
            setStep(0); setSport(null); setRedFlags({}); setMoveIds([]); setMoveOther(null);
            setAreaIds([]); setAreaOther(null); setContact(null); setWeightBearing(null); setSymptoms({});
          }}
          onExit={onExit}
        />
      )}
    </Shell>
  );
}

function EmergencyReminder({ redFlags }) {
  const callNow = redFlags.collapse === 'yes';
  return (
    <div style={{
      background: TIERS.emergency.bg, border: `1.5px solid ${TIERS.emergency.color}`, borderRadius: 14,
      padding: '11px 14px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <AlertTriangle size={18} color={TIERS.emergency.color} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.45 }}>
        <b style={{ color: TIERS.emergency.color }}>
          {callNow ? 'Call 911 first.' : 'Your safety answers point to emergency care.'}
        </b>{' '}
        Get help on the way before finishing this. These questions only help narrow down what it might be.
      </div>
    </div>
  );
}

function MatchCard({ r, label }) {
  return (
    <Card style={{ padding: '15px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{r.injury_name}</div>
        {label && (
          <div style={{
            fontSize: 11, fontWeight: 600, color: C.ink, padding: '2px 10px', borderRadius: 20, whiteSpace: 'nowrap',
            background: label === 'Closest match' ? C.mint : '#FFE8C2',
          }}>
            {label}
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.body_part}</div>

      {r.severity && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, background: '#ECEAFB', borderRadius: 10, padding: '3px 10px' }}>
            Typical severity: <b>{r.severity.severity}</b>
          </div>
          <div style={{ fontSize: 12, background: '#ECEAFB', borderRadius: 10, padding: '3px 10px' }}>
            Recovery: <b>~{r.severity.recovery_time_avg} wk</b>
          </div>
        </div>
      )}
      {r.reasons.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {r.reasons.slice(0, 3).map((reason, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: C.ink }}>
              <Check size={13} color={C.mintDeep} strokeWidth={3} style={{ marginTop: 2, flexShrink: 0 }} />
              {reason}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ResultsScreen({ tierKey, redFlags, groups, onRestart, onExit, onHistory }) {
  const tier = TIERS[tierKey];
  const Icon = tier.Icon;
  const flagged = RED_FLAGS.filter(f => redFlags[f.key] === 'yes');
  const isEmergency = tierKey === 'emergency';
  const multiArea = groups.length > 1;

  return (
    <div>
      <div style={{ background: tier.bg, borderRadius: 18, padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14, background: tier.color, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: tier.color, lineHeight: 1.2 }}>{tier.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: tier.color }}>{tier.time}</div>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>{tier.copy}</p>
        {flagged.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: tier.color, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              While you wait for help
            </div>
            {flagged.map(f => (
              <div key={f.key} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.ink, lineHeight: 1.45 }}>
                <ChevronRight size={15} color={tier.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <span><b>{f.short}:</b> {f.firstAid}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {groups.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={H2}>What it could be</h2>
          <p style={{ ...SUB, marginBottom: 12 }}>
            {isEmergency
              ? "Shown for information only. It's not a reason to delay the care above. Not a diagnosis."
              : 'Ranked by how well it matches what you described. Not a diagnosis.'}
          </p>

          {multiArea && (
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-start', background: '#ECEAFB', borderRadius: 12,
              padding: '10px 12px', marginBottom: 14, fontSize: 12.5, lineHeight: 1.45,
            }}>
              <Info size={16} color={C.purple} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                You described problems in {groups.length} areas, so each one is checked on its own.
                You may have more than one injury.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {groups.map(g => {
              const top = g.matches[0];
              const together = g.matches.filter(m => m.together);
              return (
                <div key={g.key}>
                  {(multiArea || g.key === 'collapse') && (
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>
                      {[g.label, ...g.areaLabels.filter(l => l.toLowerCase() !== g.label.toLowerCase())].join(' · ')}
                    </div>
                  )}
                  {together.length > 0 && (
                    <p style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.45, marginBottom: 8 }}>
                      These often happen together, so more than one could be involved:{' '}
                      <b>{[top, ...together].map(m => m.injury_name).join(' + ')}</b>.
                    </p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {g.matches.map((r, idx) => (
                      <MatchCard
                        key={r.injury_id}
                        r={r}
                        label={idx === 0 ? 'Closest match' : r.together ? 'May also be involved' : r.close ? 'Nearly as likely' : null}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {groups.length === 0 && (
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
          Nothing on file matched closely. That's not unusual, and it doesn't mean it's nothing.
          Use the guidance above either way.
        </p>
      )}

      <Card style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', marginBottom: 16 }}>
        <CircleCheck size={20} color={C.mintDeep} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Saved to Past history</div>
        <button
          onClick={onHistory}
          style={{ background: 'none', border: 'none', color: C.purple, fontWeight: 600, fontSize: 13, padding: 4 }}
        >
          View
        </button>
      </Card>

      <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5, marginBottom: 18 }}>
        This is not a diagnosis. It's built from patterns in reported injuries to give you a
        starting point. A licensed clinician makes the actual call.
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="ghost" onClick={onRestart}>Report another</Button>
        <Button variant="purple" onClick={onExit}>Done</Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAST HISTORY
--------------------------------------------------------------- */
function DetailRow({ label, value, flag }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '5px 0' }}>
      <div style={{ fontSize: 12.5 }}>{label}</div>
      <div style={{
        fontSize: 11.5, fontWeight: 600, borderRadius: 10, padding: '2px 10px', whiteSpace: 'nowrap',
        background: flag ? TIERS.emergency.bg : '#ECEAFB',
        color: flag ? TIERS.emergency.color : C.ink,
      }}>
        {value}
      </div>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}

function ReportCard({ r }) {
  const [open, setOpen] = useState(false);
  const tier = TIERS[r.tier];
  const when = formatWhen(r.savedAt || r.date);
  const matches = r.matches || (r.topInjury ? [{ name: r.topInjury }] : []);
  // Newer reports rank each body area separately; older ones are one list.
  const tops = matches.some(m => m.rank !== undefined) ? matches.filter(m => m.rank === 0) : matches.slice(0, 1);
  const areaCount = new Set(matches.map(m => m.area).filter(Boolean)).size;
  const hasDetail = !!(r.symptoms || r.redFlags);
  const flagged = r.redFlags ? RED_FLAGS.filter(f => r.redFlags[f.key] === 'yes') : [];

  return (
    <Card style={{ padding: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', background: 'none', border: 'none', textAlign: 'left',
          padding: '15px 16px', color: 'inherit', display: 'block',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{r.sport}</div>
            {(r.bodyParts && r.bodyParts.length > 0 || r.bodyPartOther) && (
              <div style={{ fontSize: 12, color: C.muted }}>
                {[...(r.bodyParts || []), ...(r.bodyPartOther && !(r.bodyParts || []).length ? [r.bodyPartOther] : [])].join(', ')}
              </div>
            )}
          </div>
          <ChevronDown
            size={18}
            color={C.purple}
            style={{ flexShrink: 0, marginTop: 2, transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </div>
        {when && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.muted, marginTop: 6 }}>
            <Clock size={12} /> Saved {when}
          </div>
        )}
        {tops.length > 0 && tops[0].name && (
          <div style={{ fontSize: 13, marginTop: 8 }}>
            {tops.length > 1 ? 'Closest matches' : 'Closest match'}: <b>{tops.map(t => t.name).join(', ')}</b>
          </div>
        )}
        {tier && (
          <div style={{
            display: 'inline-block', marginTop: 10, fontSize: 11.5, fontWeight: 600,
            color: tier.color, background: tier.bg, padding: '3px 10px', borderRadius: 20,
          }}>
            {tier.label}
          </div>
        )}
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.line}` }}>
          {!hasDetail && (
            <p style={{ fontSize: 12.5, color: C.muted, marginTop: 12 }}>
              This report was saved before full details were recorded, so only the summary is available.
            </p>
          )}

          {(r.moveNames && r.moveNames.length > 0 || r.moveName || r.moveOther) && (
            <DetailSection title="What you were doing">
              {(r.moveNames && r.moveNames.length > 0 ? r.moveNames : r.moveName ? [r.moveName] : []).map(n => (
                <div key={n} style={{ fontSize: 13 }}>{n}</div>
              ))}
              {r.moveOther && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>In your words: "{r.moveOther}"</div>}
            </DetailSection>
          )}

          {(r.bodyParts && r.bodyParts.length > 0 || r.bodyPartOther) && (
            <DetailSection title="Where it hurt">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(r.bodyParts || []).map(bp => (
                  <span key={bp} style={{ fontSize: 12, background: '#ECEAFB', borderRadius: 12, padding: '3px 10px' }}>{bp}</span>
                ))}
              </div>
              {r.bodyPartOther && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6 }}>In your words: "{r.bodyPartOther}"</div>}
            </DetailSection>
          )}

          {r.redFlags && (
            <DetailSection title="Safety check">
              {flagged.length > 0 && (
                <p style={{ fontSize: 12.5, color: TIERS.emergency.color, fontWeight: 600, margin: '2px 0 4px' }}>
                  Flagged: {flagged.map(f => f.short.toLowerCase()).join(', ')}
                </p>
              )}
              {RED_FLAGS.map(f => (
                <DetailRow
                  key={f.key}
                  label={f.short}
                  value={ANSWER_LABEL[r.redFlags[f.key]] || 'Not answered'}
                  flag={r.redFlags[f.key] === 'yes'}
                />
              ))}
            </DetailSection>
          )}

          {r.symptoms && (
            <DetailSection title="How it felt">
              {SYMPTOM_FIELDS.map(f => (
                <DetailRow
                  key={f.key}
                  label={f.label}
                  value={ANSWER_LABEL[r.symptoms[f.key]] || 'Not answered'}
                />
              ))}
              <DetailRow
                label="Could bear weight"
                value={ANSWER_LABEL[r.weightBearing] || 'Not answered'}
              />
              {r.contact && (
                <DetailRow
                  label="Contact"
                  value={(CONTACT_OPTIONS.find(o => o.key === r.contact) || {}).label || 'Not answered'}
                />
              )}
            </DetailSection>
          )}

          {matches.length > 0 && (
            <DetailSection title="What it could be">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matches.map((m, i) => (
                  <div key={i} style={{ background: C.paper, borderRadius: 12, padding: '9px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                    {(m.bodyPart || m.severity) && (
                      <div style={{ fontSize: 11.5, color: C.muted }}>
                        {[areaCount > 1 && m.area, m.bodyPart, m.together && 'may also be involved', m.severity && `${m.severity} typical`, m.recoveryWeeks != null && `~${m.recoveryWeeks} wk recovery`]
                          .filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {r.redFlagTriggered && matches.length === 0 && (
            <DetailSection title="What it could be">
              <p style={{ fontSize: 12.5, color: C.muted }}>
                The safety check flagged this, so the report went straight to emergency guidance without matching injuries. (Reports saved now always include possible injuries.)
              </p>
            </DetailSection>
          )}
        </div>
      )}
    </Card>
  );
}

function HistoryScreen({ onBack, onReport }) {
  const [reports, setReports] = useState(() => getSavedReports());
  const [confirmClear, setConfirmClear] = useState(false);
  const lastSaved = reports.length ? formatWhen(reports[0].savedAt || reports[0].date) : '';

  return (
    <Shell>
      <TopBar
        title="Past history"
        subtitle="Every finished report is saved on this device with the date, time, and everything you entered."
        onBack={onBack}
      />

      {reports.length === 0 ? (
        <Card style={{ padding: '28px 22px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', width: 44, height: 44, borderRadius: '50%',
            background: C.mintTint, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <History size={20} color={C.mintDeep} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No reports yet</div>
          <p style={{ fontSize: 13, color: C.muted, maxWidth: 280, margin: '0 auto 16px' }}>
            Finish an injury report and it will show up here with what you were doing, how it felt, and what it could be.
          </p>
          <Button onClick={onReport}>Report an injury</Button>
        </Card>
      ) : (
        <>
          <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 12, textAlign: 'center' }}>
            {reports.length} {reports.length === 1 ? 'report' : 'reports'} saved. Last saved {lastSaved}.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {reports.map(r => <ReportCard key={r.id} r={r} />)}
          </div>
          {confirmClear ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="ghost" onClick={() => setConfirmClear(false)}>Keep history</Button>
              <Button
                variant="purple"
                onClick={() => { clearReports(); setReports([]); setConfirmClear(false); }}
              >
                <Trash2 size={15} /> Clear all
              </Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmClear(true)}>
              <Trash2 size={15} /> Clear history
            </Button>
          )}
        </>
      )}
    </Shell>
  );
}

/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
export default function SidelineApp() {
  const [screen, setScreen] = useState('welcome');
  const home = () => setScreen('home');
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  if (screen === 'welcome') {
    return <Welcome onStart={home} onReport={() => setScreen('report')} />;
  }
  if (screen === 'report') {
    return <ReportFlow onExit={home} onHistory={() => setScreen('history')} />;
  }
  if (screen === 'history') {
    return <HistoryScreen onBack={home} onReport={() => setScreen('report')} />;
  }
  if (screen === 'emergency') {
    return <EmergencyScreen onBack={home} />;
  }
  if (screen in PLACEHOLDER_COPY) {
    const titles = { return: 'Return to play', data: 'My data' };
    return <Placeholder title={titles[screen]} desc={PLACEHOLDER_COPY[screen]} onBack={home} />;
  }
  return <Home go={setScreen} onBack={() => setScreen('welcome')} />;
}
