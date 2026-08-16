from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Pool, Payee, Deposit, Withdrawal

router = APIRouter(prefix="/payees", tags=["payees"])

@router.get("/{address}/earnings")
async def get_payee_earnings(address: str, db: AsyncSession = Depends(get_db)):
    """
    Aggregate earnings report across ALL pools where payee_address is a recipient.
    Computes total received per pool, entitlement based on share basis points, released payouts, and pending balance.
    """
    # 1. Find all pools where payee is registered
    payee_stmt = select(Payee).where(func.lower(Payee.payee_address) == address.lower())
    payee_res = await db.execute(payee_stmt)
    payee_records = payee_res.scalars().all()

    pool_earnings = []
    total_aggregate_pending = {}
    total_aggregate_released = {}

    for rec in payee_records:
        pool_stmt = select(Pool).where(Pool.address == rec.pool_address)
        pool_res = await db.execute(pool_stmt)
        pool = pool_res.scalar_one_or_none()
        if not pool:
            continue

        shares_bps = int(rec.shares)
        share_ratio = shares_bps / 10000.0

        # Deposits for pool
        dep_stmt = select(
            Deposit.token,
            func.sum(Deposit.amount).label("total")
        ).where(Deposit.pool_address == pool.address).group_by(Deposit.token)
        dep_res = await db.execute(dep_stmt)
        deposits_by_token = {row.token: float(row.total) for row in dep_res.all()}

        # Withdrawals by payee for pool
        with_stmt = select(
            Withdrawal.token,
            func.sum(Withdrawal.amount).label("total")
        ).where(
            Withdrawal.pool_address == pool.address,
            func.lower(Withdrawal.payee_address) == address.lower()
        ).group_by(Withdrawal.token)
        with_res = await db.execute(with_stmt)
        released_by_token = {row.token: float(row.total) for row in with_res.all()}

        pool_token_breakdown = {}
        for token, total_rec in deposits_by_token.items():
            entitled = total_rec * share_ratio
            released = released_by_token.get(token, 0.0)
            pending = max(0.0, entitled - released)

            pool_token_breakdown[token] = {
                "total_received": str(total_rec),
                "entitled": str(entitled),
                "released": str(released),
                "pending": str(pending)
            }

            total_aggregate_pending[token] = total_aggregate_pending.get(token, 0.0) + pending
            total_aggregate_released[token] = total_aggregate_released.get(token, 0.0) + released

        pool_earnings.append({
            "pool_address": pool.address,
            "pool_name": pool.name,
            "shares": shares_bps,
            "share_percentage": f"{(shares_bps / 100.0):.1f}%",
            "tokens": pool_token_breakdown
        })

    return {
        "payee_address": address,
        "total_pools": len(pool_earnings),
        "aggregate_pending": {k: str(v) for k, v in total_aggregate_pending.items()},
        "aggregate_released": {k: str(v) for k, v in total_aggregate_released.items()},
        "pools": pool_earnings
    }
