import json
import logging
from sentence_transformers import SentenceTransformer
from actian_vectorai import VectorAIClient, VectorParams, Distance, PointStruct

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MedEdge_Ingestion")

# Configuration
DB_HOST = "localhost:50051"
COLLECTION_NAME = "medical_knowledge"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
DATA_FILE = "data/medical_sample.json"

def init_db(client: VectorAIClient):
    """Pastikan collection siap. Ini mendemonstrasikan Actian DB setup."""
    if not client.collections.exists(COLLECTION_NAME):
        logger.info(f"📍 Collection {COLLECTION_NAME} tidak ditemukan. Membuat baru...")
        client.collections.create(
            COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.Cosine)
        )
        logger.info("✅ Collection berhasil dibuat!")
    else:
        logger.info(f"📍 Collection {COLLECTION_NAME} sudah ada.")

def seed_data():
    logger.info("🚀 Memulai proses ingestion untuk MedEdge AI (Offline Mode)")
    
    # 1. Load Local Model (tanpa API Cloud - Syarat Hackathon Local Mode)
    logger.info(f"🔄 Memuat model lokal: {EMBEDDING_MODEL}")
    model = SentenceTransformer(EMBEDDING_MODEL)
    
    # 2. Baca file data json offline
    logger.info(f"📖 Membaca data knowledge base medis dari {DATA_FILE}")
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"❌ Gagal membaca {DATA_FILE}: {e}")
        return

    # 3. Connect ke Actian VectorAI DB & Masukkan Data
    try:
        with VectorAIClient(DB_HOST) as client:
            init_db(client)
            
            points = []
            logger.info("🧬 Melakukan embedding (vektorisasi) dokumen medis...")
            for item in data:
                # Kita vektorisasi konten utamanya
                text_to_embed = f"Title: {item['title']}. Content: {item['content']}"
                vector = model.encode(text_to_embed).tolist()
                
                # Buat point untuk VectorAI DB, simpan metadata untuk Filtered Search
                point = PointStruct(
                    id=item['id'],
                    vector=vector,
                    payload={
                        "title": item['title'],
                        "specialty": item['specialty'],
                        "urgency": item['urgency'],
                        "content": item['content']
                    }
                )
                points.append(point)
            
            logger.info(f"💾 Memasukkan {len(points)} dokumen ke Actian VectorAI DB...")
            # Demonstrasi Batch Upsert Actian
            client.points.upsert(COLLECTION_NAME, points)
            
            # Verifikasi
            count = client.points.count(COLLECTION_NAME)
            logger.info(f"✅ Ingestion Selesai! Total dokumen di database: {count}")
            
    except Exception as e:
        logger.error(f"❌ Terjadi kesalahan pada Actian client: {e}")

if __name__ == "__main__":
    seed_data()
