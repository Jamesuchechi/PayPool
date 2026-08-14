// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISplitterFactory {
    event SplitterCreated(address indexed pool, address indexed creator, address[] payees, uint256[] shares, string name);

    function createPool(address[] calldata payees, uint256[] calldata shares, string calldata name) external returns (address pool);
    function getAllPools() external view returns (address[] memory);
    function implementation() external view returns (address);
}
