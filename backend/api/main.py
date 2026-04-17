from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from actian_vectorai import VectorAIClient, VectorParams, Distance, PointStruct, Field, FilterBuilder
from sentence_transformers import SentenceTransformer
import logging

import os

# Konfigurasi aplikasi & model
app = FastAPI(
    title="MedEdge AI API", 
    description="Offline Medical Knowledge Assistant powered by Actian VectorAI DB",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
DB_HOST = os.getenv("VECTOR_DB_HOST", "localhost:50051")
COLLECTION_NAME = "medical_knowledge"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
VECTOR_SIZE = 384

# Global vars for Lazy Loading
model = None

logger = logging.getLogger("uvicorn")

class SearchRequest(BaseModel):
    query: str
    specialty: Optional[str] = None
    urgency: Optional[str] = None
    use_hybrid: bool = True
    limit: int = 5

class SearchResponse(BaseModel):
    id: str
    score: float
    payload: Dict[str, Any]

@app.on_event("startup")
def startup_event():
    global model
    logger.info("Memulai MedEdge AI API Edge Server...")
    
    # 1. Load Embedding Model
    logger.info(f"Loading lokal model {EMBEDDING_MODEL_NAME}...")
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    
    # 2. Check Database & Setup Collection
    logger.info(f"Checking Actian VectorAI DB at {DB_HOST}...")
    try:
        with VectorAIClient(DB_HOST) as client:
            info = client.health_check()
            logger.info(f"Berhasil terkoneksi ke {info['title']} v{info['version']}")
            
            if not client.collections.exists(COLLECTION_NAME):
                logger.info(f"Creating collection '{COLLECTION_NAME}'...")
                client.collections.create(
                    COLLECTION_NAME,
                    vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.Cosine)
                )
                logger.info("Collection berhasil dibuat.")
    except Exception as e:
        logger.error(f"Gagal koneksi ke database: {e}")
        
@app.on_event("shutdown")
def shutdown_event():
    logger.info("Menutup Edge Server...")

@app.get("/health")
def health_check():
    engine_status = False
    total_docs = 0
    try:
        with VectorAIClient(DB_HOST) as client:
            client.health_check()
            engine_status = True
            total_docs = client.points.count(COLLECTION_NAME)
    except:
        pass
    return {"status": "ok", "db_connected": engine_status, "total_docs": total_docs, "offline_ready": True}

@app.post("/api/search", response_model=List[SearchResponse])
def search_medical_knowledge(req: SearchRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model belum siap.")
        
    logger.info(f"Menerima query pencarian: '{req.query}'")
    
    # 1. Buat Filter (Filtered Search - Juri requirement!)
    filter_builder = FilterBuilder()
    apply_filter = False
    
    if req.specialty and req.specialty != "All":
        filter_builder = filter_builder.must(Field("specialty").eq(req.specialty))
        apply_filter = True
    
    if req.urgency and req.urgency != "All":
        filter_builder = filter_builder.must(Field("urgency").eq(req.urgency))
        apply_filter = True
        
    db_filter = filter_builder.build() if apply_filter else None
    
    # 2. Hasilkan Embedding (Dense Vector) secara lokal (Offline mode)
    query_vector = model.encode(req.query).tolist()
    
    try:
        with VectorAIClient(DB_HOST) as db_client:
            # Base Semantic Search (Dense Vector)
            results = db_client.points.search(
                COLLECTION_NAME, 
                vector=query_vector, 
                limit=req.limit * 2, # Fetch more for re-ranking 
                filter=db_filter
            )

        final_results = []
        query_terms = req.query.lower().split()

        for r in results:
            score = float(r.score)
            
            if req.use_hybrid:
                # PSEUDO-RRF (Reciprocal Rank Fusion) / Hybrid Keyword Boost
                # We boost the score if exact keywords are found in the content or title (BM25 simulation)
                content_lower = r.payload.get('content', '').lower()
                title_lower = r.payload.get('title', '').lower()
                
                keyword_matches = sum(1 for term in query_terms if term in content_lower or term in title_lower)
                
                if keyword_matches > 0:
                    # Boost score based on keyword matches, capped at 0.99
                    boost = 0.05 * keyword_matches
                    score = min(0.99, score + boost)
            
            final_results.append({
                "id": str(r.id),
                "score": score,
                "payload": r.payload
            })
            
        # Re-sort after hybrid boost and apply original limit
        final_results.sort(key=lambda x: x["score"], reverse=True)
        final_results = final_results[:req.limit]

        # Format to SearchResponse
        return [
            SearchResponse(id=r["id"], score=r["score"], payload=r["payload"]) 
            for r in final_results
        ]
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
