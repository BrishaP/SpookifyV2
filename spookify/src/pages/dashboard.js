"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../auth/authContext";
import { signOut } from "../auth/signOut";
import ProtectedRoute from "../components/ProtectedRoute";
import { Mistral } from "@mistralai/mistralai";
import supabase from "../auth/supabaseClient"; // Import Supabase client
import styles from "./dashboard.module.css"; // Import the CSS module
import CategorySelector from "../components/CategorySelector/CategorySelector"; // Import CategorySelector component
import TextInput from "../components/TextInput/TextInput"; // Import TextInput component
import ResponseDisplay from "../components/ResponseDisplay/ResponseDisplay"; // Import ResponseDisplay component

const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [response, setResponse] = useState(null);
  const [category, setCategory] = useState({
    DIY: false,
    FOOD: false,
    PARTY: false,
  });
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(""); // State to store error messages

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("firebase_uid", user.uid)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            setError(userError.message);
          } else if (!userData) {
            console.error("No user data found.");
            setError("No user data found.");
          } else {
            console.log("User data:", userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data. Please try again later.");
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleCheckboxChange = (e) => {
    const { name } = e.target;

    setCategory({
      DIY: name === "DIY",
      FOOD: name === "FOOD",
      PARTY: name === "PARTY",
    });
  };

  const handlePromptChange = (e) => setPrompt(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = Object.keys(category).find((key) => category[key]);
    if (!selectedCategory || !prompt) {
      alert(
        !selectedCategory
          ? "Please select a category."
          : "Please enter a prompt."
      );
      return;
    }

    const data = { category: selectedCategory, prompt: prompt };
    const promptForAi = `Based on the selected category (${selectedCategory}) and the items I have at home (${prompt}), please generate a Halloween-themed ${
      selectedCategory === "FOOD"
        ? "recipe"
        : selectedCategory === "DIY"
        ? "DIY project"
        : "party idea"
    }. Provide simple steps, mentioning any extra items I might need to buy.`;

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-tiny",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant specialized in providing creative Halloween ideas based on a given category and available items. Return the data in the JSON format with {title: input: response:}.",
          },
          { role: "user", content: promptForAi },
        ],
        temperature: 0.7,
      });

      const aiData = JSON.parse(chatResponse.choices[0].message.content);
      setResponse(aiData);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setError("Sorry, something went wrong. Please try again later.");
    }
  };

  const saveSearch = async (
    userId,
    title,
    itemsNeeded,
    responseInstructions
  ) => {
    try {
      const { data, error } = await supabase
        .from("saved_searches")
        .insert([
          {
            user_id: userId,
            title,
            items_needed: itemsNeeded,
            response_instructions: responseInstructions,
          },
        ]);

      if (error) throw error;

      console.log("Search saved successfully:", data);
    } catch (error) {
      console.error("Error saving search:", error);
      setError("Error saving search. Please try again.");
    }
  };

  const handleSaveSearch = async () => {
    if (response) {
      await saveSearch(
        user.uid,
        response.title,
        response.input,
        response.response
      );
    } else {
      setError("No response to save. Please generate a response first.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/"); // Redirect to landing page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Error signing out. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h2 className={styles.header}>😈 Spookify Your Activities 😈</h2>
        {error && <p className={styles.error}>{error}</p>}{" "}
        {/* Display error message */}
        <CategorySelector
          category={category}
          handleCheckboxChange={handleCheckboxChange}
        />
        <TextInput value={prompt} onChange={handlePromptChange} />
        <div className={styles.submitSection}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            Submit
          </button>
        </div>
        <ResponseDisplay response={response} />
        {response && (
          <div className={styles.saveSection}>
            <button onClick={handleSaveSearch} className={styles.saveButton}>
              Save Search
            </button>
          </div>
        )}
        <Link href="/savedsearches">
          <button className={styles.savedSearchesButton}>
            View Saved Searches
          </button>
        </Link>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;