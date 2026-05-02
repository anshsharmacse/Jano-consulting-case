'use client'

import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { Database, Brain, FlaskConical, Lightbulb, ArrowRight } from 'lucide-react'

const pillars = [
  {
    icon: Database,
    title: 'SQL Diagnostic Analysis',
    description: 'Deep-dive into patient behavior patterns using 10+ analytical queries across patient, doctor, and interaction data',
    color: 'teal',
    step: '01',
  },
  {
    icon: Brain,
    title: 'Machine Learning',
    description: 'Predictive model to identify at-risk patients before they drop off using Random Forest classification',
    color: 'violet',
    step: '02',
  },
  {
    icon: FlaskConical,
    title: 'Simulation Modeling',
    description: 'What-if scenarios to quantify the impact of potential interventions on patient retention rates',
    color: 'amber',
    step: '03',
  },
  {
    icon: Lightbulb,
    title: 'Actionable Insights',
    description: 'Translating analytics into concrete business recommendations with projected ROI',
    color: 'emerald',
    step: '04',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', glow: 'group-hover:shadow-teal-500/20' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'group-hover:shadow-violet-500/20' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/20' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/20' },
}

export function SolutionSection() {
  return (
    <SectionWrapper id="solution" sectionNumber="02" className="bg-slate-950">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          The <span className="gradient-text-teal">Solution</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          A data-driven consulting approach to chronic care retention, combining deep analytics,
          predictive modeling, and strategic recommendations
        </p>
      </FadeIn>

      <div className="relative">
        {/* Connecting line - desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent -translate-y-1/2" />

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            const c = colorMap[pillar.color]
            return (
              <StaggerItem key={i}>
                <div className={`group relative glass-card glass-card-hover p-6 h-full transition-all duration-300 hover:shadow-lg ${c.glow}`}>
                  {/* Step number */}
                  <span className={`absolute top-4 right-4 text-3xl font-bold ${c.text} opacity-10`}>
                    {pillar.step}
                  </span>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${c.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-3 pr-8">{pillar.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{pillar.description}</p>

                  {/* Arrow */}
                  <div className={`flex items-center gap-1 text-xs font-medium ${c.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <span>Learn more</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Connecting arrows between pillars on mobile/tablet */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-teal-500/20" />
          <div className="flex-1 h-px bg-teal-500/20" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-teal-500/20" />
        </div>
      </div>
    </SectionWrapper>
  )
}
