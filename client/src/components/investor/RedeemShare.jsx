import React from 'react'
import { useState } from 'react';

export default function RedeemShare() {

    const [donateAmount, setDonateAmount] = useState('');
    const [redeemShareCount, setRedeemShareCount] = useState('');
    const handleRedeemShare = () => {
        console.log(`Redeeming ${redeemShareCount} shares`);
        // Include your transaction logic here
    };
    return (
        <><div className="section">
            <h2>4. Redeem Shares</h2>
            <input
                type="text"
                placeholder="Enter Share Count"
                value={redeemShareCount}
                onChange={(e) => setRedeemShareCount(e.target.value)}
            />
            <button className="action-button" onClick={handleRedeemShare}>
                Redeem Shares
            </button>
        </div></>
    )
}
