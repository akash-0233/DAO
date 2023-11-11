import React, { useState } from 'react';
import './Investor.css'; 
import Donate from './Donate';
import Vote from './Vote';
import TransferShare from './TransferShare';
import RedeemShare from './RedeemShare';

const App = ({state, address}) => {
  return (
    <div className="app">
      <Donate state={state} address={address} />
      <Vote state={state} address={address} />
      <TransferShare state={state} address={address}/>
      <RedeemShare state={state} address={address}/>
    </div>
  );
};

export default App;
