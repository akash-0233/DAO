import React, {useState} from 'react'

export default function Vote({state, address}) {
    
  const handleVote =async () => {
    try {
      const id = document.querySelector("#VoteId").value;
      if(id === ""){
        console.log("Invalid Id");
        return "Invalid Id";
      }
      const result = await state.contract.methods.Vote(id).send({from:address, gas:200000});
      alert(`You Have Successfully Voted On Proposal Id:- ${id}`);
      console.log(result);
    } catch (error) {
      console.log(error);
      
    }
  };
  return (
    <>
     <div className="section">
        <h2>2. Vote</h2>
        <input id='VoteId'
          type="text"
          placeholder="Enter Proposal ID"
        />
        <button className="action-button" onClick={handleVote}>
          Vote
        </button>
      </div></>
  )
}
