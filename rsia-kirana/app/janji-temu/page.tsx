import { getBookableDoctors } from '@/lib/services/doctor.service'
import JanjiTemuClient from './JanjiTemuClient'

export default async function JanjiTemuPage() {
  const doctors = await getBookableDoctors()

  return <JanjiTemuClient doctors={doctors} />
}