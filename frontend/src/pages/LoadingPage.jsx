import LoadingPipeline from '../components/LoadingPipeline.jsx'

export default function LoadingPage({ query, onDone }) {
  return (
    <div className="grid-bg" style={{ minHeight: 'calc(100vh - 60px)', position: 'relative' }}>
      <LoadingPipeline query={query} onDone={onDone} />
    </div>
  )
}