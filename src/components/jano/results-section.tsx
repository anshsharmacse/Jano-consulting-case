'use client'

import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ArrowRight, Clock, ShieldCheck, Users, TrendingUp, Sparkles, Award } from 'lucide-react'

const recommendations = [
  {
    icon: Clock,
    title: 'Increase Minimum Consultation Time',
    description: 'Moving all consultations to 10+ minutes could improve retention by approximately 12 percentage points. Short consultations (<10 min) show 57.7% retention vs. 71.7% for medium-length sessions.',
    impact: '+12%',
    metric: 'Retention Improvement',
    color: 'violet',
  },
  {
    icon: ShieldCheck,
    title: 'Implement Adherence Monitoring',
    description: 'Targeted adherence interventions for patients scoring below 0.4 could recover approximately 14% of drop-offs. High-adherence patients show 82.8% retention vs. 61.4% for low-adherence.',
    impact: '+14%',
    metric: 'Drop-offs Recovered',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Balance Doctor Workloads',
    description: 'Redistributing patients from high-load doctors (>240 patients) to medium-load doctors could improve outcomes by approximately 4 percentage points across the network.',
    impact: '+4%',
    metric: 'Retention Improvement',
    color: 'emerald',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'shadow-violet-500/10' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/10' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
}

export function ResultsSection() {
  return (
    <SectionWrapper id="results" sectionNumber="09" className="bg-slate-950">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Results & <span className="gradient-text-teal">Recommendations</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          Evidence-based strategic recommendations derived from SQL analysis, machine learning,
          and simulation modeling
        </p>
      </FadeIn>

      {/* Recommendation Cards */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
        {recommendations.map((rec, i) => {
          const Icon = rec.icon
          const c = colorMap[rec.color]
          return (
            <StaggerItem key={i}>
              <div className={`glass-card glass-card-hover p-6 h-full shadow-lg ${c.glow} border ${c.border} border-l-4`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${c.text}`} />
                  </div>
                  <Badge className={`text-xs ${c.bg} ${c.text} border ${c.border}`}>
                    {rec.impact}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white mb-3">{rec.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{rec.description}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <TrendingUp className={`h-3 w-3 ${c.text}`} />
                  <span>{rec.metric}</span>
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>

      {/* Before/After Comparison */}
      <FadeIn delay={0.3}>
        <div className="glass-card p-6 sm:p-8 mb-14">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Projected Combined Impact</h3>
            </div>
            <p className="text-sm text-slate-500">Implementation of all three recommendations simultaneously</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Before */}
            <div className="text-center">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">Before</div>
              <div className="text-5xl font-bold text-rose-400/80 mb-1">66.8<span className="text-2xl">%</span></div>
              <div className="text-xs text-slate-500">Current Retention</div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="h-px w-20 bg-gradient-to-r from-rose-500/30 to-teal-500/30" />
                <div className="absolute -top-1.5 right-0">
                  <ArrowRight className="h-4 w-4 text-teal-400/50" />
                </div>
              </div>
            </div>

            {/* After */}
            <div className="text-center">
              <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">After</div>
              <div className="text-5xl font-bold gradient-text-teal mb-1">87.3<span className="text-2xl">%</span></div>
              <div className="text-xs text-slate-500">Projected Retention</div>
            </div>

            {/* Improvement */}
            <div className="text-center">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Improvement</div>
              <div className="text-5xl font-bold text-emerald-400 mb-1">+20.5<span className="text-2xl">pp</span></div>
              <div className="text-xs text-slate-500">Percentage Points</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8 max-w-lg mx-auto">
            <div className="h-4 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white z-10">66.8% → 87.3%</span>
              </div>
              <div className="h-full rounded-full bg-gradient-to-r from-rose-500/40 via-amber-500/50 to-teal-500" style={{ width: '87.3%' }} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-600">0%</span>
              <span className="text-[10px] text-slate-600">100%</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Summary Boxes */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {[
          { icon: CheckCircle2, label: 'Key Predictors', value: 'Adherence Score', color: 'teal' },
          { icon: TrendingUp, label: 'Biggest Win', value: 'Consultation Time', color: 'violet' },
          { icon: Sparkles, label: 'Optimal Strategy', value: 'Combined Approach', color: 'amber' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <StaggerItem key={i}>
              <div className="glass-card p-5 text-center hover:bg-white/[0.04] transition-colors">
                <Icon className="h-5 w-5 mx-auto mb-2 text-slate-400" />
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">{item.label}</div>
                <div className="text-sm font-bold text-white">{item.value}</div>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>

      {/* Author Card */}
      <FadeIn delay={0.4}>
        <div className="glass-card p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20">
              AS
            </div>
            <div className="text-left">
              <p className="text-base font-bold text-white">Ansh Sharma</p>
              <p className="text-xs text-slate-500">Healthcare Analytics Consultant</p>
            </div>
          </div>
          <div className="h-px bg-white/5 my-4" />
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            This analysis was conducted using SQL diagnostic queries, Random Forest classification,
            and simulation modeling to provide evidence-based recommendations for improving
            Jano.Health&apos;s chronic care patient retention.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-[10px] text-teal-400/60 font-medium">Jano.Health</span>
            <span className="text-[10px] text-slate-700">|</span>
            <span className="text-[10px] text-slate-600">2025</span>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  )
}
