'use client'

import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { HelpCircle } from 'lucide-react'

const questions = [
  {
    number: '01',
    question: 'What is the patient retention rate, and how does it vary by disease stage, age group, and gender?',
    area: 'Retention Analysis',
    color: 'teal',
  },
  {
    number: '02',
    question: 'Which doctors have the highest and lowest patient retention rates, and why?',
    area: 'Doctor Performance',
    color: 'violet',
  },
  {
    number: '03',
    question: 'How does consultation time impact patient follow-through and retention?',
    area: 'Time Analysis',
    color: 'amber',
  },
  {
    number: '04',
    question: 'Can we predict which patients are at risk of dropping off before they do?',
    area: 'Predictive Modeling',
    color: 'emerald',
  },
  {
    number: '05',
    question: 'What interventions would most effectively improve retention, and by how much?',
    area: 'Intervention Design',
    color: 'rose',
  },
]

const colorMap: Record<string, { badge: string; border: string; text: string; bg: string }> = {
  teal: { badge: 'bg-teal-500/15 text-teal-400', border: 'border-teal-500/10', text: 'text-teal-400', bg: 'bg-teal-500' },
  violet: { badge: 'bg-violet-500/15 text-violet-400', border: 'border-violet-500/10', text: 'text-violet-400', bg: 'bg-violet-500' },
  amber: { badge: 'bg-amber-500/15 text-amber-400', border: 'border-amber-500/10', text: 'text-amber-400', bg: 'bg-amber-500' },
  emerald: { badge: 'bg-emerald-500/15 text-emerald-400', border: 'border-emerald-500/10', text: 'text-emerald-400', bg: 'bg-emerald-500' },
  rose: { badge: 'bg-rose-500/15 text-rose-400', border: 'border-rose-500/10', text: 'text-rose-400', bg: 'bg-rose-500' },
}

export function QuestionsSection() {
  return (
    <SectionWrapper id="questions" sectionNumber="04" className="bg-slate-950">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Key Questions We Set Out to{' '}
          <span className="gradient-text-teal">Answer</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          Five critical questions that guided our analytical approach and shaped our recommendations
        </p>
      </FadeIn>

      <StaggerContainer className="space-y-4">
        {questions.map((q, i) => {
          const c = colorMap[q.color]
          return (
            <StaggerItem key={i}>
              <div className={`glass-card glass-card-hover p-5 sm:p-6 flex items-start gap-4 sm:gap-6 ${c.border} border-l-2`}>
                {/* Number badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${c.badge} flex items-center justify-center`}>
                  <span className="text-sm font-bold">{q.number}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${c.text} ${c.badge} px-2 py-0.5 rounded`}>
                      {q.area}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {/* Question icon */}
                <div className="hidden sm:flex flex-shrink-0 opacity-20">
                  <HelpCircle className="h-6 w-6 text-slate-400" />
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </SectionWrapper>
  )
}
