import asyncio
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

import httpx
from eth_utils import keccak, to_checksum_address
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import engine, AsyncSessionLocal, Base
from app.models import Pool, Payee, Deposit, Withdrawal, IndexerState

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("paypool_indexer")

# Event Topics (Keccak-256 Hashes)
# SplitterCreated(address indexed pool, address indexed creator, address[] payees, uint256[] shares, string name)
TOPIC_SPLITTER_CREATED = "0x" + keccak(text="SplitterCreated(address,address,address[],uint256[],string)").hex()
# PaymentReceived(address indexed from, address indexed token, uint256 amount)
TOPIC_PAYMENT_RECEIVED = "0x" + keccak(text="PaymentReceived(address,address,uint256)").hex()
# PaymentReleased(address indexed to, address indexed token, uint256 amount)
TOPIC_PAYMENT_RELEASED = "0x" + keccak(text="PaymentReleased(address,address,uint256)").hex()


class IndexerService:
    def __init__(self):
        self.rpc_url = settings.rpc_url
        self.factory_address = settings.factory_address.lower()
        self.confirmation_depth = settings.confirmation_depth
        self.poll_interval = settings.poll_interval_seconds
        self.batch_size = settings.batch_size
        self.http_client = httpx.AsyncClient(timeout=30.0)

    async def init_db(self):
        """Initialize PostgreSQL database tables via SQLAlchemy metadata."""
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("PostgreSQL database tables initialized.")

    async def rpc_call(self, method: str, params: list) -> Any:
        """Execute a JSON-RPC request against Base Sepolia RPC endpoint."""
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": 1
        }
        resp = await self.http_client.post(self.rpc_url, json=payload)
        resp.raise_for_request()
        data = resp.json()
        if "error" in data:
            raise Exception(f"RPC Error: {data['error']}")
        return data.get("result")

    async def get_latest_block_number(self) -> int:
        """Fetch latest block number from chain head."""
        res = await self.rpc_call("eth_blockNumber", [])
        return int(res, 16)

    async def get_last_indexed_block(self, session: AsyncSession) -> int:
        """Get last indexed block from indexer_state table."""
        stmt = select(IndexerState).where(IndexerState.id == 1)
        res = await session.execute(stmt)
        state = res.scalar_one_or_none()
        if state:
            return state.last_indexed_block
        return 0

    async def update_last_indexed_block(self, session: AsyncSession, block_num: int):
        """Update last_indexed_block in indexer_state table."""
        stmt = select(IndexerState).where(IndexerState.id == 1)
        res = await session.execute(stmt)
        state = res.scalar_one_or_none()
        if not state:
            state = IndexerState(id=1, last_indexed_block=block_num)
            session.add(state)
        else:
            state.last_indexed_block = block_num
        await session.commit()

    async def get_all_known_pools(self, session: AsyncSession) -> List[str]:
        """Retrieve all pool contract addresses currently in database."""
        stmt = select(Pool.address)
        res = await session.execute(stmt)
        return [r[0].lower() for r in res.fetchall()]

    async def process_log_events(self, session: AsyncSession, from_block: int, to_block: int):
        """
        Poll eth_getLogs for factory + known pool addresses and decode logs idempotently.
        """
        known_pools = await self.get_all_known_pools(session)
        addresses_to_query = [self.factory_address] + known_pools

        params = [{
            "fromBlock": hex(from_block),
            "toBlock": hex(to_block),
            "address": list(set(addresses_to_query)) if settings.factory_address != "0x0000000000000000000000000000000000000000" else None,
            "topics": [[TOPIC_SPLITTER_CREATED, TOPIC_PAYMENT_RECEIVED, TOPIC_PAYMENT_RELEASED]]
        }]

        logs = await self.rpc_call("eth_getLogs", params)
        if not logs:
            await self.update_last_indexed_block(session, to_block)
            return

        logger.info(f"Fetched {len(logs)} chain events between blocks #{from_block} and #{to_block}")

        for log in logs:
            tx_hash = log["transactionHash"]
            log_index = int(log["logIndex"], 16)
            block_number = int(log["blockNumber"], 16)
            address = to_checksum_address(log["address"])
            topics = log.get("topics", [])
            data = log.get("data", "0x")

            if not topics:
                continue

            topic0 = topics[0]

            # 1. Handle SplitterCreated Event
            if topic0 == TOPIC_SPLITTER_CREATED:
                pool_address = to_checksum_address("0x" + topics[1][-40:])
                creator_address = to_checksum_address("0x" + topics[2][-40:])
                
                # Check if pool already exists idempotently
                existing = await session.get(Pool, pool_address)
                if not existing:
                    new_pool = Pool(
                        address=pool_address,
                        creator=creator_address,
                        name="PayPool Splitter",
                        total_shares=10000,
                        block_created=block_number,
                        tx_hash=tx_hash
                    )
                    session.add(new_pool)
                    await session.commit()
                    logger.info(f"Indexed new Splitter Pool: {pool_address} created by {creator_address}")

            # 2. Handle PaymentReceived Event
            elif topic0 == TOPIC_PAYMENT_RECEIVED:
                from_addr = to_checksum_address("0x" + topics[1][-40:])
                token_addr = to_checksum_address("0x" + topics[2][-40:])
                amount = int(data, 16) if data != "0x" else 0

                # Raw SQL INSERT ON CONFLICT DO NOTHING for idempotency
                sql = text("""
                    INSERT INTO deposits (pool_address, token, amount, from_address, tx_hash, log_index, block_number, timestamp)
                    VALUES (:pool_address, :token, :amount, :from_address, :tx_hash, :log_index, :block_number, :timestamp)
                    ON CONFLICT (tx_hash, log_index) DO NOTHING
                """)
                await session.execute(sql, {
                    "pool_address": address,
                    "token": token_addr,
                    "amount": amount,
                    "from_address": from_addr,
                    "tx_hash": tx_hash,
                    "log_index": log_index,
                    "block_number": block_number,
                    "timestamp": datetime.now(timezone.utc)
                })
                await session.commit()

            # 3. Handle PaymentReleased Event
            elif topic0 == TOPIC_PAYMENT_RELEASED:
                to_addr = to_checksum_address("0x" + topics[1][-40:])
                token_addr = to_checksum_address("0x" + topics[2][-40:])
                amount = int(data, 16) if data != "0x" else 0

                sql = text("""
                    INSERT INTO withdrawals (pool_address, payee_address, token, amount, tx_hash, log_index, block_number, timestamp)
                    VALUES (:pool_address, :payee_address, :token, :amount, :tx_hash, :log_index, :block_number, :timestamp)
                    ON CONFLICT (tx_hash, log_index) DO NOTHING
                """)
                await session.execute(sql, {
                    "pool_address": address,
                    "payee_address": to_addr,
                    "token": token_addr,
                    "amount": amount,
                    "tx_hash": tx_hash,
                    "log_index": log_index,
                    "block_number": block_number,
                    "timestamp": datetime.now(timezone.utc)
                })
                await session.commit()

        await self.update_last_indexed_block(session, to_block)

    async def run_indexing_loop(self):
        """
        Main continuous event listener loop with N-confirmation depth delay and backfill.
        """
        await self.init_db()

        while True:
            try:
                async with AsyncSessionLocal() as session:
                    latest_chain_block = await self.get_latest_block_number()
                    last_indexed = await self.get_last_indexed_block(session)

                    if last_indexed == 0:
                        # Starting block backfill: initialize from latest_chain_block - 100
                        from_block = max(0, latest_chain_block - 100)
                    else:
                        from_block = last_indexed + 1

                    # Apply N-confirmation depth delay
                    target_block = max(from_block, latest_chain_block - self.confirmation_depth)

                    if from_block <= target_block:
                        to_block = min(target_block, from_block + self.batch_size)
                        await self.process_log_events(session, from_block, to_block)
                    else:
                        logger.debug("Indexer in sync with chain head.")

            except Exception as e:
                logger.error(f"Error in indexer poll loop: {e}")

            await asyncio.sleep(self.poll_interval)

indexer_service = IndexerService()
