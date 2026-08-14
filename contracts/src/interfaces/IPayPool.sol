// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPayPool {
    event PaymentReceived(address indexed from, address indexed token, uint256 amount);
    event PaymentReleased(address indexed to, address indexed token, uint256 amount);

    function initialize(address[] calldata payees, uint256[] calldata shares) external;

    receive() external payable;
    function depositERC20(address token, uint256 amount) external;

    function release(address payee, address token) external;

    function pendingPayment(address payee, address token) external view returns (uint256);
    function totalReceived(address token) external view returns (uint256);
    function totalReleased(address token) external view returns (uint256);
    function getPayees() external view returns (address[] memory);
    function getShares() external view returns (uint256[] memory);
    function totalShares() external view returns (uint256);
}
