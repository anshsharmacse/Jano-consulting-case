import { NextResponse } from 'next/server'
import {
  loadPatients,
  loadDoctors,
  loadInteractions,
  type Patient,
} from '@/lib/csv-loader'

export async function GET() {
  try {
    const patients = loadPatients()
    const doctors = loadDoctors()
    const interactions = loadInteractions()

    // Core counts
    const totalPatients = patients.length
    const totalDoctors = doctors.length
    const totalInteractions = interactions.length

    // Gender distribution
    const genderMap = new Map<string, number>()
    for (const p of patients) {
      genderMap.set(p.gender, (genderMap.get(p.gender) ?? 0) + 1)
    }
    const genderDistribution: { gender: string; count: number; percentage: number }[] =
      Array.from(genderMap.entries()).map(([gender, count]) => ({
        gender,
        count,
        percentage: Number(((count / totalPatients) * 100).toFixed(1)),
      }))

    // Age group distribution
    const ageGroups = [
      { label: '18-34', min: 18, max: 34 },
      { label: '35-50', min: 35, max: 50 },
      { label: '51-65', min: 51, max: 65 },
      { label: '65+', min: 66, max: 999 },
    ]
    const ageDistribution = ageGroups.map(({ label, min, max }) => {
      const count = patients.filter((p) => p.age >= min && p.age <= max).length
      return {
        ageGroup: label,
        count,
        percentage: Number(((count / totalPatients) * 100).toFixed(1)),
      }
    })

    // Disease stage distribution
    const stageMap = new Map<string, number>()
    for (const p of patients) {
      stageMap.set(p.disease_stage, (stageMap.get(p.disease_stage) ?? 0) + 1)
    }
    const diseaseStageDistribution: {
      stage: string
      count: number
      percentage: number
    }[] = Array.from(stageMap.entries())
      .map(([stage, count]) => ({
        stage,
        count,
        percentage: Number(((count / totalPatients) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)

    // Average adherence score
    const avgAdherence =
      patients.reduce((sum, p) => sum + p.adherence_score, 0) / totalPatients

    // Retention rate (follow_up=1 percentage from interactions)
    const retained = interactions.filter((i) => i.follow_up === 1).length
    const retentionRate = (retained / totalInteractions) * 100

    // Additional helpful stats
    const uniquePatientIds = new Set(interactions.map((i) => i.patient_id))
    const patientsWithInteractions = uniquePatientIds.size

    const avgConsultTime =
      interactions.reduce((sum, i) => sum + i.consultation_time, 0) /
      totalInteractions

    // Signup date range
    const signupDates = patients.map((p) => new Date(p.signup_date).getTime())
    const earliestSignup = new Date(Math.min(...signupDates))
    const latestSignup = new Date(Math.max(...signupDates))

    return NextResponse.json({
      totalPatients,
      totalDoctors,
      totalInteractions,
      patientsWithInteractions,
      retentionRate: Number(retentionRate.toFixed(2)),
      avgAdherence: Number(avgAdherence.toFixed(3)),
      avgConsultTime: Number(avgConsultTime.toFixed(1)),
      dateRange: {
        earliest: earliestSignup.toISOString().split('T')[0],
        latest: latestSignup.toISOString().split('T')[0],
      },
      genderDistribution,
      ageDistribution,
      diseaseStageDistribution,
    })
  } catch (error) {
    console.error('Data Summary API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data summary' },
      { status: 500 },
    )
  }
}
