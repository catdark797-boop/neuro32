import { useState, useRef, useEffect } from 'react';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

const VKIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#4a7fff" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.18 13.63h-1.63c-.62 0-.81-.49-1.92-1.62-1-.93-1.44-.93-1.69-.93-.36 0-.47.1-.47.6v1.47c0 .43-.14.69-1.27.69-1.88 0-3.96-1.14-5.42-3.26C3.48 10.29 3 8.4 3 7.64c0-.25.1-.49.6-.49h1.63c.44 0 .61.2.78.67.87 2.5 2.31 4.7 2.91 4.7.22 0 .32-.1.32-.65V9.76c-.06-1.17-.68-1.27-.68-1.69 0-.2.16-.4.43-.4h2.56c.37 0 .5.2.5.62v3.36c0 .37.16.5.27.5.22 0 .41-.13.82-.54 1.27-1.42 2.17-3.6 2.17-3.6.12-.25.32-.49.76-.49h1.63c.49 0 .6.25.49.62-.21.96-2.23 3.83-2.23 3.83-.18.29-.24.42 0 .74.17.24.73.74 1.1 1.19.69.79 1.21 1.46 1.35 1.92.14.45-.1.69-.58.69z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#26a5e4" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#25d366" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : (url || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const copyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const el = document.createElement('textarea');
        el.value = shareUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setToast(true);
    setMenuOpen(false);
    setTimeout(() => setToast(false), 2200);
  };

  const handleShare = async () => {
    if (hasNativeShare) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        /* cancelled or error — fall through to copy */
      }
    }
    await copyLink();
  };

  const enc = encodeURIComponent;
  const links = [
    { label: 'ВКонтакте', href: `https://vk.com/share.php?url=${enc(shareUrl)}`, icon: <VKIcon /> },
    { label: 'Telegram', href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(text)}`, icon: <TelegramIcon /> },
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(text + ' ' + shareUrl)}`, icon: <WhatsAppIcon /> },
  ];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <button
        className="btn btn-ghost btn-sm"
        onClick={handleShare}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: toast ? '#10b981' : undefined, transition: 'color .2s' }}
        aria-label="Поделиться"
      >
        {toast
          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : <ShareIcon />
        }
        {toast ? 'Скопировано!' : 'Поделиться'}
      </button>

      <button
        className="btn btn-ghost btn-sm"
        onClick={() => setMenuOpen(o => !o)}
        style={{ padding: '5px 7px', minWidth: 0 }}
        aria-label="Открыть меню поделиться"
        title="Выбрать платформу"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={menuOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}/>
        </svg>
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 200,
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 12, padding: 6, minWidth: 190,
          boxShadow: '0 8px 32px rgba(0,0,0,.6)',
        }}>
          {links.map(item => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, color: 'var(--t2)', textDecoration: 'none', fontSize: '.88rem', transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
          <div style={{ height: 1, background: 'var(--line)', margin: '4px 6px' }} />
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, color: toast ? '#10b981' : 'var(--t2)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '.88rem', width: '100%', transition: 'all .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={copyLink}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {toast
                ? <polyline points="20 6 9 17 4 12"/>
                : <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>
              }
            </svg>
            {toast ? 'Скопировано!' : 'Скопировать ссылку'}
          </button>
        </div>
      )}
    </div>
  );
}
