import React from 'react';
import styles from './TextInput.module.css'; // Import the CSS module

const TextInput = ({ value, onChange }) => (
  <div className={styles.inputSection}>
    <label className={styles.inputLabel}>
      Enter your items:
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={styles.textInput}
      />
    </label>
  </div>
);

export default TextInput;