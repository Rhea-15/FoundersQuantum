import { useEffect, useState } from 'react'
import { PIPELINE_STEPS } from '../data/mockData.js'

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const SpinnerIcon = () => (
  <div style={{
    width: '14px',
    height: '14px',
    border: '2px solid rgba(139,92,246,0.3)',
    borderTopColor: 'var(--violet-bright)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }} />
)

export default function LoadingPipeline({ query, onDone }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  useEffect(() => {
    let stepIndex = 0
    const runStep = () => {
      if (stepIndex >= PIPELINE_STEPS.length) {
        setTimeout(onDone, 600)
        return
      }
      setCurrentStep(stepIndex)
      const duration = PIPELINE_STEPS[stepIndex].duration
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, stepIndex])
        stepIndex++
        runStep()
      }, duration)
    }
    runStep()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse, var(--violet-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'glow-pulse 3s ease-in-out infinite',
      }} />

      {/* Query label */}
      <p style={{
        color: 'var(--text-muted)',
        fontSize: '14px',
        fontFamily: 'var(--font-sans)',
        marginBottom: '36px',
        animation: 'fadeIn 0.5s ease',
      }}>
        Running discovery for{' '}
        <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          "{query}"
        </strong>
      </p>

      {/* Steps card */}
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '8px',
        boxShadow: 'var(--shadow-glow)',
        animation: 'fadeInUp 0.5s ease',
      }}>
        {PIPELINE_STEPS.map((step, i) => {
          const isDone = completedSteps.includes(i)
          const isActive = currentStep === i && !isDone
          const isPending = i > currentStep || (i === currentStep && completedSteps.includes(i - 1) === false && i !== 0)

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--violet-light)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--border-hover)' : 'transparent'}`,
                marginBottom: i < PIPELINE_STEPS.length - 1 ? '4px' : 0,
                transition: 'all 0.3s ease',
                opacity: !isDone && !isActive ? 0.4 : 1,
              }}
            >
              {/* Icon */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isDone
                  ? 'rgba(52, 211, 153, 0.15)'
                  : isActive
                    ? 'var(--violet-light)'
                    : 'var(--bg-elevated)',
                border: `1px solid ${isDone ? 'rgba(52,211,153,0.4)' : isActive ? 'var(--border-hover)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: isDone ? '#34d399' : isActive ? 'var(--violet-bright)' : 'var(--text-muted)',
                transition: 'all 0.3s ease',
              }}>
                {isDone
                  ? <CheckIcon />
                  : isActive
                    ? <SpinnerIcon />
                    : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{i + 1}</span>
                }
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <p style={{
                  color: isDone ? 'var(--text-secondary)' : isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  margin: 0,
                  marginBottom: '2px',
                  transition: 'all 0.3s ease',
                }}>
                  {step.title}
                </p>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {step.subtitle}
                </p>
              </div>

              {/* Progress bar for active */}
              {isActive && (
                <div style={{ width: '48px', height: '3px', borderRadius: '2px', background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: '60%',
                    background: 'var(--violet-bright)',
                    borderRadius: '2px',
                    animation: 'shimmer 1.5s linear infinite',
                    backgroundImage: 'linear-gradient(90deg, var(--violet) 0%, #a855f7 50%, var(--violet) 100%)',
                    backgroundSize: '200% 100%',
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}