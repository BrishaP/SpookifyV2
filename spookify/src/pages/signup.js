// pages/signup.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../auth/authContext';
import { signUp } from '../auth/signUp'; // Import your signup function

const Signup = () => {
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

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      router.push('/dashboard'); // Redirect to dashboard after signup
    } catch (error) {
      setMessage(`Sign up error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
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
      <p>{message}</p>
    </div>
  );
};

export default Signup;