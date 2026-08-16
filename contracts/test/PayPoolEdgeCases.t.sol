// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PayPool.sol";
import "../src/interfaces/IPayPool.sol";
import "./mocks/MockERC20.sol";

/**
 * @title MaliciousReentrantPayee
 * @notice Helper contract attempting re-entrancy during ETH release.
 */
contract MaliciousReentrantPayee {
    PayPool public pool;
    bool public reentrancyAttempted;
    bool public reentrancySucceeded;

    constructor(PayPool _pool) {
        pool = _pool;
    }

    receive() external payable {
        if (!reentrancyAttempted) {
            reentrancyAttempted = true;
            // Attempt recursive call to release()
            try pool.release(address(this), address(0)) {
                reentrancySucceeded = true;
            } catch {
                reentrancySucceeded = false;
            }
        }
    }
}

/**
 * @title PayPoolEdgeCasesTest
 * @notice Test suite for security edge cases, re-entrancy prevention, zero-deposits, and double claims.
 */
contract PayPoolEdgeCasesTest is Test {
    PayPool pool;
    MockERC20 token;
    MaliciousReentrantPayee attacker;

    address payee2 = address(0x2002);

    function setUp() public {
        token = new MockERC20("Edge Token", "EDGE");

        // Set up attacker as payee1
        address[] memory payees = new address[](2);
        payees[0] = address(0x3001); // placeholder before creating attacker
        payees[1] = payee2;

        uint256[] memory shares = new uint256[](2);
        shares[0] = 5000; // 50%
        shares[1] = 5000; // 50%

        // Deploy pool with temporary addresses, then deploy clean pool for attacker
        attacker = new MaliciousReentrantPayee(PayPool(payable(address(0))));
        payees[0] = address(attacker);

        pool = new PayPool(payees, shares);

        // Update attacker's pool reference
        attacker = new MaliciousReentrantPayee(pool);
        payees[0] = address(attacker);
        pool = new PayPool(payees, shares);
    }

    /* ========================================================================= */
    /* 1. RE-ENTRANCY PROTECTION TEST                                           */
    /* ========================================================================= */

    function test_Reentrancy_PreventedByReentrancyGuard() public {
        // Fund pool with 10 ETH
        (bool ok, ) = address(pool).call{value: 10 ether}("");
        assertTrue(ok);

        // Trigger release for attacker payee
        pool.release(address(attacker), address(0));

        // Verify attacker received its 5 ETH share and re-entrancy call failed
        assertEq(address(attacker).balance, 5 ether);
        assertTrue(attacker.reentrancyAttempted());
        assertFalse(attacker.reentrancySucceeded());
    }

    /* ========================================================================= */
    /* 2. ZERO DEPOSIT EDGE CASES                                                */
    /* ========================================================================= */

    function test_Revert_ZeroERC20Deposit() public {
        token.mint(address(this), 100);
        token.approve(address(pool), 100);

        vm.expectRevert(IPayPool.ZeroDeposit.selector);
        pool.depositERC20(address(token), 0);
    }

    function test_Revert_DepositInvalidToken() public {
        vm.expectRevert(IPayPool.InvalidToken.selector);
        pool.depositERC20(address(0), 100);
    }

    /* ========================================================================= */
    /* 3. REPEATED & ZERO BALANCE RELEASE EDGE CASES                             */
    /* ========================================================================= */

    function test_Revert_RepeatedReleaseCalls() public {
        (bool ok, ) = address(pool).call{value: 10 ether}("");
        assertTrue(ok);

        // First release succeeds
        pool.release(payee2, address(0));

        // Immediate second release reverts with NoPendingPayment
        vm.expectRevert(IPayPool.NoPendingPayment.selector);
        pool.release(payee2, address(0));
    }

    function test_NonPayee_HasZeroPending() public view {
        address stranger = address(0x9999);
        assertEq(pool.pendingPayment(stranger, address(0)), 0);
    }
}
