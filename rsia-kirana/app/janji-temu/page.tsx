import { getBookableDoctors } from '@/lib/services/doctor.service'
import JanjiTemuClient from './JanjiTemuClient'
import { Suspense } from 'react'

export default async function JanjiTemuPage() {
  const doctors = await getBookableDoctors()

  return (
  <Suspense fallback={null}>
    <JanjiTemuClient doctors={doctors} />
  </Suspense>
  )
}