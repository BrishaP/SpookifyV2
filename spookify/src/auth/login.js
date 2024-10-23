import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import supabase from './supabaseClient';

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve user data from Supabase using Firebase UID
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', user.uid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('No user found with this email.');
      }
      throw error;
    }

    return { user, userData: data };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};