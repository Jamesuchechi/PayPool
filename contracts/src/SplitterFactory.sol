// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/ISplitterFactory.sol";
import "./PayPool.sol";

/**
 * @title SplitterFactory
 * @notice Factory for deploying autonomous PayPool minimal proxy (EIP-1167) clone instances.
 */
contract SplitterFactory is ISplitterFactory {
    address public immutable override implementation;
    address[] private _allPools;

    constructor() {
        address[] memory emptyPayees;
        uint256[] memory emptyShares;
        implementation = address(new PayPool(emptyPayees, emptyShares));
    }

    /**
     * @notice Deploy a new lightweight EIP-1167 PayPool clone and initialize payee shares.
     */
    function createPool(
        address[] calldata payees,
        uint256[] calldata shares,
        string calldata name
    ) external override returns (address pool) {
        pool = Clones.clone(implementation);
        PayPool(payable(pool)).initialize(payees, shares);
        _allPools.push(pool);

        emit SplitterCreated(pool, msg.sender, payees, shares, name);
    }

    function getAllPools() external view override returns (address[] memory) {
        return _allPools;
    }

    function poolCount() external view returns (uint256) {
        return _allPools.length;
    }
}
