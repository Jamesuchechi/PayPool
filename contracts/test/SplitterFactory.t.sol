// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SplitterFactory.sol";
import "../src/PayPool.sol";
import "../src/interfaces/IPayPool.sol";
import "../src/interfaces/ISplitterFactory.sol";
import "./mocks/MockERC20.sol";

/**
 * @title SplitterFactoryTest
 * @notice Tests for EIP-1167 factory deployment, pool isolation, initialization safeguards, and gas comparison.
 */
contract SplitterFactoryTest is Test {
    SplitterFactory factory;
    MockERC20 token;

    address payee1 = address(0x4001);
    address payee2 = address(0x4002);
    address payee3 = address(0x4003);

    address[] payees;
    uint256[] shares;

    event SplitterCreated(
        address indexed pool,
        address indexed creator,
        address[] payees,
        uint256[] shares,
        string name
    );

    function setUp() public {
        factory = new SplitterFactory();
        token = new MockERC20("Test Token", "TTK");

        payees = new address[](3);
        payees[0] = payee1;
        payees[1] = payee2;
        payees[2] = payee3;

        shares = new uint256[](3);
        shares[0] = 5000; // 50%
        shares[1] = 3000; // 30%
        shares[2] = 2000; // 20%
    }

    function test_FactoryInitialization() public view {
        assertTrue(factory.implementation() != address(0));
        assertEq(factory.poolCount(), 0);
        assertEq(factory.getAllPools().length, 0);
    }

    function test_CreatePool_Success() public {
        vm.expectEmit(false, true, false, true);
        emit SplitterCreated(address(0), address(this), payees, shares, "Band Royalties Pool");

        address poolAddr = factory.createPool(payees, shares, "Band Royalties Pool");

        assertTrue(poolAddr != address(0));
        assertEq(factory.poolCount(), 1);
        assertEq(factory.getAllPools()[0], poolAddr);

        // Verify clone pool state
        PayPool pool = PayPool(payable(poolAddr));
        assertEq(pool.getPayees().length, 3);
        assertEq(pool.totalShares(), 10000);
        assertEq(pool.sharesOf(payee1), 5000);

        // Test deposit & withdrawal on clone
        (bool ok, ) = poolAddr.call{value: 10 ether}("");
        assertTrue(ok);

        assertEq(pool.pendingPayment(payee1, address(0)), 5 ether);
        pool.release(payee1, address(0));
        assertEq(payee1.balance, 5 ether);
    }

    function test_CreateMultiplePools_AutonomousIsolation() public {
        // Deploy 3 separate pools via factory
        address pool1 = factory.createPool(payees, shares, "Pool Alpha");
        address pool2 = factory.createPool(payees, shares, "Pool Beta");
        address pool3 = factory.createPool(payees, shares, "Pool Gamma");

        assertEq(factory.poolCount(), 3);
        assertEq(factory.getAllPools().length, 3);

        // Fund Pool 1 with 10 ETH, Pool 2 with 20 ETH
        (bool ok1, ) = pool1.call{value: 10 ether}("");
        (bool ok2, ) = pool2.call{value: 20 ether}("");
        assertTrue(ok1);
        assertTrue(ok2);

        // Verify isolated pending payments
        assertEq(PayPool(payable(pool1)).pendingPayment(payee1, address(0)), 5 ether);
        assertEq(PayPool(payable(pool2)).pendingPayment(payee1, address(0)), 10 ether);
        assertEq(PayPool(payable(pool3)).pendingPayment(payee1, address(0)), 0);

        // Release from Pool 1 does not affect Pool 2
        PayPool(payable(pool1)).release(payee1, address(0));
        assertEq(PayPool(payable(pool1)).pendingPayment(payee1, address(0)), 0);
        assertEq(PayPool(payable(pool2)).pendingPayment(payee1, address(0)), 10 ether);
    }

    function test_Revert_CannotReinitializeClone() public {
        address poolAddr = factory.createPool(payees, shares, "Test Clone");

        vm.expectRevert(IPayPool.AlreadyInitialized.selector);
        PayPool(payable(poolAddr)).initialize(payees, shares);
    }

    function test_GasComparison_CloneVsFullDeployment() public {
        // 1. Measure gas for full contract deployment
        uint256 startGasFull = gasleft();
        new PayPool(payees, shares);
        uint256 gasUsedFull = startGasFull - gasleft();

        // 2. Measure gas for EIP-1167 minimal proxy clone deployment
        uint256 startGasClone = gasleft();
        factory.createPool(payees, shares, "Gas Test Pool");
        uint256 gasUsedClone = startGasClone - gasleft();

        console.log("-----------------------------------------");
        console.log("Full Contract Deployment Gas :", gasUsedFull);
        console.log("EIP-1167 Clone Deployment Gas:", gasUsedClone);
        uint256 gasSavingsPct = ((gasUsedFull - gasUsedClone) * 100) / gasUsedFull;
        console.log("Deployment Gas Savings       :", gasSavingsPct, "%");
        console.log("-----------------------------------------");

        // Assert clone deployment uses significantly less gas (>60% savings)
        assertTrue(gasUsedClone < gasUsedFull);
        assertTrue(gasSavingsPct > 60);
    }
}
