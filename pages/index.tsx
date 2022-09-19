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
        <p className='fw-bold'>Eerstvolgende:</p>
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
          <p className='fw-bold'>Komende weken:</p>
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
          <p className='fw-bold'>Toekomst:</p>
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

      <footer className={styles.footer}>
        <Link href='/'><button className="btn btn-outline-primary me-2" type="button">Home</button></Link>
        <Link href='/profiel'><button className="btn btn-outline-secondary me-2" type="button">Mijn profiel</button></Link>
        <button className="btn btn-outline-warning" onClick={logout} type="button">Afmelden</button>
      </footer>
    </div>
  )
}

const SessionLinkComponent = ({ href, date, sessions, limit, badge }: { href: string, date: number, sessions: any, limit?: number, badge: JSX.Element}) => {
  return <Link href={href}>
    <a>
      {dayjs.unix(date).format('D MMMM')}
      &nbsp;<span className="badge bg-light text-dark">{Object.values(sessions[date] || {}).filter((s: any) => s.isPresent).length}/{limit}</span>
      &nbsp;{badge}
    </a>
  </Link>
}

export default Home
