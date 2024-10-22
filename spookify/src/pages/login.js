import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../auth/authContext';
import { login } from '../auth/login';
import { resetPassword } from '../auth/resetPassword'; // Import resetPassword function

const Login = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // Redirect to dashboard if authenticated
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      setMessage(`Login error: ${error.message}`);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      <button onClick={handleResetPassword}>Forgot Password?</button>
    </div>
  );
};

export default Login;