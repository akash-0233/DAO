import React, {useState} from 'react'

export default function TransferShare({state, address, SetAlert}) {

    const handleTransferShare = async () => {
      try{
         const id = document.querySelector("#share").value;
      const receiver = document.querySelector("#receiver").value;
      const result = await state.contract.methods.TransferShare(receiver,id).send({from:address, gas:200000});
      SetAlert( "success","Share Transfered successfully");
      }catch(error){
        if (error.message.includes("reverted")) {
          SetAlert("danger","Transaction reverted. Possible reason: Already voted.");
        } else {
          SetAlert("danger","Transaction failed. Please try again later.");
        }
      }
      
      };
  return (
    <>
    <div className="section">
        <h2>3. Transfer Shares</h2>
        <input
          id='share'
          type="text"
          placeholder="Enter Share Count"
          // value={transferShareCount}
          // onChange={(e) => setTransferShareCount(e.target.value)}
        />
        <input
          id='receiver'
          type="text"
          placeholder="Enter Receiver's Address"
          // value={transferReceiverAddress}
          // onChange={(e) => setTransferReceiverAddress(e.target.value)}
        />
        <button className="action-button" onClick={handleTransferShare}>
          Transfer Shares
        </button>
      </div></>
  )
}
