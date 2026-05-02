'use client'

import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import { Brain, Target, TrendingUp, BarChart3, Zap } from 'lucide-react'

// ==================== HARDCODED ML DATA ====================

const modelComparisonData = [
  { model: 'Random Forest', auc: 62.68, accuracy: 63.39 },
  { model: 'Gradient Boosting', auc: 61.09, accuracy: 66.31 },
  { model: 'Logistic Regression', auc: 61.44, accuracy: 57.38 },
]

const featureImportanceData = [
  { feature: 'adherence_score', importance: 23.15 },
  { feature: 'pat_avg_time', importance: 12.06 },
  { feature: 'age', importance: 11.38 },
  { feature: 'consultation_time', importance: 10.59 },
  { feature: 'doc_retention_rate', importance: 5.81 },
  { feature: 'doc_avg_time', importance: 5.42 },
  { feature: 'stage_severity', importance: 5.32 },
  { feature: 'doc_total_patients', importance: 4.65 },
  { feature: 'pat_unique_docs', importance: 4.47 },
  { feature: 'pat_total_consults', importance: 4.39 },
]

const confusionMatrix = {
  tn: 165, fp: 206, fn: 233, tp: 595,
}

const classificationMetrics = {
  'Drop-off (0)': { precision: 0.44, recall: 0.72, f1: 0.55, support: 371 },
  'Retained (1)': { precision: 0.74, recall: 0.44, f1: 0.55, support: 828 },
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  return (
    <div className="glass-card p-3 shadow-xl border border-white/10">
      <p className="text-xs font-semibold text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="text-white font-medium">{p.value.toFixed(1)}%</span>
        </p>
      ))}
    </div>
  )
}

// ==================== CONFUSION MATRIX ====================

function ConfusionMatrix() {
  const { tn, fp, fn, tp } = confusionMatrix
  const total = tn + fp + fn + tp

  return (
    <FadeIn delay={0.3}>
      <div className="glass-card p-5 sm:p-6">
        <h4 className="text-sm font-semibold text-white mb-1">Confusion Matrix</h4>
        <p className="text-xs text-slate-500 mb-5">Random Forest predictions on test set</p>

        <div className="max-w-sm mx-auto">
          {/* Headers */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-1 mb-1">
            <div />
            <div className="w-20 sm:w-24 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider pb-1">Predicted No</div>
            <div className="w-20 sm:w-24 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider pb-1">Predicted Yes</div>
          </div>

          {/* Row: Actual No */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-1 mb-1">
            <div className="flex items-center pr-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actual No</span>
            </div>
            <div className="confusion-cell w-20 sm:w-24 h-20 sm:h-24 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">{tn}</span>
              <span className="text-[9px] text-emerald-400/60">True Neg</span>
            </div>
            <div className="confusion-cell w-20 sm:w-24 h-20 sm:h-24 rounded-lg bg-rose-500/15 border border-rose-500/20 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-rose-400">{fp}</span>
              <span className="text-[9px] text-rose-400/60">False Pos</span>
            </div>
          </div>

          {/* Row: Actual Yes */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-1">
            <div className="flex items-center pr-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actual Yes</span>
            </div>
            <div className="confusion-cell w-20 sm:w-24 h-20 sm:h-24 rounded-lg bg-amber-500/15 border border-amber-500/20 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-amber-400">{fn}</span>
              <span className="text-[9px] text-amber-400/60">False Neg</span>
            </div>
            <div className="confusion-cell w-20 sm:w-24 h-20 sm:h-24 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">{tp}</span>
              <span className="text-[9px] text-emerald-400/60">True Pos</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[10px] text-slate-500">Total predictions: <span className="text-slate-400 font-medium">{total}</span></span>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

// ==================== CLASSIFICATION METRICS ====================

function ClassificationMetrics() {
  return (
    <FadeIn delay={0.35}>
      <div className="glass-card p-5 sm:p-6">
        <h4 className="text-sm font-semibold text-white mb-1">Classification Report</h4>
        <p className="text-xs text-slate-500 mb-5">Per-class performance metrics</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500">
                <th className="text-left pb-3 font-medium">Class</th>
                <th className="text-center pb-3 font-medium">Precision</th>
                <th className="text-center pb-3 font-medium">Recall</th>
                <th className="text-center pb-3 font-medium">F1-Score</th>
                <th className="text-center pb-3 font-medium">Support</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(classificationMetrics).map(([cls, metrics]) => (
                <tr key={cls} className="border-t border-white/5">
                  <td className="py-3 text-slate-300 font-medium">{cls}</td>
                  <td className="py-3 text-center font-mono text-slate-400">{metrics.precision.toFixed(2)}</td>
                  <td className="py-3 text-center font-mono text-slate-400">{metrics.recall.toFixed(2)}</td>
                  <td className="py-3 text-center font-mono text-slate-400">{metrics.f1.toFixed(2)}</td>
                  <td className="py-3 text-center font-mono text-slate-400">{metrics.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 p-3 rounded-lg bg-teal-500/5 border border-teal-500/10">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-teal-300/80 leading-relaxed">
              <span className="font-semibold text-teal-400">Key Insight:</span> Adherence score is the #1 predictor of drop-off (23.2% importance), followed by consultation time patterns (12.1%) and patient age (11.4%).
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

// ==================== MAIN SECTION ====================

export function MlSection() {
  return (
    <SectionWrapper id="ml-analysis" sectionNumber="07" className="bg-slate-950">
      <FadeIn>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-violet-400" />
          <span className="section-number">Machine Learning</span>
        </div>
      </FadeIn>
      <FadeIn delay={0.05}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Predicting Patient <span className="text-violet-400">Drop-off</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          Random Forest classifier trained on 2,000 patient records to identify at-risk individuals
          before they disengage from chronic care programs
        </p>
      </FadeIn>

      {/* Model Comparison + Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Model Comparison */}
        <FadeIn delay={0.15}>
          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <h4 className="text-sm font-semibold text-white">Model Comparison</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">Evaluating three classification algorithms</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={modelComparisonData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="model" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 70]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="auc" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="AUC" barSize={24} />
                <Bar dataKey="accuracy" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Accuracy" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge className="text-[10px] bg-violet-500/15 text-violet-400 border-violet-500/20">
                Best: Random Forest AUC 0.627
              </Badge>
            </div>
          </div>
        </FadeIn>

        {/* Feature Importance */}
        <FadeIn delay={0.2}>
          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Top 10 Feature Importance</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">Key predictors of patient drop-off</p>
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {featureImportanceData.map((feat, i) => {
                const maxImportance = featureImportanceData[0].importance
                const pct = (feat.importance / maxImportance) * 100
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-600 font-mono w-4 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-300 font-medium truncate mr-2">{feat.feature}</span>
                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">{feat.importance.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Confusion Matrix + Classification Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConfusionMatrix />
        <ClassificationMetrics />
      </div>
    </SectionWrapper>
  )
}
