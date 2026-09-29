import { getDoctorsWithSchedules } from '@/lib/services/doctor.service'
import DokterClient from './DokterClient'

export default async function DokterPage() {
  const doctors = await getDoctorsWithSchedules()

  return <DokterClient doctors={doctors} />
}