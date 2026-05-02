'use client'

import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { AlertTriangle, TrendingDown, Clock, ShieldAlert } from 'lucide-react'

const problems = [
  {
    icon: TrendingDown,
    title: '33% Patient Drop-off Rate',
    description: 'Nearly 1 in 3 patients disengage from chronic care programs before completing their treatment plans',
    severity: 33,
    color: 'rose',
  },
  {
    icon: ShieldAlert,
    title: 'Declining Adherence',
    description: 'Average adherence score of 0.46 indicates widespread medication and treatment non-compliance',
    severity: 54,
    color: 'amber',
  },
  {
    icon: Clock,
    title: 'Short Consultations',
    description: 'Average consultation time is insufficient for meaningful chronic disease management discussions',
    severity: 40,
    color: 'orange',
  },
]

export function ProblemSection() {
  return (
    <SectionWrapper id="problem" sectionNumber="01" className="bg-slate-950">
      <div className="text-center mb-12">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Critical Finding</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            The <span className="text-rose-400">Problem</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            &ldquo;Jano.Health is losing chronic care patients
            <br className="hidden sm:block" /> at an alarming rate&rdquo;
          </p>
        </FadeIn>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {problems.map((problem, i) => {
          const Icon = problem.icon
          const colorMap: Record<string, { bg: string; border: string; text: string; bar: string; glow: string }> = {
            rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', bar: 'bg-rose-500', glow: 'shadow-rose-500/10' },
            amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', bar: 'bg-amber-500', glow: 'shadow-amber-500/10' },
            orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', bar: 'bg-orange-500', glow: 'shadow-orange-500/10' },
          }
          const c = colorMap[problem.color]
          return (
            <StaggerItem key={i}>
              <div className={`glass-card glass-card-hover p-6 h-full ${c.glow} shadow-lg`}>
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center mb-5`}>
                  <Icon className={`h-6 w-6 ${c.text}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{problem.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{problem.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium uppercase tracking-wider">Severity</span>
                    <span className={`${c.text} font-bold`}>{problem.severity}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.bar} transition-all duration-1000 ease-out`}
                      style={{ width: `${problem.severity}%`, animation: 'progress-fill 1.5s ease-out' }}
                    />
                  </div>
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>

      <FadeIn delay={0.4}>
        <div className="relative glass-card p-6 border-l-4 border-l-rose-500/50">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-full bg-rose-500/10 items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-2">Key Insight</p>
              <p className="text-base text-slate-300 leading-relaxed">
                If left unaddressed, this translates to deteriorating patient health outcomes,
                increased emergency readmissions, and significant revenue loss for the organization.
                The estimated annual impact exceeds <span className="text-white font-semibold">millions in preventable costs</span>.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  )
}
