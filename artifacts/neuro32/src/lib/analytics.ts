// Yandex Metrika goal-events.
//
// Each call here lands as a "reachGoal" in counter 108745795. Goals matching
// these names need to be registered ONCE in the Metrika dashboard
// (Settings → Goals → "JavaScript event") so they show up in funnel reports.
// If a goal isn't registered there yet the call is still cheap (Metrika just
// records it as an "uncaptured event" you can promote later).
//
// Convention: `<noun>_<verb>` snake_case. Verbs match user intent, not button
// state, so `enroll_click` (intent) vs `enroll_submit` (success).
declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void;
    YM_ID?: number;
  }
}

const YM_ID = Number(import.meta.env.VITE_YM_ID) || 0;

function ym(goal: string, params?: Record<string, unknown>) {
  if (typeof window.ym === 'function' && YM_ID) {
    window.ym(YM_ID, 'reachGoal', goal, params);
  }
}

export const analytics = {
  // ─── Funnel: Lead → Application ────────────────────────────────────────
  /** «Записаться» button clicked, before form is open. Intent signal. */
  enrollClick: () => ym('enroll_click'),
  /** EnrollModal form submit fully succeeded (after retry). Conversion. */
  enrollSubmit: (direction?: string) => ym('enroll_submit', direction ? { direction } : undefined),

  // ─── Funnel: B2B ───────────────────────────────────────────────────────
  /** Bottom-of-page «business» form successfully submitted. */
  businessSubmit: (format?: string) => ym('business_submit', format ? { format } : undefined),

  // ─── Funnel: Account ───────────────────────────────────────────────────
  /** Brand-new user registered (POST /auth/register success). */
  registerSubmit: () => ym('register_submit'),
  /** Existing user logged in (POST /auth/login success). Cheap retention metric. */
  loginSuccess: () => ym('login_success'),
  /** GDPR self-deletion completed — useful negative signal. */
  accountDelete: () => ym('account_delete'),

  // ─── Engagement ────────────────────────────────────────────────────────
  /** Generic «contact us» CTA on Contact page. */
  contactSubmit: () => ym('contact_submit'),
  /** AI widget panel opened — proxy for «curious about ИИ-продукт» */
  aiWidgetOpen: () => ym('ai_widget_open'),
  /** Click on program card from Home → /kids|/teens|/adults|/cyber */
  programClick: (program: 'kids' | 'teens' | 'adults' | 'cyber') => ym(`program_click_${program}`),
  /** Any external CTA pointing to Telegram (DSM1322). High-quality lead. */
  telegramClick: (source: string) => ym('telegram_click', { source }),

  // ─── Funnel: Payment (LK) ─────────────────────────────────────────────
  /** User pressed «Оплатить» in LK; redirect to YooMoney about to fire. */
  paymentInitiated: (amount: number) => ym('payment_initiated', { amount }),
};
