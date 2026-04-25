export interface Review {
  id: string;
  name: string;
  role: string;
  direction: string;
  rating: number;
  text: string;
  date: string;
}

export interface ClassSession {
  id: string;
  date: string;
  time: string;
  direction: 'Дети' | 'Подростки' | 'Взрослые' | 'Кибербезопасность';
  topic: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  direction: string;
  format: string;
  message: string;
  status: 'new' | 'processed' | 'declined';
  date: string;
  isBusinessInquiry?: boolean;
  organizationName?: string;
  businessStatus?: 'new' | 'in_progress' | 'contracted' | 'declined';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  telegram: string;
  role: 'user' | 'admin';
  direction: string;
  goals: string;
  registeredAt: string;
}

const DEMO_REVIEWS: Review[] = [];

const DEMO_USERS: User[] = [
  { id: 'user', name: 'Иван Петров', email: 'ivan@example.com', phone: '+7 900 000-00-00', telegram: '@ivan_p', role: 'user', direction: 'Подростки', goals: 'Освоить ИИ для учёбы', registeredAt: '1 марта 2026' },
  { id: 'admin', name: 'Степан Денис', email: 'd3stemar@yandex.ru', phone: '+79019769810', telegram: '@DSM1322', role: 'admin', direction: 'Все', goals: 'Обучение ИИ', registeredAt: '1 января 2026' },
];

function getLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function setLS(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

export const store = {
  getReviews(): Review[] { return getLS('n32_reviews', DEMO_REVIEWS); },
  addReview(r: Omit<Review, 'id' | 'date'>): Review {
    const reviews = this.getReviews();
    const newR: Review = { ...r, id: Date.now().toString(), date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) };
    setLS('n32_reviews', [newR, ...reviews]);
    return newR;
  },
  getRequests(): ContactRequest[] { return getLS('n32_requests', []); },
  addRequest(r: Omit<ContactRequest, 'id' | 'date' | 'status' | 'businessStatus'>): ContactRequest {
    const requests = this.getRequests();
    const newR: ContactRequest = {
      ...r,
      id: Date.now().toString(),
      status: 'new',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      ...(r.isBusinessInquiry ? { businessStatus: 'new' as const } : {}),
    };
    setLS('n32_requests', [newR, ...requests]);
    return newR;
  },
  updateRequestStatus(id: string, status: ContactRequest['status']) {
    const requests = this.getRequests().map(r => r.id === id ? { ...r, status } : r);
    setLS('n32_requests', requests);
  },
  updateBusinessStatus(id: string, businessStatus: ContactRequest['businessStatus']) {
    const requests = this.getRequests().map(r => r.id === id ? { ...r, businessStatus } : r);
    setLS('n32_requests', requests);
  },
  getBusinessInquiries(): ContactRequest[] {
    return this.getRequests().filter(r => r.isBusinessInquiry === true);
  },
  getClassSessions(): ClassSession[] { return getLS('n32_sessions', []); },
  addClassSession(s: Omit<ClassSession, 'id'>): ClassSession {
    const sessions = this.getClassSessions();
    const newS: ClassSession = { ...s, id: Date.now().toString() };
    setLS('n32_sessions', [...sessions, newS].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)));
    return newS;
  },
  deleteClassSession(id: string) {
    setLS('n32_sessions', this.getClassSessions().filter(s => s.id !== id));
  },
  getUsers(): User[] { return getLS('n32_users', DEMO_USERS); },
  getCurrentUser(): User | null { return getLS('n32_current', null); },
  login(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return null;
    if (password === 'demo' || password === 'admin123') { setLS('n32_current', user); return user; }
    return null;
  },
  register(data: Pick<User, 'name' | 'email' | 'phone'>): User {
    const users = this.getUsers();
    const user: User = { ...data, id: Date.now().toString(), telegram: '', role: 'user', direction: '', goals: '', registeredAt: new Date().toLocaleDateString('ru-RU') };
    setLS('n32_users', [...users, user]);
    setLS('n32_current', user);
    return user;
  },
  logout() { localStorage.removeItem('n32_current'); },
  updateUser(data: Partial<User>) {
    const current = this.getCurrentUser();
    if (!current) return;
    const updated = { ...current, ...data };
    setLS('n32_current', updated);
    const users = this.getUsers().map(u => u.id === updated.id ? updated : u);
    setLS('n32_users', users);
  },
  updateUserGroup(userId: string, direction: string) {
    const users = this.getUsers().map(u => u.id === userId ? { ...u, direction } : u);
    setLS('n32_users', users);
    const current = this.getCurrentUser();
    if (current?.id === userId) setLS('n32_current', { ...current, direction });
  },
  deleteUser(id: string) {
    const toDelete = this.getUsers().find(u => u.id === id);
    if (!toDelete || toDelete.role === 'admin') return false;
    setLS('n32_users', this.getUsers().filter(u => u.id !== id));
    return true;
  },
  getGroupMax(): number { return getLS('n32_group_max', 8); },
  setGroupMax(max: number) { setLS('n32_group_max', max); },
  getAIMessages(): number { return getLS('n32_ai_msgs', 0); },
  incAIMessages() { setLS('n32_ai_msgs', this.getAIMessages() + 1); },
};
