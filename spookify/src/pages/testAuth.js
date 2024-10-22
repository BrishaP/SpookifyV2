import { useState } from 'react';
import { signUp } from '../auth/signUp';
import { login } from '../auth/login';

export default function TestAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password);
      setMessage(`Sign up successful: ${user.email}`);
    } catch (error) {
      setMessage(`Sign up error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const { user, userData } = await login(email, password);
      setMessage(`Login successful: ${user.email}`);
    } catch (error) {
      setMessage(`Login error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Test Firebase Auth</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
}