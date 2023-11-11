import React, { useState } from 'react';
import './ExecuteProposal.css';

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleExecute = () => {
    // You can add your code to execute here when the button is clicked.
    console.log('Button clicked with input:', inputValue);
  };

  return (
    <div className="app-container " >
  <div className="input-container">
    <input
      type="text"
      className="input-field" // Updated class name
      placeholder="Enter Proposal ID"

    />
    <button className="execute-button" >
      Execute Proposal
    </button>
    <div className="status">{status}</div>
  </div>
</div>
  
  );
}

export default App;
