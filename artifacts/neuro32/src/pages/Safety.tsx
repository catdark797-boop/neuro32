import { useLocation } from 'wouter';
import { usePageMeta } from '../hooks/usePageMeta';
import { motion } from 'framer-motion';
import { Key, Lock, Smartphone, Globe, Fish, Bot, Cloud, Search, MessageCircle, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const CARDS: { Icon: LucideIcon; t: string; d: string }[] = [
  { Icon: Key,           t: 'Сильные пароли', d: 'Используйте менеджер паролей (Bitwarden бесплатен). Уникальный пароль для каждого сервиса. Минимум 16 символов с символами.' },
  { Icon: Lock,          t: 'Двухфакторная аутентификация', d: 'Включите 2FA везде: ВКонтакте, Госуслуги, почта. Используйте приложение-аутентификатор, а не SMS.' },
  { Icon: Smartphone,    t: 'Безопасность смартфона', d: 'Обновляйте ОС. Устанавливайте приложения только из официальных магазинов. Проверяйте разрешения.' },
  { Icon: Globe,         t: 'VPN в публичных сетях', d: 'Никогда не вводите пароли в публичном Wi-Fi без VPN. Используйте Outline или WireGuard.' },
  { Icon: Fish,          t: 'Фишинг и мошенничество', d: 'Не переходите по ссылкам из SMS и email. Сотрудники банка никогда не звонят первыми и не просят CVV.' },
  { Icon: Bot,           t: 'ИИ-мошенники', d: 'В 2026 году мошенники клонируют голоса и лица. Придумайте семейное кодовое слово для экстренных ситуаций.' },
  { Icon: Cloud,         t: 'Резервные копии', d: 'Правило 3-2-1: 3 копии, 2 разных носителя, 1 хранится удалённо. Проверяйте бэкапы раз в месяц.' },
  { Icon: Search,        t: 'Приватность данных', d: 'Проверьте, не утекли ли ваши данные: haveibeenpwned.com. Минимизируйте данные в соцсетях.' },
  { Icon: MessageCircle, t: 'Безопасные мессенджеры', d: 'Signal для конфиденциальных переписок. Telegram — только в секретных чатах. ВКонтакте — не для секретов.' },
];

export default function Safety() {
  const [, navigate] = useLocation();
  usePageMeta('Цифровая безопасность', 'Советы по кибербезопасности от Нейро 32: сильные пароли, 2FA, VPN, защита от фишинга и ИИ-мошенников.');
  return (
    <div>
      <div className="pg-hero">
        <div className="pg-badge"><Shield size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Цифровая безопасность</div>
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
        <motion.div
          className="safety-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              className="safety-card rv-s"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <div className="safety-ico"><c.Icon size={24} /></div>
              <div className="safety-t">{c.t}</div>
              <div className="safety-d">{c.d}</div>
            </motion.div>
          ))}
        </motion.div>
        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <p style={{ color: 'var(--t3)', fontSize: '.9rem', marginBottom: 24 }}>Хотите изучить кибербезопасность глубже?</p>
          <button className="btn btn-amber btn-lg" onClick={() => navigate('/cyber')}>Курс кибербезопасности →</button>
        </div>
      </section>
    </div>
  );
}
