import { useState, useRef } from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Navbar from './components/Navbar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoadingPage from './pages/LoadingPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import OpportunityPage from './pages/OpportunityPage.jsx'
import { runSearch } from './lib/api.js'

export default function App() {
  const [page, setPage] = useState('landing')
  const [query, setQuery] = useState('')
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [searchResult, setSearchResult] = useState(null)
  const [searchError, setSearchError] = useState(null)
  const apiDoneRef = useRef(false)
  const animDoneRef = useRef(false)
  const pendingTransitionRef = useRef(false)

  const tryTransitionToResults = () => {
    if (apiDoneRef.current && animDoneRef.current) {
      setPage('results')
    }
  }

  const handleSearch = (q) => {
    setQuery(q)
    setSearchResult(null)
    setSearchError(null)
    apiDoneRef.current = false
    animDoneRef.current = false
    setPage('loading')

    // Fire API call immediately while animation plays
    runSearch(q)
      .then(result => {
        setSearchResult(result)
        apiDoneRef.current = true
        tryTransitionToResults()
      })
      .catch(err => {
        setSearchError(err)
        apiDoneRef.current = true
        tryTransitionToResults()
      })
  }

  const handleAnimationDone = () => {
    animDoneRef.current = true
    tryTransitionToResults()
  }

  const handleSelectOpportunity = (opp) => {
    setSelectedOpp(opp)
    setPage('opportunity')
  }

  const handleSearchAgain = () => {
    setPage('landing')
    setQuery('')
    setSearchResult(null)
    setSearchError(null)
  }

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.4s' }}>
        <Navbar
          onLogoClick={() => setPage('landing')}
          showBack={page === 'opportunity'}
          onBack={() => setPage('results')}
        />
        {page === 'landing' && (
          <LandingPage onSearch={handleSearch} />
        )}
        {page === 'loading' && (
          <LoadingPage query={query} onDone={handleAnimationDone} />
        )}
        {page === 'results' && (
          <ResultsPage
            query={query}
            searchResult={searchResult}
            searchError={searchError}
            onSelectOpportunity={handleSelectOpportunity}
            onSearchAgain={handleSearchAgain}
            onSearch={handleSearch}
          />
        )}
        {page === 'opportunity' && selectedOpp && (
          <OpportunityPage
            opportunity={selectedOpp}
            onBack={() => setPage('results')}
          />
        )}
      </div>
    </ThemeProvider>
  )
}