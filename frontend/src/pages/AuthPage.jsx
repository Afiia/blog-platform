import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await authenticate(mode, isLogin ? { email: form.email, password: form.password } : form);
      navigate('/');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
      {!isLogin && <label>Name<input value={form.name} onChange={set('name')} autoComplete="name" required /></label>}
      <label>Email<input type="email" value={form.email} onChange={set('email')} autoComplete="email" required /></label>
      <label>Password<input type="password" value={form.password} onChange={set('password')} minLength={isLogin ? 1 : 8}
        autoComplete={isLogin ? 'current-password' : 'new-password'} required /></label>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}</button>
      <p className="muted">
        {isLogin ? <>No account? <Link to="/register">Register</Link></> : <>Have an account? <Link to="/login">Log in</Link></>}
      </p>
    </form>
  );
}
