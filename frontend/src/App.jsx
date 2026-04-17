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
          specialty: specialty === 'All' ? 'All' : specialty,
          urgency: urgency === 'All' ? 'All' : urgency,
          use_hybrid: useHybrid,
          limit: 3
        })
      })

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error(err)
      setResults([
        { id: '1', score: 0.98, payload: { title: 'Aspirin Guideline', specialty: 'Cardiology', urgency: 'High', content: 'Connection to backend failed. Demo Mode.' } }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex">
      {/* Desktop SideNavBar */}
      <nav className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-2xl rounded-xl m-4 shadow-2xl shadow-sky-900/10 z-40 fixed left-0 top-0 h-[calc(100vh-2rem)] p-4 font-['Plus_Jakarta_Sans'] text-sm font-medium">
        <div className="flex items-center gap-4 mb-8 px-4 mt-2">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined icon-fill text-primary text-2xl">health_and_safety</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-sky-900">MedEdge AI</h1>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider">Edge Inference</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-grow">
          <a className="bg-sky-50 text-sky-700 rounded-lg px-6 py-4 flex items-center gap-3 hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined icon-fill">search_insights</span>
            Database Search
          </a>
          <a className="text-slate-500 px-6 py-4 flex items-center gap-3 hover:bg-sky-50/50 rounded-lg transition-colors hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">folder_shared</span>
            Patient Records
          </a>
        </div>
        
        <div className="mt-auto mb-6 px-4">
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white rounded-full py-3 px-6 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">wifi_off</span>
            Offline Mode Ready
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[19.5rem] p-4 md:p-8 md:pt-4 max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <header className="mb-8 hidden md:flex justify-between items-center mt-4">
          <div>
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-background mb-1">Search Database</h2>
            <p className="text-on-surface-variant">Query patient records and clinical guidelines natively at the edge.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full bg-surface-container-high rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border-none transition-all placeholder:text-outline shadow-sm" 
              placeholder="Search symptoms, treatments..." 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
          
          {/* Active Query Status (Wide) */}
          <section className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl p-6 shadow-xl shadow-sky-900/5 hover:shadow-sky-900/10 transition-all duration-300 group border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-headline font-bold text-on-background">
                  {searched ? `Active Query: "${query}"` : "Awaiting Query..."}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">Actian Vector DB Retrieval Status</p>
              </div>
              <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> 
                {loading ? 'Searching' : 'Complete'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-surface-container-high pt-6">
              <div>
                <p className="text-xs text-outline uppercase tracking-wider mb-1">Matches Found</p>
                <p className="text-3xl font-headline font-extrabold text-primary">{results.length}</p>
              </div>
              <div>
                <p className="text-xs text-outline uppercase tracking-wider mb-1">Retrieval Engine</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-headline font-extrabold text-secondary">{useHybrid ? 'Hybrid' : 'Vector'}</p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button className="bg-primary-container text-on-primary-container rounded-full px-5 py-2 text-sm font-semibold hover:bg-primary-fixed-dim transition-colors flex items-center gap-2">
                  Export Log <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
            </div>
          </section>

          {/* Quick Filters (Tall) */}
          <section className="md:row-span-2 bg-white rounded-2xl p-6 shadow-xl shadow-sky-900/5 transition-all duration-300 border border-slate-100 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                <span className="material-symbols-outlined">tune</span>
              </div>
              <h3 className="text-lg font-headline font-bold text-on-background">Vector Filters</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {/* Specialty Filter */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-transparent focus-within:border-primary">
                <label className="text-xs font-bold text-outline uppercase ml-1">Specialty</label>
                <select className="w-full bg-transparent font-semibold text-sm mt-1 focus:outline-none text-sky-900 cursor-pointer" value={specialty} onChange={e => setSpecialty(e.target.value)}>
                  <option value="All">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Emergency Medicine">Emergency</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              {/* Urgency Filter */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-transparent focus-within:border-primary">
                <label className="text-xs font-bold text-outline uppercase ml-1">Urgency</label>
                <select className="w-full bg-transparent font-semibold text-sm mt-1 focus:outline-none text-sky-900 cursor-pointer" value={urgency} onChange={e => setUrgency(e.target.value)}>
                  <option value="All">Any Urgency</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Hybrid Toggle */}
              <div 
                className={`rounded-xl p-3 flex justify-between items-center cursor-pointer transition-colors border ${useHybrid ? 'bg-primary-container/30 border-primary-container' : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'}`}
                onClick={() => setUseHybrid(!useHybrid)}
              >
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] ${useHybrid ? 'text-primary icon-fill' : 'text-outline'}`}>hub</span>
                  <span className={`text-sm font-bold ${useHybrid ? 'text-primary' : 'text-on-surface'}`}>Hybrid Fusion</span>
                </div>
                <span className={`material-symbols-outlined text-[20px] ${useHybrid ? 'text-primary' : 'text-outline'}`}>
                  {useHybrid ? 'toggle_on' : 'toggle_off'}
                </span>
              </div>
            </div>
          </section>

          {/* Map Results to Compact Data Cards */}
          {results.map((item, index) => {
             const isHigh = item.payload.urgency === 'High';
             const isMedium = item.payload.urgency === 'Medium';
             const colorClass = isHigh ? 'error' : isMedium ? 'tertiary' : 'secondary';
             const bgClass = isHigh ? 'bg-error-container text-on-error-container' : isMedium ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container';
             const icon = isHigh ? 'warning' : 'vital_signs';

             return (
              <div key={index} className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-sky-900/5 hover:-translate-y-1 hover:shadow-sky-900/15 transition-all duration-300 border border-slate-100 h-48">
                <div className="flex justify-between items-start mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgClass}`}>
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider text-${colorClass} bg-${colorClass}/5 px-2 py-1 rounded-md`}>
                    {item.payload.specialty}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-[15px] font-extrabold text-sky-950 line-clamp-2 leading-tight">{item.payload.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium">{item.payload.content}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Match Score</span>
                  <div className={`w-8 h-8 rounded-full border-2 border-${colorClass} flex items-center justify-center`}>
                    <span className={`text-[11px] font-black text-${colorClass}`}>{(item.score * 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>
             )
          })}

          {/* Empty State */}
          {searched && results.length === 0 && !loading && (
            <div className="bg-surface-dim rounded-2xl p-5 flex flex-col justify-center items-center opacity-80 border border-outline-variant/20 col-span-1 md:col-span-2 lg:col-span-3 min-h-[12rem]">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">folder_off</span>
              <p className="font-bold text-on-surface-variant">No guidelines matched your query.</p>
            </div>
          )}

          {loading && (
             <div className="bg-white rounded-2xl p-5 flex flex-col justify-center items-center border border-slate-100 col-span-1 md:col-span-2 lg:col-span-3 min-h-[12rem] shadow-xl shadow-sky-900/5">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-2">autorenew</span>
                <p className="font-bold text-sky-900">Querying Actian Vector Engine...</p>
             </div>
          )}

          {/* Data Source Distribution */}
          <section className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl p-6 shadow-xl shadow-sky-900/5 border border-slate-100 relative overflow-hidden mt-2">
            <h3 className="text-lg font-headline font-bold text-on-background mb-4">Architecture Telemetry</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 w-full space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-sky-900">Actian Vector Index (HNSW)</span>
                    <span className="font-black text-primary">85%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-primary rounded-full h-2.5 shadow-[0_0_10px_rgba(43,102,122,0.5)]" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-sky-900">BM25 Keyword Cache</span>
                    <span className="font-black text-secondary">15%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-secondary rounded-full h-2.5 shadow-[0_0_10px_rgba(74,102,76,0.5)]" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 aspect-video rounded-xl bg-slate-900 relative shadow-inner overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-slate-900 to-black"></div>
                 <div className="relative z-10 text-center">
                    <span className="material-symbols-outlined text-white text-3xl mb-1">memory</span>
                    <p className="text-white text-xs font-bold tracking-widest uppercase">Local Edge Node</p>
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
