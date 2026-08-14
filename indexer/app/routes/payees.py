from fastapi import APIRouter

router = APIRouter(prefix="/payees", tags=["payees"])

@router.get("/{address}/earnings")
async def get_payee_earnings(address: str):
    """Aggregate earnings across all pools for a specific payee address."""
    return {"address": address, "pools": []}
