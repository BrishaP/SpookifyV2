import { auth } from './firebaseConfig';
import supabase from './supabaseClient';

export const deleteAccount = async (userId, firebaseUid) => {
  try {
    if (!userId || !firebaseUid) {
      throw new Error("User ID or Firebase UID is undefined.");
    }

    // Delete user from Supabase
    const { error: supabaseError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (supabaseError) {
      console.error("Error deleting user from Supabase:", supabaseError);
      throw supabaseError;
    }

    // Delete user from Firebase Authentication
    const user = auth.currentUser;
    if (user && user.uid === firebaseUid) {
      await user.delete();
    } else {
      throw new Error("User not authenticated or UID mismatch.");
    }

    console.log("User account deleted successfully.");
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};