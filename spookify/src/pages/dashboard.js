"use client";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '../auth/authContext';
import { signOut } from '../auth/signOut';
import ProtectedRoute from '../components/ProtectedRoute';
import { Mistral } from "@mistralai/mistralai";
import styles from './dashboard.module.css'; // Import the CSS module

const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY; 
const client = new Mistral({ apiKey: apiKey });

const Checkbox = ({ name, checked, onChange, label }) => (
  <div className={styles.category}>
    <label>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  </div>
);

const TextInput = ({ value, onChange }) => (
  <div className={styles.inputSection}>
    <label className={styles.inputLabel}>
      Enter your items:
      <input type="text" value={value} onChange={onChange} className={styles.textInput} />
    </label>
  </div>
);

const ResponseDisplay = ({ response }) => {
  const formatResponseAsList = (responseText) => {
    const steps = responseText.match(/\d+\.\s+[^\.]+\./g);
    return steps || [responseText];
  };

  return (
    response && (
      <div className={styles.responseSection}>
        {typeof response === "object" ? (
          <div>
            <h3>{response.title}</h3>
            <p>
              <strong>Items needed:</strong> {response.input}
            </p>
            <h4>Steps:</h4>
            <ol className={styles.response}>
              {formatResponseAsList(response.response).map((step, index) => (
                <ul key={index}>{step.trim()}</ul>
              ))}
            </ol>
          </div>
        ) : (
          <p>{response}</p>
        )}
      </div>
    )
  );
};

function CategorySelector({ category, handleCheckboxChange }) {
  return (
    <>
      <Checkbox
        name="DIY"
        checked={category.DIY}
        onChange={handleCheckboxChange}
        label="DIY"
      />
      <Checkbox
        name="FOOD"
        checked={category.FOOD}
        onChange={handleCheckboxChange}
        label="FOOD"
      />
      <Checkbox
        name="PARTY"
        checked={category.PARTY}
        onChange={handleCheckboxChange}
        label="PARTY"
      />
    </>
  );
}

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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // Redirect to landing page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Error signing out. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h2 className={styles.header}>😈 Spookify Your Activities 😈</h2>

        {error && <p className={styles.error}>{error}</p>} {/* Display error message */}

        <CategorySelector category={category} handleCheckboxChange={handleCheckboxChange} />

        <TextInput value={prompt} onChange={handlePromptChange} />

        <div className={styles.submitSection}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            Submit
          </button>
        </div>

        <ResponseDisplay response={response} />

        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;