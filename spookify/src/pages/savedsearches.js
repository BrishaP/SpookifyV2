"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link component
import { useAuth } from '../auth/authContext';
import { signOut } from '../auth/signOut';
import supabase from '../auth/supabaseClient'; // Import Supabase client
import styles from './savedsearches.module.css'; // Import the CSS module

const SavedSearches = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [searches, setSearches] = useState([]);
  const [expandedSearchId, setExpandedSearchId] = useState(null);
  const [error, setError] = useState(""); // State to store error messages

  useEffect(() => {
    const fetchSearches = async () => {
      if (user) {
        // Retrieve user data from Supabase using Firebase UID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('firebase_uid', user.uid)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          setError(userError.message);
          return;
        }

        if (!userData) {
          console.error("No user data found.");
          setError("No user data found.");
          return;
        }

        const userId = userData.id;

        console.log("User ID:", userId); // Debugging log
        const { data, error } = await supabase
          .from('saved_searches')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error("Error fetching saved searches:", error);
          setError(error.message);
        } else {
          console.log("Fetched searches:", data); // Debugging log
          setSearches(data);
        }
      }
    };

    fetchSearches();
  }, [user]);

  const handleCardClick = (id) => {
    setExpandedSearchId(expandedSearchId === id ? null : id);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // Redirect to landing page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleSignOut} className={styles.signOutButton}>
        Sign Out
      </button>
      <h2 className={styles.header}>Your Saved Searches</h2>
      <Link href="/dashboard">
        <button className={styles.dashboardButton}>Return to Dashboard</button>
      </Link>
      <div className={styles.grid}>
        {error && <p className={styles.error}>{error}</p>}
        {searches.length === 0 && !error && <p>No saved searches found.</p>}
        {searches.map((search) => (
          <div
            key={search.id}
            className={`${styles.card} ${expandedSearchId === search.id ? styles.expanded : ''}`}
            onClick={() => handleCardClick(search.id)}
          >
            <h3 className={styles.title}>{search.title}</h3>
            {expandedSearchId === search.id && (
              <div className={styles.details}>
                <p><strong>Items needed:</strong> {search.items_needed}</p>
                <p><strong>Instructions:</strong> {search.response_instructions}</p>
                <p><strong>Saved on:</strong> {new Date(search.search_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches;