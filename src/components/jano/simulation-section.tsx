'use client'

import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine,
} from 'recharts'
import { FlaskConical, TrendingUp, Star, Zap } from 'lucide-react'

// ==================== HARDCODED SIMULATION DATA ====================

const simulationData = {
  baseline: 66.8,
  scenarios: [
    { name: 'Reduce Doctor Load', retention: 71.1, improvement: 4.3, recovered: 13.1 },
    { name: 'Increase Consult Time', retention: 78.6, improvement: 11.8, recovered: 35.4 },
    { name: 'Adherence Intervention', retention: 71.4, improvement: 4.6, recovered: 13.8 },
    { name: 'Combined Strategy', retention: 87.3, improvement: 20.5, recovered: 61.8, isWinner: true },
    { name: 'Specialist Assignment', retention: 69.9, improvement: 3.1, recovered: 9.3 },
  ],
}

const chartData = [
  { name: 'Baseline', retention: simulationData.baseline, isBaseline: true },
  ...simulationData.scenarios.map(s => ({ name: s.name, retention: s.retention, isWinner: s.isWinner })),
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  const scenario = simulationData.scenarios.find(s => s.name === label)
  return (
    <div className="glass-card p-3 shadow-xl border border-white/10 min-w-[180px]">
      <p className="text-xs font-semibold text-white mb-1.5">{label}</p>
      <p className="text-xs text-slate-400 mb-0.5">
        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: '#14b8a6' }} />
        Retention: <span className="text-white font-medium">{payload[0].value}%</span>
      </p>
      {scenario && (
        <>
          <p className="text-xs text-emerald-400">
            +{scenario.improvement} pp improvement
          </p>
          <p className="text-xs text-teal-400">
            {scenario.recovered}% drop-offs recovered
          </p>
        </>
      )}
    </div>
  )
}

export function SimulationSection() {
  return (
    <SectionWrapper id="simulation" sectionNumber="08" className="bg-slate-950">
      <FadeIn>
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="h-5 w-5 text-amber-400" />
          <span className="section-number">Simulation</span>
        </div>
      </FadeIn>
      <FadeIn delay={0.05}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          What-If <span className="gradient-text-amber">Analysis</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          Quantifying the impact of potential interventions through Monte Carlo-style
          simulation modeling
        </p>
      </FadeIn>

      {/* Main Chart */}
      <FadeIn delay={0.15}>
        <div className="glass-card p-5 sm:p-6 mb-10">
          <h4 className="text-sm font-semibold text-white mb-1">Scenario Impact on Patient Retention</h4>
          <p className="text-xs text-slate-500 mb-5">Baseline vs. intervention scenarios (% of patients retained)</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} barCategoryGap="15%" margin={{ bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.6)' }}
                axisLine={false}
                tickLine={false}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[55, 95]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={simulationData.baseline} stroke="rgba(255,255,255,0.15)" strokeDasharray="5 5" label={{ value: 'Baseline', position: 'right', fill: 'rgba(148,163,184,0.5)', fontSize: 10 }} />
              <Bar dataKey="retention" radius={[8, 8, 0, 0]} name="Retention %">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isWinner ? '#14b8a6' : entry.isBaseline ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.4)'}
                    fillOpacity={entry.isWinner ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </FadeIn>

      {/* Scenario Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {simulationData.scenarios.map((scenario, i) => (
          <StaggerItem key={i}>
            <div className={`glass-card p-5 h-full text-center transition-all duration-300 hover:scale-105 ${
              scenario.isWinner
                ? 'border-teal-500/30 winner-glow bg-teal-500/[0.04]'
                : 'hover:bg-white/[0.04]'
            }`}>
              {scenario.isWinner && (
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-teal-400 fill-teal-400" />
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Recommended</span>
                </div>
              )}
              <h5 className="text-sm font-semibold text-white mb-3">{scenario.name}</h5>
              <div className="text-3xl font-bold mb-1" style={{ color: scenario.isWinner ? '#14b8a6' : 'white' }}>
                {scenario.retention}%
              </div>
              <div className="text-xs text-emerald-400 font-medium mb-3">+{scenario.improvement} pp</div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(scenario.retention / 100) * 100}%`,
                    background: scenario.isWinner
                      ? 'linear-gradient(90deg, #14b8a6, #5eead4)'
                      : 'linear-gradient(90deg, rgba(148,163,184,0.4), rgba(148,163,184,0.6))',
                  }}
                />
              </div>
              <div className="text-[10px] text-slate-500">
                <span className="text-teal-400 font-medium">{scenario.recovered}%</span> drop-offs recovered
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Key Insight */}
      <FadeIn delay={0.4}>
        <div className="relative glass-card p-6 border-l-4 border-l-teal-500/50">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-full bg-teal-500/10 items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-2">Key Finding</p>
              <p className="text-base text-slate-300 leading-relaxed">
                A combined approach of better consultation time, adherence support, and balanced doctor
                loads could achieve <span className="text-white font-bold">87.3% retention</span> — a{' '}
                <span className="text-teal-400 font-semibold">+20.5 percentage point improvement</span> over baseline —{' '}
                recovering <span className="text-emerald-400 font-semibold">61.8% of all drop-offs</span>.
                This represents the single most impactful intervention strategy.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  )
}
