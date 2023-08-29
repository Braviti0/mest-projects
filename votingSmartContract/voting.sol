// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

// You are supposed to complete this assignment by defining appropriate data types
// And working on the code implementation for the various functions/methods in the contract
contract Voting {

uint nextCandidateId;
address moderator;
uint totalCandidates;

// Define an Appropriate Data Type to Store Candidates
mapping (address => bool) isCandidate;
mapping (uint => address) candidateList;
mapping (address => uint) candidateIds;

// Define an Appropriate Data Type to Track If Voter has Already Voted
mapping (address => bool) hasVoted;

modifier onlyModerator() {
    require(msg.sender == moderator, "Only Moderator Can Perform This Action");
    _;
}

// Adds New Candidate
function addCandidate(address newCandidate) public onlyModerator() {
    isCandidate[newCandidate] = true;
    candidateList[nextCandidateId] = newCandidate;
    candidateIds[newCandidate] = nextCandidateId;
    nextCandidateId++;
    totalCandidates++;
}

// Removes Already Added Candidate
function removeCandidate(address Candidate) public onlyModerator() {
    isCandidate[Candidate] = false;
    candidateList[candidateIds[Candidate]] = address(0);
    candidateIds[Candidate] = 0;
    totalCandidates--;

}

// Retrieves All Candidates for Viewing
function getAllCandidates() public view {
    for (uint i = 1; i <= totalCandidates; i++) {
        if (candidateList[i] != address(0)) {
            // Print Candidate Name
        }
    }
}

// Allows Voter to Cast a Vote for a Single Candidate
function castVote() public {
    require(isCandidate[msg.sender] == true, "You Are Not A Candidate");
    require(hasVoted[msg.sender] == false, "You Have Already Voted");
    hasVoted[msg.sender] = true;
}


constructor () {
    nextCandidateId = 1;
    moderator = msg.sender;
}
}