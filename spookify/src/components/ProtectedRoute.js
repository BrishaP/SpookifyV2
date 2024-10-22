// components/ProtectedRoute.js
import { useRouter } from 'next/router';
import { useAuth } from '../auth/authContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, router]);

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return children;
};

export default ProtectedRoute;