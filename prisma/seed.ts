import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashCuid(seed: number): string {
  return crypto
    .createHash("sha1")
    .update(`seed-${seed}`)
    .digest("hex")
    .slice(0, 25);
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 1000) / 1000;
}

function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding database...");

  // Clean up
  await prisma.interaction.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();

  // ==========================================
  // PATIENTS (2000)
  // ==========================================
  const stages = [
    "CKD Stage 3",
    "CKD Stage 4",
    "CKD Stage 5",
    "ESRD",
    "Peritoneal Dialysis",
    "Transplant",
  ];
  const stageProbs = [0.25, 0.2, 0.15, 0.18, 0.12, 0.1];

  function pickStage(): string {
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < stages.length; i++) {
      cum += stageProbs[i];
      if (r < cum) return stages[i];
    }
    return stages[0];
  }

  const stagePenalty: Record<string, number> = {
    "CKD Stage 3": 0.0,
    "CKD Stage 4": -0.02,
    "CKD Stage 5": -0.05,
    ESRD: -0.08,
    "Peritoneal Dialysis": -0.1,
    Transplant: -0.03,
  };

  const patientData: {
    id: string;
    patientId: string;
    age: number;
    gender: string;
    diseaseStage: string;
    adherenceScore: number;
    signupDate: string;
  }[] = [];

  for (let i = 0; i < 2000; i++) {
    const stage = pickStage();
    const baseAdh = Math.max(0.05, Math.min(1, 0.5 + (Math.random() - 0.5) * 0.4));
    const adh = Math.max(
      0.05,
      Math.min(1, baseAdh + stagePenalty[stage] + (Math.random() - 0.5) * 0.1)
    );
    const signupMonth = rand(0, 17);
    const day = rand(1, 28);
    const signupDate = `2024-${String(1 + Math.floor(signupMonth / 12)).padStart(2, "0")}-${String(1 + (signupMonth % 12)).padStart(2, "0")}`;

    patientData.push({
      id: hashCuid(i + 1),
      patientId: `P${String(i + 1).padStart(4, "0")}`,
      age: rand(25, 80),
      gender: Math.random() < 0.45 ? "Male" : "Female",
      diseaseStage: stage,
      adherenceScore: Math.round(adh * 1000) / 1000,
      signupDate,
    });
  }

  await prisma.patient.createMany({ data: patientData });
  console.log(`Created ${patientData.length} patients`);

  // ==========================================
  // DOCTORS (25)
  // ==========================================
  const specialties = [
    "Nephrology",
    "Internal Medicine",
    "Urology",
    "General Practice",
  ];
  const specCounts = [9, 8, 2, 6];
  const specialtyList: string[] = [];
  specCounts.forEach((count, idx) => {
    for (let i = 0; i < count; i++) specialtyList.push(specialties[idx]);
  });

  const doctorData: {
    id: string;
    doctorId: string;
    specialty: string;
    experienceYears: number;
    hospitalId: string;
  }[] = [];

  for (let i = 0; i < 25; i++) {
    doctorData.push({
      id: hashCuid(3000 + i),
      doctorId: `D${String(i + 1).padStart(3, "0")}`,
      specialty: specialtyList[i],
      experienceYears: Math.max(1, Math.min(30, rand(2, 25) + rand(-2, 2))),
      hospitalId: `H${String((i % 5) + 1).padStart(3, "0")}`,
    });
  }

  await prisma.doctor.createMany({ data: doctorData });
  console.log(`Created ${doctorData.length} doctors`);

  // ==========================================
  // INTERACTIONS (6000+)
  // ==========================================
  const interactionData: {
    id: string;
    consultationId: string;
    patientId: string;
    doctorId: string;
    consultationTime: number;
    consultationDate: string;
    followUp: number;
  }[] = [];

  let consultIdx = 0;
  for (const patient of patientData) {
    const nConsults = choice([1, 2, 3, 4, 5, 6]);
    const signupMonth = parseInt(patient.signupDate.split("-")[1]) - 1;
    const signupDay = parseInt(patient.signupDate.split("-")[2]);

    for (let j = 0; j < nConsults; j++) {
      const consultMonth = signupMonth + j * 3;
      const consultDay = rand(signupDay, Math.min(signupDay + 25, 28));
      if (consultMonth > 17) continue;

      const yr = consultMonth < 12 ? 2024 : 2025;
      const mo = (consultMonth % 12) + 1;
      const consultationDate = `${yr}-${String(mo).padStart(2, "0")}-${String(Math.min(consultDay, 28)).padStart(2, "0")}`;

      // Assign doctor with Dirichlet-like weighting
      const docIdx = rand(0, 24);
      const doc = doctorData[docIdx];
      const exp = doc.experienceYears;
      let baseTime = 8 + exp * 0.5;
      if (
        patient.diseaseStage === "ESRD" ||
        patient.diseaseStage === "Peritoneal Dialysis"
      )
        baseTime += 5;
      if (doc.specialty === "Nephrology") baseTime += 3;
      const consultationTime = Math.max(3, Math.round(baseTime + (Math.random() - 0.5) * 8));

      // Follow-up probability
      let followProb = 0.85;
      if (patient.adherenceScore < 0.5) followProb -= 0.20;
      if (consultationTime < 10) followProb -= 0.15;
      if (patient.diseaseStage === "Peritoneal Dialysis") followProb -= 0.08;

      const followUp = Math.random() < followProb ? 1 : 0;

      consultIdx++;
      interactionData.push({
        id: hashCuid(5000 + consultIdx),
        consultationId: `C${String(consultIdx).padStart(5, "0")}`,
        patientId: patient.patientId,
        doctorId: doc.doctorId,
        consultationTime,
        consultationDate,
        followUp,
      });
    }
  }

  // Batch insert in chunks of 500
  for (let i = 0; i < interactionData.length; i += 500) {
    const chunk = interactionData.slice(i, i + 500);
    await prisma.interaction.createMany({ data: chunk });
  }
  console.log(`Created ${interactionData.length} interactions`);
  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
