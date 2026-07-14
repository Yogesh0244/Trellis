import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        <div className="aurora" aria-hidden="true">
          <span className="aurora__blob aurora__blob--1" />
          <span className="aurora__blob aurora__blob--2" />
          <span className="aurora__blob aurora__blob--3" />
        </div>
        <div className="auth-page__brand-inner">
          <span className="auth-page__mark">T</span>
          <h1 className="auth-page__headline">Every task has a home.</h1>
          <p className="auth-page__subhead">
            Trellis organizes work into workspaces, projects, and tasks — structured enough to stay
            organized, simple enough to actually use.
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 className="auth-card__title">Welcome back</h2>
          <p className="auth-card__subtitle">Log in to see your workspaces.</p>

          <Alert type="error">{error}</Alert>

          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>

          <p className="auth-card__footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}