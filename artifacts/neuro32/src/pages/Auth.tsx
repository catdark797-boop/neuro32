import { useState } from 'react';
import { useLocation } from 'wouter';
import { store } from '../lib/store';

type Mode = 'login' | 'register';

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [, navigate] = useLocation();

  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === '@DSM1322' || email === 'd3stemar@yandex.ru') {
      const users = store.getUsers();
      const admin = users.find(u => u.role === 'admin');
      if (admin) {
        localStorage.setItem('n32_current', JSON.stringify(admin));
        navigate('/admin');
        return;
      }
    }
    const user = store.login(email, password);
    if (!user) {
      setError('Неверный email или пароль. Для теста используйте пароль «demo»');
      return;
    }
    if (user.role === 'admin') navigate('/admin');
    else navigate('/lk');
  };

  const registerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone) { setError('Заполните все поля'); return; }
    const existing = store.getUsers().find(u => u.email === email);
    if (existing) { setError('Пользователь с таким email уже существует'); return; }
    store.register({ name, email, phone });
    navigate('/lk');
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {mode === 'login' ? (
          <>
            <h2>Войти</h2>
            <p>Личный кабинет ученика или панель администратора</p>

            {error && (
              <div style={{ background: 'rgba(230,57,70,.1)', border: '1px solid rgba(230,57,70,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '.84rem', color: 'var(--scarlet)' }}>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={loginSubmit}>
              <div className="form-field">
                <label className="form-label">Email или Telegram</label>
                <input className="form-inp" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com или @DSM1322" autoComplete="username" required />
              </div>
              <div className="form-field">
                <label className="form-label">Пароль</label>
                <input className="form-inp" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введите пароль" autoComplete="current-password" required />
              </div>
              <button type="submit" className="btn btn-amber btn-lg" style={{ justifyContent: 'center' }}>Войти →</button>
            </form>

            <div className="auth-link">Нет аккаунта? <a onClick={() => { setMode('register'); setError(''); }}>Зарегистрироваться</a></div>

            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(240,165,0,.05)', border: '1px solid rgba(240,165,0,.12)', borderRadius: 10, fontSize: '.76rem', color: 'var(--t3)', lineHeight: 1.7 }}>
              Демо-вход: любой email + пароль «demo»<br />
              Админ: @DSM1322 + любой пароль
            </div>
          </>
        ) : (
          <>
            <h2>Регистрация</h2>
            <p>Создайте аккаунт для доступа к личному кабинету</p>
            {error && <div style={{ background: 'rgba(230,57,70,.1)', border: '1px solid rgba(230,57,70,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '.84rem', color: 'var(--scarlet)' }}>{error}</div>}
            <form className="auth-form" onSubmit={registerSubmit}>
              <div className="form-field">
                <label className="form-label">Имя</label>
                <input className="form-inp" value={name} onChange={e => setName(e.target.value)} placeholder="Иван Петров" required />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" autoComplete="email" required />
              </div>
              <div className="form-field">
                <label className="form-label">Телефон</label>
                <input className="form-inp" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" required />
              </div>
              <button type="submit" className="btn btn-amber btn-lg" style={{ justifyContent: 'center' }}>Зарегистрироваться →</button>
            </form>
            <div className="auth-link">Уже есть аккаунт? <a onClick={() => { setMode('login'); setError(''); }}>Войти</a></div>
          </>
        )}
      </div>
    </div>
  );
}
