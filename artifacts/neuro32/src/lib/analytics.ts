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
  enrollClick: () => ym('enroll_click'),
  enrollSubmit: (direction?: string) => ym('enroll_submit', direction ? { direction } : undefined),
  contactSubmit: () => ym('contact_submit'),
  aiWidgetOpen: () => ym('ai_widget_open'),
  programClick: (program: 'kids' | 'teens' | 'adults' | 'cyber') => ym(`program_click_${program}`),
};
