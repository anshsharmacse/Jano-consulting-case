import { NextResponse } from 'next/server'
import { loadPatients, loadInteractions, getPatientMap } from '@/lib/csv-loader'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page') ?? 1))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)))
    const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
    const stage = searchParams.get('stage')?.trim() ?? ''
    const gender = searchParams.get('gender')?.trim() ?? ''

    const patients = loadPatients()
    const interactions = loadInteractions()

    // Build lookup: patient_id -> interaction stats
    const patientStats = new Map<
      string,
      { totalConsults: number; followUps: number; avgConsultTime: number }
    >()
    for (const i of interactions) {
      const existing = patientStats.get(i.patient_id) ?? {
        totalConsults: 0,
        followUps: 0,
        avgConsultTime: 0,
      }
      existing.totalConsults++
      existing.followUps += i.follow_up
      existing.avgConsultTime += i.consultation_time
      patientStats.set(i.patient_id, existing)
    }

    // Filter
    let filtered = patients
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.patient_id.toLowerCase().includes(search) ||
          p.gender.toLowerCase().includes(search) ||
          p.disease_stage.toLowerCase().includes(search),
      )
    }
    if (stage) {
      filtered = filtered.filter((p) => p.disease_stage === stage)
    }
    if (gender) {
      filtered = filtered.filter((p) => p.gender.toLowerCase() === gender.toLowerCase())
    }

    const totalFiltered = filtered.length
    const totalPages = Math.ceil(totalFiltered / limit)
    const offset = (page - 1) * limit
    const paginated = filtered.slice(offset, offset + limit)

    const result = paginated.map((p) => {
      const stats = patientStats.get(p.patient_id)
      const totalConsults = stats?.totalConsults ?? 0
      const followUps = stats?.followUps ?? 0
      const avgTime = stats ? stats.avgConsultTime / stats.totalConsults : 0
      return {
        patient_id: p.patient_id,
        age: p.age,
        gender: p.gender,
        disease_stage: p.disease_stage,
        adherence_score: p.adherence_score,
        signup_date: p.signup_date,
        total_consultations: totalConsults,
        follow_ups: followUps,
        retention_rate:
          totalConsults > 0
            ? Number(((followUps / totalConsults) * 100).toFixed(1))
            : 0,
        avg_consultation_time: Number(avgTime.toFixed(1)),
      }
    })

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Patients API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients data' },
      { status: 500 },
    )
  }
}
