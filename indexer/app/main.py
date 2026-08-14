from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pools, payees, health

app = FastAPI(
    title="PayPool Indexer REST API",
    description="Queryable indexer API for PayPool smart contracts",
    version="0.1.0"
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
    return {"message": "PayPool Indexer API is running", "docs": "/docs"}
