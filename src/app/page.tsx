'use client'

import { Navigation } from '@/components/jano/navigation'
import { HeroSection } from '@/components/jano/hero-section'
import { ProblemSection } from '@/components/jano/problem-section'
import { SolutionSection } from '@/components/jano/solution-section'
import { ConsultingApproachSection } from '@/components/jano/consulting-approach'
import { QuestionsSection } from '@/components/jano/questions-section'
import { DataSection } from '@/components/jano/data-section'
import { SqlAnalysisSection } from '@/components/jano/sql-analysis-section'
import { MlSection } from '@/components/jano/ml-section'
import { SimulationSection } from '@/components/jano/simulation-section'
import { ResultsSection } from '@/components/jano/results-section'
import { Separator } from '@/components/ui/separator'
import { Heart, BarChart3, Sparkles } from 'lucide-react'

function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10">
                <Heart className="h-4 w-4 text-teal-400" fill="currentColor" fillOpacity={0.3} />
              </div>
              <span className="text-base font-bold text-white">Jano.Health</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Improving Chronic Care Retention & Outcomes through data-driven analytics and predictive modeling.
            </p>
          </div>

          {/* Center - Project Info */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-3">
              <BarChart3 className="h-3.5 w-3.5 text-teal-400" />
              <span className="text-xs font-medium text-slate-400">Powered by Data Analytics</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
              <span>2,000 Patients</span>
              <span>·</span>
              <span>25 Doctors</span>
              <span>·</span>
              <span>5,992 Interactions</span>
            </div>
          </div>

          {/* Credits */}
          <div className="md:text-right">
            <div className="flex items-center gap-1.5 md:justify-end mb-2">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span className="text-xs font-medium text-slate-400">Analytics Engagement</span>
            </div>
            <p className="text-xs text-slate-600">
              SQL Analysis · ML Modeling · Simulation · Insights
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/5" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-[9px] font-bold text-slate-950">
              AS
            </div>
            <p className="text-xs text-slate-500">
              Ansh Sharma | Healthcare Analytics Consultant
            </p>
          </div>
          <p className="text-xs text-slate-700">
            Built with Next.js, Recharts, Tailwind CSS & TypeScript · 2025
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function JanoHealthPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ConsultingApproachSection />
        <QuestionsSection />
        <DataSection />
        <SqlAnalysisSection />
        <MlSection />
        <SimulationSection />
        <ResultsSection />
      </main>
      <Footer />
    </div>
  )
}
