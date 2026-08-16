// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SplitterFactory.sol";
import "../src/PayPool.sol";

/**
 * @title DeployTestnet
 * @notice Parameterized deployment script for Base Sepolia testnet deployment.
 */
contract DeployTestnet is Script {
    function run()
        external
        returns (
            address factoryAddress,
            address implementationAddress,
            address pool1Address,
            address pool2Address
        )
    {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );

        address p1 = vm.envOr("PAYEE_1", address(0x7aC9d1B48e6f02CA7715be39db2C0a9e4d5c3f41));
        address p2 = vm.envOr("PAYEE_2", address(0x9bE12c3d4e5f6A7b8C9d0e1F2a3b4C5d6E7f04D7));
        address p3 = vm.envOr("PAYEE_3", address(0x1D772C3D4E5f6A7b8c9d0e1F2a3b4C5D6E7FAe30));
        address p4 = vm.envOr("PAYEE_4", address(0xc0fF2c3D4e5F6A7b8C9d0E1F2A3b4C5D6E7F82ab));

        address[] memory payees1 = new address[](4);
        payees1[0] = p1;
        payees1[1] = p2;
        payees1[2] = p3;
        payees1[3] = p4;

        uint256[] memory shares1 = new uint256[](4);
        shares1[0] = 4000; // 40%
        shares1[1] = 3000; // 30%
        shares1[2] = 2000; // 20%
        shares1[3] = 1000; // 10%

        address[] memory payees2 = new address[](3);
        payees2[0] = p1;
        payees2[1] = p2;
        payees2[2] = p3;

        uint256[] memory shares2 = new uint256[](3);
        shares2[0] = 5000; // 50%
        shares2[1] = 3500; // 35%
        shares2[2] = 1500; // 15%

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy SplitterFactory (which deploys master PayPool implementation)
        SplitterFactory factory = new SplitterFactory();
        factoryAddress = address(factory);
        implementationAddress = factory.implementation();

        // 2. Create 2 real revenue pools via factory
        pool1Address = factory.createPool(payees1, shares1, "Band Royalties Splitter");
        pool2Address = factory.createPool(payees2, shares2, "SaaS Co-Founder Splitter");

        vm.stopBroadcast();

        console.log("=========================================");
        console.log("Base Sepolia Deployment Complete");
        console.log("SplitterFactory Address :", factoryAddress);
        console.log("PayPool Implementation  :", implementationAddress);
        console.log("Pool 1 (Band Royalties) :", pool1Address);
        console.log("Pool 2 (SaaS Co-Founder):", pool2Address);
        console.log("Total Deployed Pools    :", factory.poolCount());
        console.log("=========================================");
    }
}
