import { useState } from 'react';

interface Session {
  n: string;
  t: string;
  d: string;
  tags: string[];
  type?: 'online' | 'project' | 'warn';
}

interface Phase {
  num: string;
  title: string;
  sub: string;
  chip: { label: string; cls: string };
  sessions: Session[];
}

export default function Roadmap({ phases }: { phases: Phase[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);

  return (
    <div>
      {phases.map((ph, i) => (
        <div className="rm-phase" key={i}>
          <button className={`rm-phase-head${openIdx === i ? ' open' : ''}`} onClick={() => toggle(i)}>
            <div className="rm-ph-num">{ph.num}</div>
            <div className="rm-ph-info">
              <div className="rm-ph-title">{ph.title}</div>
              <div className="rm-ph-sub">{ph.sub}</div>
            </div>
            <span className={`chip ${ph.chip.cls}`}>{ph.chip.label}</span>
            <div className="rm-ph-toggle">{openIdx === i ? '×' : '+'}</div>
          </button>
          <div className={`rm-sessions${openIdx === i ? ' open' : ''}`}>
            {ph.sessions.map((s, j) => (
              <div key={j} className={`rm-ses rm-ses-${s.type || 'online'}`}>
                <div className="rm-ses-n">{s.n}</div>
                <div className="rm-ses-t">{s.t}</div>
                <div className="rm-ses-d">{s.d}</div>
                <div className="rm-ses-tags">
                  {s.tags.map((tag, k) => {
                    const cls = tag.startsWith('⚠') ? 'ch-red' : tag.startsWith('✓') ? 'ch-green' : 'ch-dim';
                    return <span key={k} className={`chip ${cls}`}>{tag}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export type { Phase, Session };
