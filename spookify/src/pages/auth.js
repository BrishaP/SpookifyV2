import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../auth/authContext';
import { login } from '../auth/login';
import { signUp } from '../auth/signUp';
import { resetPassword } from '../auth/resetPassword'; // Import resetPassword function
import styles from './auth.module.css';

const Auth = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

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

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      router.push('/dashboard'); // Redirect to dashboard after signup
    } catch (error) {
      setMessage(`Sign up error: ${error.message}`);
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
    <div className={styles.container}>
      <h1 className={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      {isLogin ? (
        <>
          <button onClick={handleLogin} className={styles.button}>Login</button>
          <button onClick={handleResetPassword} className={styles.button}>Forgot Password?</button>
        </>
      ) : (
        <button onClick={handleSignUp} className={styles.button}>Sign Up</button>
      )}
      <p className={styles.message}>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)} className={styles.switchButton}>
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default Auth;