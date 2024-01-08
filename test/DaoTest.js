
const HelloTesting = artifacts.require("DAO");
// Install test libraries
// npm i @openzeppelin/test-helpers

// Import that libraries
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");

contract("DAO", (accounts) => {
  let helloTesting = null;
  beforeEach(async () => {
    helloTesting = await HelloTesting.new();
  });

  //Manager Operations :-

  it("should revert if msg.sender is not manager", async () => {
    await expectRevert(
      helloTesting.createProposal("buyCar", 5000, accounts[1], 500000, { from: accounts[1] }),
      "Only Manager can access this function"

    );
  });

  it(" Should msg.sender become the manager", async () => {
    const manager = await helloTesting.manager();
    assert(manager === accounts[0]);
  });

  //Proposal Creation :-
  it("Should create a proposal ", async () => {
    const initialTimestamp = (await web3.eth.getBlock('latest')).timestamp;
    await helloTesting.createProposal("Buy_1", 1111, accounts[1], 111111, { from: accounts[0] });
    await helloTesting.createProposal("Buy_2", 2222, accounts[2], 222222, { from: accounts[0] });
    let Proposal = await helloTesting.GetProposalList();
    assert(Proposal[0].purpose === "Buy_1", "Purpose not match");
    assert(parseInt(Proposal[0].amount) === 1111, "Amount not match");
    assert(Proposal[0].recipient === accounts[1], "recipient not match");
    assert(parseInt(Proposal[0].id) === 0, "id not match");
    assert(parseInt(Proposal[0].end) === 111111 + initialTimestamp, "End not match");
    assert(parseInt(Proposal[1].id) === 1);
  });

  it("Should not create a proposal if msg.sender is not the manager", async () => {
    await expectRevert(
      helloTesting.createProposal("buy_1", 1111, accounts[1], 11111, { from: accounts[1] }), "Only Manager can access this function"
    );
  });

  it("Should create multiple unique proposals with incrementing IDs", async () => {
    await helloTesting.createProposal("Test_1", 1111, accounts[1], 11111);
    await helloTesting.createProposal("Test_2", 2222, accounts[1], 22222);
    await helloTesting.createProposal("Test_3", 3333, accounts[1], 33333);
    await helloTesting.createProposal("Test_4", 4444, accounts[1], 44444);
    const proposal = await helloTesting.GetProposalList();
    for (let x = 0; x < 4; x++) {
      assert
        .equal(proposal[x].id, x, "Id not matched");
    }
  });

  it("Should test proposal creation with various durations", async () => {
    const manager = accounts[0];
    const recipient = accounts[1];
    const durations = [3600, 7200, 10800];
    for (let i = 0; i < durations.length; i++) {
      const duration = durations[i];
      await helloTesting.createProposal(
        `Proposal ${i}`,
        1000,
        recipient,
        duration,
        { from: manager }
      );

      // Fetch the latest proposal
      const proposals = await helloTesting.GetProposalList();
      const latestProposal = proposals[proposals.length - 1];

      // Check if the duration of the latest proposal matches the expected duration
      const expectedEndTime = parseInt(latestProposal.end);
      const currentTime = Math.floor(Date.now() / 1000);
      const actualDuration = expectedEndTime - currentTime;
      assert.equal(
        actualDuration,
        duration,
        `Proposal ${i} duration mismatch`
      );
    }
  });

 // Voting: -

    it("Should revert if voting is reattempted", async () => {
      const _id = 0;
      const voter = accounts[1];
      await helloTesting.Donate({ from: voter, value: web3.utils.toWei('1000', 'wei') });
      await helloTesting.createProposal("Buy_1", 1111, accounts[1], 2, { from: accounts[0] });
      await helloTesting.Vote(_id, { from: voter });
      await expectRevert(
        helloTesting.Vote(_id, { from: voter }), "Already Voted"
      );
    });

  it("Should vote properly", async () => {
    await expectRevert(
      helloTesting.Vote(1, { from: accounts[1] }),
      "Only investors can access"
    );
    await helloTesting.Donate({ from: accounts[1], value: 1000 });
    await helloTesting.Donate({ from: accounts[2], value: 1000 });
    await helloTesting.Donate({ from: accounts[3], value: 1000 });
    await helloTesting.createProposal("Buy_1", 1111, accounts[1], 111111, { from: accounts[0] });
    let proposal = await helloTesting.GetProposalList();
    await helloTesting.Vote(0, { from: accounts[1] });
    proposal = await helloTesting.GetProposalList();
    assert(parseInt(proposal[0].votes) === 1000, "First vote casted");
    await helloTesting.Vote(0, { from: accounts[2] });
    proposal = await helloTesting.GetProposalList();
    assert(parseInt(proposal[0].votes) === 2000, "second vote casted");
    await helloTesting.Vote(0, { from: accounts[3] });
    proposal = await helloTesting.GetProposalList();
    assert(parseInt(proposal[0].votes) === 3000, "third vote casted");
    const isVoted = await helloTesting.isVoted(accounts[1], 0);
    assert(isVoted === true, "Is Voted not updated");
  });

  it("Should test simultaneous voting by multiple investors", async () => {
    await helloTesting.createProposal("Test_1", 1000, accounts[1], 3600, { from: accounts[0] });
    await helloTesting.Donate({ from: accounts[1], value: 1000 });
    await helloTesting.Donate({ from: accounts[2], value: 1000 });
    await helloTesting.Donate({ from: accounts[3], value: 1000 });
    await helloTesting.Donate({ from: accounts[4], value: 1000 });
    let amount = 1000;
    for (let x = 1; x < 5; x++) {
      let proposal = await helloTesting.GetProposalList();

      await helloTesting.Vote(0, { from: accounts[x] });
      proposal = await helloTesting.GetProposalList();
      assert.equal(parseInt(proposal[0].votes), amount * x, `Account ${x} vote not counted`);
    }
  });

  it("Should test voting after the proposal end time", async () => {
    const _id = 0;
    const voter = accounts[1];
    await helloTesting.Donate({ from: voter, value: web3.utils.toWei('1000', 'wei') });
    await helloTesting.createProposal("Buy_1", 1111, accounts[1], 2, { from: accounts[0] });
    await new Promise(resolve => setTimeout(resolve, 3 * 1000));

    await expectRevert(
      helloTesting.Vote(_id, { from: voter }),
      "Voting Time Ended"
    );
  });

  // Proposal Execution :-
  it("Should not execute a proposal if msg.sender is not the manager", async () => {
    await expectRevert(
      helloTesting.executeProposal(1, { from: accounts[1] }), "Only Manager can access this function"
    );
  });

  it(" Should not execute a proposal if the proposal has already been executed ", async () => {
    await helloTesting.createProposal("buy_1", 1111, accounts[1], 11111, { from: accounts[0] });
    await helloTesting.Donate({ from: accounts[1], value: 9000000000000 });
    await helloTesting.Vote(0, { from: accounts[1] });
    await helloTesting.executeProposal(0, { from: accounts[0] });
    await expectRevert(
      helloTesting.executeProposal(0, { from: accounts[0] }), "Proposal Already Executed"
    );
  });

  it("Should not execute a proposal if the majority does not support it ", async () => {
    await helloTesting.createProposal("buy_1", 1111, accounts[1], 11111, { from: accounts[0] });
    await helloTesting.Donate({ from: accounts[1], value: 1000 });
    await helloTesting.Donate({ from: accounts[2], value: 10000 });
    await helloTesting.Vote(0, { from: accounts[1] });
    await expectRevert(
      helloTesting.executeProposal(0, { from: accounts[0] }), " Majority does not support"
    );
  });

  it(" Should execute a proposal ", async () => {
    const amount1 = 9000000000000;
    const amount2 = 9000000000000;
    await helloTesting.createProposal("Buy_1", amount1 + amount2, accounts[3], 111111, { from: accounts[0] });
    await helloTesting.Donate({ from: accounts[1], value: amount1 });
    await helloTesting.Donate({ from: accounts[2], value: amount2 });
    await helloTesting.Vote(0, { from: accounts[1] });
    await helloTesting.Vote(0, { from: accounts[2] });
    const proposal = await helloTesting.GetProposalList();
    const InitialBalance = parseInt(await web3.eth.getBalance(accounts[3]));
    await helloTesting.executeProposal(0);
    const FinalBalance = parseInt(await web3.eth.getBalance(accounts[3]));
    assert(FinalBalance > InitialBalance, "Balance not update");
  });

  it("should test contract balance after proposal execution, donations, and share transfers", async () => {
    let RemainingFund;
    let contractBalance;
    await helloTesting.createProposal("Test1", 1000, accounts[1], 9999, { from: accounts[0] });

    await helloTesting.Donate({ from: accounts[1], value: 500 });
    assert.equal(parseInt(await web3.eth.getBalance(helloTesting.address)), 500, "Balance updated on first donation"
    );
    await helloTesting.Donate({ from: accounts[2], value: 500 });

    // On Donation
    assert.equal(parseInt(await web3.eth.getBalance(helloTesting.address)), 1000, "Balance updated on second donation"
    );
    RemainingFund = parseInt(await helloTesting.RemainingFund());
    contractBalance = parseInt(await web3.eth.getBalance(helloTesting.address));
    assert.equal(contractBalance, RemainingFund, `1 Remaing Fund :-${RemainingFund} and contract balance ${contractBalance} not matched after donation`);

    await helloTesting.Vote(0, { from: accounts[1] });
    await helloTesting.Vote(0, { from: accounts[2] });
    await helloTesting.executeProposal(0, { from: accounts[0] });

    // On Proposal Execution
    assert.equal(parseInt(await web3.eth.getBalance(helloTesting.address)), 0, "Balance updated after Proposal executaion"
    );
    assert.equal(contractBalance, RemainingFund, `Remaing Fund :-${RemainingFund} and contract balance ${contractBalance} not matched after proposal execution`);

    // Donation :-
    it("Should not receive Ether if the amount is less than 500 wei", async () => {
      await expectRevert(
        helloTesting.Donate({ from: accounts[1], value: 499 }), "Send At least 500 Wei"
      );
    });

    it("Should update data after receiving Ether", async () => {
      const amount = 1000;
      const B_RemainingFund = parseInt(await helloTesting.RemainingFund());
      const B_SharesOf = parseInt(await helloTesting.SharesOf(accounts[1]));
      const B_isInvestor = await helloTesting.isInvestor(accounts[1]);
      const B_TotalShares = parseInt(await helloTesting.TotalShares());
      await helloTesting.Donate({ from: accounts[1], value: amount });
      const A_RemainingFund = parseInt(await helloTesting.RemainingFund())
      const A_SharesOf = parseInt(await helloTesting.SharesOf(accounts[1]));
      const A_isInvestor = await helloTesting.isInvestor(accounts[1]);
      const A_TotalShares = parseInt(await helloTesting.TotalShares());
      assert(B_RemainingFund + amount === A_RemainingFund, "Remaining fund does not updating");
      assert(B_SharesOf + amount === A_SharesOf, "SharesOf does not updating");
      assert(B_isInvestor === false, "Initial status of isInvestor was wrong");
      assert(A_isInvestor === true, "isInvestor does not updating");
      assert(B_TotalShares + amount === A_TotalShares, "TotalShares was not updating");
    });

    // On Share Redeem
    await helloTesting.RedeemShare(500, { from: accounts[1] });
    await helloTesting.RedeemShare(500, { from: accounts[2] });
    let ShareOf = await helloTesting.SharesOf(accounts[1]);
    RemainingFund = parseInt(await helloTesting.RemainingFund());
    contractBalance = parseInt(await web3.eth.getBalance(helloTesting.address));
    assert.equal(parseInt(await helloTesting.SharesOf(accounts[1])), 0, "Account 1 share not updated");
    assert.equal(parseInt(await helloTesting.SharesOf(accounts[2])), 0, "Account 1 share not updated");
    assert.equal(contractBalance, RemainingFund, `Remaing Fund :-${RemainingFund} and contract balance ${contractBalance} not matched After share redeem`);


  });

  // Share Transfer :-


  it(" Should not execute the TransferShare function if msg.sender is not an investor", async () => {
    await expectRevert(
      helloTesting.TransferShare(accounts[1], 1000, { from: accounts[1] }), "Only investors can access"
    );
  });

  it(" Should revert if the user transfers more shares than available", async () => {
    await helloTesting.Donate({ from: accounts[1], value: 1000 });
    await expectRevert(
      helloTesting.TransferShare(accounts[2], 1100, { from: accounts[1] }), "Insufficient Shares"
    );
  });

  it("Should revert if the user transfers shares to their own account", async () => {
    await helloTesting.Donate({ from: accounts[1], value: 1000 });
    await expectRevert(
      helloTesting.TransferShare(accounts[1], 1000, { from: accounts[1] }), "Invalid Address"
    );
  });

  it(" Should transfer shares", async () => {
    const amount = 1000;
    const transferAmount = 500;
    const user = accounts[1];
    const receiver = accounts[2];
    await helloTesting.Donate({ from: accounts[1], value: amount });
    const isInvestor = await helloTesting.isInvestor(user);
    const B_SharesOfUser = parseInt(await helloTesting.SharesOf(user));
    const B_SharesOfReceiver = parseInt(await helloTesting.SharesOf(receiver));
    await helloTesting.TransferShare(receiver, transferAmount, { from: user });
    const A_SharesOfUser = parseInt(await helloTesting.SharesOf(user));
    const A_SharesOfReceiver = parseInt(await helloTesting.SharesOf(receiver));
    const InvestorList = await helloTesting.getIList();
    assert((B_SharesOfUser - transferAmount) === A_SharesOfUser, "Shares of user not updating");
    assert((B_SharesOfReceiver + transferAmount) === A_SharesOfReceiver, "Shares of reveiver not updating");
    assert(InvestorList[InvestorList.length - 1] === receiver, "Receier address not becomeing investor");
  });

  it("Should remove the user's address from the investor list if they transfer all shares", async () => {
    const amount = 1000;
    const user = accounts[1];
    const receiver = accounts[2];
    await helloTesting.Donate({ from: accounts[1], value: amount });
    await helloTesting.TransferShare(receiver, amount, { from: user });
    const isInvestor = await helloTesting.isInvestor(user);
    const investorList = await helloTesting.getIList();
    for (let x = 0; x < investorList.length; x++) {
      assert(investorList[x] !== user, "Addrest dosent remove from InvestoList");
    }
  });

  // Share redemption :-
  it("Should revert from RedeemShare() if msg.sender is not an investor", async () => {
    await expectRevert(
      helloTesting.RedeemShare(500), "Only investors can access"
    );
  });
 
  it(" Should revert if the user tries to redeem more shares than they have ", async () => {
    const amount = 1000;
    await helloTesting.Donate({ from: accounts[1], value: amount });
    await expectRevert(
      helloTesting.RedeemShare(amount + 1, { from: accounts[1] }), "Insufficient Shares"
    );
  });

  it("Should redeem shares", async () => {
    const amount = 90000000000;
    const user = accounts[1];
    await helloTesting.Donate({ from: user, value: amount });
    const BeforeShareCount = parseInt(await helloTesting.SharesOf(user));
    const BeforeBalance = parseInt(await web3.eth.getBalance(user));
    await helloTesting.RedeemShare(amount, { from: user });
    const AfterShareCount = parseInt(await helloTesting.SharesOf(user));
    const AfterBalance = parseInt(await web3.eth.getBalance(user));
    assert.equal(BeforeShareCount - amount, AfterShareCount, "Share count does not change");
    assert(BeforeBalance > AfterBalance, "User balance does not update");
  });

  it(" Should remove the user's address from the investor list if they redeem all shares", async () => {
    const amount = 100000000;
    const user = accounts[1];
    await helloTesting.Donate({ from: user, value: amount });
    await helloTesting.RedeemShare(amount, { from: user });
    const isInvestor = await helloTesting.isInvestor(user);
    const InvestorList = await helloTesting.getIList();
    for (let x = 0; x < InvestorList.length; x++) {
      assert(InvestorList[x] !== user, "User address dosent remove from investor list");
    }
    assert.equal(isInvestor, false, "isInvestor is still true");
  });

  it("Should redeem the maximum number of shares a user can have", async () => {
    const user = accounts[0];
    await helloTesting.Donate({ from: user, value: 10000000 });
    const maxShares = await helloTesting.SharesOf(user);
    await helloTesting.RedeemShare(maxShares, { from: user });
    const finalShares = await helloTesting.SharesOf(user);
    assert.equal(finalShares, 0, "Shares were not fully redeemed");
  });

  it("Should handle multiple attempts to redeem shares", async () => {
    const user = accounts[1];
    let TotalShares;
    let SharesOf;
    let RemainingFund;
    let Balance;
    await helloTesting.Donate({ from: user, value: 10000 });
    TotalShares = parseInt(await helloTesting.TotalShares());
    SharesOf = parseInt(await helloTesting.SharesOf(user));
    RemainingFund = parseInt(await helloTesting.RemainingFund());
    Balance = parseInt(await web3.eth.getBalance(helloTesting.address));
    assert(TotalShares === 10000 && SharesOf === 10000, "Share not update on Donate");
    assert(Balance === 10000 && RemainingFund === 10000, "Smart Contract balance not update on Donate");


    await helloTesting.RedeemShare(1000, { from: user });
    TotalShares = parseInt(await helloTesting.TotalShares());
    SharesOf = parseInt(await helloTesting.SharesOf(user));
    Balance = parseInt(await web3.eth.getBalance(helloTesting.address));
    RemainingFund = parseInt(await helloTesting.RemainingFund());
    assert(TotalShares === 9000 && SharesOf === 9000, "Share not update on first redeem");
    assert(Balance === 9000 && RemainingFund === 9000, "Smart Contract balance not update on first redeem");

    await helloTesting.RedeemShare(1000, { from: user });
    TotalShares = parseInt(await helloTesting.TotalShares());
    SharesOf = parseInt(await helloTesting.SharesOf(user));
    Balance = parseInt(await web3.eth.getBalance(helloTesting.address));
    RemainingFund = parseInt(await helloTesting.RemainingFund());
    assert(TotalShares === 8000 && SharesOf === 8000, "Share not update on second redeem");
    assert(Balance === 8000 && RemainingFund === 8000, "Smart Contract balance not update on second redeem");

    await helloTesting.RedeemShare(1000, { from: user });
    TotalShares = parseInt(await helloTesting.TotalShares());
    SharesOf = parseInt(await helloTesting.SharesOf(user));
    Balance = parseInt(await web3.eth.getBalance(helloTesting.address));
    RemainingFund = parseInt(await helloTesting.RemainingFund());
    assert(TotalShares === 7000 && SharesOf === 7000, "Share not update on third redeem");
    assert(Balance === 7000 && RemainingFund === 7000, "Smart Contract balance not update on third redeem");

    await helloTesting.RedeemShare(1000, { from: user });
    TotalShares = parseInt(await helloTesting.TotalShares());
    SharesOf = parseInt(await helloTesting.SharesOf(user));
    Balance = parseInt(await web3.eth.getBalance(helloTesting.address));
    RemainingFund = parseInt(await helloTesting.RemainingFund());
    assert(TotalShares === 6000 && SharesOf === 6000, "Share not update on fourth redeem");
    assert(Balance === 6000 && RemainingFund === 6000, "Smart Contract balance not update on fourth redeem");
  });

  // Manager and investor operations
  it("should revert manager operations from an account that is not the manager's", async () => {
    await expectRevert(
      helloTesting.createProposal("Test_1", 1111, accounts[1], 1111, { from: accounts[1] }), "Only Manager can access this function"
    );
    await expectRevert(
      helloTesting.executeProposal(0, { from: accounts[1] }), "Only Manager can access this function"
    );
  });
  it("should revert investor operations from an account that is not the investors's", async () => {
    await expectRevert(
      helloTesting.Vote(1, { from: accounts[1] }), "Only investors can access"
    );
    await expectRevert(
      helloTesting.TransferShare(accounts[2], 1000, { from: accounts[1] }), "Only investors can access"
    );
    await expectRevert(
      helloTesting.RedeemShare(1000, { from: accounts[1] }), "Only investors can access"
    );
  });
});























































