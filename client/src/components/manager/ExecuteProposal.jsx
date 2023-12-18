import React from 'react';
import './ExecuteProposal.css';

function App({state,address,SetAlert}) {

  const handleExecute =async () => {
    const id  = document.querySelector("#Pid").value;

    try {
       await state.contract.methods.executeProposal(id).send({from:address, gas:400000});
    SetAlert("success",`successfully Executed proposal :- ${id}`);
    } catch (error) {
      console.log(error);
    }

   
  };

  return (
    <div className="app-container " >
  <div className="input-container">
    <input
      id='Pid'
      type="text"
      className="input-field" // Updated class name
      placeholder="Enter Proposal ID"


    />
    <button className="execute-button" onClick={handleExecute} >
      Execute Proposal
    </button>
    {/* <div className="status">{status}</div> */}
  </div>
</div>
  
  );
}

export default App;
