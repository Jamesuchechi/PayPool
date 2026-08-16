from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import IndexerState
from app.services.indexer_service import indexer_service

router = APIRouter(tags=["health"])

@router.get("/health")
async def get_health(db: AsyncSession = Depends(get_db)):
    """
    Sync health status endpoint reporting last indexed block vs chain head, block lag, and operational status.
    """
    try:
        latest_chain_block = await indexer_service.get_latest_block_number()
    except Exception:
        latest_chain_block = 0

    stmt = select(IndexerState).where(IndexerState.id == 1)
    res = await db.execute(stmt)
    state = res.scalar_one_or_none()

    last_indexed = state.last_indexed_block if state else 0
    block_lag = max(0, latest_chain_block - last_indexed)
    lag_seconds = block_lag * 2  # Approx 2 seconds per block on Base Sepolia

    if latest_chain_block == 0:
        status = "degraded"
    elif block_lag <= 5:
        status = "healthy"
    else:
        status = "syncing"

    return {
        "last_indexed_block": last_indexed,
        "chain_head_block": latest_chain_block,
        "block_lag": block_lag,
        "lag_seconds": lag_seconds,
        "status": status
    }
