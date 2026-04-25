// Standalone Breadcrumb with schema.org microdata. Currently NOT imported
// (ProgramBlocks has its own inline Breadcrumb with JSON-LD). Kept around
// for non-program pages that may want a breadcrumb later.
const BASE = '';
const SITE_ORIGIN = 'https://xn--32-mlcqsin.xn--p1ai';

interface Crumb { label: string; href?: string; }

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" style={{ paddingTop: 'calc(var(--nav-h) + 12px)', paddingLeft: 'clamp(16px,4vw,48px)', paddingBottom: 0 }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}
        itemScope itemType="https://schema.org/BreadcrumbList">
        {crumbs.map((c, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <meta itemProp="position" content={String(i + 1)} />
            {c.href ? (
              <>
                <meta itemProp="item" content={`${SITE_ORIGIN}${BASE}${c.href}`} />
                <a href={c.href} itemProp="name" style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', letterSpacing: '.04em', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t4)'; }}>
                  {c.label}
                </a>
              </>
            ) : (
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--amber)', letterSpacing: '.04em' }} itemProp="name">{c.label}</span>
            )}
            {i < crumbs.length - 1 && <span style={{ color: 'var(--line2)', fontSize: '.55rem' }}>›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
