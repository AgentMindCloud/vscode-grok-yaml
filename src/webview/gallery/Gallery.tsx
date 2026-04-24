import { useMemo, useState } from 'react';
import { FILTERS, TEMPLATES, TemplateCategory } from './templates';
import { TemplateCard } from './TemplateCard';

type Filter = 'all' | TemplateCategory;

export function Gallery() {
  const [active, setActive] = useState<Filter>('all');

  const visible = useMemo(() => {
    if (active === 'all') return TEMPLATES;
    return TEMPLATES.filter((t) => t.categories.includes(active));
  }, [active]);

  return (
    <div className="gallery">
      <header className="gallery__header">
        <CircuitBackdrop />
        <div className="gallery__heading">
          <h1 className="gallery__title">Grok Agent Gallery</h1>
          <p className="gallery__subtitle">
            Schema-valid templates for reply bots, voice companions, thread orchestrators, trend
            surfers, and multi-agent swarms. Clone into your workspace or drop a snippet into the
            current file.
          </p>
        </div>
      </header>

      <nav className="filters" aria-label="Template filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`pill ${active === f.id ? 'pill--active' : ''}`}
            onClick={() => setActive(f.id)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      {visible.length === 0 ? (
        <div className="empty">
          <p className="empty__message">No templates match this filter yet.</p>
          <button type="button" className="link" onClick={() => setActive('all')}>
            Clear filters
          </button>
        </div>
      ) : (
        <section className="grid">
          {visible.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </section>
      )}

      <footer className="gallery__footer">
        GrokInstall is an independent community project. Not affiliated with xAI, Grok, or X.
      </footer>
    </div>
  );
}

function CircuitBackdrop() {
  return (
    <svg
      className="circuit"
      viewBox="0 0 1200 280"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="trace" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,240,255,0)" />
          <stop offset="50%" stopColor="rgba(0,240,255,0.6)" />
          <stop offset="100%" stopColor="rgba(0,240,255,0)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="rgba(0,240,255,0.15)" strokeWidth="1">
        <path d="M0 60 L320 60 L360 100 L640 100 L680 60 L1200 60" />
        <path d="M0 140 L200 140 L240 180 L520 180 L560 140 L920 140 L960 180 L1200 180" />
        <path d="M0 220 L440 220 L480 260 L880 260 L920 220 L1200 220" />
      </g>
      <g fill="#00F0FF">
        <circle cx="360" cy="100" r="3" />
        <circle cx="680" cy="60" r="3" />
        <circle cx="240" cy="180" r="3" />
        <circle cx="560" cy="140" r="3" />
        <circle cx="960" cy="180" r="3" />
        <circle cx="480" cy="260" r="3" />
        <circle cx="920" cy="220" r="3" />
      </g>
      <g stroke="url(#trace)" strokeWidth="1.5" fill="none" className="circuit__pulse">
        <path d="M0 100 L1200 100" />
      </g>
    </svg>
  );
}
