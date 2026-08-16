from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Pool, Payee, Deposit, Withdrawal

router = APIRouter(prefix="/pools", tags=["pools"])

@router.get("")
async def list_pools(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    creator: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    List all deployed PayPool instances with pagination and optional creator filtering.
    """
    stmt = select(Pool)
    if creator:
        stmt = stmt.where(func.lower(Pool.creator) == creator.lower())
    
    stmt = stmt.order_by(desc(Pool.block_created)).limit(limit).offset(offset)
    res = await db.execute(stmt)
    pools = res.scalars().all()

    result = []
    for p in pools:
        # Fetch payees
        payees_stmt = select(Payee).where(Payee.pool_address == p.address)
        payees_res = await db.execute(payees_stmt)
        payees = payees_res.scalars().all()

        result.append({
            "address": p.address,
            "name": p.name,
            "creator": p.creator,
            "total_shares": int(p.total_shares),
            "block_created": p.block_created,
            "tx_hash": p.tx_hash,
            "payees": [
                {"address": payee.payee_address, "shares": int(payee.shares)}
                for payee in payees
            ]
        })

    return {
        "total": len(result),
        "limit": limit,
        "offset": offset,
        "data": result
    }

@router.get("/{address}")
async def get_pool(address: str, db: AsyncSession = Depends(get_db)):
    """
    Get detailed breakdown for a specific PayPool instance.
    """
    stmt = select(Pool).where(func.lower(Pool.address) == address.lower())
    res = await db.execute(stmt)
    pool = res.scalar_one_or_none()

    if not pool:
        raise HTTPException(status_code=404, detail="Pool contract address not found")

    # Payees
    payees_stmt = select(Payee).where(Payee.pool_address == pool.address)
    payees_res = await db.execute(payees_stmt)
    payees = payees_res.scalars().all()

    # Deposit totals per token
    dep_stmt = select(
        Deposit.token,
        func.sum(Deposit.amount).label("total")
    ).where(Deposit.pool_address == pool.address).group_by(Deposit.token)
    dep_res = await db.execute(dep_stmt)
    deposits_summary = {row.token: str(row.total) for row in dep_res.all()}

    # Withdrawal totals per token
    with_stmt = select(
        Withdrawal.token,
        func.sum(Withdrawal.amount).label("total")
    ).where(Withdrawal.pool_address == pool.address).group_by(Withdrawal.token)
    with_res = await db.execute(with_stmt)
    withdrawals_summary = {row.token: str(row.total) for row in with_res.all()}

    return {
        "address": pool.address,
        "name": pool.name,
        "creator": pool.creator,
        "total_shares": int(pool.total_shares),
        "block_created": pool.block_created,
        "tx_hash": pool.tx_hash,
        "payees": [
            {"address": payee.payee_address, "shares": int(payee.shares)}
            for payee in payees
        ],
        "total_received": deposits_summary,
        "total_released": withdrawals_summary
    }

@router.get("/{address}/deposits")
async def get_pool_deposits(
    address: str,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    token: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Get paginated deposit transaction history for a pool.
    """
    stmt = select(Deposit).where(func.lower(Deposit.pool_address) == address.lower())
    if token:
        stmt = stmt.where(func.lower(Deposit.token) == token.lower())

    stmt = stmt.order_by(desc(Deposit.block_number), desc(Deposit.log_index)).limit(limit).offset(offset)
    res = await db.execute(stmt)
    deposits = res.scalars().all()

    return {
        "pool_address": address,
        "limit": limit,
        "offset": offset,
        "deposits": [
            {
                "id": d.id,
                "token": d.token,
                "amount": str(d.amount),
                "from_address": d.from_address,
                "tx_hash": d.tx_hash,
                "log_index": d.log_index,
                "block_number": d.block_number,
                "timestamp": d.timestamp.isoformat() if d.timestamp else None
            }
            for d in deposits
        ]
    }

@router.get("/{address}/withdrawals")
async def get_pool_withdrawals(
    address: str,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    payee: Optional[str] = None,
    token: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Get paginated withdrawal transaction history for a pool.
    """
    stmt = select(Withdrawal).where(func.lower(Withdrawal.pool_address) == address.lower())
    if payee:
        stmt = stmt.where(func.lower(Withdrawal.payee_address) == payee.lower())
    if token:
        stmt = stmt.where(func.lower(Withdrawal.token) == token.lower())

    stmt = stmt.order_by(desc(Withdrawal.block_number), desc(Withdrawal.log_index)).limit(limit).offset(offset)
    res = await db.execute(stmt)
    withdrawals = res.scalars().all()

    return {
        "pool_address": address,
        "limit": limit,
        "offset": offset,
        "withdrawals": [
            {
                "id": w.id,
                "payee_address": w.payee_address,
                "token": w.token,
                "amount": str(w.amount),
                "tx_hash": w.tx_hash,
                "log_index": w.log_index,
                "block_number": w.block_number,
                "timestamp": w.timestamp.isoformat() if w.timestamp else None
            }
            for w in withdrawals
        ]
    }
