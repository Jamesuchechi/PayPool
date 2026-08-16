// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/PayPool.sol";

contract DeployPayPool is Script {
    function run() external returns (address poolAddress) {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        address payee1 = vm.envOr("PAYEE_1", address(0x7aC9d1B48e6f02CA7715be39db2C0a9e4d5c3f41));
        address payee2 = vm.envOr("PAYEE_2", address(0x9bE12c3d4e5f6A7b8C9d0e1F2a3b4C5d6E7f04D7));
        address payee3 = vm.envOr("PAYEE_3", address(0x1D772C3D4E5f6A7b8c9d0e1F2a3b4C5D6E7FAe30));
        address payee4 = vm.envOr("PAYEE_4", address(0xc0fF2c3D4e5F6A7b8C9d0E1F2A3b4C5D6E7F82ab));

        address[] memory payees = new address[](4);
        payees[0] = payee1;
        payees[1] = payee2;
        payees[2] = payee3;
        payees[3] = payee4;

        uint256[] memory shares = new uint256[](4);
        shares[0] = 4000; // 40%
        shares[1] = 3000; // 30%
        shares[2] = 2000; // 20%
        shares[3] = 1000; // 10%

        vm.startBroadcast(deployerPrivateKey);

        PayPool pool = new PayPool(payees, shares);
        poolAddress = address(pool);

        console.log("PayPool Core Contract deployed at:", poolAddress);

        vm.stopBroadcast();
    }
}
