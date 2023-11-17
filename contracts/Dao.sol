// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract DAO {
    struct Proposal {
        string purpose; // Purpose or description of the proposal
        uint256 amount; // Amount of Ether associated with the proposal.
        address recipient; // Corrected "receipient" to "recipient"
        uint256 id; // Unique identifier for the proposal.
        uint256 votes; // Total votes reveived by the proposal.
        uint256 end; // Timestamp indicating when the proposal's voting ends.
        bool isExecuted; // Flag indicating whether the proposal has been executed.
    }
    uint256 public voteTime; // Time allocated for vating on proposals.
    uint256 public quorum; // Percentage of votes required for a proposal to pass
    address public manager; // Address of the contract manager (creator).
    uint256 id; // Unique identifier for proposals.
    uint256 public TotalShares; // Total shares held by all investors.
    uint256 public RemainingFund; // Remaaining Et
    address[] public InvestorList; // List of addresses of all investors.

    mapping(address => uint) SharesOf; // Mapping of shares held by each investor.
    mapping(address => bool) public isInvestor; // Mapping of Addresses to investor status.
    mapping(address => mapping(uint256 => bool)) public isVoted; // Mapping of addresses and proposals voted on.
    mapping(uint256 => Proposal) public proposals; // Mapping of proposal IDs to proposal details.

    event ProposalCreated(
        uint256 indexed id,
        string purpose,
        uint256 amount,
        address recipient,
        uint256 end
    ); // Emits information about a newly created proposal.
    event VoteCasted(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 votes
    ); // Emits when an investor casts their vote on a proposal.
    event ProposalExecuted(
        uint256 indexed proposalId,
        uint256 amount,
        address recipient
    ); // Emits the execution of a proposal, including details of the transaction.
    event SharesTransferred(
        address indexed from,
        address indexed to,
        uint256 shares
    ); // Emits the transfer of shares between investors.
    event RedeemShares(address indexed investor, uint256 amount); // Emits when an investor redeems shares and withdraws funds.
    event DonationReceived(address indexed donor, uint256 amount); // Emits when a donation is made to the contract.

    constructor() {
        quorum = 51;
        manager = msg.sender; // The contract creator is the initial manager.
    }

    modifier onlyManager() {
        // Modifier to restrict access to only the contract manager.
        require(msg.sender == manager, "Only manager can access");
        _;
    }

    modifier onlyInvestor() {
        // Modifier to restrict access to only investors.
        require(isInvestor[msg.sender], "Only investors can access");
        _;
    }

    // Function to create a proposal.
    function createProposal(
        string memory _purpose,
        uint256 _amount,
        address _recipient, // Corrected "receipient" to "recipient"
        uint256 _Endin
    ) public onlyManager {
        proposals[id] = Proposal(
            _purpose,
            _amount,
            _recipient,
            id,
            0,
            block.timestamp + _Endin,
            false
        );
        emit ProposalCreated(
            id,
            _purpose,
            _amount,
            _recipient,
            _Endin + block.timestamp
        );
        id++;
}

    // Function to retrieve a list of all proposals.
    function GetProposalList() public view returns (Proposal[] memory) {
        Proposal[] memory arr = new Proposal[](id);
        for (uint x; x < id; x++) {
            arr[x] = proposals[x];
        }
        return arr;
    }

    // Function to execute a proposal.
    function executeProposal(uint256 _id) public onlyManager returns (bool) {
        require(
            proposals[_id].isExecuted == false,
            "Proposal Already Executed"
        );
        require(
            ((proposals[_id].votes * 100) / TotalShares) >= quorum,
            "Majority does not support"
        );
        proposals[_id].isExecuted = true;
        RemainingFund -= proposals[_id].amount;
        require(proposals[_id].amount <= RemainingFund, "Insufficient Balance");
        payable(proposals[_id].recipient).transfer(proposals[_id].amount);
        emit ProposalExecuted(
            _id,
            proposals[_id].amount,
            proposals[_id].recipient
        );
        return true;
    }

    // Function to receive Ether donations.
    receive() external payable {
        require(msg.value >= 500, "Send at least 500 Wei");
        TotalShares += msg.value;
        isInvestor[msg.sender] = true;
        SharesOf[msg.sender] += msg.value;
        InvestorList.push(msg.sender);
        RemainingFund += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Function for users to donate to the contract.
    function Donate() public payable {
        require(msg.value >= 500, "Send At least 500 Wei");
        TotalShares += msg.value;
        isInvestor[msg.sender] = true;
        SharesOf[msg.sender] += msg.value;
        InvestorList.push(msg.sender);
        RemainingFund += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Function for investors to vote on a proposal.
    function Vote(uint _id) public onlyInvestor returns (bool) {
        require(proposals[_id].end >= block.timestamp, "Voting Time Ended");
        require(isVoted[msg.sender][_id] == false, "Already Voted");
        isVoted[msg.sender][_id] = true;
        proposals[_id].votes = SharesOf[msg.sender];
        emit VoteCasted(_id, msg.sender, SharesOf[msg.sender]);
        return true;
    }

    // Function to transfer shares from one investor to another.
    function TransferShare(
        address TransferTo,
        uint ShareCount
    ) public onlyInvestor {
        require(SharesOf[msg.sender] >= ShareCount, "Insufficient Shares");
        require(
            TransferTo != msg.sender && TransferTo != address(0),
            "Invalid Address"
        );
        SharesOf[msg.sender] -= ShareCount;
        SharesOf[TransferTo] += ShareCount; // Corrected to add shares to the recipient
        isInvestor[TransferTo] = true;
        InvestorList.push(TransferTo);
        if (SharesOf[msg.sender] == 0) {
            isInvestor[msg.sender] = false;
            for (uint a; a < InvestorList.length; a++) {
                if (InvestorList[a] == msg.sender) {
                    InvestorList[a] = InvestorList[InvestorList.length - 1];
                    return;
                } else if (a == InvestorList.length - 1) {
                    InvestorList.pop();
                }
            }
        }
        emit SharesTransferred(msg.sender, TransferTo, ShareCount);
    }

    // Function to redeem shares and withdraw funds.
    function RedeemShare(uint _ShareCount) public onlyInvestor {
        require(SharesOf[msg.sender] >= _ShareCount, "Insufficient Shares");
        SharesOf[msg.sender] -= _ShareCount;
        if (SharesOf[msg.sender] == 0) {
            isInvestor[msg.sender] = false;
            for (uint a; a < InvestorList.length; a++) {
                if (InvestorList[a] == msg.sender) {
                    InvestorList[a] = InvestorList[InvestorList.length - 1];
                    return;
                } else if (a == InvestorList.length - 1) {
                    InvestorList.pop();
                }
            }
        }
        RemainingFund -= _ShareCount;
        payable(msg.sender).transfer(_ShareCount);
        emit RedeemShares(msg.sender, _ShareCount);
    }
}
