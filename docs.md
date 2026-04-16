# 🏆 Actian VectorAI DB Build Challenge — Ultimate Deep Analysis & Winning Blueprint

> **Tujuan Dokumen**: Memberikan analisis paling lengkap dari kompetisi, teknologi yang digunakan, referensi teknis, contoh kode API, dan strategi eksekusi langkah-demi-langkah agar Anda bisa menjadi **Juara 1**.

---

## 📋 Table of Contents

1. [Ringkasan Kompetisi](#1-ringkasan-kompetisi)
2. [Bobot Penilaian Juri (Dissected)](#2-bobot-penilaian-juri-dissected)
3. [Apa itu Actian VectorAI DB? (Penjelasan Teknis)](#3-apa-itu-actian-vectorai-db)
4. [Referensi & Resource Lengkap](#4-referensi--resource-lengkap)
5. [API Reference & Contoh Kode](#5-api-reference--contoh-kode)
6. [Ide Proyek Juara 1 (Rekomendasi Final)](#6-ide-proyek-juara-1-rekomendasi-final)
7. [Action Plan Eksekusi Per-Jam](#7-action-plan-eksekusi-per-jam)
8. [Script Video Demo (Template Siap Pakai)](#8-script-video-demo)
9. [Checklist Submission](#9-checklist-submission)

---

## 1. Ringkasan Kompetisi

| Item | Detail |
|------|--------|
| **Nama** | Actian VectorAI DB Build Challenge |
| **Platform** | [DoraHacks Hackathon #2097](https://dorahacks.io/hackathon/2097/detail) |
| **Mode** | Virtual (online) |
| **Periode** | 13 April – 18 April 2026 |
| **Deadline Submission** | **18 April 2026, 16:00 UTC** (= **23:00 WIB**) |
| **Pengumuman Juara** | 20 April 2026 |
| **Tim** | Solo diperbolehkan, maks 4 anggota |

### Hadiah
| Peringkat | Hadiah |
|-----------|--------|
| 🥇 Juara 1 | 3 bulan **Claude Max 5x** per orang |
| 🥈 Juara 2 | 1 bulan **Claude Max 5x** per orang |
| 🥉 Juara 3 | 1 bulan **Claude Pro** per orang |

### Syarat Submission
- ✅ Link **repository publik** (GitHub / GitLab / Bitbucket)
- ✅ **Demo video** end-to-end (bukan hanya screenshot)
- ✅ **README** yang menjelaskan cara menjalankan proyek (minimal 1 command)
- ✅ Menggunakan **fitur lanjutan** VectorAI DB (Hybrid Fusion / Filtered Search / Named Vectors)

---

## 2. Bobot Penilaian Juri (Dissected)

### 2.1 Penggunaan Actian VectorAI DB — 30% (TERBESAR!)

**Apa yang juri cari:**
- VectorAI DB sebagai **komponen inti** (bukan tambahan/opsional)
- Menggunakan minimal **1 fitur lanjutan** (WAJIB):

| Fitur | Penjelasan | Kapan Digunakan |
|-------|------------|-----------------|
| **Hybrid Fusion** | Menggabungkan hasil Dense Vector Search (semantik) + Sparse/Keyword Search. Algoritma: RRF (Reciprocal Rank Fusion) atau DBSF (Distribution-Based Score Fusion) | Ketika pencarian semantic saja kurang akurat untuk nama spesifik/kode/singkatan |
| **Filtered Search** | Pencarian vektor + filter metadata (harga, kategori, tanggal, lokasi) | Ketika user ingin mempersempit hasil berdasarkan atribut struktural |
| **Named Vectors / Multimodal** | Satu entitas data punya >1 vektor (misal: vektor teks + vektor gambar) | Ketika data Anda punya beberapa representasi semantik berbeda |

**Strategi Menang:**
- Buat **narasi perbandingan**: "Tanpa hybrid, hasilnya X (jelek). Dengan hybrid, hasilnya Y (akurat)" — tunjukkan ini di video demo!
- Tampilkan minimal **2-3 skenario query** berbeda

### 2.2 Real-World Impact — 25%

**Apa yang juri cari:**
- Masalah **nyata** yang diselesaikan
- Persona pengguna yang jelas (siapa yang pakai?)
- Bukti bahwa solusi ini **useful** (bukan mainan)

**Strategi Menang:**
- Pilih domain yang regulated/sensitif (medis, finansial, logistik, keamanan) — ini selaras dengan keunggulan Actian di privasi & edge
- Buat format: **"Pain → Solution → Proof"**

### 2.3 Technical Execution — 25%

**Apa yang juri cari:**
- Sistem **benar-benar berjalan** (bukan mockup)
- Arsitektur kode yang **bersih dan koheren**
- Pipeline end-to-end: Ingestion → Indexing → Query → Post-processing → UX

**Strategi Menang:**
- Struktur folder yang rapi (terpisah antara `ingestion/`, `search/`, `api/`, `frontend/`)
- Error handling & logging minimal
- `README.md` yang sangat jelas

### 2.4 Demo & Presentation — 20%

**Format video yang disarankan (5-7 menit):**

| Waktu | Konten |
|-------|--------|
| 0:00–0:30 | Masalah + Persona pengguna |
| 0:30–1:30 | Overview arsitektur (1 diagram sederhana) |
| 1:30–3:30 | Demo retrieval (2 skenario query berbeda) |
| 3:30–4:30 | Tunjukkan nilai tambah fitur (filtered/hybrid) |
| 4:30–5:30 | UX end-to-end |
| 5:30–6:30 | Status deploy (lokal/ARM/offline) |

### 2.5 Bonus Points (Discretionary) — DIFFERENTIATOR!

| Bonus | Cara Membuktikan |
|-------|-----------------|
| **Local Deployment** | Tunjukkan `docker compose up` tanpa cloud dependency |
| **ARM Support** | Jalankan di Mac M-Series / Raspberry Pi (Docker image sudah multi-arch!) |
| **Offline Mode** | Aktifkan Airplane Mode lalu jalankan query — SANGAT IMPACTFUL di video! |

---

## 3. Apa itu Actian VectorAI DB?

### 3.1 Konsep Dasar (Untuk Belajar)

**Vector Database** adalah database khusus untuk aplikasi AI yang mencari berdasarkan **makna (semantik)**, bukan kata kunci eksak.

```
🔹 Database Biasa:     "Cari produk dengan nama 'laptop'"
🔹 Vector Database:    "Cari produk yang mirip 'komputer portabel untuk mahasiswa'"
```

**Cara Kerja:**
1. Data Anda (teks/gambar/kode) diubah menjadi **vektor** (array angka) oleh model embedding
2. Vektor ini merepresentasikan **makna** dari data tersebut
3. VectorAI DB menyimpan dan mengindeks vektor-vektor ini
4. Saat Anda mencari, query juga diubah jadi vektor, lalu dicari yang **paling mirip**

> ⚠️ **PENTING**: VectorAI DB **TIDAK** menyertakan model embedding. Anda harus bring-your-own (misal: `sentence-transformers`). DB ini hanya menangani **storage & search** — Anda yang menangani embedding.

### 3.2 Keunggulan Utama Actian VectorAI DB

| Keunggulan | Penjelasan |
|------------|------------|
| **Edge-Native** | Dirancang untuk berjalan **tanpa cloud**. Bisa di laptop, Raspberry Pi, data center |
| **Sub-15ms Latency** | Query lokal sangat cepat karena tidak ada round-trip ke cloud |
| **Multi-Arch Docker** | Image Docker otomatis pilih arsitektur yang benar (amd64 / arm64) |
| **HNSW Indexing** | Algoritma indexing teroptimasi untuk recall tinggi dan load time cepat |
| **Real-time Indexing** | Update data langsung tersedia (tanpa eventual consistency delay) |
| **Enterprise Security** | Enkripsi at-rest & in-transit, GDPR/HIPAA compliant |
| **LangChain + LlamaIndex** | Integrasi native dengan framework AI populer |

### 3.3 Model Embedding yang Direkomendasikan

| Model | Dimensi | Tujuan | Speed |
|-------|---------|--------|-------|
| `sentence-transformers/all-MiniLM-L6-v2` | 384d | Teks umum (default terbaik) | ⚡ Cepat |
| `sentence-transformers/all-mpnet-base-v2` | 768d | Teks kualitas tinggi | 🐢 Sedang |
| `BAAI/bge-small-en-v1.5` | 384d | Rasio kualitas/kecepatan terbaik | ⚡ Cepat |
| `openai/clip-vit-base-patch32` | 512d | **Multimodal** (teks + gambar) | 🐢 Sedang |
| `microsoft/codebert-base` | 768d | Pencarian kode | 🐢 Sedang |

---

## 4. Referensi & Resource Lengkap

### 4.1 Link Wajib Buka

| Resource | URL | Fungsi |
|----------|-----|--------|
| 🏠 Halaman Hackathon | https://dorahacks.io/hackathon/2097/detail | Submission & aturan resmi |
| 📦 Starter Repo (GitHub) | https://github.com/hackmamba-io/actian-vectorAI-db-beta | Kode starter, examples, Docker setup |
| 🌐 Website Produk Actian | https://www.actian.com/products/vectorai-db/ | Marketing & use case referensi |
| 💬 Discord (Support) | https://discord.gg/432A2M63Py | Tanya langsung ke penyelenggara |
| 📖 API Detail | https://github.com/hackmamba-io/actian-vectorAI-db-beta/blob/main/docs/api.md | Dokumentasi API lengkap |
| 🐍 PyPI Package | `pip install actian-vectorai` | Install Python client |

### 4.2 Contoh Kode di Repo

| File | Fungsi |
|------|--------|
| `examples/quick_start.py` | Starting point — connect, create collection, insert, search |
| `examples/semantic_search.py` | Semantic search dengan filtering |
| `examples/async_example.py` | Operasi asynchronous |
| `examples/batch_upsert.py` | Batch upload banyak data sekaligus |
| `examples/rag/rag_example.py` | **End-to-End RAG** (chunking → embedding → retrieval → generation) |

### 4.3 Use Case Resmi dari Actian (Inspirasi)

Dari website resmi Actian, mereka mempromosikan 5 use case utama:
1. **Customer Support Agent** — RAG on-premises tanpa kirim data pelanggan ke cloud
2. **Inventory Management** — Real-time tracking & search offline-capable
3. **Predictive Maintenance** — Pencarian dokumentasi peralatan di lantai pabrik
4. **Financial Documentation** — Semantic search kontrak/regulasi sensitif secara lokal
5. **Facial Recognition** — Biometric edge processing tanpa cloud

---

## 5. API Reference & Contoh Kode

### 5.1 Setup & Instalasi

```bash
# 1. Clone starter repo
git clone https://github.com/hackmamba-io/actian-vectorAI-db-beta.git
cd actian-vectorAI-db-beta

# 2. Jalankan database via Docker (multi-arch: otomatis pilih amd64/arm64)
docker compose up -d
# Database akan jalan di localhost:50051

# 3. Setup Python environment
python -m venv .venv
.venv\Scripts\Activate.ps1   # Windows PowerShell

# 4. Install Python client
pip install actian-vectorai

# 5. Install embedding model
pip install sentence-transformers
```

### 5.2 Quickstart — Sync Client

```python
from actian_vectorai import VectorAIClient, VectorParams, Distance, PointStruct

# Buka koneksi ke database lokal
with VectorAIClient("localhost:50051") as client:

    # Health check — pastikan DB berjalan
    info = client.health_check()
    print(f"Connected to {info['title']} v{info['version']}")

    # Buat collection (seperti "tabel" di database biasa)
    client.collections.create(
        "products",
        vectors_config=VectorParams(size=384, distance=Distance.Cosine),
        # size=384 karena kita pakai all-MiniLM-L6-v2 yang output 384 dimensi
    )

    # Insert data (points = baris data + vektor + metadata)
    client.points.upsert("products", [
        PointStruct(id=1, vector=[0.1]*384, payload={"name": "Laptop", "price": 999}),
        PointStruct(id=2, vector=[0.2]*384, payload={"name": "Tablet", "price": 499}),
    ])

    # Cari yang paling mirip
    results = client.points.search("products", vector=[0.15]*384, limit=5)
    for r in results:
        print(f"  id={r.id} score={r.score:.4f} payload={r.payload}")
```

### 5.3 Filtered Search (Fitur Lanjutan — WAJIB!)

```python
from actian_vectorai import Field, FilterBuilder

# Buat filter: kategori = electronics DAN harga <= 500
f = (
    FilterBuilder()
    .must(Field("category").eq("electronics"))    # field harus = "electronics"
    .must(Field("price").lte(500.0))              # field harus <= 500
    .must_not(Field("deleted").eq(True))          # field BUKAN deleted
    .build()
)

# Gunakan filter dalam pencarian vektor
results = client.points.search(
    "products",
    vector=query_vector,  # vektor dari embedding query user
    limit=10,
    filter=f              # <-- ini yang membedakan dari similarity biasa!
)
```

**Penjelasan Filter DSL:**
- `Field("x").eq(val)` — sama dengan
- `Field("x").lte(val)` — kurang dari atau sama dengan
- `Field("x").between(a, b)` — antara a dan b
- `FilterBuilder().must(...)` — kondisi WAJIB terpenuhi
- `FilterBuilder().must_not(...)` — kondisi WAJIB TIDAK terpenuhi
- Bisa juga pakai operator: `Field("a").eq("x") & Field("b").lte(100)`

### 5.4 Hybrid Fusion (Fitur Lanjutan — PEMBEDA UTAMA!)

```python
from actian_vectorai import reciprocal_rank_fusion, distribution_based_score_fusion

# Langkah 1: Jalankan 2 pencarian terpisah
# Dense search = pencarian semantik (berdasarkan makna)
dense_results = client.points.search("col", vector=dense_query, limit=50)

# Sparse search = pencarian keyword (berdasarkan kata kunci, BM25-style)
sparse_results = client.points.search("col", vector=sparse_query, limit=50)

# Langkah 2: Gabungkan hasil dengan Reciprocal Rank Fusion (RRF)
# weights: berapa besar pengaruh masing-masing pencarian
fused = reciprocal_rank_fusion(
    [dense_results, sparse_results],
    limit=10,
    weights=[0.7, 0.3]  # 70% semantic, 30% keyword
)

# ATAU gunakan Distribution-Based Score Fusion (DBSF)
fused = distribution_based_score_fusion(
    [dense_results, sparse_results],
    limit=10
)
```

**Penjelasan Hybrid Fusion untuk Belajar:**
- **Dense Vector** = representasi semantik dari teks (output dari model seperti `all-MiniLM-L6-v2`). Mengerti **makna**.
- **Sparse Vector** = representasi berbasis kata kunci (seperti TF-IDF/BM25). Mengerti **kata eksak**.
- **Masalah**: Dense search kadang gagal menangkap nama spesifik, kode, atau singkatan. Sparse search kadang gagal menangkap sinonim/parafrase.
- **Solusi**: Gabungkan keduanya! Ini yang disebut **Hybrid Fusion**.
- **RRF**: Menggabungkan berdasarkan **peringkat** (ranking). Sederhana tapi efektif.
- **DBSF**: Menggabungkan berdasarkan **distribusi skor**. Lebih canggih.

### 5.5 Named Vectors (Multimodal — BONUS POINTS!)

```python
# Buat collection dengan beberapa vektor per entitas
client.collections.create(
    "multimodal_products",
    vectors_config={
        "text": VectorParams(size=384, distance=Distance.Cosine),   # vektor teks
        "image": VectorParams(size=512, distance=Distance.Cosine),  # vektor gambar
    }
)

# Insert data dengan 2 vektor: teks + gambar
client.points.upsert("multimodal_products", [
    PointStruct(
        id=1,
        vector={
            "text": text_embedding,    # dari sentence-transformers
            "image": image_embedding,  # dari CLIP
        },
        payload={"name": "Red Sneakers", "brand": "Nike"}
    ),
])
```

### 5.6 HNSW Configuration (Tuning Performa)

```python
from actian_vectorai import HnswConfigDiff

client.collections.create(
    "vectors",
    vectors_config=VectorParams(size=384, distance=Distance.Cosine),
    hnsw_config=HnswConfigDiff(
        m=32,            # Edges per node (default: 16, lebih tinggi = lebih akurat tapi lebih lambat)
        ef_construct=256, # Build-time neighbors (default: 200, lebih tinggi = index lebih baik)
    ),
)
```

### 5.7 VDE Operations (Engine Management)

```python
client.vde.open_collection("col")       # Buka collection
client.vde.get_state("col")             # Cek status: READY / LOADING
client.vde.get_stats("col")             # Statistik: jumlah vektor, ukuran, dll
client.vde.flush("col")                 # Flush data ke disk
client.vde.save_snapshot("col")         # Simpan snapshot (backup)
client.vde.rebuild_index("col")         # Rebuild HNSW index
client.vde.compact_collection("col")    # Kompresi storage
client.vde.close_collection("col")      # Tutup collection
```

### 5.8 Known Issues (Penting untuk Dihindari!)

| Issue ID | Masalah |
|----------|---------|
| CRTX-202 | Jangan close/delete collection saat ada operasi read/write yang sedang berjalan |
| CRTX-232 | `scroll` API menggunakan istilah `cursor` untuk offset |
| CRTX-233 | `get_many` API tidak mengembalikan vector IDs |
| — | `create_field_index` belum diimplementasi di server |
| — | Sparse-vector dan multi-dense-vector write paths masih dalam pengembangan |

---

## 6. Ide Proyek Juara 1 (Rekomendasi Final)

### 🏆 "MedEdge AI" — Offline Medical Knowledge Assistant

**Tagline**: *"AI-powered medical reference that works without internet — built for clinics in remote areas"*

**Mengapa Ide Ini Bisa Juara:**

| Kriteria Juri (Bobot) | Bagaimana MedEdge Menjawab |
|------------------------|---------------------------|
| **Actian VectorAI DB (30%)** | Menggunakan **Hybrid Fusion** (semantic + keyword) + **Filtered Search** (filter by specialty, drug type, urgency level) |
| **Real-World Impact (25%)** | Masalah nyata: klinik terpencil tanpa internet butuh akses cepat ke referensi medis |
| **Technical Execution (25%)** | Pipeline lengkap: PDF ingestion → chunking → embedding → VectorAI DB → FastAPI → React UI |
| **Demo & Presentation (20%)** | Demo bisa dilakukan dalam **Airplane Mode** — sangat dramatis dan membuktikan offline capability! |
| **Bonus: Local Deploy** | ✅ Docker compose, zero cloud dependency |
| **Bonus: ARM Support** | ✅ Docker image multi-arch, bisa jalan di Mac M-Series |
| **Bonus: Offline Mode** | ✅ Semua berjalan lokal (embedding + DB + UI) |

**Fitur Utama:**
1. **Hybrid Medical Search**: Dokter mengetik gejala → sistem mencari referensi medis secara **semantic** + **keyword** sekaligus
2. **Filter by Specialty**: Filter berdasarkan spesialisasi (kardiologi, pediatri, dll), tipe obat, atau tingkat urgensi
3. **Before/After Comparison**: Demo menunjukkan hasil **tanpa** hybrid (jelek) vs **dengan** hybrid (akurat) — ini yang juri cari!
4. **100% Offline**: Semua berjalan tanpa internet, menggunakan model embedding lokal

**Tech Stack:**
- **Backend**: Python + FastAPI
- **Database**: Actian VectorAI DB (Docker)
- **Embedding**: `sentence-transformers/all-MiniLM-L6-v2` (lokal, 384d)
- **Frontend**: React + modern CSS (dashboard premium)
- **Dataset**: Medical textbook chunks / Drug database / Clinical guidelines (bisa pakai open data)

### Alternatif Ide (Jika Tidak Suka Medis):

| Ide | Domain | Fitur VectorAI DB | Impact |
|-----|--------|-------------------|--------|
| **SecurEdge** (On-Prem Code Auditor) | Cybersecurity/DevOps | Hybrid Search + CodeBERT | Bank/enterprise yang dilarang kirim kode ke cloud |
| **AgriVision** (Smart Farm Diagnostics) | Agriculture/IoT | Multimodal (CLIP) + Filtered Search | Petani di daerah tanpa internet |
| **FactoryGuard** (Predictive Maintenance) | Manufacturing | Hybrid Search + Filtered by equipment type | Pabrik di area terpencil |

---

## 7. Action Plan Eksekusi Per-Jam

> ⏰ **Deadline: 18 April 2026, 23:00 WIB**. Tersisa ~27 jam.

### Phase 1: Foundation (Jam 1-3)

```
□ Clone starter repo
□ docker compose up -d
□ pip install actian-vectorai sentence-transformers
□ Jalankan examples/quick_start.py → pastikan DB works
□ Siapkan dataset medis (50-200 dokumen chunk cukup untuk demo)
□ Buat struktur folder proyek:
    hackathon-actian/
    ├── backend/
    │   ├── ingestion/      # Script untuk memproses & embed dokumen
    │   ├── search/         # Search API (hybrid + filtered)
    │   └── api/            # FastAPI endpoints
    ├── frontend/           # React UI
    ├── data/               # Dataset
    ├── docker-compose.yml
    └── README.md
```

### Phase 2: Backend Core (Jam 4-10)

```
□ Buat ingestion pipeline:
    - Load dokumen medis (PDF/TXT/JSON)
    - Chunk menjadi paragraf-paragraf kecil
    - Generate embedding dengan all-MiniLM-L6-v2
    - Upsert ke VectorAI DB dengan metadata (specialty, type, source)
□ Buat search API:
    - Endpoint /search yang menerima query text
    - Implement Filtered Search (filter by specialty, urgency)
    - Implement Hybrid Fusion (dense + sparse, RRF weights)
□ Buat endpoint /compare:
    - Menunjukkan hasil "pure similarity" vs "hybrid filtered"
    - Ini untuk narasi perbandingan di video demo!
```

### Phase 3: Frontend (Jam 11-16)

```
□ Buat React app dengan design premium:
    - Search bar dengan filter dropdown (specialty, urgency)
    - Hasil pencarian dengan highlighting
    - Toggle Hybrid ON/OFF untuk perbandingan
    - Architecture diagram section
□ Pastikan responsive & modern (glassmorphism, gradients, micro-animations)
```

### Phase 4: Video & Polish (Jam 17-24)

```
□ Tulis script video (lihat Section 8)
□ Rapikan README.md:
    - Tujuan proyek
    - Arsitektur diagram
    - Cara install & run (1 command!)
    - Contoh output
□ Rekam video demo 5-7 menit:
    - PENTING: Tunjukkan Airplane Mode ON saat demo query!
    - Tunjukkan 2 skenario query berbeda
    - Tunjukkan before/after hybrid
□ Push ke GitHub
□ Submit di DoraHacks
```

### Phase 5: Final Check (Jam 25-27)

```
□ Cek semua link di submission
□ Pastikan video bisa diputar
□ Pastikan repo publik
□ Double-check README
```

---

## 8. Script Video Demo

> Template siap pakai. Sesuaikan dengan proyek Anda.

```
[0:00-0:30] MASALAH
"Imagine a clinic in a remote area with no internet.
A doctor needs to quickly find the right drug interaction for a patient.
Traditional cloud-based AI solutions? Useless without connectivity."

[0:30-1:30] SOLUSI
"Introducing MedEdge AI — an offline medical knowledge assistant
powered by Actian VectorAI DB.
[Tunjukkan diagram arsitektur]
Everything runs locally: embedding model, vector database, and UI.
Zero cloud dependency."

[1:30-3:30] DEMO — FITUR UTAMA
"Let me show you how it works.
[Query 1: Ketik gejala umum — tunjukkan hasil semantic search]
[Query 2: Ketik nama obat spesifik — tunjukkan hybrid search lebih akurat]
Notice how Hybrid Fusion combines meaning-based AND keyword-based search
for significantly better results."

[3:30-4:30] FITUR PEMBEDA
"Now let me show you the Filtered Search.
[Aktifkan filter: Specialty = Cardiology, Urgency = High]
The results are now narrowed to only relevant cardiology references.
This is the power of Actian VectorAI DB's Filter DSL."

[4:30-5:30] PERBANDINGAN
"Here's the key insight:
[Toggle hybrid OFF] Without hybrid — the results miss the exact drug name.
[Toggle hybrid ON] With hybrid — both semantic meaning AND exact terms are found.
This is why Actian VectorAI DB matters."

[5:30-6:30] OFFLINE PROOF
"And the best part?
[Tunjukkan Airplane Mode ON di laptop]
[Jalankan query — TETAP BEKERJA!]
Everything runs locally. No cloud. No latency. No data exposure.
MedEdge AI — medical intelligence at the edge."
```

---

## 9. Checklist Submission

### Repository
- [ ] `README.md` berisi: tujuan, arsitektur, cara setup, cara run, contoh output
- [ ] Struktur kode bersih dan terorganisir
- [ ] Konfigurasi (`.env` / config) terpisah dari kode
- [ ] Instruksi run lokal yang jelas (idealnya 1-2 command)
- [ ] Tidak ada broken links atau file yang hilang

### Video Demo
- [ ] Durasi 5-7 menit
- [ ] Ada narasi + screen recording
- [ ] Menampilkan hasil query + metadata yang relevan
- [ ] Menampilkan dampak fitur VectorAI DB (hybrid/filtered)
- [ ] Ada bagian "offline proof" (Airplane Mode)

### DoraHacks Submission
- [ ] Link repo publik
- [ ] Link video demo
- [ ] Deskripsi proyek yang menjawab: **Apa masalahnya? Apa solusinya? Mengapa VectorAI DB?**
- [ ] Tag/kategori yang relevan

---

> **💡 Catatan Final**: Fokus pada **kualitas narasi** dan **bukti fitur lanjutan VectorAI DB**, bukan pada jumlah fitur. Juri lebih menghargai 1 fitur yang dieksekusi sempurna + ditunjukkan dengan jelas, daripada 10 fitur setengah jadi. **Good luck — let's win this! 🏆**
