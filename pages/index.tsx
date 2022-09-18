import type { NextPage } from 'next'
import Head from 'next/head'
import dayjs from 'dayjs'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import { useSeason } from '../lib/data'
import { useRef } from 'react'
import { useUser } from '../lib/useUser'

const Home: NextPage = () => {
  const { logout } = useUser()
  const datePickerRef = useRef<HTMLInputElement | null>(null)
  const { season } = useSeason("S22-23")
  const { dates, isFetched, ...sessions } = season
  const filteredDates = Object.values(dates || {}).filter(date => date > dayjs().unix() && date < dayjs().add(6, 'weeks').unix())

  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Aanmeld registratie app vooor zaalvoetbalbazen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welkom bij zaalvoetbalbazen!
        </h1>

        <div className={styles.sessions}>
          {
            filteredDates.map((date, index) =>
              <div key={index} className={styles.sessionContainer}>
                <Link href={`/S22-23/${date}`}><a>{dayjs.unix(date).format('D MMMM HH:mm')}, plek: {Object.values(sessions[date] || {}).length}/15</a></Link>
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
        <button className="btn btn-outline-warning" onClick={logout}>Afmelden</button>
      </footer>
    </div>
  )
}

export default Home
