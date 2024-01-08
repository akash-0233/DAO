import React, { useState } from 'react';
import styles from './CreateProposal.module.css'; 

function ProposalForm({ state, address,SetAlert }) {
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [endIn, setEndIn] = useState('');

  const handleSubmit = async (event) => {

    event.preventDefault();
    try {

      const Min = endIn * 60;
      const sec = Min * 60;

      const result2 = await state.contract.methods.createProposal(purpose, amount, recipient, sec).send({ from: address, gas: 200000 });
      SetAlert("success","Proposal Successfuly Created");

    } catch (error) {
      alert("Possible error :- ", error);
    }
    setAmount('');
    setRecipient('');
    setEndIn('');
  } 
  // async function GetContract(){
  //   const get = document.queryselectory("#deta").value;
  // }

  document.body.style.backgroundColor = 'white';


  return (
    <>          
    <div  className={styles['proposal-form-container-custom']}>
      <form onSubmit={handleSubmit} className={styles['proposal-form-custom']}>
        <h2>Create a Proposal</h2>
        <div className={styles['form-group-custom']}>
          <label className={styles['custom-label']} htmlFor="custom-purpose">Purpose:</label>
          <input
            type="text"
            id="custom-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={styles['custom-input']}
          />
        </div>
        <div className={styles['form-group-custom']}>
          <label className={styles['custom-label']} htmlFor="custom-amount">Amount (ETH):</label>
          <input
            type="number"
            id="custom-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles['custom-input']}
          />
        </div>
        <div className={styles['form-group-custom']}>
          <label className={styles['custom-label']} htmlFor="custom-recipient">Recipient:</label>
          <input
            type="text"
            id="custom-recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={styles['custom-input']}
          />
        </div>
        <div className={styles['form-group-custom']}>
          <label className={styles['custom-label']} htmlFor="custom-endIn">End in hours:</label>
          <input
            type="number"
            id="custom-endIn"
            value={endIn}
            onChange={(e) => setEndIn(e.target.value)}
            className={styles['custom-input']}
          />
        </div>
        <button type="submit" className={styles['custom-button']}>Create Proposal</button>
       
      </form>

    </div>       


  </>
  );
}

export default ProposalForm;
