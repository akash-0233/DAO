import React from 'react'
import { useState } from 'react';

export default function Donate({state,address, SetAlert}) {
    const[donateAmount, setDonateAmount]=useState("");
    const handleDonate = async () => {
        try{
            console.log(donateAmount);
            const result = await state.contract.methods.Donate().send({from:address, gas:2000000, value:donateAmount});
            console.log(result);
            setDonateAmount("");
            SetAlert("success","successfully Donated Ether");
        }catch(error){
            console.log(error);
        }
    };

    return (
    <>
                <div className="section">
                    <h2>1. Donate</h2>
                    <input
                        type="text"
                        placeholder="Enter Amount (ETH)"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value)}
                    />
                    <button className="action-button" onClick={handleDonate}>
                        Donate
                    </button>
                </div>
            </>
            )
}
