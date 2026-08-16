// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SplitterFactory.sol";
import "../src/PayPool.sol";

/**
 * @title DeployFactory
 * @notice Script to deploy SplitterFactory and create 3 demo revenue pools.
 */
contract DeployFactory is Script {
    function run() external returns (address factoryAddress, address implementationAddress) {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        address[] memory payees1 = new address[](4);
        payees1[0] = address(0x7aC9d1B48e6f02CA7715be39db2C0a9e4d5c3f41);
        payees1[1] = address(0x9bE12c3d4e5f6A7b8C9d0e1F2a3b4C5d6E7f04D7);
        payees1[2] = address(0x1D772C3D4E5f6A7b8c9d0e1F2a3b4C5D6E7FAe30);
        payees1[3] = address(0xc0fF2c3D4e5F6A7b8C9d0E1F2A3b4C5D6E7F82ab);

        uint256[] memory shares1 = new uint256[](4);
        shares1[0] = 4000; shares1[1] = 3000; shares1[2] = 2000; shares1[3] = 1000;

        vm.startBroadcast(deployerPrivateKey);

        SplitterFactory factory = new SplitterFactory();
        factoryAddress = address(factory);
        implementationAddress = factory.implementation();

        address pool1 = factory.createPool(payees1, shares1, "Band Royalties Splitter");
        address pool2 = factory.createPool(payees1, shares1, "SaaS Co-Founder Splitter");
        address pool3 = factory.createPool(payees1, shares1, "DAO Grant Pool");

        vm.stopBroadcast();

        console.log("SplitterFactory deployed at:", factoryAddress);
        console.log("PayPool Implementation at :", implementationAddress);
        console.log("Pool 1 (Band Royalties)  :", pool1);
        console.log("Pool 2 (SaaS Co-Founder) :", pool2);
        console.log("Pool 3 (DAO Grant Pool)  :", pool3);
    }
}
