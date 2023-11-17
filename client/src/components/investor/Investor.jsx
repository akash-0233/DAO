import React, { useState } from 'react';
import './Investor.css'; 
import Donate from './Donate';
import Vote from './Vote';
import TransferShare from './TransferShare';
import RedeemShare from './RedeemShare';


const App = ({state, address, SetAlert}) => {
  return (
    <div className="app">
      <Donate state={state} address={address} SetAlert={SetAlert} />
      <Vote state={state} address={address} SetAlert={SetAlert}/>
      <TransferShare state={state} address={address} SetAlert={SetAlert}/>
      <RedeemShare state={state} address={address} SetAlert={SetAlert}/>
    </div>
  );
};

export default App;
