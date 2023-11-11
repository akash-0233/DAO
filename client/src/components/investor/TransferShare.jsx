import React, {useState} from 'react'

export default function TransferShare({state, address}) {

    const handleTransferShare = async () => {
      try{
         const id = document.querySelector("#share").value;
      const receiver = document.querySelector("#receiver").value;
      const result = await state.contract.methods.TransferShare(receiver,id).send({from:address, gas:200000});
      alert("Transfer Succaseed");
      }catch(error){
        console.log(error);
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
