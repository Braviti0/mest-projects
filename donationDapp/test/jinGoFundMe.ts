import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("jinGoFundMe", function () {
  let jinGoFundMe: any;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;

beforeEach(async function () {
  [owner, user1, user2] = await ethers.getSigners();

  jinGoFundMe = await new ethers.ContractFactory(
    "jinGoFundMe",
    await ethers.getContractFactory("jinGoFundMe"),
    owner
  ).deploy();
  await jinGoFundMe.deployed();
});


  it("should deploy the contract", async function () {
    expect(jinGoFundMe.address).to.not.equal(0);
  });

  it("should allow donation", async function () {
    const donationAmount = ethers.utils.parseEther("1.0"); // 1 ETH
    await jinGoFundMe.connect(user1).donate({ value: donationAmount });
    const totalDonations = await jinGoFundMe.totalDonations();
    expect(totalDonations).to.equal(donationAmount);
  });

  it("should submit a donation request", async function () {
    const beneficiaryName = "Beneficiary 1";
    const donationPurpose = "Purpose 1";
    const amountRequested = ethers.utils.parseEther("0.5"); // 0.5 ETH

    await jinGoFundMe
      .connect(user1)
      .submitRequest(beneficiaryName, donationPurpose, amountRequested);

    const pendingRequests = await jinGoFundMe.viewPendingRequests();
    expect(pendingRequests.length).to.equal(1);
    expect(pendingRequests[0].beneficiaryName).to.equal(beneficiaryName);
    expect(pendingRequests[0].donationPurpose).to.equal(donationPurpose);
    expect(pendingRequests[0].amountRequested).to.equal(amountRequested);
  });

  it("should halt withdrawals when called by the owner", async function () {
    // Check that withdrawals are initially allowed
    const canWithdrawBefore = await jinGoFundMe.canWithdraw();
    expect(canWithdrawBefore).to.equal(true);

    // Call haltWithdrawals as the owner
    await jinGoFundMe.connect(owner).haltWithdrawals();

    // Check that withdrawals are now halted
    const canWithdrawAfter = await jinGoFundMe.canWithdraw();
    expect(canWithdrawAfter).to.equal(false);
  });

  it("should not halt withdrawals when called by a non-owner", async function () {
    // Check that withdrawals are initially allowed
    const canWithdrawBefore = await jinGoFundMe.canWithdraw();
    expect(canWithdrawBefore).to.equal(true);

    // Attempt to call haltWithdrawals as a non-owner
    try {
      await jinGoFundMe.connect(user1).haltWithdrawals();
      // If the call succeeds, this line will throw an error
    } catch (error) {
      // Ensure that the error message indicates unauthorized access
      expect(error.message).to.include(
        "Only the moderator can call this function"
      );
    }

    // Check that withdrawals are still allowed
    const canWithdrawAfter = await jinGoFundMe.canWithdraw();
    expect(canWithdrawAfter).to.equal(true);
  });

it("should resume withdrawals when called by the owner", async function () {
  // First, halt withdrawals as the owner
  await jinGoFundMe.connect(owner).haltWithdrawals();
  const canWithdrawHalted = await jinGoFundMe.canWithdraw();
  expect(canWithdrawHalted).to.equal(false);

  // Now, resume withdrawals as the owner
  await jinGoFundMe.connect(owner).resumeWithdrawals();
  const canWithdrawResumed = await jinGoFundMe.canWithdraw();
  expect(canWithdrawResumed).to.equal(true);
});

it("should not resume withdrawals when called by a non-owner", async function () {
  // First, halt withdrawals as the owner
  await jinGoFundMe.connect(owner).haltWithdrawals();
  const canWithdrawHalted = await jinGoFundMe.canWithdraw();
  expect(canWithdrawHalted).to.equal(false);

  // Attempt to resume withdrawals as a non-owner
  try {
    await jinGoFundMe.connect(user1).resumeWithdrawals();
    // If the call succeeds, this line will throw an error
  } catch (error) {
    // Ensure that the error message indicates unauthorized access
    expect(error.message).to.include("Only the moderator can call this function");
  }

  // Check that withdrawals are still halted
  const canWithdrawStillHalted = await jinGoFundMe.canWithdraw();
  expect(canWithdrawStillHalted).to.equal(false);
});


  it("should hardlock withdrawals when called by the owner", async function () {
  // Check that hardlock status is initially false
  const isHardlockedBefore = await jinGoFundMe.hardlocked();
  expect(isHardlockedBefore).to.equal(false);

  // Call hardlock as the owner
  await jinGoFundMe.connect(owner).hardlock();

  // Check that hardlock status is now true
  const isHardlockedAfter = await jinGoFundMe.hardlocked();
  expect(isHardlockedAfter).to.equal(true);
});

it("should not hardlock withdrawals when called by a non-owner", async function () {
  // Check that hardlock status is initially false
  const isHardlockedBefore = await jinGoFundMe.hardlocked();
  expect(isHardlockedBefore).to.equal(false);

  // Attempt to call hardlock as a non-owner
  try {
    await jinGoFundMe.connect(user1).hardlock();
    // If the call succeeds, this line will throw an error
  } catch (error) {

    it("should approve a donation request when called by the owner", async function () {
  // Create a sample donation request
  const beneficiaryName = "Beneficiary 1";
  const donationPurpose = "Purpose 1";
  const amountRequested = ethers.utils.parseEther("0.5"); // 0.5 ETH

  // Submit the donation request
  await jinGoFundMe.connect(user1).submitRequest(beneficiaryName, donationPurpose, amountRequested);

  // Check the initial length of approved requests
  const initialApprovedRequestsLength = (await jinGoFundMe.viewApprovedRequests()).length;

  // Approve the donation request as the owner
  await jinGoFundMe.connect(owner).approveRequest(0);

  // Check the updated length of approved requests
  const updatedApprovedRequestsLength = (await jinGoFundMe.viewApprovedRequests()).length;

  // Verify that the request was approved
  expect(updatedApprovedRequestsLength).to.equal(initialApprovedRequestsLength + 1);
});
  }


it("should reject a donation request when called by the owner", async function () {
  // Create a sample donation request
  const beneficiaryName = "Beneficiary 1";
  const donationPurpose = "Purpose 1";
  const amountRequested = ethers.utils.parseEther("0.5"); // 0.5 ETH

  // Submit the donation request
  await jinGoFundMe.connect(user1).submitRequest(beneficiaryName, donationPurpose, amountRequested);

  // Check the initial length of pending requests
  const initialPendingRequestsLength = (await jinGoFundMe.viewPendingRequests()).length;

  // Reject the donation request as the owner
  await jinGoFundMe.connect(owner).rejectRequest(0);

  // Check the updated length of pending requests
  const updatedPendingRequestsLength = (await jinGoFundMe.viewPendingRequests()).length;

  // Verify that the request was rejected
  expect(updatedPendingRequestsLength).to.equal(initialPendingRequestsLength - 1);
});


it("should donate to a specific request when called with donateToRequest", async function () {
  // Create a sample donation request
  const beneficiaryName = "Beneficiary 1";
  const donationPurpose = "Purpose 1";
  const amountRequested = ethers.utils.parseEther("1.0"); // 1 ETH

  // Submit the donation request
  await jinGoFundMe.connect(user1).submitRequest(beneficiaryName, donationPurpose, amountRequested);

  // Check the initial balance of the contract
  const initialBalance = await ethers.provider.getBalance(jinGoFundMe.address);

  // Donate to the specific request as a user
  const donationAmount = ethers.utils.parseEther("0.5"); // 0.5 ETH
  await jinGoFundMe.connect(user2).donateToRequest(0, { value: donationAmount });

  // Check the updated balance of the contract
  const updatedBalance = await ethers.provider.getBalance(jinGoFundMe.address);

  // Verify that the contract balance increased by the donation amount
  const expectedBalanceIncrease = ethers.utils.parseEther("0.5"); // 0.5 ETH
  expect(updatedBalance.sub(initialBalance)).to.equal(expectedBalanceIncrease);
});

});
});
