import { prisma } from '@/lib/prisma'

// Senin..Sabtu, then Minggu last — matches the display order used across the site
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const DAY_NAMES: Record<number, string> = {
  0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu',
}

function formatTime(date: Date) {
  // start_time/end_time are stored as Postgres TIME, which Prisma reads back
  // as a Date anchored at 1970-01-01 — we only care about the HH:mm part.
  return date.toISOString().substring(11, 16)
}

type RawSchedule = { day_of_week: number; start_time: Date; end_time: Date }

/**
 * Turns individual doctors_schedule rows into display rows that mirror the
 * original hand-written format:
 * - multiple time slots on the same day are joined with " & "
 * - days sharing identical hours that form a consecutive run become a range
 *   ("Senin - Jumat")
 * - days sharing identical hours that are NOT consecutive are listed with
 *   commas and an ampersand before the last one ("Senin, Selasa, & Jumat")
 */
function groupDoctorSchedules(rawSchedules: RawSchedule[]) {
  // Step 1: combine multiple time-slots on the same day into one string
  const perDayRanges = new Map<number, string[]>()
  for (const s of rawSchedules) {
    const range = `${formatTime(s.start_time)} - ${formatTime(s.end_time)} WITA`
    const list = perDayRanges.get(s.day_of_week) ?? []
    list.push(range)
    perDayRanges.set(s.day_of_week, list)
  }
  const dayHours = new Map<number, string>()
  for (const [day, ranges] of perDayRanges) {
    dayHours.set(day, [...ranges].sort().join(' & '))
  }

  // Step 2: group days that share an identical combined hours string
  const hoursToDays = new Map<string, number[]>()
  for (const [day, hours] of dayHours) {
    const list = hoursToDays.get(hours) ?? []
    list.push(day)
    hoursToDays.set(hours, list)
  }

  // Step 3: build one display row per hours-group
  const rows: { day: string; hours: string; minPosition: number }[] = []
  for (const [hours, days] of hoursToDays) {
    const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
    const positions = sorted.map((d) => DAY_ORDER.indexOf(d))
    const isContiguous =
      sorted.length >= 2 && positions.every((p, i) => i === 0 || p === positions[i - 1] + 1)

    let label: string
    if (sorted.length === 1) {
      label = DAY_NAMES[sorted[0]]
    } else if (isContiguous) {
      label = `${DAY_NAMES[sorted[0]]} - ${DAY_NAMES[sorted[sorted.length - 1]]}`
    } else if (sorted.length === 2) {
      label = `${DAY_NAMES[sorted[0]]} & ${DAY_NAMES[sorted[1]]}`
    } else {
      const names = sorted.map((d) => DAY_NAMES[d])
      label = `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}`
    }

    rows.push({ day: label, hours, minPosition: positions[0] })
  }

  rows.sort((a, b) => a.minPosition - b.minPosition)
  return rows.map(({ day, hours }) => ({ day, hours }))
}

export async function getDoctorsWithSchedules() {
  const doctors = await prisma.doctors.findMany({
    where: { is_active: true },
    include: { doctors_schedule: true },
    orderBy: { name: 'asc' },
  })

  return doctors.map((doc) => {
    const activeDays = Array.from(new Set(doc.doctors_schedule.map((s) => s.day_of_week)))

    return {
      id: doc.id,
      name: doc.name,
      specialty: doc.specialization,
      category: doc.category,
      photo: doc.photo_url,
      bio: doc.bio,
      bookable: doc.doctors_schedule.length > 0,
      activeDays,
      schedules: groupDoctorSchedules(doc.doctors_schedule),
    }
  })
}

export type DoctorWithSchedules = Awaited<ReturnType<typeof getDoctorsWithSchedules>>[number]

// For the booking flow we need each schedule slot on its own (not grouped
// into display strings) so the form can filter by exact day_of_week/time.
export async function getBookableDoctors() {
  const doctors = await prisma.doctors.findMany({
    where: { is_active: true },
    include: { doctors_schedule: true },
    orderBy: { name: 'asc' },
  })

  return doctors
    .filter((doc) => doc.doctors_schedule.length > 0) // exclude doctors with no regular schedule
    .map((doc) => ({
      id: doc.id,
      name: doc.name,
      category: doc.category,
      schedules: doc.doctors_schedule.map((s) => ({
        dayOfWeek: s.day_of_week,
        hours: `${formatTime(s.start_time)} - ${formatTime(s.end_time)} WITA`,
      })),
    }))
}

export type BookableDoctor = Awaited<ReturnType<typeof getBookableDoctors>>[number]