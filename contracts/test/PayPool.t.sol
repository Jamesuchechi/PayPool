// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PayPool.sol";
import "../src/interfaces/IPayPool.sol";
import "./mocks/MockERC20.sol";

contract PayPoolTest is Test {
    PayPool pool;
    MockERC20 token;

    address payee1 = address(0x1001);
    address payee2 = address(0x1002);
    address payee3 = address(0x1003);
    address payee4 = address(0x1004);

    address[] defaultPayees;
    uint256[] defaultShares;

    event PaymentReceived(address indexed from, address indexed token, uint256 amount);
    event PaymentReleased(address indexed to, address indexed token, uint256 amount);

    function setUp() public {
        defaultPayees = new address[](4);
        defaultPayees[0] = payee1;
        defaultPayees[1] = payee2;
        defaultPayees[2] = payee3;
        defaultPayees[3] = payee4;

        defaultShares = new uint256[](4);
        defaultShares[0] = 4000; // 40%
        defaultShares[1] = 3000; // 30%
        defaultShares[2] = 2000; // 20%
        defaultShares[3] = 1000; // 10%

        pool = new PayPool(defaultPayees, defaultShares);
        token = new MockERC20("Test USDC", "USDC");
    }

    /* ========================================================================= */
    /* 1. INITIALIZATION TESTS                                                   */
    /* ========================================================================= */

    function test_Initialization_Success() public view {
        address[] memory payees = pool.getPayees();
        uint256[] memory shares = pool.getShares();

        assertEq(payees.length, 4);
        assertEq(payees[0], payee1);
        assertEq(payees[1], payee2);
        assertEq(payees[2], payee3);
        assertEq(payees[3], payee4);

        assertEq(shares[0], 4000);
        assertEq(shares[1], 3000);
        assertEq(shares[2], 2000);
        assertEq(shares[3], 1000);

        assertEq(pool.totalShares(), 10000);
        assertEq(pool.sharesOf(payee1), 4000);
    }

    function test_Revert_LengthMismatch() public {
        address[] memory p = new address[](2);
        p[0] = payee1;
        p[1] = payee2;

        uint256[] memory s = new uint256[](1);
        s[0] = 10000;

        vm.expectRevert(IPayPool.LengthMismatch.selector);
        new PayPool(p, s);
    }

    function test_Revert_InvalidPayeeCount_Under2() public {
        address[] memory p = new address[](1);
        p[0] = payee1;

        uint256[] memory s = new uint256[](1);
        s[0] = 10000;

        vm.expectRevert(IPayPool.InvalidPayeeCount.selector);
        new PayPool(p, s);
    }

    function test_Revert_InvalidPayeeCount_Over20() public {
        address[] memory p = new address[](21);
        uint256[] memory s = new uint256[](21);

        for (uint256 i = 0; i < 21; i++) {
            p[i] = address(uint160(i + 1));
            s[i] = 476; // total ~10,000
        }
        s[20] = 480;

        vm.expectRevert(IPayPool.InvalidPayeeCount.selector);
        new PayPool(p, s);
    }

    function test_Revert_ZeroAddressPayee() public {
        address[] memory p = new address[](2);
        p[0] = address(0);
        p[1] = payee2;

        uint256[] memory s = new uint256[](2);
        s[0] = 5000;
        s[1] = 5000;

        vm.expectRevert(IPayPool.ZeroAddressPayee.selector);
        new PayPool(p, s);
    }

    function test_Revert_DuplicatePayee() public {
        address[] memory p = new address[](2);
        p[0] = payee1;
        p[1] = payee1; // duplicate

        uint256[] memory s = new uint256[](2);
        s[0] = 5000;
        s[1] = 5000;

        vm.expectRevert(abi.encodeWithSelector(IPayPool.DuplicatePayee.selector, payee1));
        new PayPool(p, s);
    }

    function test_Revert_ZeroShares() public {
        address[] memory p = new address[](2);
        p[0] = payee1;
        p[1] = payee2;

        uint256[] memory s = new uint256[](2);
        s[0] = 0; // zero shares
        s[1] = 10000;

        vm.expectRevert(IPayPool.ZeroShares.selector);
        new PayPool(p, s);
    }

    function test_Revert_InvalidTotalShares() public {
        address[] memory p = new address[](2);
        p[0] = payee1;
        p[1] = payee2;

        uint256[] memory s = new uint256[](2);
        s[0] = 5000;
        s[1] = 4999; // sum = 9999

        vm.expectRevert(abi.encodeWithSelector(IPayPool.InvalidTotalShares.selector, 9999));
        new PayPool(p, s);
    }

    function test_Revert_AlreadyInitialized() public {
        vm.expectRevert(IPayPool.AlreadyInitialized.selector);
        pool.initialize(defaultPayees, defaultShares);
    }

    /* ========================================================================= */
    /* 2. ETH DEPOSIT & WITHDRAWAL TESTS                                         */
    /* ========================================================================= */

    function test_ETH_DepositAndWithdrawal_HappyPath() public {
        uint256 depositAmount = 10 ether;

        // 1. Send ETH to pool via receive()
        vm.expectEmit(true, true, false, true);
        emit PaymentReceived(address(this), address(0), depositAmount);

        (bool ok, ) = address(pool).call{value: depositAmount}("");
        assertTrue(ok);

        assertEq(pool.totalReceived(address(0)), depositAmount);
        assertEq(address(pool).balance, depositAmount);

        // 2. Check pending payments per payee
        assertEq(pool.pendingPayment(payee1, address(0)), 4 ether); // 40% of 10 ETH
        assertEq(pool.pendingPayment(payee2, address(0)), 3 ether); // 30% of 10 ETH
        assertEq(pool.pendingPayment(payee3, address(0)), 2 ether); // 20% of 10 ETH
        assertEq(pool.pendingPayment(payee4, address(0)), 1 ether); // 10% of 10 ETH

        // 3. Payee 1 releases funds
        uint256 initialBal1 = payee1.balance;
        vm.expectEmit(true, true, false, true);
        emit PaymentReleased(payee1, address(0), 4 ether);

        pool.release(payee1, address(0));

        assertEq(payee1.balance - initialBal1, 4 ether);
        assertEq(pool.pendingPayment(payee1, address(0)), 0);
        assertEq(pool.totalReleased(address(0)), 4 ether);
    }

    /* ========================================================================= */
    /* 3. ERC20 DEPOSIT & WITHDRAWAL TESTS                                       */
    /* ========================================================================= */

    function test_ERC20_DepositAndWithdrawal_HappyPath() public {
        uint256 depositAmount = 10_000 * 1e18; // 10,000 USDC

        token.mint(address(this), depositAmount);
        token.approve(address(pool), depositAmount);

        // 1. Deposit ERC20 into pool
        vm.expectEmit(true, true, false, true);
        emit PaymentReceived(address(this), address(token), depositAmount);

        pool.depositERC20(address(token), depositAmount);

        assertEq(pool.totalReceived(address(token)), depositAmount);
        assertEq(token.balanceOf(address(pool)), depositAmount);

        // 2. Check pending payments
        assertEq(pool.pendingPayment(payee2, address(token)), 3_000 * 1e18); // 30% of 10,000

        // 3. Payee 2 releases ERC20 funds
        vm.expectEmit(true, true, false, true);
        emit PaymentReleased(payee2, address(token), 3_000 * 1e18);

        pool.release(payee2, address(token));

        assertEq(token.balanceOf(payee2), 3_000 * 1e18);
        assertEq(pool.pendingPayment(payee2, address(token)), 0);
    }

    /* ========================================================================= */
    /* 4. MULTIPLE DEPOSITS & PARTIAL WITHDRAWALS                                */
    /* ========================================================================= */

    function test_MultipleDeposits_IncrementalClaims() public {
        // First deposit: 5 ETH
        (bool ok1, ) = address(pool).call{value: 5 ether}("");
        assertTrue(ok1);

        assertEq(pool.pendingPayment(payee1, address(0)), 2 ether);

        // Payee 1 claims 1st tranche (2 ETH)
        pool.release(payee1, address(0));
        assertEq(payee1.balance, 2 ether);
        assertEq(pool.pendingPayment(payee1, address(0)), 0);

        // Second deposit: 5 ETH (total received 10 ETH, payee 1 entitled to 4 ETH total)
        (bool ok2, ) = address(pool).call{value: 5 ether}("");
        assertTrue(ok2);

        // Payee 1 should now have 2 ETH pending
        assertEq(pool.pendingPayment(payee1, address(0)), 2 ether);

        // Payee 1 claims 2nd tranche (2 ETH)
        pool.release(payee1, address(0));
        assertEq(payee1.balance, 4 ether);
        assertEq(pool.pendingPayment(payee1, address(0)), 0);
    }

    function test_Revert_Release_NoPendingPayment() public {
        vm.expectRevert(IPayPool.NoPendingPayment.selector);
        pool.release(payee1, address(0));
    }
}
