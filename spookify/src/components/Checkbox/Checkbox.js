import React from 'react';
import styles from './Checkbox.module.css'; // Import the CSS module

const Checkbox = ({ name, checked, onChange, label }) => (
  <div className={styles.category}>
    <label>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  </div>
);

export default Checkbox; 