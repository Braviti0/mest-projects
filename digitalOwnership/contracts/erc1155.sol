// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateToken is ERC1155, Ownable {
    string public name = "Real Estate Token";
    string public symbol = "RET";

    mapping(uint256 => string) public realEstateDetails;
    mapping(uint256 => address[]) public realEstateOwners;

    constructor() ERC1155("your_base_uri_here") {}

    // Mint function with access control
    function mint(
        address[] memory accounts,
        uint256 id,
        uint256[] memory amounts,
        string memory _houseNumber,
        string memory _city
    ) public onlyOwner {
        require(accounts.length == amounts.length, "Accounts and amounts length must match");

        for (uint i = 0; i < accounts.length; i++) {
            _mint(accounts[i], id, amounts[i], "");
            realEstateOwners[id].push(accounts[i]);
        }

        realEstateDetails[id] = string(abi.encodePacked(_houseNumber, ", ", _city));
    }

    // Set real estate details function with access control
    function setRealEstateDetails(
        uint256 id,
        string memory _houseNumber,
        string memory _city
    ) public onlyOwner {
        realEstateDetails[id] = string(abi.encodePacked(_houseNumber, ", ", _city));
    }
}
