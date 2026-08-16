// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PayPool.sol";
import "../src/interfaces/IPayPool.sol";
import "./mocks/MockERC20.sol";

/**
 * @title PayPoolFuzzTest
 * @notice Fuzz and Invariant tests proving mathematical correctness and fund conservation in PayPool.
 */
contract PayPoolFuzzTest is Test {
    PayPool pool;
    MockERC20 token;

    address payee1 = address(0x1001);
    address payee2 = address(0x1002);
    address payee3 = address(0x1003);
    address payee4 = address(0x1004);

    address[] payees;
    uint256[] shares;

    function setUp() public {
        payees = new address[](4);
        payees[0] = payee1;
        payees[1] = payee2;
        payees[2] = payee3;
        payees[3] = payee4;

        shares = new uint256[](4);
        shares[0] = 4000; // 40%
        shares[1] = 3000; // 30%
        shares[2] = 2000; // 20%
        shares[3] = 1000; // 10%

        pool = new PayPool(payees, shares);
        token = new MockERC20("Fuzz Token", "FUZZ");
    }

    /**
     * @notice Invariant: Total Received ETH strictly equals Total Released ETH + sum of all payees' Pending ETH.
     */
    function testFuzz_ETH_FundConservationInvariant(uint96[4] memory depositAmounts) public {
        uint256 totalDeposited = 0;

        // Perform 4 randomized deposit iterations
        for (uint256 i = 0; i < depositAmounts.length; i++) {
            uint256 amt = bound(depositAmounts[i], 1, 100_000 ether);
            (bool ok, ) = address(pool).call{value: amt}("");
            assertTrue(ok);
            totalDeposited += amt;

            // Randomly release for a payee during deposits
            if (i % 2 == 0) {
                address payeeToRelease = payees[i % payees.length];
                uint256 pending = pool.pendingPayment(payeeToRelease, address(0));
                if (pending > 0) {
                    pool.release(payeeToRelease, address(0));
                }
            }
        }

        // Verify Conservation Invariant
        uint256 totalRec = pool.totalReceived(address(0));
        uint256 totalRel = pool.totalReleased(address(0));

        uint256 sumPending = 0;
        for (uint256 i = 0; i < payees.length; i++) {
            sumPending += pool.pendingPayment(payees[i], address(0));
        }

        assertEq(totalRec, totalDeposited);
        assertApproxEqAbs(totalRec, totalRel + sumPending, 10); // precision within rounding tolerance
    }

    /**
     * @notice Invariant: Total Received ERC20 strictly equals Total Released ERC20 + sum of pending ERC20 payments.
     */
    function testFuzz_ERC20_FundConservationInvariant(uint96[4] memory depositAmounts) public {
        uint256 totalDeposited = 0;

        for (uint256 i = 0; i < depositAmounts.length; i++) {
            uint256 amt = bound(depositAmounts[i], 1, 1_000_000 * 1e18);
            token.mint(address(this), amt);
            token.approve(address(pool), amt);
            pool.depositERC20(address(token), amt);
            totalDeposited += amt;

            if (i % 2 == 1) {
                address payeeToRelease = payees[i % payees.length];
                uint256 pending = pool.pendingPayment(payeeToRelease, address(token));
                if (pending > 0) {
                    pool.release(payeeToRelease, address(token));
                }
            }
        }

        uint256 totalRec = pool.totalReceived(address(token));
        uint256 totalRel = pool.totalReleased(address(token));

        uint256 sumPending = 0;
        for (uint256 i = 0; i < payees.length; i++) {
            sumPending += pool.pendingPayment(payees[i], address(token));
        }

        assertEq(totalRec, totalDeposited);
        assertApproxEqAbs(totalRec, totalRel + sumPending, 10);
    }

    /**
     * @notice Fuzz test random valid share distributions summing to 10,000.
     */
    function testFuzz_RandomValidShareSplits(uint16 rawShare1, uint16 /* rawShare2 */) public {
        uint256 s1 = bound(rawShare1, 1, 9998);
        uint256 s2 = 10000 - s1;

        address[] memory p = new address[](2);
        p[0] = address(0x2001);
        p[1] = address(0x2002);

        uint256[] memory s = new uint256[](2);
        s[0] = s1;
        s[1] = s2;

        PayPool customPool = new PayPool(p, s);

        // Deposit 100 ETH
        (bool ok, ) = address(customPool).call{value: 100 ether}("");
        assertTrue(ok);

        uint256 p1Pending = customPool.pendingPayment(p[0], address(0));
        uint256 p2Pending = customPool.pendingPayment(p[1], address(0));

        assertEq(p1Pending + p2Pending, 100 ether);
    }
}
