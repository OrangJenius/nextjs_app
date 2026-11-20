import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// --- Pembatas laju sederhana untuk tamu (best-effort) ---
// Catatan: di Vercel (serverless) memori ini tidak dibagi antar instance,
// jadi ini hanya menahan spam ringan. Untuk perlindungan kuat, pakai Upstash/Redis.
const WINDOW_MS = 10 * 60 * 1000
const MAX_GUEST_BOOKINGS = 5
const hits = new Map<string, number[]>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_GUEST_BOOKINGS) {
    hits.set(key, recent)
    return true
  }
  recent.push(now)
  hits.set(key, recent)
  return false
}

const PHONE_RE = /^(\+?62|0)8\d{7,12}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/

// Sama dengan jangkauan pencarian jadwal terdekat di halaman janji temu
const MAX_DAYS_AHEAD = 60

const hhmm = (d: Date) => d.toISOString().substring(11, 16)
const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const addDays = (dateStr: string, days: number) => {
  const d = new Date(`${dateStr}T00:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const rawId = (session?.user as { id?: string } | undefined)?.id
  const userId = rawId ? Number(rawId) : null

  const body = await req.json().catch(() => ({}))
  const { patientId, namaPasien, nik, noHp, email, dokterId, tanggal, jam, tipePembayaran, catatan } = body

  if (!dokterId || !tanggal || !jam) {
    return NextResponse.json({ error: 'Data belum lengkap.' }, { status: 400 })
  }

  // --- Tanggal: format, kalender valid, tidak lampau, tidak terlalu jauh (WITA) ---
  if (!DATE_RE.test(String(tanggal))) {
    return NextResponse.json({ error: 'Format tanggal tidak valid.' }, { status: 400 })
  }
  const parsedDate = new Date(`${tanggal}T00:00:00.000Z`)
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== String(tanggal)) {
    return NextResponse.json({ error: 'Tanggal tidak valid.' }, { status: 400 })
  }
  const todayWita = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' }).format(new Date())
  if (String(tanggal) < todayWita) {
    return NextResponse.json({ error: 'Tanggal kunjungan tidak boleh sebelum hari ini.' }, { status: 400 })
  }
  if (String(tanggal) > addDays(todayWita, MAX_DAYS_AHEAD)) {
    return NextResponse.json(
      { error: `Janji temu hanya dapat dibuat maksimal ${MAX_DAYS_AHEAD} hari ke depan.` },
      { status: 400 }
    )
  }

  // --- Jam: "10:00 - 12:00 WITA"; preferred_time menyimpan jam mulai ---
  const startTime = String(jam).split('-')[0].trim()
  if (!TIME_RE.test(startTime)) {
    return NextResponse.json({ error: 'Format jam tidak valid.' }, { status: 400 })
  }
  const startHHmm = startTime.padStart(5, '0')

  // --- Dokter harus ada, aktif, dan praktik pada hari & jam tersebut ---
  const doctor = await prisma.doctors.findFirst({
    where: { id: String(dokterId), is_active: true },
    select: { id: true, doctors_schedule: true },
  })
  if (!doctor) {
    return NextResponse.json({ error: 'Dokter tidak ditemukan.' }, { status: 400 })
  }

  const slot = doctor.doctors_schedule.find(
    (s) => s.day_of_week === parsedDate.getUTCDay() && hhmm(s.start_time) === startHHmm
  )
  if (!slot) {
    return NextResponse.json({ error: 'Dokter tidak praktik pada hari/jam tersebut.' }, { status: 400 })
  }

  // Untuk hari ini: sesi yang sudah berakhir tidak bisa dipesan (jam selesai dari database)
  if (String(tanggal) === todayWita) {
    const nowHHmm = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date())
    if (toMin(hhmm(slot.end_time)) <= toMin(nowHHmm)) {
      return NextResponse.json({ error: 'Jadwal praktik hari ini sudah lewat.' }, { status: 400 })
    }
  }

  // --- Data pasien ---
  let patientName: string
  let patientNik: string
  let phone: string
  let patientEmail: string | null
  let linkedPatientId: number | null = null

  if (userId) {
    // --- User login: pasien harus milik akun ini ---
    if (!patientId) {
      return NextResponse.json({ error: 'Pilih data pasien terlebih dahulu.' }, { status: 400 })
    }
    const patient = await prisma.patients.findFirst({
      where: { id: Number(patientId), user_id: userId },
    })
    if (!patient) {
      return NextResponse.json(
        { error: 'Pasien tidak ditemukan atau bukan milik akun Anda.' },
        { status: 403 }
      )
    }
    patientName = patient.nama_pasien
    patientNik = patient.nik
    phone = patient.no_hp
    patientEmail = patient.email
    linkedPatientId = patient.id
  } else {
    // --- Tamu: data pasien dikirim langsung ---
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' },
        { status: 429 }
      )
    }

    const name = String(namaPasien ?? '').trim()
    const nikClean = String(nik ?? '').replace(/\D/g, '')
    const phoneClean = String(noHp ?? '').replace(/[\s-]/g, '')
    const mail = String(email ?? '').trim()

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Nama pasien tidak valid.' }, { status: 400 })
    }
    if (!/^\d{16}$/.test(nikClean)) {
      return NextResponse.json({ error: 'NIK harus tepat 16 digit angka.' }, { status: 400 })
    }
    if (!PHONE_RE.test(phoneClean)) {
      return NextResponse.json({ error: 'Nomor WhatsApp tidak valid.' }, { status: 400 })
    }
    if (mail && (mail.length > 254 || !EMAIL_RE.test(mail))) {
      return NextResponse.json({ error: 'Email tidak valid.' }, { status: 400 })
    }

    patientName = name
    patientNik = nikClean
    phone = phoneClean
    patientEmail = mail || null
  }

  const preferredTime = new Date(`1970-01-01T${startHHmm}:00.000Z`)

  // --- Cegah pendaftaran ganda: pasien yang sama, dokter, tanggal, dan jam yang sama ---
  const duplicate = await prisma.appointments.findFirst({
    where: {
      nik: patientNik,
      doctor_id: doctor.id,
      preferred_date: parsedDate,
      preferred_time: preferredTime,
      status: { in: ['pending', 'confirmed'] },
    },
    select: { id: true },
  })
  if (duplicate) {
    return NextResponse.json(
      { error: 'Pasien ini sudah memiliki janji temu dengan dokter yang sama pada tanggal dan jam tersebut.' },
      { status: 409 }
    )
  }

  const payment = ['umum', 'asuransi'].includes(String(tipePembayaran)) ? String(tipePembayaran) : null
  const noteParts = [
    payment ? `Pembayaran: ${payment.toUpperCase()}` : null,
    catatan ? String(catatan).slice(0, 500) : null,
    userId ? null : 'Booking tamu (tanpa akun)',
  ].filter(Boolean)

  try {
    const appointment = await prisma.appointments.create({
      data: {
        patient_name: patientName,
        nik: patientNik,
        phone,
        email: patientEmail,
        doctor_id: doctor.id,
        user_id: userId,
        patient_id: linkedPatientId,
        preferred_date: parsedDate,
        preferred_time: preferredTime,
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