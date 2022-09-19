import type { NextPage } from 'next'
import Head from 'next/head'
import dayjs from 'dayjs'
import Link from 'next/link'

import { useSeasonDates, useSessions } from '../lib/seasonDBO'
import { useAppSettings } from '../lib/appSettingsDBO'
import { useUser } from '../lib/useUser'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { user, logout } = useUser()
  const { appSettings } = useAppSettings()
  const { seasonDates } = useSeasonDates(appSettings?.activeSeason || '')
  const { sessions } = useSessions(appSettings?.activeSeason || '')
  const [upcommingDate, ...commingWeeks] = Object.values(seasonDates || {}).filter(date => date > dayjs().add(-12, 'hours').unix() && date < dayjs().add(4, 'weeks').unix())
  const later = Object.values(seasonDates || {}).filter(date => date > dayjs().add(4, 'weeks').unix())

  const getMyBadge = (session: { [key: string]: { isPresent: boolean } }) => {
    if (!session) return <span className="badge bg-secondary">reageren</span>
    if (session[user?.id || '']?.isPresent) return <span className="badge bg-success">aanwezig</span>
    return <span className="badge bg-warning">afwezig</span>
  }

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
        <p>Eerstvolgende:</p>
          <div className={styles.sessionContainer}>
            <SessionLinkComponent
              href={`/${appSettings?.activeSeason}/${upcommingDate}`}
              date={upcommingDate}
              sessions={sessions}
              limit={appSettings?.sessionLimit}
              badge={getMyBadge(sessions[upcommingDate])}  />
          </div>
        </div>

        <div className={styles.sessions}>
          <p>Komende weken:</p>
          {
            commingWeeks.map((date, index) =>
              <div key={index} className={styles.sessionContainer}>
                <SessionLinkComponent
                  href={`/${appSettings?.activeSeason}/${date}`}
                  date={date}
                  sessions={sessions}
                  limit={appSettings?.sessionLimit}
                  badge={getMyBadge(sessions[date])} />
              </div>)
          }
        </div>

        <div className={styles.sessions}>
          <p>Toekomst:</p>
          {
            later.map((date, index) =>
              <div key={index} className={styles.sessionContainer}>
                <SessionLinkComponent
                  href={`/${appSettings?.activeSeason}/${date}`}
                  date={date}
                  sessions={sessions}
                  limit={appSettings?.sessionLimit}
                  badge={getMyBadge(sessions[date])} />
              </div>)
          }
        </div>
      </main>

      {/* TODO: ADD LATER COMMING SESSIONS */}

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

const SessionLinkComponent = ({ href, date, sessions, limit, badge }: { href: string, date: number, sessions: any, limit?: number, badge: JSX.Element}) => {
  return <Link href={href}>
    <a>
      {dayjs.unix(date).format('D MMMM')}
      &nbsp;<span className="badge bg-light text-dark">{Object.values(sessions[date] || {}).length}/{limit}</span>
      &nbsp;{badge}
    </a>
  </Link>
}

export default Home
