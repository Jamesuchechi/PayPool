import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pools, payees, health
from app.services.indexer_service import indexer_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("paypool_app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting PayPool Indexer background listener task...")
    indexer_task = asyncio.create_task(indexer_service.run_indexing_loop())
    yield
    logger.info("Stopping PayPool Indexer background listener task...")
    indexer_task.cancel()

app = FastAPI(
    title="PayPool Indexer REST API",
    description="Queryable indexer API for PayPool smart contracts",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(pools.router)
app.include_router(payees.router)

@app.get("/")
async def root():
    return {
        "message": "PayPool Indexer API is operational",
        "docs": "/docs",
        "health": "/health"
    }
