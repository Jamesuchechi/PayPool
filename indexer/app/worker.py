import asyncio
import logging
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def startup(ctx):
    logger.info("Initializing PayPool ARQ event indexer worker...")

async def shutdown(ctx):
    logger.info("Shutting down PayPool indexer worker.")

async def index_events_task(ctx):
    logger.info("Polling for new chain logs...")
    # Event polling & backfill logic scaffold

class WorkerSettings:
    functions = [index_events_task]
    on_startup = startup
    on_shutdown = shutdown
    cron_jobs = []
