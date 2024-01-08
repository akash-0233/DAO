import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Manager from './components/manager/Manager.jsx';
import HomePage from './components/HomePage';
import Investor from './components/investor/Investor';
import GetProposalList from './components/GetProposalList.jsx'
import { useEffect, useState } from 'react';
import './Hover.css'
import Web3 from "web3";
import Alert from './alert.jsx';


function App() {
  const [isConnected, setIsConnected] = useState("Connect");
  const [address, setAddress] = useState("Not Connected");
  const [state, setState] = useState({
    web3: null,
    contract: null

  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const truncateAddress = (_address) => {
    if (_address === "Not Connected") {
      return "Not Connected";
    } else {
      return `${_address.substring(0, 6)}...${_address.slice(-5)}`;

    }
  };



  const connectMetamask = async () => {
    const web3 = new Web3(window.ethereum);
    const add = "0xd7230cbc0C335d2fD72aeA7c341bd50318d92f91";//"0x8008a5BD023282A067C7A892dB6A41febc9c08be";
    const abi = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "donor",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "DonationReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "purpose",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "end",
            "type": "uint256"
          }
        ],
        "name": "ProposalCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "proposalId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          }
        ],
        "name": "ProposalExecuted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "investor",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "RedeemShares",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "reason",
            "type": "string"
          }
        ],
        "name": "RequirementError",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "shares",
            "type": "uint256"
          }
        ],
        "name": "SharesTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "proposalId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          }
        ],
        "name": "VoteCasted",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "InvestorList",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "RemainingFund",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "SharesOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "TotalShares",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "isInvestor",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "isVoted",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "manager",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "proposals",
        "outputs": [
          {
            "internalType": "string",
            "name": "purpose",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "end",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isExecuted",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "quorum",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "voteTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "stateMutability": "payable",
        "type": "receive",
        "payable": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_purpose",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_Endin",
            "type": "uint256"
          }
        ],
        "name": "createProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "GetProposalList",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "purpose",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "end",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isExecuted",
                "type": "bool"
              }
            ],
            "internalType": "struct DAO.Proposal[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "executeProposal",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "Donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "Vote",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "TransferTo",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "ShareCount",
            "type": "uint256"
          }
        ],
        "name": "TransferShare",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_ShareCount",
            "type": "uint256"
          }
        ],
        "name": "RedeemShare",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getIList",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
    ];
    // const abi = 
    // [
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "string",
    //         "name": "_purpose",
    //         "type": "string"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "_amount",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "address",
    //         "name": "_recipient",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "_Endin",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "createProposal",
    //     "outputs": [],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [],
    //     "name": "Donate",
    //     "outputs": [],
    //     "stateMutability": "payable",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "_id",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "executeProposal",
    //     "outputs": [
    //       {
    //         "internalType": "bool",
    //         "name": "",
    //         "type": "bool"
    //       }
    //     ],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [],
    //     "stateMutability": "nonpayable",
    //     "type": "constructor"
    //   },
    //   {
    //     "anonymous": false,
    //     "inputs": [
    //       {
    //         "indexed": true,
    //         "internalType": "address",
    //         "name": "donor",
    //         "type": "address"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "uint256",
    //         "name": "amount",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "DonationReceived",
    //     "type": "event"
    //   },
    //   {
    //     "anonymous": false,
    //     "inputs": [
    //       {
    //         "indexed": true,
    //         "internalType": "uint256",
    //         "name": "id",
    //         "type": "uint256"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "string",
    //         "name": "purpose",
    //         "type": "string"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "uint256",
    //         "name": "amount",
    //         "type": "uint256"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "address",
    //         "name": "recipient",
    //         "type": "address"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "uint256",
    //         "name": "end",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "ProposalCreated",
    //     "type": "event"
    //   },
    //   {
    //     "anonymous": false,
    //     "inputs": [
    //       {
    //         "indexed": true,
    //         "internalType": "uint256",
    //         "name": "proposalId",
    //         "type": "uint256"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "uint256",
    //         "name": "amount",
    //         "type": "uint256"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "address",
    //         "name": "recipient",
    //         "type": "address"
    //       }
    //     ],
    //     "name": "ProposalExecuted",
    //     "type": "event"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "_ShareCount",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "RedeemShare",
    //     "outputs": [],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   },
    //   {
    //     "anonymous": false,
    //     "inputs": [
    //       {
    //         "indexed": true,
    //         "internalType": "address",
    //         "name": "investor",
    //         "type": "address"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "uint256",
    //         "name": "amount",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "RedeemShares",
    //     "type": "event"
    //   },
    //   {
    //     "anonymous": false,
    //     "inputs": [
    //       {
    //         "indexed": true,
    //         "internalType": "address",
    //         "name": "from",
    //         "type": "address"
    //       },
    //       {
    //         "indexed": true,
    //         "internalType": "address",
    //         "name": "to",
    //         "type": "address"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "uint256",
    //         "name": "shares",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "SharesTransferred",
    //     "type": "event"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "address",
    //         "name": "TransferTo",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "ShareCount",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "TransferShare",
    //     "outputs": [],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "_id",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "Vote",
    //     "outputs": [
    //       {
    //         "internalType": "bool",
    //         "name": "",
    //         "type": "bool"
    //       }
    //     ],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   },
    //   {
    //     "anonymous": false,
    //     "inputs": [
    //       {
    //         "indexed": true,
    //         "internalType": "uint256",
    //         "name": "proposalId",
    //         "type": "uint256"
    //       },
    //       {
    //         "indexed": true,
    //         "internalType": "address",
    //         "name": "voter",
    //         "type": "address"
    //       },
    //       {
    //         "indexed": false,
    //         "internalType": "uint256",
    //         "name": "votes",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "VoteCasted",
    //     "type": "event"
    //   },
    //   {
    //     "stateMutability": "payable",
    //     "type": "receive"
    //   },
    //   {
    //     "inputs": [],
    //     "name": "GetProposalList",
    //     "outputs": [
    //       {
    //         "components": [
    //           {
    //             "internalType": "string",
    //             "name": "purpose",
    //             "type": "string"
    //           },
    //           {
    //             "internalType": "uint256",
    //             "name": "amount",
    //             "type": "uint256"
    //           },
    //           {
    //             "internalType": "address",
    //             "name": "recipient",
    //             "type": "address"
    //           },
    //           {
    //             "internalType": "uint256",
    //             "name": "id",
    //             "type": "uint256"
    //           },
    //           {
    //             "internalType": "uint256",
    //             "name": "votes",
    //             "type": "uint256"
    //           },
    //           {
    //             "internalType": "uint256",
    //             "name": "end",
    //             "type": "uint256"
    //           },
    //           {
    //             "internalType": "bool",
    //             "name": "isExecuted",
    //             "type": "bool"
    //           }
    //         ],
    //         "internalType": "struct DAO.Proposal[]",
    //         "name": "",
    //         "type": "tuple[]"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "InvestorList",
    //     "outputs": [
    //       {
    //         "internalType": "address",
    //         "name": "",
    //         "type": "address"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "address",
    //         "name": "",
    //         "type": "address"
    //       }
    //     ],
    //     "name": "isInvestor",
    //     "outputs": [
    //       {
    //         "internalType": "bool",
    //         "name": "",
    //         "type": "bool"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "address",
    //         "name": "",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "isVoted",
    //     "outputs": [
    //       {
    //         "internalType": "bool",
    //         "name": "",
    //         "type": "bool"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [],
    //     "name": "manager",
    //     "outputs": [
    //       {
    //         "internalType": "address",
    //         "name": "",
    //         "type": "address"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "proposals",
    //     "outputs": [
    //       {
    //         "internalType": "string",
    //         "name": "purpose",
    //         "type": "string"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "amount",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "address",
    //         "name": "recipient",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "id",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "votes",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "end",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "bool",
    //         "name": "isExecuted",
    //         "type": "bool"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [],
    //     "name": "quorum",
    //     "outputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "",
    //         "type": "uint256"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [],
    //     "name": "RemainingFund",
    //     "outputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "",
    //         "type": "uint256"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [],
    //     "name": "TotalShares",
    //     "outputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "",
    //         "type": "uint256"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   },
    //   {
    //     "inputs": [],
    //     "name": "voteTime",
    //     "outputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "",
    //         "type": "uint256"
    //       }
    //     ],
    //     "stateMutability": "view",
    //     "type": "function"
    //   }
    // ];
    const contract = new web3.eth.Contract(
      abi, add
    );
    setState({ web3: web3, contract: contract });
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable().then(async function (accounts) {
        setAddress(accounts[0]);
        setIsConnected("Connected🟢");
        setTimeout(() => {
                  SetAlert("success", `Connected with  ${truncateAddress(accounts[0])}`);

        }, 500);

      });

    } else {
      SetAlert("failed", "MetaMask is not installed");

    }

  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        connectMetamask();
      } else {
        setAddress('');
        setIsConnected('Not Connected🔴');

      }
    };

    checkConnection();
  }, []);


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAddress("Not Connected");
          setIsConnected("Disconnected🔴"); // Reset the button text on account change (disconnect)
          SetAlert("danger", "MetaMask Disconnected");

          setTimeout(() => {
            setIsConnected("Connect");
          }, 2000);
        }
        else {
          setAddress(accounts[0]);

        }
      });
    }
  }, []);

  const [alert, setAlert] = useState({
    type: "",
    msg: ""
  });

  function SetAlert(type, msg) {
    setAlert({ type: type, msg: msg });
    setTimeout(() => {
      setAlert({ type: "", msg: "" });

    }, 4000);
  }

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
              <li className="nav-item">
                <Link className="nav-link" to="/proposal">Proposal</Link>
              </li>
            </ul>
            <div className="button-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

              <button className="btn btn-primary" onClick={connectMetamask}> {isConnected}</button>
              {isHovered && (
                <div className="text">{truncateAddress(address)}</div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Alert alert={alert} ></Alert>
      <Routes>
        <Route path="/" element={<HomePage />} index />
        <Route path="/manager" element={<><Manager state={state} address={address} SetAlert={SetAlert} /> </>} />
        <Route path="/investor" element={<Investor state={state} address={address} SetAlert={SetAlert} />} />
        <Route path="/proposal" element={<GetProposalList state={state} address={address} />} />

      </Routes>
    </Router>


  );
}

export default App;
