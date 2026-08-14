// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/SplitterFactory.sol";

contract DeployScript {
    function run() external returns (address factoryAddress) {
        SplitterFactory factory = new SplitterFactory();
        return address(factory);
    }
}
