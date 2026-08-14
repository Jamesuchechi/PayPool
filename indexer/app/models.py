from sqlalchemy import Column, String, BigInteger, Numeric, Integer, DateTime, ForeignKey, UniqueConstraint
from app.database import Base

class Pool(Base):
    __tablename__ = "pools"

    address = Column(String, primary_key=True)
    creator = Column(String, nullable=False)
    name = Column(String, nullable=True)
    total_shares = Column(Numeric, nullable=False)
    block_created = Column(BigInteger, nullable=False)
    tx_hash = Column(String, nullable=False)

class Payee(Base):
    __tablename__ = "payees"

    pool_address = Column(String, ForeignKey("pools.address", ondelete="CASCADE"), primary_key=True)
    payee_address = Column(String, primary_key=True)
    shares = Column(Numeric, nullable=False)

class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    pool_address = Column(String, ForeignKey("pools.address", ondelete="CASCADE"), nullable=False)
    token = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    from_address = Column(String, nullable=False)
    tx_hash = Column(String, nullable=False)
    log_index = Column(Integer, nullable=False)
    block_number = Column(BigInteger, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)

    __table_args__ = (UniqueConstraint("tx_hash", "log_index", name="uq_deposit_tx_log"),)

class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    pool_address = Column(String, ForeignKey("pools.address", ondelete="CASCADE"), nullable=False)
    payee_address = Column(String, nullable=False)
    token = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    tx_hash = Column(String, nullable=False)
    log_index = Column(Integer, nullable=False)
    block_number = Column(BigInteger, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)

    __table_args__ = (UniqueConstraint("tx_hash", "log_index", name="uq_withdrawal_tx_log"),)

class IndexerState(Base):
    __tablename__ = "indexer_state"

    id = Column(Integer, primary_key=True, default=1)
    last_indexed_block = Column(BigInteger, nullable=False)
