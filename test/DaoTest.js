
const HelloTesting = artifacts.require("DAO");
//Install test libraries
//npm i @openzeppelin/test-helpers

// Import that libraries
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

contract("DAO", (accounts) => {
    let helloTesting = null;
    beforeEach(async () => {
        // It will also create new instance every time.
        // console.log(accounts);
        // helloTesting = await HelloTesting.deployed();
        // Another syntax to deploy contract and get its instance
        helloTesting = await HelloTesting.new();
        // console.log(helloTesting.address);

    })
    it("should revert if voting is attempted after the voting period has ended", async () => {
        const _id = 1; // Replace with a valid proposal ID for testing
        const voter = accounts[1]; // Replace with the address of an investor account
        await helloTesting.Donate({ from: voter, value: web3.utils.toWei('1000', 'wei') });

        await expectRevert(
            helloTesting.Vote(_id, { from: voter }),
            "Voting Time Ended"
        );
    });

    it("should revert if msg.sender is not manager", async () => {
        helloTesting.createProposal("buyCar", 5000, accounts[1], 500000, { from: accounts[1] });
        const events = await helloTesting.getPastEvents('RequirementError', {
            fromBlock: 0,
            toBlock: 'latest',
        });
        expectEvent(events[0], 'RequirementError', {
            message: "Only Manager can access this function",
        });

       
    });
    })