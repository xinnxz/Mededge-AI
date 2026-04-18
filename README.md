<p align="center">
  <img src="assets/logo.png" alt="MedEdge AI" width="160" />
</p>

# MedEdge AI

**Offline-First Medical Knowledge Assistant powered by Actian VectorAI DB**

> 🏆 Built for the [Actian VectorAI DB Build Challenge](https://dorahacks.io/) on DoraHacks

---

## 🧠 The Problem

In remote clinics and disaster zones, **doctors can't rely on cloud-based AI**. Internet is unreliable, latency kills in emergencies, and cloud API rate limits don't care about life-or-death situations.

## 💡 The Solution

**MedEdge AI** is a fully offline, edge-native medical reference system. It runs entirely on local hardware — no internet required. Doctors can instantly search 40+ clinical guidelines using natural language, with results returned in **sub-15ms** via local vector similarity.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔌 **100% Offline** | Zero cloud dependency. Works behind firewalls, in airplane mode, anywhere. |
| 🔀 **Hybrid Fusion Search** | Combines semantic vector search (dense) with keyword matching (BM25 simulation) via Pseudo-RRF scoring. |
| 🔍 **Advanced Filter DSL** | Filter by `Specialty` (13 categories) and `Urgency` (High/Medium/Low) using Actian's payload filtering. |
| ⚡ **Sub-15ms Queries** | Local HNSW index + local embedding model = instant results. |
| 🧬 **Local Embeddings** | `all-MiniLM-L6-v2` (384d) runs entirely on-device. No OpenAI API needed. |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   LOCAL EDGE DEVICE                  │
│                                                     │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐  │
│  │  React   │◄──►│   FastAPI    │◄──►│  Actian   │  │
│  │ Frontend │    │   Backend    │    │ VectorAI  │  │
│  │ :5173    │    │   :8080      │    │   DB      │  │
│  └──────────┘    └──────┬───────┘    │  :50051   │  │
│                         │            └───────────┘  │
│                  ┌──────┴───────┐                    │
│                  │ MiniLM-L6-v2 │                    │
│                  │  (384-dim)   │                    │
│                  └──────────────┘                    │
└─────────────────────────────────────────────────────┘
         ☁️ NO CLOUD CONNECTION REQUIRED ☁️
```

**Tech Stack:**
- **Database**: Actian VectorAI DB (Docker) — HNSW Index, Cosine Similarity
- **Backend**: Python FastAPI + `actian-vectorai` SDK
- **Embedding**: SentenceTransformers `all-MiniLM-L6-v2` (cached locally)
- **Frontend**: React + Vite + TailwindCSS (Bento Box UI)
- **Search**: Hybrid RRF = Dense Vector Search + Keyword Boost

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.10+
- Node.js 18+ & npm

### 1. Clone & Start Database
```bash
git clone https://github.com/xinnxz/Mededge-AI.git
cd Mededge-AI

# Start Actian VectorAI DB
docker compose up -d
```

### 2. Setup Python Backend
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (Linux/Mac)
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
pip install starter-repo/actian_vectorai-0.1.0b2-py3-none-any.whl

# Seed medical knowledge base (40 clinical guidelines)
python backend/ingestion/seed_data.py

# Start API server
python backend/api/main.py
# → API running at http://localhost:8080
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# → Dashboard at http://localhost:5173
```

---

## 🎬 Demo: Offline Medical Search

**To verify the offline capability:**

1. Start the DB, backend, and frontend as described above.
2. **Turn ON Airplane Mode** (disable all network interfaces).
3. Open `http://localhost:5173` in your browser.
4. Search for `heart attack emergency treatment`.
5. Toggle **Specialty** to "Cardiology" and **Urgency** to "High".
6. Toggle **Hybrid Fusion** ON/OFF to see different result rankings.
7. Observe results resolving in **single-digit milliseconds** with zero cloud connection.

---

## 📊 Knowledge Base

The system includes **40 real clinical guidelines** across **13 medical specialties**:

| Specialty | # of Guidelines | Example |
|---|---|---|
| Cardiology | 4 | STEMI Protocol, Hypertensive Crisis |
| Emergency Medicine | 7 | Sepsis Bundle, Stroke Thrombolysis |
| Pediatrics | 6 | Febrile Seizure, Neonatal Resuscitation |
| Infectious Disease | 3 | Malaria ACT, TB Regimen, Dengue |
| Obstetrics | 3 | Preeclampsia, Postpartum Hemorrhage |
| Internal Medicine | 3 | Type 2 Diabetes, CKD Staging |
| Toxicology | 2 | Snakebite, Organophosphate Poisoning |
| And 6 more... | | Surgery, Psychiatry, Primary Care, etc. |

---

## 🔬 Technical Deep Dive: Hybrid Search

MedEdge AI implements a **Pseudo-Reciprocal Rank Fusion (RRF)** strategy:

```
1. User query → Local embedding via MiniLM-L6-v2 → 384-dim vector
2. Dense vector search via Actian HNSW index (fetch 2x limit)
3. If Hybrid Mode ON:
   - Scan each result for keyword matches in title + content
   - Apply additive boost: score += 0.05 × keyword_matches
   - Cap at 0.99 to prevent overflow
4. Re-rank by boosted score, return top-N results
```

This ensures that documents containing **exact medical terminology** (e.g., "aspirin", "epinephrine") rank higher than semantically similar but terminologically different results.

---

## 📁 Project Structure

```
MedEdge-AI/
├── docker-compose.yml          # One-command DB setup
├── backend/
│   ├── api/main.py             # FastAPI server with Hybrid Search
│   ├── ingestion/seed_data.py  # Data ingestion & embedding pipeline
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/App.jsx             # React dashboard (Bento Box UI)
│   ├── src/App.css             # Minimal CSS reset
│   └── index.html              # Tailwind config + Design tokens
├── data/
│   └── medical_sample.json     # 40 clinical guidelines
├── starter-repo/               # Actian SDK & reference materials
└── README.md                   # This file
```

---

## 🙏 Acknowledgments

- **Actian Corporation** for the VectorAI DB engine and hackathon SDK
- Medical guidelines sourced from WHO, AHA, and clinical practice standards
- UI design inspired by modern clinical dashboard systems

---

*Built with ❤️ for the Actian VectorAI DB Build Challenge*
