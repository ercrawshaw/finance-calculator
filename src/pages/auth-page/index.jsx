import { useState } from 'react';
import LoginForm from '../../components/login-form';
import SignUpForm from '../../components/sign-up-form';

function AuthPage() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  if (isCreatingAccount) {
    return (
      <SignUpForm
        onShowLogin={() => setIsCreatingAccount(false)}
      />
    );
  }

  return (
    <LoginForm
      onShowCreateAccount={() => setIsCreatingAccount(true)}
    />
  );
}

export default AuthPage;