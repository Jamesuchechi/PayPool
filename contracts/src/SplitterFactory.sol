// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/ISplitterFactory.sol";
import "./PayPool.sol";

/**
 * @title SplitterFactory
 * @notice Factory for deploying PayPool minimal proxy instances.
 */
contract SplitterFactory is ISplitterFactory {
    address public immutable override implementation;
    address[] private _allPools;

    constructor() {
        implementation = address(new PayPool());
    }

    function createPool(
        address[] calldata payees,
        uint256[] calldata shares,
        string calldata name
    ) external override returns (address pool) {
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, _allPools.length, block.timestamp));
        // Minimal proxy assembly clone pattern
        bytes20 implBytes = bytes20(implementation);
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), implBytes)
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            pool := create2(0, ptr, 0x37, salt)
        }
        require(pool != address(0), "Factory: deployment failed");

        PayPool(payable(pool)).initialize(payees, shares);
        _allPools.push(pool);

        emit SplitterCreated(pool, msg.sender, payees, shares, name);
    }

    function getAllPools() external view override returns (address[] memory) {
        return _allPools;
    }
}
