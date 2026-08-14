// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IPayPool.sol";

/**
 * @title PayPool
 * @notice Cloned minimal proxy revenue splitter supporting ETH and ERC20 pull payouts.
 */
contract PayPool is IPayPool {
    uint256 public constant TOTAL_SHARE_UNITS = 10_000;

    bool private _initialized;
    address[] private _payees;
    uint256[] private _shares;
    uint256 private _totalShares;

    mapping(address => uint256) private _sharesOf;
    mapping(address => uint256) private _totalReceived;
    mapping(address => uint256) private _totalReleased;
    mapping(address => mapping(address => uint256)) private _released; // token => payee => amount

    modifier initializer() {
        require(!_initialized, "PayPool: already initialized");
        _initialized = true;
        _;
    }

    function initialize(address[] calldata payees, uint256[] calldata shares) external initializer {
        require(payees.length == shares.length, "PayPool: length mismatch");
        require(payees.length >= 2 && payees.length <= 20, "PayPool: payee count out of bounds");

        uint256 total = 0;
        for (uint256 i = 0; i < payees.length; i++) {
            address payee = payees[i];
            uint256 share = shares[i];

            require(payee != address(0), "PayPool: zero payee address");
            require(_sharesOf[payee] == 0, "PayPool: duplicate payee");
            require(share > 0, "PayPool: zero shares");

            _payees.push(payee);
            _shares.push(share);
            _sharesOf[payee] = share;
            total += share;
        }

        require(total == TOTAL_SHARE_UNITS, "PayPool: shares must sum to 10000");
        _totalShares = total;
    }

    receive() external payable override {
        _totalReceived[address(0)] += msg.value;
        emit PaymentReceived(msg.sender, address(0), msg.value);
    }

    function depositERC20(address token, uint256 amount) external override {
        require(token != address(0), "PayPool: invalid token");
        require(amount > 0, "PayPool: zero deposit");
        _totalReceived[token] += amount;
        emit PaymentReceived(msg.sender, token, amount);
    }

    function release(address payee, address token) external override {
        uint256 payment = pendingPayment(payee, token);
        require(payment > 0, "PayPool: no pending funds");

        _released[token][payee] += payment;
        _totalReleased[token] += payment;

        if (token == address(0)) {
            (bool success, ) = payee.call{value: payment}("");
            require(success, "PayPool: ETH transfer failed");
        } else {
            // ERC20 transfer placeholder
        }

        emit PaymentReleased(payee, token, payment);
    }

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
}
