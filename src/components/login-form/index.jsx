import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../button';
import './index.css';

function LoginForm({ onShowCreateAccount }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(event) {
    event.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Logged in.');
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-header">
          <h1>Log in</h1>
          <p className="auth-intro">
            Sign in to manage your household budget.
          </p>
        </div>

        <div className="auth-fields">
          <label className="auth-field">
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Your password"
            />
          </label>
        </div>

        <div className="auth-actions">
          <Button
            buttonType="auth-button primary"
            type="submit"
            text="Log in"
          />

          <Button
            buttonType="auth-button secondary"
            type="button"
            clickedFunction={onShowCreateAccount}
            text="Create an account"
          />
        </div>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </main>
  );
}

export default LoginForm;