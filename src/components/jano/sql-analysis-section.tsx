'use client'

import { useEffect, useState, useMemo } from 'react'
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './section-wrapper'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Legend,
} from 'recharts'
import { Database, ArrowUpDown, Search } from 'lucide-react'

// ==================== HARDCODED DATA ====================

const monthlyTrendData = [
  { month: 'Jan 24', retention: 84.09, consultations: 44 },
  { month: 'Feb 24', retention: 64.34, consultations: 143 },
  { month: 'Mar 24', retention: 69.13, consultations: 230 },
  { month: 'Apr 24', retention: 68.69, consultations: 313 },
  { month: 'May 24', retention: 71.73, consultations: 375 },
  { month: 'Jun 24', retention: 67.46, consultations: 378 },
  { month: 'Jul 24', retention: 67.87, consultations: 361 },
  { month: 'Aug 24', retention: 71.13, consultations: 336 },
  { month: 'Sep 24', retention: 69.70, consultations: 330 },
  { month: 'Oct 24', retention: 67.85, consultations: 395 },
  { month: 'Nov 24', retention: 65.89, consultations: 387 },
  { month: 'Dec 24', retention: 69.13, consultations: 392 },
  { month: 'Jan 25', retention: 69.05, consultations: 391 },
  { month: 'Feb 25', retention: 72.88, consultations: 354 },
  { month: 'Mar 25', retention: 68.99, consultations: 387 },
  { month: 'Apr 25', retention: 69.50, consultations: 377 },
  { month: 'May 25', retention: 71.50, consultations: 407 },
  { month: 'Jun 25', retention: 64.80, consultations: 392 },
]

const consultTimeData = [
  { tier: 'Short (<10 min)', rate: 57.71, consultations: 979 },
  { tier: 'Medium (10-20 min)', rate: 71.71, consultations: 3874 },
  { tier: 'Long (>20 min)', rate: 69.71, consultations: 1139 },
]

const adherenceData = [
  { tier: 'Low (<0.4)', rate: 61.44, consultations: 2360 },
  { tier: 'Medium (0.4-0.6)', rate: 69.86, consultations: 2150 },
  { tier: 'Good (0.6-0.8)', rate: 79.10, consultations: 1139 },
  { tier: 'High (>0.8)', rate: 82.80, consultations: 343 },
]

const specialtyData = [
  { specialty: 'Nephrology', patients: 1379, consultations: 2143, avgTime: 17.8, retention: 69.95 },
  { specialty: 'Internal Med', patients: 1242, consultations: 1842, avgTime: 14.5, retention: 68.84 },
  { specialty: 'Urology', patients: 424, consultations: 464, avgTime: 13.1, retention: 68.75 },
  { specialty: 'Gen Practice', patients: 1105, consultations: 1543, avgTime: 13.7, retention: 68.11 },
]

const doctorLoadData = [
  { tier: 'High (>240)', doctors: 3, avgRetention: 67.75 },
  { tier: 'Medium (210-240)', doctors: 20, avgRetention: 69.43 },
  { tier: 'Low (<210)', doctors: 2, avgRetention: 66.94 },
]

const ageGroupData = [
  { group: 'Young (18-34)', retention: 68.71, adherence: 47.5, consultations: 1045 },
  { group: 'Mid (35-50)', retention: 69.82, adherence: 46.2, consultations: 1700 },
  { group: 'Senior (51-65)', retention: 68.66, adherence: 45.0, consultations: 1704 },
  { group: 'Elderly (65+)', retention: 68.83, adherence: 46.6, consultations: 1543 },
]

// ==================== COMPONENTS ====================

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string; dataKey?: string }>; label?: string }) => {
  if (!active || !payload) return null
  return (
    <div className="glass-card p-3 shadow-xl border border-white/10 min-w-[140px]">
      <p className="text-xs font-semibold text-white mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-slate-400 mb-0.5">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="text-white font-medium">
            {p.dataKey === 'retention' || p.dataKey === 'rate' || p.dataKey === 'avgRetention' ? `${p.value.toFixed(1)}%` :
             p.dataKey === 'adherence' ? `${p.value.toFixed(1)}%` :
             p.dataKey === 'avgTime' ? `${p.value} min` :
             p.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, description, children, delay = 0 }: { title: string; description?: string; children: React.ReactNode; delay?: number }) {
  return (
    <FadeIn delay={delay}>
      <div className="glass-card p-5 sm:p-6">
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
        {description && <p className="text-xs text-slate-500 mb-4">{description}</p>}
        <div className="min-h-[240px]">{children}</div>
      </div>
    </FadeIn>
  )
}

// ==================== DOCTORS TABLE ====================

interface Doctor {
  doctor_id: string
  specialty: string
  experience_years: number
  hospital_id: string
  total_patients: number
  total_consultations: number
  avg_consultation_time: number
  retention_rate: number
  load_category: string
}

const loadBadgeMap: Record<string, { bg: string; text: string; border: string }> = {
  'Low': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'Medium': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20' },
  'High': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/20' },
}

function DoctorsTable() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof Doctor>('doctor_id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [search, setSearch] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')

  useEffect(() => {
    fetch('/api/data/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const specialties = useMemo(() => {
    const s = new Set(doctors.map(d => d.specialty))
    return Array.from(s).sort()
  }, [doctors])

  const filtered = useMemo(() => {
    let result = [...doctors]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        d.doctor_id.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital_id.toLowerCase().includes(q)
      )
    }
    if (filterSpecialty) {
      result = result.filter(d => d.specialty === filterSpecialty)
    }
    result.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
    })
    return result
  }, [doctors, search, filterSpecialty, sortField, sortDir])

  const handleSort = (field: keyof Doctor) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const renderSortHeader = (field: keyof Doctor, label: string) => (
    <th
      className="cursor-pointer hover:text-white transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 opacity-40" />
        {sortField === field && (
          <span className="text-teal-400 text-[10px]">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
        )}
      </div>
    </th>
  )

  return (
    <FadeIn delay={0.3}>
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h4 className="text-sm font-semibold text-white mb-4">Doctor Performance Analysis</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <Input
                placeholder="Search by ID, specialty, hospital..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-white/5 border-white/10 focus:border-teal-500/30"
              />
            </div>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="h-8 text-xs bg-white/5 border border-white/10 rounded-md px-3 text-slate-400 focus:outline-none focus:border-teal-500/30"
            >
              <option value="">All Specialties</option>
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="data-table w-full">
            <thead className="sticky top-0 z-10">
              <tr>
                {renderSortHeader('doctor_id', 'ID')}
                {renderSortHeader('specialty', 'Specialty')}
                {renderSortHeader('experience_years', 'Exp (yrs)')}
                {renderSortHeader('hospital_id', 'Hospital')}
                {renderSortHeader('total_patients', 'Patients')}
                {renderSortHeader('total_consultations', 'Consults')}
                {renderSortHeader('avg_consultation_time', 'Avg Time')}
                {renderSortHeader('retention_rate', 'Retention')}
                <th>Load</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j}><Skeleton className="h-4 w-12" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((doc) => {
                const badge = loadBadgeMap[doc.load_category] || loadBadgeMap['Medium']
                return (
                  <tr key={doc.doctor_id}>
                    <td className="text-teal-400 font-mono text-xs">{doc.doctor_id}</td>
                    <td className="max-w-[130px] truncate">{doc.specialty}</td>
                    <td className="font-mono">{doc.experience_years}</td>
                    <td className="max-w-[180px] truncate text-slate-400">{doc.hospital_id}</td>
                    <td className="font-mono">{doc.total_patients}</td>
                    <td className="font-mono">{doc.total_consultations}</td>
                    <td className="font-mono">{doc.avg_consultation_time.toFixed(1)}m</td>
                    <td>
                      <span className={`font-mono font-semibold ${doc.retention_rate >= 70 ? 'text-emerald-400' : doc.retention_rate >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {doc.retention_rate.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0 h-5 ${badge.bg} ${badge.text} ${badge.border}`}>
                        {doc.load_category}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="p-3 border-t border-white/5 text-center">
            <span className="text-xs text-slate-500">{filtered.length} of {doctors.length} doctors</span>
          </div>
        )}
      </div>
    </FadeIn>
  )
}

// ==================== MAIN SECTION ====================

export function SqlAnalysisSection() {
  return (
    <SectionWrapper id="sql-analysis" sectionNumber="06" className="bg-slate-950">
      <FadeIn>
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-teal-400" />
          <span className="section-number">SQL Diagnostic Analysis</span>
        </div>
      </FadeIn>
      <FadeIn delay={0.05}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Uncovering Patterns Through
          <br className="hidden sm:block" /> <span className="gradient-text-teal">Database Queries</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-14">
          10+ SQL queries analyzed across patient demographics, doctor performance, consultation patterns,
          and temporal trends
        </p>
      </FadeIn>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* 7a. Monthly Retention Trend */}
        <ChartCard title="Monthly Retention Trend" description="18-month view of patient retention rates" delay={0.1}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="retention" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3, fill: '#14b8a6' }} activeDot={{ r: 5, fill: '#14b8a6' }} name="Retention %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7b. Consultation Time Impact */}
        <ChartCard title="Consultation Time Impact on Retention" description="Retention rate by consultation duration tier" delay={0.15}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={consultTimeData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="tier" tick={{ fontSize: 9, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 80]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Retention %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7c. Adherence Impact */}
        <ChartCard title="Adherence Score Impact on Retention" description="Higher adherence strongly correlates with retention" delay={0.2}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={adherenceData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="tier" tick={{ fontSize: 9, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Retention %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7d. Specialty Analysis */}
        <ChartCard title="Specialty Analysis" description="Patients, consultations, and retention by specialty" delay={0.25}>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={specialtyData} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="specialty" tick={{ fontSize: 9, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[65, 75]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar yAxisId="left" dataKey="patients" fill="#14b8a6" radius={[3, 3, 0, 0]} name="Patients" barSize={24} />
              <Bar yAxisId="left" dataKey="consultations" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Consultations" barSize={24} />
              <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} name="Retention %" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7e. Doctor Load Analysis */}
        <ChartCard title="Doctor Load Analysis" description="Number of doctors and avg retention by load tier" delay={0.3}>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={doctorLoadData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="tier" tick={{ fontSize: 9, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[64, 72]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar yAxisId="left" dataKey="doctors" fill="#10b981" radius={[6, 6, 0, 0]} name="Doctors" barSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="avgRetention" stroke="#f43f5e" strokeWidth={2} dot={{ r: 5, fill: '#f43f5e' }} name="Avg Retention" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7f. Age Group Analysis */}
        <ChartCard title="Age Group Analysis" description="Retention rate and adherence score by age group" delay={0.35}>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={ageGroupData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="group" tick={{ fontSize: 9, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" domain={[65, 73]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <YAxis yAxisId="right" domain={[40, 52]} tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.5)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar yAxisId="left" dataKey="retention" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Retention %" barSize={36} />
              <Line yAxisId="right" type="monotone" dataKey="adherence" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} name="Adherence %" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Doctors Table */}
      <DoctorsTable />
    </SectionWrapper>
  )
}
