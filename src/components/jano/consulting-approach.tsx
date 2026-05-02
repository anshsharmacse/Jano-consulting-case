'use client'

import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { Search, BarChart3, Cpu, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Define',
    description: 'Understand Jano.Health\'s chronic care ecosystem, patient journey, and retention challenges',
    color: 'teal',
  },
  {
    icon: BarChart3,
    title: 'Measure',
    description: 'Quantify the retention problem across patient segments, disease stages, and demographics',
    color: 'violet',
  },
  {
    icon: Cpu,
    title: 'Analyze',
    description: 'Identify root causes through SQL diagnostics, machine learning, and simulation modeling',
    color: 'amber',
  },
  {
    icon: MessageSquare,
    title: 'Recommend',
    description: 'Data-driven interventions with projected impact and implementation roadmap',
    color: 'emerald',
  },
  {
    icon: CheckCircle2,
    title: 'Validate',
    description: 'Simulate outcomes to ensure feasibility and quantify expected improvements',
    color: 'rose',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', ring: 'ring-teal-500/20' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', ring: 'ring-violet-500/20' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', ring: 'ring-rose-500/20' },
}

export function ConsultingApproachSection() {
  return (
    <SectionWrapper id="approach" sectionNumber="03" className="bg-slate-950">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Consulting <span className="gradient-text-teal">Approach</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          A structured five-phase methodology ensuring rigorous, evidence-based analysis
        </p>
      </FadeIn>

      {/* Desktop Timeline */}
      <div className="hidden md:block relative">
        {/* Horizontal connector line */}
        <div className="absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-teal-500/30 via-violet-500/30 via-amber-500/30 via-emerald-500/30 to-rose-500/30" />

        <StaggerContainer className="grid grid-cols-5 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            const c = colorMap[step.color]
            return (
              <StaggerItem key={i}>
                <div className="relative text-center group">
                  {/* Circle node */}
                  <div className="relative mx-auto w-[104px] h-[104px] mb-5">
                    <div className={`absolute inset-0 rounded-full ${c.bg} ${c.border} border-2 transition-transform duration-300 group-hover:scale-110`} />
                    <div className={`absolute inset-2 rounded-full ${c.bg} ${c.border} border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:ring-4 ${c.ring}`}>
                      <Icon className={`h-7 w-7 ${c.text}`} />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                  </div>

                  <h3 className={`text-base font-bold ${c.text} mb-2 transition-colors duration-300`}>{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed px-1">{step.description}</p>

                  {/* Arrow to next step */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-[52px] -right-3 z-10">
                      <ArrowRight className="h-4 w-4 text-white/20" />
                    </div>
                  )}
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-0">
        {steps.map((step, i) => {
          const Icon = step.icon
          const c = colorMap[step.color]
          return (
            <div key={i} className="flex gap-4">
              {/* Left side: line + dot */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${c.bg} ${c.border} border-2 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${c.text}`} />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-white/5 my-1" />
                )}
              </div>
              {/* Right side: content */}
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-600 uppercase">Step {i + 1}</span>
                </div>
                <h3 className={`text-base font-bold ${c.text} mb-1.5`}>{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
