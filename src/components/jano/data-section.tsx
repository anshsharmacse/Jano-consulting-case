'use client'

import { useEffect, useState } from 'react'
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  Legend,
} from 'recharts'
import { Database, Table2, Key, Link, ArrowRight } from 'lucide-react'

const COLORS = ['#14b8a6', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#06b6d4']

interface SummaryData {
  totalPatients: number
  totalDoctors: number
  totalInteractions: number
  avgAdherence: number
  avgConsultTime: number
  retentionRate: number
  diseaseStageDistribution: { stage: string; count: number; percentage: number }[]
  ageDistribution: { ageGroup: string; count: number; percentage: number }[]
  genderDistribution: { gender: string; count: number; percentage: number }[]
}

const schemaTables = [
  {
    name: 'patients',
    icon: 'P',
    color: 'teal',
    fields: [
      { name: 'patient_id', type: 'INT', pk: true },
      { name: 'age', type: 'INT' },
      { name: 'gender', type: 'VARCHAR' },
      { name: 'disease_stage', type: 'INT' },
      { name: 'adherence_score', type: 'FLOAT' },
      { name: 'avg_consult_time', type: 'FLOAT' },
      { name: 'total_consultations', type: 'INT' },
      { name: 'retained', type: 'BOOLEAN' },
    ],
  },
  {
    name: 'doctors',
    icon: 'D',
    color: 'violet',
    fields: [
      { name: 'doctor_id', type: 'INT', pk: true },
      { name: 'specialty', type: 'VARCHAR' },
      { name: 'experience', type: 'INT' },
      { name: 'hospital', type: 'VARCHAR' },
      { name: 'total_patients', type: 'INT' },
      { name: 'avg_consult_time', type: 'FLOAT' },
      { name: 'retention_rate', type: 'FLOAT' },
    ],
  },
  {
    name: 'interactions',
    icon: 'I',
    color: 'amber',
    fields: [
      { name: 'interaction_id', type: 'INT', pk: true },
      { name: 'patient_id', type: 'INT', fk: true },
      { name: 'doctor_id', type: 'INT', fk: true },
      { name: 'consultation_time', type: 'FLOAT' },
      { name: 'date', type: 'DATE' },
    ],
  },
]

const schemaColorMap: Record<string, { bg: string; border: string; text: string; headerBg: string }> = {
  teal: { bg: 'bg-teal-500/5', border: 'border-teal-500/20', text: 'text-teal-400', headerBg: 'bg-teal-500/10' },
  violet: { bg: 'bg-violet-500/5', border: 'border-violet-500/20', text: 'text-violet-400', headerBg: 'bg-violet-500/10' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', headerBg: 'bg-amber-500/10' },
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  return (
    <div className="glass-card p-3 shadow-xl border border-white/10">
      <p className="text-xs font-semibold text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="text-white font-medium">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

export function DataSection() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [patients, setPatients] = useState<Record<string, unknown>[]>([])
  const [doctors, setDoctors] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, patientsRes, doctorsRes] = await Promise.all([
          fetch('/api/data/summary'),
          fetch('/api/data/patients?page=1&limit=5'),
          fetch('/api/data/doctors'),
        ])
        const summaryData = await summaryRes.json()
        const patientsData = await patientsRes.json()
        const doctorsData = await doctorsRes.json()
        setSummary(summaryData)
        setPatients(patientsData?.data || patientsData?.patients || [])
        setDoctors(Array.isArray(doctorsData) ? doctorsData.slice(0, 5) : [])
      } catch (e) {
        console.error('Failed to fetch data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const diseaseChartData = (summary?.diseaseStageDistribution || []).map((d) => ({
    name: d.stage,
    Patients: d.count,
  }))

  const ageChartData = (summary?.ageDistribution || []).map((d) => ({
    name: d.ageGroup,
    Patients: d.count,
  }))

  const genderChartData = (summary?.genderDistribution || []).map((d) => ({
    name: d.gender,
    value: d.count,
  }))

  return (
    <SectionWrapper id="data" sectionNumber="05" className="bg-slate-950">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Understanding the <span className="gradient-text-teal">Data</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          How I dealt with the data: Exploring Jano.Health&apos;s relational database
          containing patient records, doctor profiles, and interaction logs
        </p>
      </FadeIn>

      {/* Summary Stats */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
        {[
          { label: 'Patients', value: summary?.totalPatients ?? '—', icon: 'P' },
          { label: 'Doctors', value: summary?.totalDoctors ?? '—', icon: 'D' },
          { label: 'Interactions', value: summary?.totalInteractions ?? '—', icon: 'I' },
          { label: 'Avg Adherence', value: summary ? summary.avgAdherence.toFixed(2) : '—', icon: 'A' },
          { label: 'Avg Time (min)', value: summary ? summary.avgConsultTime.toFixed(1) : '—', icon: 'T' },
          { label: 'Retention Rate', value: summary ? `${summary.retentionRate}%` : '—', icon: 'R' },
        ].map((stat, i) => (
          <StaggerItem key={i}>
            <div className="glass-card p-4 text-center group hover:bg-white/[0.04] transition-colors">
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums mb-1">
                {loading ? (
                  <Skeleton className="h-7 w-16 mx-auto" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Database Schema */}
      <FadeIn delay={0.2}>
        <div className="mb-6 flex items-center gap-2">
          <Database className="h-4 w-4 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Database Schema</h3>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {schemaTables.map((table, i) => {
            const c = schemaColorMap[table.color]
            return (
              <div key={i} className={`${c.bg} border ${c.border} rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]`}>
                {/* Table Header */}
                <div className={`${c.headerBg} px-4 py-3 flex items-center gap-2.5 border-b ${c.border}`}>
                  <Table2 className={`h-4 w-4 ${c.text}`} />
                  <span className={`font-bold ${c.text}`}>{table.name}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">{table.fields.length} fields</span>
                </div>

                {/* Fields */}
                <div className="p-3 space-y-1">
                  {table.fields.map((field, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-white/[0.03] transition-colors">
                      {field.pk && <Key className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                      {field.fk && <Link className="h-3 w-3 text-violet-400 flex-shrink-0" />}
                      {!field.pk && !field.fk && <div className="w-3" />}
                      <span className="text-slate-300 font-medium flex-1">{field.name}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-white/10 text-slate-500 font-mono">
                        {field.type}
                      </Badge>
                      {field.pk && (
                        <Badge className="text-[9px] px-1.5 py-0 h-4 bg-amber-500/15 text-amber-400 border-amber-500/20">
                          PK
                        </Badge>
                      )}
                      {field.fk && (
                        <Badge className="text-[9px] px-1.5 py-0 h-4 bg-violet-500/15 text-violet-400 border-violet-500/20">
                          FK
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Relationship arrows - desktop only */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {/* SVG connections would go here, but CSS-only approach */}
          </div>
        </div>
      </FadeIn>

      {/* Relationship indicator */}
      <FadeIn delay={0.35}>
        <div className="flex items-center justify-center gap-4 mb-16 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="h-px w-8 bg-teal-500/30" />
            <span>interactions.patient_id</span>
            <ArrowRight className="h-3 w-3 text-teal-400/50" />
            <span>patients.patient_id</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <div className="h-px w-8 bg-violet-500/30" />
            <span>interactions.doctor_id</span>
            <ArrowRight className="h-3 w-3 text-violet-400/50" />
            <span>doctors.doctor_id</span>
          </div>
        </div>
      </FadeIn>

      {/* Distribution Charts */}
      <FadeIn delay={0.3}>
        <h3 className="text-lg font-bold text-white mb-6">Data Distributions</h3>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {/* Disease Stage Distribution */}
        <FadeIn delay={0.35}>
          <div className="glass-card p-5">
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Disease Stage Distribution</h4>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={diseaseChartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.6)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.6)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Patients" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>

        {/* Age Group Distribution */}
        <FadeIn delay={0.4}>
          <div className="glass-card p-5">
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Age Group Distribution</h4>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ageChartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.6)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.6)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Patients" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>

        {/* Gender Distribution */}
        <FadeIn delay={0.45}>
          <div className="glass-card p-5">
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Gender Distribution</h4>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={genderChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {genderChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs text-slate-400">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Sample Data Tables */}
      <FadeIn delay={0.4}>
        <h3 className="text-lg font-bold text-white mb-6">Sample Data</h3>
      </FadeIn>

      <FadeIn delay={0.5}>
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="patients" className="text-xs data-[state=active]:bg-teal-500/15 data-[state=active]:text-teal-400">
              Patients (5 rows)
            </TabsTrigger>
            <TabsTrigger value="doctors" className="text-xs data-[state=active]:bg-teal-500/15 data-[state=active]:text-teal-400">
              Doctors (5 rows)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="mt-4">
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="data-table w-full">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th>ID</th><th>Age</th><th>Gender</th><th>Stage</th><th>Adherence</th><th>Avg Time</th><th>Consults</th><th>Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <td key={j}><Skeleton className="h-4 w-12" /></td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      patients.map((row: Record<string, unknown>, i: number) => (
                        <tr key={i}>
                          <td className="text-teal-400 font-mono text-xs">{String(row.patient_id ?? '')}</td>
                          <td>{String(row.age ?? '')}</td>
                          <td>{String(row.gender ?? '')}</td>
                          <td>{String(row.disease_stage ?? '')}</td>
                          <td className="font-mono">{Number(row.adherence_score ?? 0).toFixed(2)}</td>
                          <td className="font-mono">{Number(row.avg_consultation_time ?? 0).toFixed(1)}m</td>
                          <td className="font-mono">{String(row.total_consultations ?? '')}</td>
                          <td>
                            <Badge variant="outline" className={`text-[10px] px-2 py-0 ${(row.retention_rate ?? 0) >= 50 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border-rose-500/20'}`}>
                              {Number(row.retention_rate ?? 0).toFixed(0)}%
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="mt-4">
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="data-table w-full">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th>ID</th><th>Specialty</th><th>Experience</th><th>Hospital</th><th>Patients</th><th>Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j}><Skeleton className="h-4 w-12" /></td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      doctors.map((row: Record<string, unknown>, i: number) => (
                        <tr key={i}>
                          <td className="text-violet-400 font-mono text-xs">{String(row.doctor_id ?? '')}</td>
                          <td>{String(row.specialty ?? '')}</td>
                          <td>{String(row.experience_years ?? '')} yrs</td>
                          <td className="max-w-[150px] truncate">{String(row.hospital_id ?? '')}</td>
                          <td className="font-mono">{String(row.total_patients ?? '')}</td>
                          <td className="font-mono">{Number(row.retention_rate ?? 0).toFixed(1)}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </SectionWrapper>
  )
}
