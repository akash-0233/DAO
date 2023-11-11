import React from 'react'
import CreateProposal from './CreateProposal'
import ExecuteProposal from './ExecuteProposal'

export default function Manager({state, address}) {
  return (
    <>
    <CreateProposal state={state} address={address}></CreateProposal>
    <ExecuteProposal state={state} address={address}></ExecuteProposal>
    </>
  );
}
