import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};