// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IPayPool.sol";

/**
 * @title PayPool
 * @notice Hardened implementation contract for autonomous ETH and ERC20 revenue splitting.
 * @dev Uses OpenZeppelin ReentrancyGuard and SafeERC20 for robust security.
 */
contract PayPool is IPayPool, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant TOTAL_SHARE_UNITS = 10_000;

    bool private _initialized;
    address[] private _payees;
    uint256[] private _shares;
    uint256 private _totalShares;

    mapping(address => uint256) private _sharesOf;
    mapping(address => uint256) private _totalReceived;
    mapping(address => uint256) private _totalReleased;
    mapping(address => mapping(address => uint256)) private _released; // token => payee => amount

    /**
     * @notice Single-instance constructor (for standalone Phase 1 deployments).
     */
    constructor(address[] memory payees, uint256[] memory shares) {
        if (payees.length > 0) {
            _initialized = true;
            _initialize(payees, shares);
        }
    }

    /**
     * @notice Initializer for clone instances (Phase 3 factory deployment).
     */
    function initialize(address[] calldata payees, uint256[] calldata shares) external override {
        if (_initialized) revert AlreadyInitialized();
        _initialized = true;
        _initialize(payees, shares);
    }

    function _initialize(address[] memory payees, uint256[] memory shares) internal {
        if (payees.length != shares.length) revert LengthMismatch();
        if (payees.length < 2 || payees.length > 20) revert InvalidPayeeCount();

        uint256 total = 0;
        for (uint256 i = 0; i < payees.length; i++) {
            address payee = payees[i];
            uint256 share = shares[i];

            if (payee == address(0)) revert ZeroAddressPayee();
            if (_sharesOf[payee] != 0) revert DuplicatePayee(payee);
            if (share == 0) revert ZeroShares();

            _payees.push(payee);
            _shares.push(share);
            _sharesOf[payee] = share;
            total += share;
        }

        if (total != TOTAL_SHARE_UNITS) revert InvalidTotalShares(total);
        _totalShares = total;
    }

    /**
     * @notice Deposit native ETH into the revenue pool.
     */
    receive() external payable override {
        _totalReceived[address(0)] += msg.value;
        emit PaymentReceived(msg.sender, address(0), msg.value);
    }

    /**
     * @notice Deposit an ERC20 token into the revenue pool.
     */
    function depositERC20(address token, uint256 amount) external override {
        if (token == address(0)) revert InvalidToken();
        if (amount == 0) revert ZeroDeposit();

        _totalReceived[token] += amount;

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        emit PaymentReceived(msg.sender, token, amount);
    }

    /**
     * @notice Pull-based withdrawal for a payee's earned share of ETH or ERC20.
     * @dev Protected by ReentrancyGuard and SafeERC20.
     */
    function release(address payee, address token) external override nonReentrant {
        uint256 payment = pendingPayment(payee, token);
        if (payment == 0) revert NoPendingPayment();

        _released[token][payee] += payment;
        _totalReleased[token] += payment;

        if (token == address(0)) {
            (bool ok, ) = payable(payee).call{value: payment}("");
            if (!ok) revert ETHTransferFailed();
        } else {
            IERC20(token).safeTransfer(payee, payment);
        }

        emit PaymentReleased(payee, token, payment);
    }

    /**
     * @notice Calculate pending claimable payment for a payee and token.
     */
    function pendingPayment(address payee, address token) public view override returns (uint256) {
        if (_sharesOf[payee] == 0) return 0;
        uint256 totalReceivedForToken = _totalReceived[token];
        uint256 totalEntitled = (totalReceivedForToken * _sharesOf[payee]) / _totalShares;
        uint256 alreadyReleased = _released[token][payee];
        return totalEntitled > alreadyReleased ? totalEntitled - alreadyReleased : 0;
    }

    function totalReceived(address token) external view override returns (uint256) {
        return _totalReceived[token];
    }

    function totalReleased(address token) external view override returns (uint256) {
        return _totalReleased[token];
    }

    function getPayees() external view override returns (address[] memory) {
        return _payees;
    }

    function getShares() external view override returns (uint256[] memory) {
        return _shares;
    }

    function totalShares() external view override returns (uint256) {
        return _totalShares;
    }

    function sharesOf(address payee) external view returns (uint256) {
        return _sharesOf[payee];
    }

    function released(address payee, address token) external view returns (uint256) {
        return _released[token][payee];
    }
}
