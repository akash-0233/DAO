import React from 'react'
import CreateProposal from './CreateProposal'
import ExecuteProposal from './ExecuteProposal'


export default function Manager({state, address, SetAlert}) {
  return (
    <>
    <CreateProposal state={state} address={address} SetAlert={SetAlert}></CreateProposal>
    <ExecuteProposal state={state} address={address} SetAlert={SetAlert}></ExecuteProposal>

    
    </>
  );
}
