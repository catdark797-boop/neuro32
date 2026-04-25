import { usePageMeta } from '../hooks/usePageMeta';
import { BusinessSection } from './Home';

export default function Business() {
  usePageMeta(
    'Нейро 32 для бизнеса — маркетинг, автоматизация, контент',
    'ИИ-услуги для бизнеса и организаций: маркетинг, автоматизация, создание контента и визуалов. Формат учебного кейса с учениками — реальный результат с первого дня.',
    '/business'
  );
  return (
    <div>
      <section style={{ padding: '84px 24px 0', textAlign: 'center', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--fm)', fontSize: '.62rem', fontWeight: 700,
          letterSpacing: '.14em', textTransform: 'uppercase',
          color: 'var(--amber)', marginBottom: 14,
        }}>Для бизнеса и организаций</div>
        <h1 style={{
          fontFamily: 'var(--fu)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          lineHeight: 1.05, color: '#fff', margin: '0 0 18px', letterSpacing: '-.02em',
        }}>
          Нейро 32 <span style={{ color: 'var(--amber)' }}>для бизнеса</span>
        </h1>
        <p style={{
          maxWidth: 720, margin: '0 auto 12px', fontFamily: 'var(--fb)',
          fontSize: '1.05rem', color: 'var(--t2)', lineHeight: 1.7,
        }}>
          ИИ-маркетинг, автоматизация рутины, генерация контента и визуалов. Часть задач может
          выполняться учениками под контролем наставника — это честный учебный кейс с реальным результатом.
        </p>
      </section>
      <BusinessSection />
    </div>
  );
}
