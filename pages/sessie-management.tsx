import type { NextPage } from 'next'
import Head from 'next/head'
import dayjs from 'dayjs'
import { useRef } from 'react'

import { useSeasonDates } from '../lib/seasonDBO'
import { useAppSettings } from '../lib/appSettingsDBO'

import styles from '../styles/Home.module.css'

const SessionManagement: NextPage = () => {
  const datePickerRef = useRef<HTMLInputElement | null>(null)
  const { appSettings } = useAppSettings()
  const activeSeason = appSettings?.activeSeason || ''
  const { seasonDates, addSessionDate, removeSessionDate } = useSeasonDates(activeSeason)
  const filteredDates = Object.values(seasonDates || {})

  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Aanmeld registratie app vooor zaalvoetbalbazen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Zaalvoetbalbazen ADMIN
        </h1>

        <p>
          Alle sessies:
        </p>

        <input type="datetime-local" ref={datePickerRef} />
        <button className="btn btn-outline-primary" onClick={() => { console.info(`${datePickerRef.current?.value}:00.000Z`); addSessionDate(dayjs(`${datePickerRef.current?.value}`).unix()) }} disabled={datePickerRef.current === null}>Sessie toevoegen</button>

        <div className={styles.sessions}>
          {
            filteredDates.map((date, index) =>
              <div key={index} className={styles.sessionContainer}>
                <p className='mt-2 mb-2'>{dayjs.unix(date).format('D MMMM HH:mm')}</p>
                <button className="btn btn-outline-danger btn-sm" onClick={() => removeSessionDate(date)}>verwijder sessie</button>
              </div>)
          }
        </div>
      </main>

      <footer className={styles.footer}>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a> */}
      </footer>
    </div>
  )
}

export default SessionManagement