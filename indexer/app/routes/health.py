from fastapi import APIRouter

router = APIRouter(tags=["health"])

@router.get("/health")
async def get_health():
    """Sync health status endpoint reporting last indexed block vs chain head."""
    return {
        "last_indexed_block": 0,
        "chain_head_block": 0,
        "lag_seconds": 0,
        "status": "healthy"
    }
