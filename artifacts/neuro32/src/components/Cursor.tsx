import { useEffect, useRef } from 'react';

export default function Cursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    if ('ontouchstart' in window || window.matchMedia('(hover: none)').matches) return;

    const cur = curRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    let movePending = false;
    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      if (!movePending) {
        movePending = true;
        requestAnimationFrame(() => {
          cur.style.left = pos.current.mx + 'px';
          cur.style.top = pos.current.my + 'px';
          movePending = false;
        });
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      const isLink = t.closest('a,button,.dsc,.tool-card,.pkg-card');
      const isText = t.matches('input,textarea,select');
      document.body.classList.toggle('clink', !!isLink);
      document.body.classList.toggle('ctext', isText);
    };

    let raf: number;
    const animRing = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.11;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.11;
      ring.style.left = pos.current.rx + 'px';
      ring.style.top = pos.current.ry + 'px';
      raf = requestAnimationFrame(animRing);
    };
    animRing();

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef} />
      <div id="cur-ring" ref={ringRef} />
    </>
  );
}
