import 'dotenv/config'
import { Client } from 'pg'
import { prisma } from '../lib/prisma'

const pgClient = new Client({
  connectionString: process.env.OLD_DATABASE_URL, // your old Postgres URL
})

async function main() {
  await pgClient.connect()

  // 1. Independent tables first
  const { rows: services } = await pgClient.query('SELECT * FROM services')
  await prisma.services.createMany({ data: services })

  const { rows: doctors } = await pgClient.query('SELECT * FROM doctors')
  await prisma.doctors.createMany({ data: doctors })

  const { rows: articles } = await pgClient.query('SELECT * FROM articles')
  await prisma.articles.createMany({ data: articles })

  // 2. Tables with foreign keys, after their dependencies exist
  const { rows: schedules } = await pgClient.query('SELECT * FROM doctors_schedule')
  await prisma.doctors_schedule.createMany({
    data: schedules.map((s) => ({
      ...s,
      start_time: new Date(`1970-01-01T${s.start_time}`),
      end_time: new Date(`1970-01-01T${s.end_time}`),
    })),
  })

  const { rows: appointments } = await pgClient.query('SELECT * FROM appointments')
  await prisma.appointments.createMany({
    data: appointments.map((a) => ({
      ...a,
      preferred_time: new Date(`1970-01-01T${a.preferred_time}`),
    })),
  })

  console.log('Migration complete')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => {
    await pgClient.end()
    await prisma.$disconnect()
  })