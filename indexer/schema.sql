-- PayPool PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS pools (
    address         TEXT PRIMARY KEY,
    creator         TEXT NOT NULL,
    name            TEXT,
    total_shares    NUMERIC NOT NULL,
    block_created   BIGINT NOT NULL,
    tx_hash         TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payees (
    pool_address    TEXT REFERENCES pools(address) ON DELETE CASCADE,
    payee_address   TEXT NOT NULL,
    shares          NUMERIC NOT NULL,
    PRIMARY KEY (pool_address, payee_address)
);

CREATE TABLE IF NOT EXISTS deposits (
    id              BIGSERIAL PRIMARY KEY,
    pool_address    TEXT REFERENCES pools(address) ON DELETE CASCADE,
    token           TEXT NOT NULL,   -- '0x0000000000000000000000000000000000000000' for ETH
    amount          NUMERIC NOT NULL,
    from_address    TEXT NOT NULL,
    tx_hash         TEXT NOT NULL,
    log_index       INTEGER NOT NULL,
    block_number    BIGINT NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL,
    UNIQUE (tx_hash, log_index)
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id              BIGSERIAL PRIMARY KEY,
    pool_address    TEXT REFERENCES pools(address) ON DELETE CASCADE,
    payee_address   TEXT NOT NULL,
    token           TEXT NOT NULL,
    amount          NUMERIC NOT NULL,
    tx_hash         TEXT NOT NULL,
    log_index       INTEGER NOT NULL,
    block_number    BIGINT NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL,
    UNIQUE (tx_hash, log_index)
);

CREATE TABLE IF NOT EXISTS indexer_state (
    id                  INTEGER PRIMARY KEY DEFAULT 1,
    last_indexed_block  BIGINT NOT NULL,
    CHECK (id = 1)   -- single-row table
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deposits_pool ON deposits(pool_address);
CREATE INDEX IF NOT EXISTS idx_withdrawals_pool ON withdrawals(pool_address);
CREATE INDEX IF NOT EXISTS idx_payees_payee ON payees(payee_address);
