import { NextResponse } from 'next/server'
import { loadDoctors, loadInteractions } from '@/lib/csv-loader'

export async function GET() {
  try {
    const doctors = loadDoctors()
    const interactions = loadInteractions()

    // Build doctor interaction stats
    const doctorStats = new Map<
      string,
      {
        patientIds: Set<string>
        totalConsults: number
        followUps: number
        totalTime: number
      }
    >()

    for (const i of interactions) {
      const existing = doctorStats.get(i.doctor_id) ?? {
        patientIds: new Set<string>(),
        totalConsults: 0,
        followUps: 0,
        totalTime: 0,
      }
      existing.patientIds.add(i.patient_id)
      existing.totalConsults++
      existing.followUps += i.follow_up
      existing.totalTime += i.consultation_time
      doctorStats.set(i.doctor_id, existing)
    }

    // Compute patient count thresholds for load categorization
    const patientCounts = Array.from(doctorStats.values()).map(
      (s) => s.patientIds.size,
    )
    patientCounts.sort((a, b) => a - b)
    const p33 = patientCounts[Math.floor(patientCounts.length * 0.33) ?? 0]
    const p66 = patientCounts[Math.floor(patientCounts.length * 0.66) ?? 0]

    const result = doctors.map((d) => {
      const stats = doctorStats.get(d.doctor_id)
      const totalPatients = stats?.patientIds.size ?? 0
      const totalConsults = stats?.totalConsults ?? 0
      const followUps = stats?.followUps ?? 0
      const avgTime =
        stats && stats.totalConsults > 0
          ? stats.totalTime / stats.totalConsults
          : 0
      const retentionRate =
        stats && stats.totalConsults > 0
          ? (followUps / stats.totalConsults) * 100
          : 0

      let loadCategory: 'Low' | 'Medium' | 'High'
      if (totalPatients <= p33) {
        loadCategory = 'Low'
      } else if (totalPatients <= p66) {
        loadCategory = 'Medium'
      } else {
        loadCategory = 'High'
      }

      return {
        doctor_id: d.doctor_id,
        specialty: d.specialty,
        experience_years: d.experience_years,
        hospital_id: d.hospital_id,
        total_patients: totalPatients,
        total_consultations: totalConsults,
        avg_consultation_time: Number(avgTime.toFixed(1)),
        retention_rate: Number(retentionRate.toFixed(2)),
        load_category: loadCategory,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Doctors API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctors data' },
      { status: 500 },
    )
  }
}
