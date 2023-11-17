import React, {useState} from 'react'

export default function Vote({state, address,SetAlert}) {
    
  const handleVote =async () => {
    try {
      const id = document.querySelector("#VoteId").value;
      if(id === ""){
        console.log("Invalid Id");
        return "Invalid Id";
      }
      const result = await state.contract.methods.Vote(id).send({from:address, gas:200000});
      SetAlert("success",`You Have Successfully Voted On Proposal Id:- ${id}`);
      console.log(result);
    } catch (error) {
      
      // alert(error.message);
      if (error.message.includes("reverted")) {
        // Extract the reason or handle the error accordingly
        SetAlert("danger",`Transaction reverted. Possible reason: Already voted for proposal ID :- ${document.querySelector("#VoteId").value} `);
      } else {
        // Display a general error message
        SetAlert("danger","Transaction failed. Please try again later.");
      }
      
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
