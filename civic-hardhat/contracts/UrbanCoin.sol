// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UrbanCoin is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("UrbanCoin", "URB") Ownable(msg.sender) {
        // Mint initial supply to the contract owner (treasury)
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Only owner can reward a reporter (transfer tokens from treasury)
    function rewardReporter(address reporter, uint256 amount) external onlyOwner {
        _transfer(msg.sender, reporter, amount * 10 ** decimals());
    }
}
