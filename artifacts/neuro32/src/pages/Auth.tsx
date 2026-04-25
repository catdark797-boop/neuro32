import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { login, register, getGetMeQueryKey } from '@workspace/api-client-react';
import { useCurrentUser } from '../lib/auth-context';
import { usePageMeta } from '../hooks/usePageMeta';
import { analytics } from '../lib/analytics';

type Mode = 'login' | 'register';

export default function Auth() {
  usePageMeta('Вход', 'Войдите в личный кабинет Нейро 32 или зарегистрируйтесь.');
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { invalidate } = useCurrentUser();
  const qc = useQueryClient();

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      analytics.loginSuccess();
      // Seed the query cache so the next render of Admin/LK sees the user
      // synchronously (otherwise route-guard redirects back to /auth before
      // useGetMe's refetch completes).
      qc.setQueryData(getGetMeQueryKey(), user);
      invalidate();
      if (user.role === 'admin') navigate('/admin');
      else navigate('/lk');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'data' in err
        ? (err as { data?: { error?: string } }).data?.error
        : null;
      setError(msg || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const registerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone) { setError('Заполните все поля'); return; }
    setLoading(true);
    try {
      const user = await register({ name, email, phone, password });
      analytics.registerSubmit();
      qc.setQueryData(getGetMeQueryKey(), user);
      invalidate();
      navigate('/lk');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'data' in err
        ? (err as { data?: { error?: string } }).data?.error
        : null;
      setError(msg || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const errBox = error ? (
    <div style={{ background: 'rgba(230,57,70,.1)', border: '1px solid rgba(230,57,70,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '.84rem', color: 'var(--scarlet)' }}>
      {error}
    </div>
  ) : null;

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {mode === 'login' ? (
          <>
            <h2>Войти</h2>
            <p>Личный кабинет ученика или панель администратора</p>
            {errBox}
            <form className="auth-form" onSubmit={loginSubmit}>
              <div className="form-field">
                <label className="form-label">Email или Telegram</label>
                <input className="form-inp" type="text" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com или @DSM1322" autoComplete="username" required />
              </div>
              <div className="form-field">
                <label className="form-label">Пароль</label>
                <input className="form-inp" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введите пароль" autoComplete="current-password" required />
              </div>
              <button type="submit" className="btn btn-amber btn-lg" style={{ justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Вход…' : 'Войти →'}
              </button>
            </form>
            <div className="auth-link">Нет аккаунта? <a onClick={() => { setMode('register'); setError(''); }}>Зарегистрироваться</a></div>
          </>
        ) : (
          <>
            <h2>Регистрация</h2>
            <p>Создайте аккаунт для доступа к личному кабинету</p>
            {errBox}
            <form className="auth-form" onSubmit={registerSubmit}>
              <div className="form-field">
                <label className="form-label">Имя</label>
                <input className="form-inp" value={name} onChange={e => setName(e.target.value)} placeholder="Иван Петров" autoComplete="name" required />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-inp" type="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" autoComplete="email" required />
              </div>
              <div className="form-field">
                <label className="form-label">Телефон</label>
                <input className="form-inp" type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" autoComplete="tel" required />
              </div>
              <div className="form-field">
                <label className="form-label">Пароль</label>
                <input className="form-inp" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 6 символов" autoComplete="new-password" required minLength={6} />
              </div>
              <button type="submit" className="btn btn-amber btn-lg" style={{ justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Регистрация…' : 'Зарегистрироваться →'}
              </button>
            </form>
            <div className="auth-link">Уже есть аккаунт? <a onClick={() => { setMode('login'); setError(''); }}>Войти</a></div>
          </>
        )}
      </div>
    </div>
  );
}
