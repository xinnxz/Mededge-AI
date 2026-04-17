import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [urgency, setUrgency] = useState('All')
  const [useHybrid, setUseHybrid] = useState(true)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)
  const [dbStats, setDbStats] = useState({ connected: false, totalDocs: 0 })
  const [searchTime, setSearchTime] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/health')
      .then(res => res.json())
      .then(data => setDbStats({ connected: data.db_connected, totalDocs: data.total_docs || 0 }))
      .catch(() => setDbStats({ connected: false, totalDocs: 0 }))
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return
    setLoading(true)
    setSearched(true)
    setError(null)
    const t0 = performance.now()
    try {
      const res = await fetch('http://localhost:8080/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, specialty, urgency, use_hybrid: useHybrid, limit: 5 })
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResults(data)
      setSearchTime(Math.round(performance.now() - t0))
    } catch (err) {
      setError('Backend offline. Please start the API server (python backend/api/main.py).')
      setResults([])
    } finally { setLoading(false) }
  }

  const scoreLabel = (s) => s >= 0.9 ? 'High Match' : s >= 0.7 ? 'Good Match' : 'Low Match'
  const scoreColor = (s) => s >= 0.9 ? 'secondary' : s >= 0.7 ? 'primary' : 'outline'

  const specialties = [
    'All', 'Cardiology', 'Emergency Medicine', 'Pediatrics', 'Pulmonology',
    'Internal Medicine', 'Infectious Disease', 'Toxicology', 'Orthopedics',
    'Obstetrics', 'Surgery', 'Psychiatry', 'Primary Care'
  ]

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex font-['Plus_Jakarta_Sans']">
      {/* Sidebar - Clean, no bounce */}
      <nav className="hidden md:flex flex-col w-72 bg-white/90 backdrop-blur-3xl rounded-r-[32px] border-r border-surface-container-high z-40 fixed left-0 top-0 h-screen p-6 text-sm font-medium">
        <div className="flex items-center gap-4 mb-10 px-2 mt-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shrink-0 border border-primary-container/50">
            <span className="material-symbols-outlined icon-fill text-primary text-2xl">health_and_safety</span>
          </div>
          <div>
            <h1 className="text-[19px] font-extrabold text-sky-900 tracking-tight leading-tight">MedEdge AI</h1>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.15em] font-bold mt-0.5">Precision Care</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <a className="bg-surface-container-low text-[#1c5a6d] rounded-2xl px-4 py-4 flex items-center gap-3 border border-surface-container-high" href="#">
            <span className="material-symbols-outlined icon-fill text-[20px]">search_insights</span>Database Search
          </a>
        </div>

        {/* DB Connection Status */}
        <div className="mt-auto mb-6">
          <div className={`w-full rounded-2xl py-3.5 px-4 font-bold flex items-center gap-3 text-xs border ${dbStats.connected ? 'bg-secondary-container/30 text-on-secondary-container border-secondary-container/50' : 'bg-error-container/20 text-error border-error-container/30'}`}>
            <div className={`w-2 h-2 rounded-full ${dbStats.connected ? 'bg-secondary' : 'bg-error'}`}></div>
            {dbStats.connected ? 'Actian DB Connected' : 'DB Disconnected'}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-surface-container-high pt-5 px-2">
          <div className="text-outline py-2 flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
            <span>Edge Protocol</span>
            <span className="bg-surface-container-high text-on-surface px-2 py-0.5 rounded-md">Offline</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 md:ml-72 p-6 md:p-10 md:pt-10 max-w-[1400px] mx-auto w-full">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex justify-between items-center w-full bg-white/90 backdrop-blur-xl rounded-2xl mb-8 px-6 h-16 border border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined icon-fill text-primary text-lg">health_and_safety</span>
            </div>
            <span className="text-lg font-black text-sky-800 tracking-tight">MedEdge AI</span>
          </div>
        </div>

        {/* Header + Search */}
        <header className="mb-10 hidden md:flex justify-between items-end">
          <div>
            <h2 className="text-[34px] font-black tracking-tight text-on-background mb-1 leading-none">Search Database</h2>
            <p className="text-sm text-on-surface-variant font-semibold mt-2.5">Query medical guidelines directly from Actian VectorAI edge database.</p>
          </div>
          <form onSubmit={handleSearch} className="relative w-[480px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/60">search</span>
            <input className="w-full bg-white border border-surface-container-high rounded-[20px] py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-outline/60 text-on-background shadow-sm" placeholder="Search symptoms, treatments, protocols..." type="text" value={query} onChange={e => setQuery(e.target.value)} />
          </form>
        </header>

        {/* Bento Grid - Completely rigid, solid, professional */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">

          {/* Active Query Status (Wide) */}
          <section className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-surface-container-high rounded-[32px] p-8 md:p-10 shadow-sm">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-[22px] font-black text-on-background tracking-tight">
                  {searched ? `Result: "${query}"` : 'Awaiting Query'}
                </h3>
                <p className="text-sm text-on-surface-variant mt-2 font-medium">
                  {searched
                    ? `${useHybrid ? 'Hybrid Fusion' : 'Pure Semantic'} Engine Response`
                    : 'Enter keywords above to query the localized embedding space.'}
                </p>
              </div>
              {searched && (
                <span className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl uppercase tracking-[0.15em] flex items-center gap-1.5 border border-transparent ${loading ? 'bg-surface-container text-on-surface' : error ? 'bg-error-container/20 text-error border-error/20' : 'bg-secondary-container/40 text-secondary border-secondary/20'}`}>
                  <span className="material-symbols-outlined text-[14px]">{loading ? 'autorenew' : error ? 'error' : 'check_circle'}</span>
                  {loading ? 'Processing' : error ? 'Error' : 'Complete'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-surface-container-high via-surface-container-high to-transparent"></div>
              <div>
                <p className="text-[11px] text-outline uppercase tracking-[0.15em] font-extrabold mb-2">Matches Found</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[40px] font-black text-on-background leading-none tracking-tight">{searched ? results.length : '—'}</p>
                  {searched && <span className="text-sm font-semibold text-outline">docs</span>}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-outline uppercase tracking-[0.15em] font-extrabold mb-2">Retrieval Latency</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[40px] font-black text-on-background leading-none tracking-tight">{searchTime !== null ? searchTime : '—'}</p>
                  {searchTime !== null && <span className="text-sm font-semibold text-outline">ms</span>}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-outline uppercase tracking-[0.15em] font-extrabold mb-2">Search Mode</p>
                <p className="text-[24px] font-black text-primary leading-none tracking-tight mt-2">{useHybrid ? 'Hybrid RRF' : 'Semantic Vector'}</p>
              </div>
            </div>
          </section>

          {/* Quick Filter (Tall) */}
          <section className="col-span-1 md:row-span-2 bg-white border border-surface-container-high rounded-[32px] p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-surface-container-high flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[24px]">tune</span>
              </div>
              <h3 className="text-lg font-black text-on-background tracking-tight">Query Filters</h3>
            </div>

            <div className="space-y-6 flex-grow">
              <div>
                <label className="text-[11px] font-extrabold text-outline uppercase tracking-[0.1em] mb-2.5 block">Clinical Specialty</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface-container-lowest border border-surface-container-high rounded-2xl py-3.5 pl-5 pr-10 text-[14px] font-bold text-on-background focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-colors" value={specialty} onChange={e => setSpecialty(e.target.value)}>
                    {specialties.map(s => (
                      <option key={s} value={s}>{s === 'All' ? 'All Specialties' : s}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/60 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-outline uppercase tracking-[0.1em] mb-2.5 block">Triage Urgency</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface-container-lowest border border-surface-container-high rounded-2xl py-3.5 pl-5 pr-10 text-[14px] font-bold text-on-background focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-colors" value={urgency} onChange={e => setUrgency(e.target.value)}>
                    <option value="All">Any Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/60 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-[11px] font-extrabold text-outline uppercase tracking-[0.1em] mb-2.5 block">Engine Settings</label>
                <div onClick={() => setUseHybrid(!useHybrid)} className={`rounded-2xl p-4 flex justify-between items-center cursor-pointer border ${useHybrid ? 'bg-primary-container/20 border-primary-container' : 'bg-surface-container-lowest border-surface-container-high'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${useHybrid ? 'text-primary icon-fill' : 'text-outline/60'}`}>hub</span>
                    <span className={`text-[14px] font-bold ${useHybrid ? 'text-[#1c5a6d]' : 'text-on-surface-variant'}`}>Hybrid Fusion</span>
                  </div>
                  <div className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors ${useHybrid ? 'bg-[#1c5a6d] justify-end' : 'bg-outline-variant justify-start'}`}>
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSearch} disabled={loading || !query} className="w-full mt-10 bg-[#1c5a6d] hover:bg-[#124151] text-white rounded-2xl py-4 text-[15px] font-extrabold shadow-sm transition-colors disabled:opacity-50 disabled:hover:bg-[#1c5a6d]">
              {loading ? 'Processing Query...' : 'Execute Search'}
            </button>
          </section>

          {/* Error State */}
          {error && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-error-container/10 border border-error-container/30 rounded-[32px] p-8 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-error-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-error text-[28px]">cloud_off</span>
              </div>
              <div>
                <p className="font-extrabold text-[18px] text-error">Connection Failed</p>
                <p className="text-sm text-on-surface-variant font-medium mt-1.5">{error}</p>
              </div>
            </div>
          )}

          {/* Dynamic Result Cards */}
          {results.map((item, i) => (
            <div key={i} className={`rounded-[32px] p-8 flex flex-col justify-between border ${item.score >= 0.7 ? 'bg-white border-surface-container-high shadow-sm' : 'bg-surface-container-low border-transparent'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.score >= 0.9 ? 'bg-secondary-container/30 text-secondary border-secondary-container' : item.score >= 0.7 ? 'bg-primary-container/30 text-primary border-primary-container' : 'bg-white text-outline border-outline-variant/30'}`}>
                  <span className="material-symbols-outlined text-[24px] icon-fill">{item.score >= 0.9 ? 'vital_signs' : item.score >= 0.7 ? 'science' : 'health_metrics'}</span>
                </div>
                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${item.score >= 0.9 ? 'text-secondary' : item.score >= 0.7 ? 'text-primary' : 'text-outline/70'}`}>{scoreLabel(item.score)}</span>
              </div>

              <div className="flex-grow">
                <h4 className="text-[17px] font-black text-on-background leading-snug line-clamp-2">{item.payload.title}</h4>
                <div className="flex items-center gap-2.5 mt-3">
                  <span className="bg-surface-container text-on-surface-variant text-[11px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">{item.payload.specialty}</span>
                  <span className={`text-[11px] font-extrabold uppercase tracking-widest ${item.payload.urgency === 'High' ? 'text-error' : item.payload.urgency === 'Medium' ? 'text-tertiary' : 'text-outline'}`}>{item.payload.urgency} Priority</span>
                </div>
                <p className="text-[14px] text-on-surface-variant mt-4 font-medium line-clamp-3 leading-relaxed">{item.payload.content}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-[12px] font-extrabold text-outline uppercase tracking-widest">Match Score</span>
                <span className={`text-[20px] font-black ${item.score >= 0.9 ? 'text-secondary' : item.score >= 0.7 ? 'text-primary' : 'text-outline'}`}>
                  {(item.score * 100).toFixed(1)}<span className="text-[14px] opacity-60 ml-0.5">%</span>
                </span>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-surface-container-high rounded-[32px] p-16 flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[40px] text-primary/40 animate-spin mb-5">progress_activity</span>
              <p className="font-extrabold text-on-background text-[18px]">Querying Vector Index...</p>
            </div>
          )}

          {/* Empty State */}
          {searched && !loading && !error && results.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-surface-container-low border border-transparent rounded-[32px] p-16 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-white border border-surface-container-high flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[40px] text-outline/40">search_off</span>
              </div>
              <p className="font-black text-on-background text-[22px]">No matching guidelines found</p>
              <p className="text-[15px] text-on-surface-variant font-medium mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Infrastructure Info (Wide) - Clean tech specs */}
          <section className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#0a0f12] border border-[#161f25] rounded-[32px] p-8 md:p-10 mt-6 overflow-hidden relative shadow-lg">
            <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-gradient-to-l from-[#1c5a6d]/20 to-transparent pointer-events-none"></div>
            <h3 className="text-[20px] font-black text-white tracking-tight mb-8">System Architecture</h3>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1 w-full space-y-7 relative z-10">
                {[
                  ['Actian VectorAI', 'HNSW Engine · Int8 Quantization', '#aae2fa', dbStats.connected],
                  ['Embedding Node', 'all-MiniLM-L6-v2 · 384d Local Model', '#cbebca', true],
                  ['Edge Protocol', 'Offline-First FastAPI Runtime', '#fed9b8', true]
                ].map(([name, desc, color, active]) => (
                  <div key={name} className="flex items-center gap-5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: active ? color : '#334155' }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-extrabold text-slate-100 text-[15px]">{name}</span>
                        <span className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ color: active ? color : '#64748b' }}>{active ? 'Online' : 'Offline'}</span>
                      </div>
                      <p className="text-[13px] font-medium text-slate-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full md:w-1/3 aspect-[21/9] rounded-2xl overflow-hidden relative border border-slate-700/40 flex flex-col items-center justify-center bg-black/60 shadow-inner">
                <span className="material-symbols-outlined text-slate-300 text-[32px] mb-3">dns</span>
                <p className="text-slate-200 text-[12px] font-black tracking-widest uppercase">Airgapped Server</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-emerald-400/90 text-[11px] font-bold">0ms Network Latency</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
