import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [urgency, setUrgency] = useState('All')
  const [useHybrid, setUseHybrid] = useState(true)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return
    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch('http://localhost:8080/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          specialty,
          urgency,
          use_hybrid: useHybrid,
          limit: 3
        })
      })

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error(err)
      // Fallback dummy for UI demonstration if backend is not ready
      setResults([
        { id: '1', score: 0.98, payload: { title: 'Aspirin Guideline', specialty: 'Cardiology', urgency: 'High', content: 'Connection to backend failed. This is a fallback UI demo.' } }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">M</div>
          <h2>MedEdge AI</h2>
        </div>

        <div className="status-badge offline-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .2-1.1.7l-.5 1.5 5.5 3.5-3.7 3.7-2.6-.9c-.4-.1-.8.1-.9.5l-.6 1.4 3.7 2.1 2.1 3.7 1.4-.6c.4-.1.6-.5.5-.9l-.9-2.6 3.7-3.7 3.5 5.5 1.5-.5c.5-.1.8-.6.7-1.1z"></path>
          </svg>
          Offline Mode Active
        </div>

        <div className="nav-menu">
          <a href="#" className="active">Database Search</a>
          <a href="#">Patient Records</a>
          <a href="#">Inventory Offline</a>
          <a href="#">Settings</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <h1>Medical Knowledge Base</h1>
          <p>Powered by Actian VectorAI DB (Edge Deployment)</p>
        </header>

        <section className="search-section">
          <form className="search-box glass-panel" onSubmit={handleSearch}>
            <div className="search-input-group">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search symptoms, drugs, or procedures..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            <div className="filters-row">
              <div className="filter-group">
                <label>Actian Filter DSL: Specialty</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                  <option value="All">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Toxicology">Toxicology</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Metadata Filter: Urgency</label>
                <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value="All">Any Urgency</option>
                  <option value="High">High (Immediate)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="filter-group toggle-group">
                <label>Hybrid Fusion (Vector + Keyword)</label>
                <label className="switch">
                  <input type="checkbox" checked={useHybrid} onChange={(e) => setUseHybrid(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </form>
        </section>

        <section className="results-section">
          {loading ? (
            <div className="loader">Querying local HNSW index...</div>
          ) : searched && results.length === 0 ? (
            <div className="no-results">No relevant documents found.</div>
          ) : (
            <div className="cards-grid">
              {results.map((item, index) => (
                <div key={item.id || index} className="result-card glass-panel" style={{ '--animation-order': index }}>
                  <div className="card-header">
                    <span className="urgency-tag" data-level={item.payload.urgency}>
                      {item.payload.urgency}
                    </span>
                    <span className="specialty-tag">{item.payload.specialty}</span>
                    <span className="score-badge">Match: {(item.score * 100).toFixed(1)}%</span>
                  </div>
                  <h3>{item.payload.title}</h3>
                  <p>{item.payload.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
