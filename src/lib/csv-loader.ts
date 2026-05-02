import fs from 'fs'
import path from 'path'

// ─── Type Definitions ───────────────────────────────────────────────

export interface Patient {
  patient_id: string
  age: number
  gender: string
  disease_stage: string
  adherence_score: number
  signup_date: string
}

export interface Doctor {
  doctor_id: string
  specialty: string
  experience_years: number
  hospital_id: string
}

export interface Interaction {
  consultation_id: string
  patient_id: string
  doctor_id: string
  consultation_time: number
  consultation_date: string
  follow_up: number
}

// ─── CSV Parsing ────────────────────────────────────────────────────

function parseCSV<T>(filePath: string, rowMapper: (row: string[]) => T): T[] {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const lines = raw.trim().split('\n')
  if (lines.length < 2) return []

  // Skip header
  return lines.slice(1).map((line) => {
    const cols = line.split(',')
    return rowMapper(cols)
  })
}

// ─── In-Memory Cache ────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'download', 'jano_health')

let patientsCache: Patient[] | null = null
let doctorsCache: Doctor[] | null = null
let interactionsCache: Interaction[] | null = null

export function loadPatients(): Patient[] {
  if (patientsCache) return patientsCache
  patientsCache = parseCSV<Patient>(path.join(DATA_DIR, 'patients.csv'), (cols) => ({
    patient_id: cols[0].trim(),
    age: Number(cols[1]),
    gender: cols[2].trim(),
    disease_stage: cols[3].trim(),
    adherence_score: Number(cols[4]),
    signup_date: cols[5].trim(),
  }))
  return patientsCache
}

export function loadDoctors(): Doctor[] {
  if (doctorsCache) return doctorsCache
  doctorsCache = parseCSV<Doctor>(path.join(DATA_DIR, 'doctors.csv'), (cols) => ({
    doctor_id: cols[0].trim(),
    specialty: cols[1].trim(),
    experience_years: Number(cols[2]),
    hospital_id: cols[3].trim(),
  }))
  return doctorsCache
}

export function loadInteractions(): Interaction[] {
  if (interactionsCache) return interactionsCache
  interactionsCache = parseCSV<Interaction>(path.join(DATA_DIR, 'interactions.csv'), (cols) => ({
    consultation_id: cols[0].trim(),
    patient_id: cols[1].trim(),
    doctor_id: cols[2].trim(),
    consultation_time: Number(cols[3]),
    consultation_date: cols[4].trim(),
    follow_up: Number(cols[5]),
  }))
  return interactionsCache
}

// ─── Lookup Helpers ─────────────────────────────────────────────────

const patientMapCache = new Map<string, Patient>()
const doctorMapCache = new Map<string, Doctor>()

export function getPatientMap(): Map<string, Patient> {
  if (patientMapCache.size === 0) {
    for (const p of loadPatients()) {
      patientMapCache.set(p.patient_id, p)
    }
  }
  return patientMapCache
}

export function getDoctorMap(): Map<string, Doctor> {
  if (doctorMapCache.size === 0) {
    for (const d of loadDoctors()) {
      doctorMapCache.set(d.doctor_id, d)
    }
  }
  return doctorMapCache
}
