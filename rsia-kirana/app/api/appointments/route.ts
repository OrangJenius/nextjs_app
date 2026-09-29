import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = Number((session.user as { id: string }).id)
  const { patientId, dokterId, tanggal, jam, tipePembayaran, catatan } = await req.json()

  if (!patientId || !dokterId || !tanggal || !jam) {
    return NextResponse.json({ error: 'Data belum lengkap.' }, { status: 400 })
  }

  // The selected patient must belong to the logged-in user
  const patient = await prisma.patients.findFirst({
    where: { id: Number(patientId), user_id: userId },
  })
  if (!patient) {
    return NextResponse.json(
      { error: 'Pasien tidak ditemukan atau bukan milik akun Anda.' },
      { status: 403 }
    )
  }

  // jam arrives as "10:00 - 12:00 WITA"; preferred_time stores one value,
  // so we save the start of the slot (same as before).
  const startTime = String(jam).split('-')[0].trim()

  // No payment-method column, so it goes into notes like before.
  const noteParts = [
    tipePembayaran ? `Pembayaran: ${String(tipePembayaran).toUpperCase()}` : null,
    catatan || null,
  ].filter(Boolean)

  try {
    const appointment = await prisma.appointments.create({
      data: {
        patient_name: patient.nama_pasien,
        phone: patient.no_hp,
        email: patient.email,
        doctor_id: dokterId,
        user_id: userId,
        patient_id: patient.id,
        preferred_date: new Date(tanggal),
        preferred_time: new Date(`1970-01-01T${startTime}:00`),
        notes: noteParts.length > 0 ? noteParts.join(' | ') : null,
        status: 'pending',
      },
    })

    return NextResponse.json({ id: appointment.id }, { status: 201 })
  } catch (err) {
    console.error('Failed to create appointment', err)
    return NextResponse.json({ error: 'Gagal menyimpan janji temu.' }, { status: 500 })
  }
}