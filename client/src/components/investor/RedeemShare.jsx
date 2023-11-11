import React from 'react'
import { useState } from 'react';

export default function RedeemShare({state, address}) {

    const handleRedeemShare =  async() => {
        try{
             const share = document.querySelector("#Nshare").value;
        if(share === ""){
            console.log("Invalid Share Count");
            return ;
        }
        const result = await state.contract.methods.RedeemShare(share).send({from:address, gas:48000});
        alert("Redeemed");
    }catch(error){
        console.log("Error is:  " + error);
    }
       
        
    ;};
    return (
        <><div className="section">
            <h2>4. Redeem Shares</h2>
            <input
                id='Nshare'
                type="text"
                placeholder="Enter Share Count"
            />
            <button className="action-button" onClick={handleRedeemShare}>
                Redeem Shares
            </button>
        </div></>
    )
}
