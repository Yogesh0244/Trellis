import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await register({ name, email, password });
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
          <h1 className="auth-page__headline">Structure your best work.</h1>
          <p className="auth-page__subhead">
            Create an account to spin up your first workspace and track work from TODO to DONE.
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2 className="auth-card__title">Create your account</h2>
          <p className="auth-card__subtitle">It takes less than a minute.</p>

          <Alert type="error">{error}</Alert>

          <div className="form-field">
            <label htmlFor="register-name">Name</label>
            <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Asha Rao" required autoFocus />
          </div>

          <div className="form-field">
            <label htmlFor="register-email">Email</label>
            <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="form-field">
            <label htmlFor="register-password">Password</label>
            <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-card__footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}