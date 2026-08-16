// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IPayPool
 * @notice Interface for PayPool autonomous revenue splitter contracts.
 */
interface IPayPool {
    // Custom Errors
    error LengthMismatch();
    error InvalidPayeeCount();
    error ZeroAddressPayee();
    error DuplicatePayee(address payee);
    error ZeroShares();
    error InvalidTotalShares(uint256 total);
    error AlreadyInitialized();
    error NoPendingPayment();
    error ZeroDeposit();
    error InvalidToken();
    error ETHTransferFailed();
    error ERC20TransferFailed();

    // Events
    event PaymentReceived(address indexed from, address indexed token, uint256 amount);
    event PaymentReleased(address indexed to, address indexed token, uint256 amount);

    // Initializer
    function initialize(address[] calldata payees, uint256[] calldata shares) external;

    // Deposits
    receive() external payable;
    function depositERC20(address token, uint256 amount) external;

    // Pull Payouts
    function release(address payee, address token) external;

    // View Functions
    function pendingPayment(address payee, address token) external view returns (uint256);
    function totalReceived(address token) external view returns (uint256);
    function totalReleased(address token) external view returns (uint256);
    function getPayees() external view returns (address[] memory);
    function getShares() external view returns (uint256[] memory);
    function totalShares() external view returns (uint256);
}
