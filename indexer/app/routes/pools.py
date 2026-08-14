from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/pools", tags=["pools"])

@router.get("")
async def list_pools():
    """List all deployed PayPool instances."""
    return []

@router.get("/{address}")
async def get_pool(address: str):
    """Get detail for a specific PayPool instance."""
    return {"address": address, "name": "PayPool Instance", "payees": [], "total_received": {}}

@router.get("/{address}/deposits")
async def get_pool_deposits(address: str):
    """Get deposit history for a pool."""
    return []

@router.get("/{address}/withdrawals")
async def get_pool_withdrawals(address: str):
    """Get withdrawal history for a pool."""
    return []
