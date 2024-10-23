import React from 'react';
import styles from './ResponseDisplay.module.css'; // Import the CSS module

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

export default ResponseDisplay;