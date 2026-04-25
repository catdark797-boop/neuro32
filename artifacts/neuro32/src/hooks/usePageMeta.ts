import { useEffect } from 'react';

export function usePageMeta(title: string, description: string, _legacyPath?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — Нейро 32` : 'Нейро 32 — Офлайн-практика ИИ в Новозыбкове';

    const getMeta = (name: string) => document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    const getProp = (prop: string) => document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);

    const descEl = getMeta('description');
    const prevDesc = descEl?.content || '';
    if (descEl && description) descEl.content = description;

    // Canonical: use current origin so punycode/unicode variants both work.
    // Fallback for SSR / non-browser contexts.
    const origin =
      (typeof window !== 'undefined' && window.location?.origin) ||
      'https://xn--32-mlcqsin.xn--p1ai';
    const canonical = `${origin}${window.location.pathname}`;

    const ogTitle = getProp('og:title');
    const prevOGTitle = ogTitle?.content || '';
    if (ogTitle) ogTitle.content = title ? `${title} — Нейро 32` : 'Нейро 32';

    const ogDesc = getProp('og:description');
    const prevOGDesc = ogDesc?.content || '';
    if (ogDesc && description) ogDesc.content = description;

    const ogUrl = getProp('og:url');
    const prevOGUrl = ogUrl?.content || '';
    if (ogUrl) ogUrl.content = canonical;

    const twTitle = getMeta('twitter:title');
    const prevTwTitle = twTitle?.content || '';
    if (twTitle) twTitle.content = title ? `${title} — Нейро 32` : 'Нейро 32';

    const twDesc = getMeta('twitter:description');
    const prevTwDesc = twDesc?.content || '';
    if (twDesc && description) twDesc.content = description;

    let canonEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonEl?.href || '';
    if (!canonEl) {
      canonEl = document.createElement('link');
      canonEl.rel = 'canonical';
      document.head.appendChild(canonEl);
    }
    canonEl.href = canonical;

    return () => {
      document.title = prev;
      if (descEl) descEl.content = prevDesc;
      if (ogTitle) ogTitle.content = prevOGTitle;
      if (ogDesc) ogDesc.content = prevOGDesc;
      if (ogUrl) ogUrl.content = prevOGUrl;
      if (twTitle) twTitle.content = prevTwTitle;
      if (twDesc) twDesc.content = prevTwDesc;
      if (canonEl) canonEl.href = prevCanonical;
    };
  }, [title, description]);
}
