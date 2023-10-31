import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import CreateProposal from './components/manager/CreateProposal';
import Vote from './components/investor/Vote';
import HomePage from './components/HomePage';
import { useEffect,useState } from 'react';
// import { useWeb3React } from '@web3-react/core';
import Web3 from "web3";


function App() {
  // const { activate } = useWeb3React();
  const[isConnected, setIsConnected]=useState("Connect");

  const connectMetamask = async () => {
    // const Web3 = require('web3');

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
    
      window.ethereum.enable().then(function (accounts) {
        // You can now use web3 to interact with Ethereum
        console.log('Connected with MetaMask', accounts[0]);
        setIsConnected("Connected");
      });
    } else {
      console.log('MetaMask is not installed');
    }
    
  };
  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Home</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/manager">Manager</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/investor">Investor</Link>
              </li>
            </ul>
            <button className="btn btn-primary" onClick={connectMetamask}> {isConnected}</button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} index /> {/* Display HomePage by default */}
        <Route path="/manager" element={<CreateProposal />} />
        <Route path="/investor" element={<Vote />} />
      </Routes>
    </Router>
  );
}

export default App;
