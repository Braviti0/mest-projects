// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

// You are supposed to complete this assignment by defining appropriate data types
// And working on the code implementation for the various functions/methods in the contract
contract JingoElects {

    address moderator;
    uint totalRegisteredVoters;
    uint totalVotes;
    uint nextCandidateId;
    mapping (address => bool) registeredVoters;


    constructor () {
        moderator = msg.sender;
    }

    modifier onlyModerator {
        require(msg.sender == moderator, "Only moderator can call this function");
        _;
    }


    // Define an Appropriate Data Type to Store Candidates
    mapping (uint => string) Candidates;
    mapping (uint => uint) VotesForCandidateId;
    mapping (string => uint) CandidateIds;

    // Define an Appropriate Data Type to Track If Voter has Already Voted
    mapping (address => bool) hasVoted;

    // Adds New Candidate
    function addCandidate(string memory name) public onlyModerator() {
        require(CandidateIds[name] == 0, "Candidate Name already exists");
        Candidates[nextCandidateId] = name;
        CandidateIds[name] = nextCandidateId;
        nextCandidateId++;
    }

    // Removes Already Added Candidate
    function removeCandidate(string memory name) public onlyModerator() {
        require(CandidateIds[name] != 0, "Candidate does not exist");
        uint candidateId = CandidateIds[name];
        delete Candidates[candidateId];
        delete CandidateIds[name];
    }

    // Retrieves All Candidates for Viewing
    function getAllCandidates() public view returns (string[] memory) {
        string[] memory candidateNames = new string[](nextCandidateId);

        for (uint i = 0; i < nextCandidateId; i++) {
            if (bytes(Candidates[i]).length != 0) {
                candidateNames[i] = Candidates[i];
            }
        }
        return candidateNames;
    }

    // Allows Voter to Cast a Vote for a Single Candidate
    function castVote(string memory candidate) public {
        require(CandidateIds[candidate] != 0, "Candidate does not exist");
        require(registeredVoters[msg.sender] == false, "Voter has already voted");
        uint candidateId = CandidateIds[candidate];
        VotesForCandidateId[candidateId]++;
        totalVotes++;
        registeredVoters[msg.sender] = true;
    }

    function registerVoter(address voter) public onlyModerator() {
        require(registeredVoters[voter] == false, "Voter already registered");
        registeredVoters[voter] = true;
        totalRegisteredVoters++;
    }

    function checkResults() public view returns (string memory winnerCandidate) {
        require(totalVotes != 0, "No votes casted yet");
        uint maxVotes = 0;
        for (uint i = 0; i < nextCandidateId; i++) {
            if (VotesForCandidateId[i] > maxVotes) {
                maxVotes = VotesForCandidateId[i];
                require(totalVotes >= (((totalRegisteredVoters * 9)/10)), "Not enough votes to declare winner");
                winnerCandidate = Candidates[i];
            }
        }
    }
}