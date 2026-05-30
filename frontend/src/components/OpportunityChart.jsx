import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-card)',
    }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '6px', fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: p.fill }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// Truncate a title to fit in the chart X axis
function shortTitle(title) {
  const words = title.split(' ')
  if (words.length <= 3) return title
  return words.slice(0, 3).join(' ') + '…'
}

export default function OpportunityChart({ opportunities }) {
  if (!opportunities || opportunities.length === 0) return null

  // Derive chart data from real opportunities — cap at 6 for readability
  const chartData = opportunities.slice(0, 6).map(opp => ({
    name: shortTitle(opp.brief?.opportunity_title || opp.paper?.title || 'Opportunity'),
    gap: Math.round((opp.scores?.gap_score || opp.gap_score || 0) * 10),
    novelty: Math.round((opp.scores?.novelty_score || 0) * 10),
    ready: Math.round((opp.scores?.market_readiness_score || 0) * 10),
  }))

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-card)',
      animation: 'fadeInUp 0.4s ease 0.1s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px' }}>📈</span>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, margin: 0 }}>
          Opportunity landscape
        </h3>
        <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
          {[
            { color: '#7c3aed', label: 'Gap' },
            { color: '#a855f7', label: 'Novelty' },
            { color: '#6d28d9', label: 'Ready' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--text-muted)', fontSize: 9, fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--violet-light)' }} />
          <Bar dataKey="gap" name="gap" fill="#7c3aed" radius={[3, 3, 0, 0]} />
          <Bar dataKey="novelty" name="novelty" fill="#a855f7" radius={[3, 3, 0, 0]} />
          <Bar dataKey="ready" name="ready" fill="#6d28d9" radius={[3, 3, 0, 0]} opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}