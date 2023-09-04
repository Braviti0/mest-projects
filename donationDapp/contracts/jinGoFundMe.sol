// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract jinGoFundMe {

    uint public totalDonations;
        
    uint public totalClaimsWithdrawn;


    // access control

    address public moderator;

        constructor() {
        moderator = msg.sender;
    }

    modifier onlymoderator() {
        require(msg.sender == moderator);
        _;
    }


    // emergency stop measures

    bool public canWithdraw = true;

    bool public hardlocked = false;

    function haltWithdrawals() public onlymoderator {
        canWithdraw = false;
    }

    function resumeWithdrawals() public onlymoderator {
        require(hardlocked == false, "Withdrawals are hardlocked. The contract has been compromised.");
        canWithdraw = true;
    }

    function hardlock() public onlymoderator {
        hardlocked = true;
    }


    // request donation

    struct donationRequest {
        address beneficiaryAddress;
        string beneficiaryName;
        string donationPurpose;
        uint amountRequested;
    }



    // pending requests
    donationRequest[] pendingRequests;

    function submitRequest(string memory _beneficiaryName, string memory _donationPurpose, uint _amountRequested) public  returns (uint requestId) {
        donationRequest memory newRequest = donationRequest({
            beneficiaryAddress: msg.sender,
            beneficiaryName: _beneficiaryName,
            donationPurpose: _donationPurpose,
            amountRequested: _amountRequested
        });

        pendingRequests.push(newRequest);
        return (pendingRequests.length - 1);
    }

    function viewPendingRequests() public view returns (donationRequest[] memory) {
        return pendingRequests;
    }


    // approved requests
    donationRequest[] public approvedRequests;

    function viewApprovedRequests() public view returns (donationRequest[] memory) {
        return approvedRequests;
    }


    // approve donation request

    function approveRequest(uint _requestId) public onlymoderator {
        donationRequest storage request = pendingRequests[_requestId];
        beneficiaryPendingClaims[request.beneficiaryAddress] += request.amountRequested;
        approvedRequests.push(request);
        delete pendingRequests[_requestId];

        emit approvedDonationRequest(request.beneficiaryAddress, request.amountRequested, block.timestamp);
    }

    function rejectRequest(uint _requestId) public onlymoderator {
        delete pendingRequests[_requestId];
    }




    // make claim

    mapping (address => uint) public beneficiaryPendingClaims;

    mapping (address => uint) public beneficiaryWithdrawnClaims;



    function withdraw() public {

        require(canWithdraw == true, "Withdrawals are currently halted.");

        require(beneficiaryPendingClaims[msg.sender] > 0, "You have no pending claims.");

        require(address(this).balance >= beneficiaryPendingClaims[msg.sender], "Contract balance is insufficient.");

        uint amount = beneficiaryPendingClaims[msg.sender];

        beneficiaryPendingClaims[msg.sender] = 0;

        beneficiaryWithdrawnClaims[msg.sender] += amount;

        totalClaimsWithdrawn += amount;

        payable(msg.sender).transfer(amount);

        emit claimed(msg.sender, amount, block.timestamp);
    }


    function donate() public payable {
        require(msg.value > 0, "You must send some ether.");
        totalDonations += msg.value;
        donations.push(donation({
            donorAddress: msg.sender,
            amountDonated: msg.value,
            timestamp: block.timestamp,
            beneficiaryAddress: address(0)
        }));
        emit donated(msg.sender, msg.value, block.timestamp, donations.length - 1);
    }

    function donateToRequest(uint _requestId) public payable {
        require(msg.value > 0, "dust donations are prohibited.");
        totalDonations += msg.value;
        donationRequest storage request = pendingRequests[_requestId];
        request.amountRequested -= msg.value;
        beneficiaryPendingClaims[request.beneficiaryAddress] += msg.value;
        donations.push(donation({
            donorAddress: msg.sender,
            amountDonated: msg.value,
            timestamp: block.timestamp,
            beneficiaryAddress: request.beneficiaryAddress
        }));
        emit donatedToRequest(msg.sender, request.beneficiaryAddress, msg.value, block.timestamp, donations.length - 1);
    }

    // donation records

    struct donation {
        address donorAddress;
        uint amountDonated;
        uint timestamp;
        address beneficiaryAddress;
    }

    donation[] public donations;





    // events could be used to keep records of donations and claims as a gas optimization measure
    // the donor list can still be accessed by querying the blockchain for the events listed here

    // but this will require a frontend interface which is not yet implemented
    // this may not be helpful in all use cases


    event donated (address indexed donor, uint amount, uint timestamp, uint indexed donationId );

    event claimed (address indexed beneficiary, uint amount, uint timestamp);

    event approvedDonationRequest (address indexed beneficiary, uint amount, uint timestamp);

    event donatedToRequest (address indexed donor, address indexed beneficiary, uint amount, uint timestamp, uint indexed donationId);



}