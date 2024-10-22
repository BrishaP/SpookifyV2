import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};