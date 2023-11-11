import React, { useState, useEffect } from 'react';
import './GetProposalList.css'

const GetProposalList = ({ state, address }) => {
    const [proposals, setProposals] = useState([]);

    const proposalsArray = [];
    const convertTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        };

        return date.toLocaleString('en-US', options);
    };

    useEffect(() => {
        const fetchProposals = async () => {
            try {

                const proposal = await state.contract.methods.GetProposalList().call();
                proposal.map((Prop) => {

                    const formattedProposal = {
                        id: Prop.id.toString(), 
                        purpose: Prop.purpose,
                        amount: Prop.amount.toString(), 
                        recipient: Prop.recipient,
                        votes: Prop.votes.toString(), 
                        end: convertTimestamp(Prop.end.toString()), 
                        isExecuted: Prop.isExecuted,
                    };

                    proposalsArray.push(formattedProposal);
                })



                setProposals(proposalsArray);
            } catch (error) {
                console.error('Error fetching proposals:', error);
            }
        };

        state.contract && fetchProposals();
    }, [state.contract]);





    return (
        <div>
            <h2>Proposal List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Purpose</th>
                        <th>Amount</th>
                        <th>Recipient</th>
                        <th>Votes</th>
                        <th>End Time</th>
                        <th>Executed</th>
                    </tr>
                </thead>
                <tbody>
                    {proposals
                        .filter((proposal) => proposal.isExecuted !== true)
                        .map((proposal) => (
                            <tr key={proposal.id}>
                                <td>{proposal.id}</td>
                                <td className="ellipsis">{proposal.purpose}</td>
                                <td>{proposal.amount}</td>
                                <td className="ellipsis">{proposal.recipient}</td>
                                <td>{proposal.votes}</td>
                                <td>{proposal.end}</td>
                                <td>{proposal.isExecuted ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}

                </tbody>
            </table>
        </div>

    );
};

export default GetProposalList;
