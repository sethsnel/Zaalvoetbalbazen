import type { NextPage } from 'next'
import Head from 'next/head'
import dayjs from 'dayjs'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import { useSeason } from '../lib/data'
import { useRef } from 'react'

const SessionManagement: NextPage = () => {
  const datePickerRef = useRef<HTMLInputElement | null>(null)
  const { season, addSession, removeSession } = useSeason("S22-23")
  const { dates, isFetched, ...sessions } = season
  const filteredDates = Object.values(dates || {})

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
        <button className="btn btn-outline-primary" onClick={() => { console.info(`${datePickerRef.current?.value}:00.000Z`); addSession(dayjs(`${datePickerRef.current?.value}`).unix()) }} disabled={datePickerRef.current === null}>Sessie toevoegen</button>

        <div className={styles.sessions}>
          {
            filteredDates.map((date, index) =>
              <div key={index} className={styles.sessionContainer}>
                <Link href={`/S22-23/${date}`}><a>{dayjs.unix(date).format('D MMMM HH:mm')}, plek: {Object.values(sessions[date] || {}).length}/15</a></Link>
                <button className="btn btn-outline-danger btn-sm" onClick={() => removeSession(date)}>verwijder sessie</button>
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