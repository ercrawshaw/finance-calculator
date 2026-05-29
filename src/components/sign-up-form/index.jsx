import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../button';
import './index.css';

function SignUpForm({ onShowLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [profileName, setProfileName] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignUp(event) {
    event.preventDefault();
    setMessage('');

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage(signUpError.message);
      return;
    }

    const user = signUpData.user;

    if (!user) {
      setMessage('Account created. Please check your email to confirm it.');
      return;
    }

    const { data: household, error: householdError } = await supabase
      .from('households')
      .select('id')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .single();

    if (householdError) {
      setMessage('Invite code not found.');
      return;
    }

    const { error: memberError } = await supabase
      .from('household_members')
      .insert({
        household_id: household.id,
        user_id: user.id,
        role: 'member',
      });

    if (memberError) {
      setMessage(memberError.message);
      return;
    }

    if (profileName) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_id: user.id })
        .eq('household_id', household.id)
        .eq('name', profileName);

      if (profileError) {
        setMessage(profileError.message);
        return;
      }
    }

    setMessage('Account created and linked to household. You can now log in.');
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSignUp}>
        <div className="auth-header">
          <h1>Create account</h1>
          <p className="auth-intro">
            Use your invite code to join your household.
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
              placeholder="Password"
            />
          </label>

          <label className="auth-field">
            <span>Invite code</span>
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              placeholder="Enter your invite code"
            />
          </label>

          <label className="auth-field">
            <span>Profile name</span>
            <input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              placeholder="Name"
            />
          </label>
        </div>

        <div className="auth-actions">
          <Button
            buttonType="auth-button primary"
            type="submit"
            text="Create account"
          />

          <Button
            buttonType="auth-button secondary"
            type="button"
            clickedFunction={onShowLogin}
            text="Log in instead"
          />
        </div>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </main>
  );
}

export default SignUpForm;