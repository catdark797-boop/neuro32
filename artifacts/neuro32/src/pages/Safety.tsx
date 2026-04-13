import { useLocation } from 'wouter';
import { usePageMeta } from '../hooks/usePageMeta';

const CARDS = [
  { ico: '🔑', t: 'Сильные пароли', d: 'Используйте менеджер паролей (Bitwarden бесплатен). Уникальный пароль для каждого сервиса. Минимум 16 символов с символами.' },
  { ico: '🔐', t: 'Двухфакторная аутентификация', d: 'Включите 2FA везде: ВКонтакте, Госуслуги, почта. Используйте приложение-аутентификатор, а не SMS.' },
  { ico: '📱', t: 'Безопасность смартфона', d: 'Обновляйте ОС. Устанавливайте приложения только из официальных магазинов. Проверяйте разрешения.' },
  { ico: '🌐', t: 'VPN в публичных сетях', d: 'Никогда не вводите пароли в публичном Wi-Fi без VPN. Используйте Outline или WireGuard.' },
  { ico: '🎣', t: 'Фишинг и мошенничество', d: 'Не переходите по ссылкам из SMS и email. Сотрудники банка никогда не звонят первыми и не просят CVV.' },
  { ico: '🤖', t: 'ИИ-мошенники', d: 'В 2026 году мошенники клонируют голоса и лица. Придумайте семейное кодовое слово для экстренных ситуаций.' },
  { ico: '☁️', t: 'Резервные копии', d: 'Правило 3-2-1: 3 копии, 2 разных носителя, 1 хранится удалённо. Проверяйте бэкапы раз в месяц.' },
  { ico: '🕵️', t: 'Приватность данных', d: 'Проверьте, не утекли ли ваши данные: haveibeenpwned.com. Минимизируйте данные в соцсетях.' },
  { ico: '💬', t: 'Безопасные мессенджеры', d: 'Signal для конфиденциальных переписок. Telegram — только в секретных чатах. ВКонтакте — не для секретов.' },
];

export default function Safety() {
  const [, navigate] = useLocation();
  usePageMeta('Цифровая безопасность', 'Советы по кибербезопасности от Нейро 32: сильные пароли, 2FA, VPN, защита от фишинга и ИИ-мошенников.');
  return (
    <div>
      <div className="pg-hero">
        <div className="pg-badge">🛡️ Цифровая безопасность</div>
        <h1>ЦИФРОВАЯ <span className="accent">БЕЗОПАСНОСТЬ</span></h1>
        <p>Базовые правила защиты в интернете для всей семьи. Подготовлено на основе программы курса кибербезопасности Нейро 32.</p>
        <div className="prog-meta">
          <span className="chip ch-green">Бесплатный гайд</span>
          <span className="chip ch-blue">Для всех</span>
        </div>
      </div>
      <section className="S">
        <div className="s-eyebrow rv">Ваша защита</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">9 правил <span className="accent">цифровой защиты</span></h2>
        <div className="safety-grid">
          {CARDS.map((c, i) => (
            <div key={i} className="safety-card rv-s" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
              <div className="safety-ico">{c.ico}</div>
              <div className="safety-t">{c.t}</div>
              <div className="safety-d">{c.d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <p style={{ color: 'var(--t3)', fontSize: '.9rem', marginBottom: 24 }}>Хотите изучить кибербезопасность глубже?</p>
          <button className="btn btn-amber btn-lg" onClick={() => navigate('/cyber')}>Курс кибербезопасности →</button>
        </div>
      </section>
    </div>
  );
}
