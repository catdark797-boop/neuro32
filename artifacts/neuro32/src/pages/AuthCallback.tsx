import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { store } from '../lib/store';

interface OAuthUser {
  provider: string;
  providerId: string;
  name: string;
  email: string;
  avatar: string;
}

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setStatus('error');
      setTimeout(() => navigate('/auth'), 2500);
      return;
    }
    const userParam = params.get('user');
    if (!userParam) {
      setStatus('error');
      setTimeout(() => navigate('/auth'), 2500);
      return;
    }
    try {
      const oauthUser: OAuthUser = JSON.parse(userParam);
      const users = store.getUsers();
      const existing = users.find(u => u.email && u.email === oauthUser.email);
      if (existing) {
        localStorage.setItem('n32_current', JSON.stringify(existing));
        navigate(existing.role === 'admin' ? '/admin' : '/lk');
        return;
      }
      const newUser = store.register({
        name: oauthUser.name || `Пользователь (${oauthUser.provider})`,
        email: oauthUser.email || `${oauthUser.provider}_${oauthUser.providerId}@oauth.local`,
        phone: '',
      });
      navigate(newUser.role === 'admin' ? '/admin' : '/lk');
    } catch {
      setStatus('error');
      setTimeout(() => navigate('/auth'), 2500);
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: 'var(--dark)', padding: 32 }}>
      {status === 'loading' ? (
        <>
          <div style={{ width: 44, height: 44, border: '3px solid rgba(240,165,0,.2)', borderTopColor: 'var(--amber)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
          <p style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--t3)', letterSpacing: '.02em' }}>Входим в аккаунт…</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: '2.4rem', color: 'var(--scarlet)' }}>✕</div>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--t3)' }}>Ошибка входа. Перенаправляем…</p>
        </>
      )}
    </div>
  );
}
