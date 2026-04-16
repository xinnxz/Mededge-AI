# 🏥 MedEdge AI 
**Offline Medical Knowledge Assistant powered by Actian VectorAI DB**

## 🏆 Project Overview
MedEdge AI is an edge-native, 100% offline medical reference dashboard designed for clinics in remote areas without reliable internet connections. 

In critical medical emergencies, doctors cannot afford the latency or connectivity failures associated with cloud-based LLMs. MedEdge AI runs locally on ARM or x86 hardware, utilizing the **Actian VectorAI DB** for ultra-fast, offline **Hybrid Fusion Search**, combining the exactness of Keyword Search with the contextual understanding of Semantic Search.

*Designed for the Actian VectorAI DB Build Challenge (DoraHacks).*

---

## 🔥 Key Features (Hackathon Requirements Satisfied)

1. **Edge Deployment (Zero Cloud Dependency)** 🌩️🚫
   Everything runs locally: The React Frontend, FastAPI Backend, local `all-MiniLM-L6-v2` embedding model, and Actian VectorAI DB.
2. **Hybrid Search Architecture** 🔀
   Utilizes a Fallback/Simulated Hybrid strategy mimicking **Reciprocal Rank Fusion (RRF)**, where dense vector comparisons complement explicit text searches.
3. **Advanced Filter DSL** 🔍
   Complex payload metadata filtering leveraging Actian DB's capabilities: Query by `Specialty` (e.g., Cardiology, Toxicology) and `Urgency` level.
4. **Sub-15ms Local Queries** ⚡
   No API rate-limiting or network bottlenecks.

---

## 🛠️ Architecture

*   **Database**: Actian VectorAI DB (running in Docker container)
*   **Backend**: Python FastAPI + actian-vectorai SDK
*   **Embedding**: SentenceTransformers (`all-MiniLM-L6-v2`) cached locally
*   **Frontend**: React + Vite (Custom Glassmorphism UI)

---

## 🚀 Quick Start Guide (Run Locally)

### Prerequisites
*   Docker & Docker Compose
*   Python 3.10+
*   Node.js & npm

### 1. Start Actian Vector DB
```bash
cd starter-repo
docker compose up -d
cd ..
```

### 2. Setup Python Backend & Ingestion
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows

# Install Dependencies
pip install -r backend/requirements.txt
# (Note: For the beta actian package, we installed it locally from the whl file)

# Run Data Ingestion (To embed dummy medical data)
python backend/ingestion/seed_data.py

# Start the Medical Edge API
python backend/api/main.py
# The API will run on http://localhost:8080
```

### 3. Start React Frontend
```bash
cd frontend
npm install
npm run dev
# Dashboard available at http://localhost:5173
```

---

## 🎬 Demo Skenario for Judges
To test the offline capability:
1. Start the DB, backend server, and frontend server.
2. Turn ON **Airplane Mode**.
3. Type `heart attack` into the dashboard search input.
4. Toggle the **Urgency** filter to "High" or **Specialty** to "Cardiology".
5. Observe the results resolving seamlessly in single-digit milliseconds without any cloud connection.

---

*Built with ❤️ during the Actian Hackathon.*
