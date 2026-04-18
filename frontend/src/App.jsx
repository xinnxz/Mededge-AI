import { useState, useEffect } from 'react'
import './App.css'
import {
  IllustrationAwaitingQuery,
  IllustrationEmptyGuidelines,
  IllustrationAirgappedEdge,
  IllustrationQueryFilters,
  IllustrationLoadingVectors,
} from './illustrations/MedEdgeIllustrations'

const HighlightText = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const terms = query.trim().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return <>{text}</>;
  const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = terms.some(term => part.toLowerCase() === term.toLowerCase());
        return isMatch
          ? <mark key={i} className="bg-amber-200/90 text-amber-900 px-1 py-0.5 mx-0.5 rounded-[4px] font-black shadow-sm">{part}</mark>
          : <span key={i}>{part}</span>;
      })}
    </>
  );
};

function App() {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [urgency, setUrgency] = useState('All')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)
  const [dbStats, setDbStats] = useState({ connected: false, totalDocs: 0 })
  const [searchTime, setSearchTime] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const [searchHistory, setSearchHistory] = useState([])

  // Comparison mode
  const [compareMode, setCompareMode] = useState(false)
  const [semanticResults, setSemanticResults] = useState([])
  const [hybridResults, setHybridResults] = useState([])
  const [semanticTime, setSemanticTime] = useState(null)
  const [hybridTime, setHybridTime] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8080/health')
      .then(res => res.json())
      .then(data => setDbStats({ connected: data.db_connected, totalDocs: data.total_docs || 0 }))
      .catch(() => setDbStats({ connected: false, totalDocs: 0 }))
  }, [])

  const runSearch = async (useHybrid) => {
    const t0 = performance.now()
    const res = await fetch('http://127.0.0.1:8080/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, specialty, urgency, use_hybrid: useHybrid, limit: 5 })
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    const data = await res.json()
    return { data, time: Math.round(performance.now() - t0) }
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!query) return
    setLoading(true)
    setSearched(true)
    setError(null)
    // Add to history (deduplicate, max 5)
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== query.toLowerCase())
      return [query, ...filtered].slice(0, 5)
    })
    try {
      if (compareMode) {
        const [sem, hyb] = await Promise.all([runSearch(false), runSearch(true)])
        setSemanticResults(sem.data)
        setHybridResults(hyb.data)
        setSemanticTime(sem.time)
        setHybridTime(hyb.time)
        setResults([])
        setSearchTime(null)
      } else {
        const result = await runSearch(true)
        setResults(result.data)
        setSearchTime(result.time)
        setSemanticResults([])
        setHybridResults([])
      }
    } catch (err) {
      setError('Backend offline. Please start the API server.')
      setResults([]); setSemanticResults([]); setHybridResults([])
    } finally { setLoading(false) }
  }

  // Quick search from emergency buttons or history
  const quickSearch = (term) => {
    setQuery(term)
    // Use setTimeout to let React update state before firing search
    setTimeout(() => {
      setQuery(term)
      setLoading(true)
      setSearched(true)
      setError(null)
      setSearchHistory(prev => {
        const filtered = prev.filter(h => h.toLowerCase() !== term.toLowerCase())
        return [term, ...filtered].slice(0, 5)
      })
      const doSearch = async () => {
        try {
          if (compareMode) {
            const [sem, hyb] = await Promise.all([
              runSearch(false),
              runSearch(true)
            ].map(p => {
              // Override query in closure
              const t0 = performance.now()
              return fetch('http://127.0.0.1:8080/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: term, specialty, urgency, use_hybrid: p === runSearch(true), limit: 5 })
              }).then(r => r.json()).then(data => ({ data, time: Math.round(performance.now() - t0) }))
            }))
            setSemanticResults(sem.data)
            setHybridResults(hyb.data)
            setSemanticTime(sem.time)
            setHybridTime(hyb.time)
            setResults([])
          } else {
            const t0 = performance.now()
            const res = await fetch('http://127.0.0.1:8080/api/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: term, specialty, urgency, use_hybrid: true, limit: 5 })
            })
            const data = await res.json()
            setResults(data)
            setSearchTime(Math.round(performance.now() - t0))
            setSemanticResults([])
            setHybridResults([])
          }
        } catch {
          setError('Backend offline.')
          setResults([])
        } finally { setLoading(false) }
      }
      doSearch()
    }, 50)
  }

  const emergencyScenarios = [
    { label: 'Cardiac Arrest', icon: 'cardiology', query: 'cardiac arrest resuscitation protocol' },
    { label: 'Massive Bleeding', icon: 'bloodtype', query: 'massive hemorrhage trauma bleeding' },
    { label: 'Anaphylaxis', icon: 'allergy', query: 'anaphylaxis epinephrine emergency' },
    { label: 'Seizure', icon: 'neurology', query: 'seizure convulsion emergency management' },
    { label: 'Burns', icon: 'local_fire_department', query: 'burns assessment initial care' },
    { label: 'Poisoning', icon: 'skull', query: 'poisoning toxicology antidote treatment' },
  ]

  const scoreLabel = (s) => s >= 0.9 ? 'High Match' : s >= 0.7 ? 'Good Match' : 'Low Match'

  const specialties = [
    'All', 'Cardiology', 'Emergency Medicine', 'Pediatrics', 'Pulmonology',
    'Internal Medicine', 'Infectious Disease', 'Toxicology', 'Orthopedics',
    'Obstetrics', 'Surgery', 'Psychiatry', 'Primary Care'
  ]

  const ResultCard = ({ item, rank }) => (
    <div onClick={() => setSelectedItem(item)} className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg rounded-3xl p-6 flex flex-col border ${item.score >= 0.7 ? 'bg-white border-surface-container-high' : 'bg-surface-container-low border-transparent hover:border-outline-variant/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-black text-outline/40 w-6">#{rank}</span>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.score >= 0.9 ? 'bg-secondary-container/30 text-secondary border-secondary-container' : item.score >= 0.7 ? 'bg-primary-container/30 text-primary border-primary-container' : 'bg-white text-outline border-outline-variant/30'}`}>
            <span className="material-symbols-outlined text-[20px] icon-fill">{item.score >= 0.9 ? 'vital_signs' : item.score >= 0.7 ? 'science' : 'health_metrics'}</span>
          </div>
        </div>
        <span className={`text-[11px] font-extrabold uppercase tracking-widest ${item.score >= 0.9 ? 'text-secondary' : item.score >= 0.7 ? 'text-primary' : 'text-outline/70'}`}>{scoreLabel(item.score)}</span>
      </div>
      <h4 className="text-[15px] font-black text-on-background leading-snug line-clamp-2 mb-2">
        <HighlightText text={item.payload.title} query={query} />
      </h4>
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-surface-container text-on-surface-variant text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">{item.payload.specialty}</span>
        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${item.payload.urgency === 'High' ? 'text-error' : item.payload.urgency === 'Medium' ? 'text-tertiary' : 'text-outline'}`}>{item.payload.urgency}</span>
      </div>
      <p className="text-[13px] text-on-surface-variant font-medium line-clamp-2 leading-relaxed flex-grow">
        <HighlightText text={item.payload.content} query={query} />
      </p>
      <div className="mt-4 pt-4 border-t border-surface-container-high flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-outline uppercase tracking-widest">Score</span>
        <span className={`text-[18px] font-black ${item.score >= 0.9 ? 'text-secondary' : item.score >= 0.7 ? 'text-primary' : 'text-outline'}`}>
          {(item.score * 100).toFixed(1)}<span className="text-[12px] opacity-60">%</span>
        </span>
      </div>
    </div>
  )

  const hasCompareResults = compareMode && (semanticResults.length > 0 || hybridResults.length > 0)
  const hasNormalResults = !compareMode && results.length > 0

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex font-['Plus_Jakarta_Sans']">
      {/* Sidebar */}
      <nav className="hidden md:flex flex-col w-72 bg-white/90 backdrop-blur-3xl rounded-r-[32px] border-r border-surface-container-high z-40 fixed left-0 top-0 h-screen p-6 text-sm font-medium">
        <div className="flex items-center gap-4 mb-10 px-2 mt-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-primary-container/50 overflow-hidden">
            <img src="/logo.png" alt="MedEdge AI" className="w-full h-full object-contain" />
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

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] font-extrabold text-outline uppercase tracking-[0.15em] mb-3 px-2">Recent Queries</p>
              <div className="space-y-1">
                {searchHistory.map((h, i) => (
                  <button key={i} onClick={() => quickSearch(h)} className="w-full text-left text-[13px] font-medium text-on-surface-variant rounded-xl px-4 py-3 hover:bg-surface-container-low transition-colors flex items-center gap-3 group">
                    <span className="material-symbols-outlined text-[16px] text-outline/40 group-hover:text-primary transition-colors">history</span>
                    <span className="truncate">{h}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DB Connection */}
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
            <div className="w-8 h-8 rounded-xl bg-white border border-primary-container/40 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-black text-sky-800 tracking-tight">MedEdge AI</span>
          </div>
        </div>

        {/* Header + Search */}
        <header className="mb-6 hidden md:flex justify-between items-end">
          <div>
            <h2 className="text-[34px] font-black tracking-tight text-on-background mb-1 leading-none">Search Database</h2>
            <p className="text-sm text-on-surface-variant font-semibold mt-2.5">Query medical guidelines directly from Actian VectorAI edge database.</p>
          </div>
          <form onSubmit={handleSearch} className="relative w-[480px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/60">search</span>
            <input className="w-full bg-white border border-surface-container-high rounded-[20px] py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-outline/60 text-on-background shadow-sm" placeholder="Search symptoms, treatments, protocols..." type="text" value={query} onChange={e => setQuery(e.target.value)} />
          </form>
        </header>

        {/* Emergency Quick Access */}
        <div className="hidden md:flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-[11px] font-extrabold text-error uppercase tracking-widest mr-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">emergency</span>Quick:
          </span>
          {emergencyScenarios.map(s => (
            <button key={s.label} onClick={() => quickSearch(s.query)} className="bg-white border border-surface-container-high rounded-full px-4 py-2 text-[12px] font-bold text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">{s.icon}</span>{s.label}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">

          {/* Active Query Status (Wide) */}
          <section className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-surface-container-high rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-container/15 blur-2xl" aria-hidden />
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start mb-10">
              <div className="min-w-0 flex-1">
                <h3 className="text-[22px] font-black text-on-background tracking-tight">
                  {searched ? `Result: "${query}"` : 'Awaiting Query'}
                </h3>
                <p className="text-sm text-on-surface-variant mt-2 font-medium max-w-xl">
                  {searched
                    ? compareMode ? 'Side-by-Side Comparison: Semantic vs Hybrid Fusion' : 'Hybrid Fusion Engine Response'
                    : 'Run a query against your local vector index—semantic similarity plus keyword fusion, no cloud round-trip.'}
                </p>
              </div>
              {!searched && (
                <div className="shrink-0 self-center sm:self-start">
                  <IllustrationAwaitingQuery className="w-[200px] max-w-[42vw] sm:w-[220px] h-auto drop-shadow-sm" />
                </div>
              )}
              {searched && (
                <span className={`shrink-0 text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl uppercase tracking-[0.15em] flex items-center gap-1.5 border border-transparent ${loading ? 'bg-surface-container text-on-surface' : error ? 'bg-error-container/20 text-error border-error/20' : 'bg-secondary-container/40 text-secondary border-secondary/20'}`}>
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
                  <p className="text-[40px] font-black text-on-background leading-none tracking-tight">
                    {searched ? (compareMode ? hybridResults.length : results.length) : '—'}
                  </p>
                  {searched && <span className="text-sm font-semibold text-outline">docs</span>}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-outline uppercase tracking-[0.15em] font-extrabold mb-2">Retrieval Latency</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[40px] font-black text-on-background leading-none tracking-tight">
                    {compareMode ? (hybridTime !== null ? hybridTime : '—') : (searchTime !== null ? searchTime : '—')}
                  </p>
                  {(compareMode ? hybridTime !== null : searchTime !== null) && <span className="text-sm font-semibold text-outline">ms</span>}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-outline uppercase tracking-[0.15em] font-extrabold mb-2">Search Mode</p>
                <p className="text-[24px] font-black text-primary leading-none tracking-tight mt-2">
                  {compareMode ? 'Comparison' : 'Hybrid RRF'}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Filter (Tall) */}
          <section className="col-span-1 md:row-span-2 bg-white border border-surface-container-high rounded-[32px] p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <IllustrationQueryFilters className="w-12 h-12 shrink-0 shadow-sm" />
              <h3 className="text-lg font-black text-on-background tracking-tight">Query Filters</h3>
            </div>

            <div className="space-y-5 flex-grow">
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

              {/* Compare Mode Toggle */}
              <div className="pt-2">
                <label className="text-[11px] font-extrabold text-outline uppercase tracking-[0.1em] mb-2.5 block">Engine Mode</label>
                <div onClick={() => setCompareMode(!compareMode)} className={`rounded-2xl p-4 flex justify-between items-center cursor-pointer border ${compareMode ? 'bg-tertiary-container/20 border-tertiary-container' : 'bg-surface-container-lowest border-surface-container-high'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${compareMode ? 'text-tertiary icon-fill' : 'text-outline/60'}`}>compare_arrows</span>
                    <span className={`text-[14px] font-bold ${compareMode ? 'text-tertiary' : 'text-on-surface-variant'}`}>Compare Mode</span>
                  </div>
                  <div className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors ${compareMode ? 'bg-tertiary justify-end' : 'bg-outline-variant justify-start'}`}>
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <p className="text-[11px] text-outline mt-2 leading-snug px-1">
                  {compareMode ? 'Runs Semantic & Hybrid queries simultaneously side-by-side.' : 'Toggle to compare Semantic vs Hybrid results.'}
                </p>
              </div>
            </div>

            <button onClick={handleSearch} disabled={loading || !query} className="w-full mt-8 bg-[#1c5a6d] hover:bg-[#124151] text-white rounded-2xl py-4 text-[15px] font-extrabold shadow-sm transition-colors disabled:opacity-50 disabled:hover:bg-[#1c5a6d]">
              {loading ? 'Processing...' : compareMode ? 'Run Comparison' : 'Execute Search'}
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

          {/* ===== COMPARISON MODE: Side-by-Side ===== */}
          {hasCompareResults && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: Pure Semantic */}
                <div className="bg-white border border-surface-container-high rounded-[32px] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-container-high">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[20px] icon-fill">neurology</span>
                      </div>
                      <div>
                        <h4 className="text-[16px] font-black text-on-background">Pure Semantic</h4>
                        <p className="text-[11px] text-outline font-bold">Dense Vector Only</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[22px] font-black text-primary">{semanticTime}<span className="text-[13px] text-outline ml-1">ms</span></p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {semanticResults.map((item, i) => (
                      <ResultCard key={`sem-${i}`} item={item} rank={i + 1} />
                    ))}
                    {semanticResults.length === 0 && (
                      <p className="text-center text-outline py-8 font-medium">No results</p>
                    )}
                  </div>
                </div>

                {/* RIGHT: Hybrid RRF */}
                <div className="bg-white border border-tertiary-container/50 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-tertiary text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">Enhanced</div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-container-high">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 border border-tertiary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-tertiary text-[20px] icon-fill">hub</span>
                      </div>
                      <div>
                        <h4 className="text-[16px] font-black text-on-background">Hybrid RRF</h4>
                        <p className="text-[11px] text-outline font-bold">Vector + Keyword Boost</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[22px] font-black text-tertiary">{hybridTime}<span className="text-[13px] text-outline ml-1">ms</span></p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {hybridResults.map((item, i) => (
                      <ResultCard key={`hyb-${i}`} item={item} rank={i + 1} />
                    ))}
                    {hybridResults.length === 0 && (
                      <p className="text-center text-outline py-8 font-medium">No results</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comparison Insight Banner */}
              {semanticResults.length > 0 && hybridResults.length > 0 && (
                <div className="mt-6 bg-[#0a0f12] border border-[#161f25] rounded-[32px] p-6 md:p-8">
                  <h4 className="text-[16px] font-black text-white mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-400 text-[20px]">analytics</span>
                    Comparison Insight
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold mb-1">Semantic Top Score</p>
                      <p className="text-[24px] font-black text-primary-fixed">
                        {(semanticResults[0].score * 100).toFixed(1)}<span className="text-[14px] text-slate-500">%</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold mb-1">Hybrid Top Score</p>
                      <p className="text-[24px] font-black text-tertiary-fixed">
                        {(hybridResults[0].score * 100).toFixed(1)}<span className="text-[14px] text-slate-500">%</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold mb-1">RRF Boost Effect</p>
                      <p className="text-[24px] font-black text-amber-400">
                        +{((hybridResults[0].score - semanticResults[0].score) * 100).toFixed(1)}<span className="text-[14px] text-slate-500">%</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] text-slate-400 font-medium mt-4 leading-relaxed">
                    Hybrid RRF re-ranks documents by boosting exact keyword matches found in titles and content.
                    Documents containing the search terms "{query}" receive an additive score increase,
                    demonstrating how Actian VectorAI combines dense vector similarity with sparse keyword relevance.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== NORMAL MODE: Standard Results ===== */}
          {hasNormalResults && results.map((item, i) => (
            <ResultCard key={i} item={item} rank={i + 1} />
          ))}

          {/* Loading State */}
          {loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-surface-container-high rounded-[32px] p-16 flex flex-col items-center justify-center shadow-sm gap-4">
              <div className="flex items-center gap-6">
                <IllustrationLoadingVectors className="w-24 h-20" />
                <span className="material-symbols-outlined text-[36px] text-primary/50 animate-spin">progress_activity</span>
              </div>
              <p className="font-extrabold text-on-background text-[18px] text-center">
                {compareMode ? 'Running dual queries: Semantic + Hybrid...' : 'Querying Vector Index...'}
              </p>
            </div>
          )}

          {/* Empty State */}
          {searched && !loading && !error && !hasCompareResults && !hasNormalResults && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-surface-container-low border border-surface-container-high/60 rounded-[32px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14">
              <IllustrationEmptyGuidelines className="w-full max-w-[220px] h-auto shrink-0 drop-shadow-md" />
              <div className="text-center md:text-left">
                <p className="font-black text-on-background text-[22px]">No matching guidelines found</p>
                <p className="text-[15px] text-on-surface-variant font-medium mt-2 max-w-md">
                  Broaden the search phrase, reset specialty and urgency to “All”, or confirm the vector index has ingested documents.
                </p>
              </div>
            </div>
          )}

          {/* System Architecture */}
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

              <div className="w-full md:w-1/2 lg:w-2/5 rounded-2xl overflow-hidden relative border border-slate-700/50 bg-gradient-to-b from-[#121a1f] to-black/80 shadow-inner px-4 py-5 flex flex-col items-center justify-center min-h-[140px]">
                <IllustrationAirgappedEdge className="w-full max-w-[300px] h-auto opacity-95" />
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-emerald-400/90 text-[11px] font-bold tracking-wide">Airgapped · 0ms cloud latency</p>
                </div>
              </div>
            </div>
          </section>

          {/* Detail View Modal */}
          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0f12]/60 backdrop-blur-md" onClick={() => setSelectedItem(null)}>
              <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-3xl w-full shadow-2xl border border-surface-container-high relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex items-center gap-3 mb-6 mt-2">
                  <span className="bg-surface-container text-on-surface-variant text-[11px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider">{selectedItem.payload.specialty}</span>
                  <span className={`text-[11px] font-extrabold uppercase tracking-widest ${selectedItem.payload.urgency === 'High' ? 'text-error' : selectedItem.payload.urgency === 'Medium' ? 'text-tertiary' : 'text-outline/70'}`}>{selectedItem.payload.urgency} Priority</span>
                </div>

                <h2 className="text-[28px] font-black text-on-background leading-tight mb-6 pr-12"><HighlightText text={selectedItem.payload.title} query={query} /></h2>

                <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 mb-8">
                  <p className="text-[16px] text-on-surface font-medium leading-relaxed">
                    <HighlightText text={selectedItem.payload.content} query={query} />
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-surface-container-high">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${selectedItem.score >= 0.9 ? 'bg-secondary-container/30 text-secondary border-secondary-container' : selectedItem.score >= 0.7 ? 'bg-primary-container/30 text-primary border-primary-container' : 'bg-surface-container-high text-outline border-outline-variant/30'}`}>
                      <span className="material-symbols-outlined text-[24px] icon-fill">analytics</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-outline uppercase tracking-widest">Actian Vector Match</p>
                      <p className={`text-[20px] font-black ${selectedItem.score >= 0.9 ? 'text-secondary' : selectedItem.score >= 0.7 ? 'text-primary' : 'text-outline'}`}>
                        {(selectedItem.score * 100).toFixed(2)}<span className="text-[14px] opacity-60 ml-0.5">%</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => alert('Offline printing sequence initiated...')} className="flex-1 sm:flex-none border border-surface-container-high bg-white text-on-surface rounded-xl px-6 py-3.5 text-[14px] font-extrabold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">print</span> Print
                    </button>
                    <button onClick={() => alert('Alert sent to on-call pager.')} className="flex-1 sm:flex-none bg-[#1c5a6d] hover:bg-[#124151] text-white rounded-xl px-6 py-3.5 text-[14px] font-extrabold transition-colors shadow-sm flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">send_to_mobile</span> Send to Pager
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
