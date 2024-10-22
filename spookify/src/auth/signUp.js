import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import supabase from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const signUp = async (email, password) => {
  try {
    // Sign up the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userId = uuidv4();

    // Store user data in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: userId, email: user.email, created_at: new Date() }]);

    if (error) throw error;

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};