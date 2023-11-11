import React from 'react'
import CreateProposal from './CreateProposal'
import ExecuteProposal from './ExecuteProposal'
import GetProposalList from '../GetProposalList'; // Adjust the path based on your file structure


export default function Manager({state, address}) {
  return (
    <>
    <CreateProposal state={state} address={address}></CreateProposal>
    <ExecuteProposal state={state} address={address}></ExecuteProposal>
    <GetProposalList state={state} address={address}></GetProposalList>

    
    </>
  );
}
