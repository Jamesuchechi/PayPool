import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    rpc_url: str = os.getenv("RPC_URL", "https://sepolia.base.org")
    database_url: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/paypool")
    factory_address: str = os.getenv("FACTORY_ADDRESS", "0x0000000000000000000000000000000000000000")
    chain_id: int = int(os.getenv("CHAIN_ID", "84532"))
    confirmation_depth: int = int(os.getenv("CONFIRMATION_DEPTH", "5"))
    poll_interval_seconds: int = int(os.getenv("POLL_INTERVAL_SECONDS", "15"))
    batch_size: int = int(os.getenv("BATCH_SIZE", "2000"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
