import type { NextPage } from 'next'
import Head from 'next/head'
import dayjs from 'dayjs'
import Link from 'next/link'
import { MdOutlineEventAvailable, MdOutlineEventBusy } from 'react-icons/md'
import { RiQuestionMark } from 'react-icons/ri'

import { useSeasonDates, useSessions } from '../lib/seasonDBO'
import { useAppSettings } from '../lib/appSettingsDBO'
import { useUser } from '../lib/useUser'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { user } = useUser()
  const { appSettings } = useAppSettings('')
  const { seasonDates } = useSeasonDates(appSettings?.activeSeason || '')
  const { sessions } = useSessions(appSettings?.activeSeason || '')
  const [upcommingDate, ...commingWeeks] = Object.values(seasonDates || {}).filter(date => date > dayjs().add(-12, 'hours').unix() && date < dayjs().add(4, 'weeks').unix())
  const later = Object.values(seasonDates || {}).filter(date => date > dayjs().add(4, 'weeks').unix())

  const getMyBadge = (session: { [key: string]: { isPresent: boolean } }) => {
    if (!session || !session[user?.id || '']) return <span className="text-primary fs-5 d-flex"><RiQuestionMark /></span>
    if (session[user?.id || '']?.isPresent) return <span className="text-success fs-5 d-flex"><MdOutlineEventAvailable /></span>
    return <span className="text-danger fs-5 d-flex"><MdOutlineEventBusy /></span>
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
        <p className='fw-bold w-100 mb-1'>Eerstvolgende</p>
          <div className={styles.sessionContainer}>
            <SessionLinkComponent
              href={`/${appSettings?.activeSeason}/${upcommingDate}`}
              date={upcommingDate}
              sessions={sessions}
              limit={appSettings?.sessionLimit}
              presentIndicator={true}
              badge={getMyBadge(sessions[upcommingDate])}  />
          </div>
        </div>

        <div className={styles.sessions}>
          <p className='fw-bold w-100 mb-1'>Komende weken</p>
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
          <p className='fw-bold w-100 mb-1'>Toekomst</p>
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
    </div>
  )
}

const SessionLinkComponent = ({ href, date, sessions, limit, presentIndicator, badge }: { href: string, date: number, sessions: any, limit?: number, presentIndicator?: boolean, badge: JSX.Element}) => {
  const peoplePresent = Object.values(sessions[date] || {}).filter((s: any) => s.isPresent).length
  let presentBadgeBg = 'bg-light text-dark'
  if (presentIndicator) {
    if (peoplePresent < 6) {
      presentBadgeBg = 'bg-danger'
    } else if (peoplePresent < 10) {
      presentBadgeBg = 'bg-warning'
    } else {
      presentBadgeBg = 'bg-success'
    }
  }

  return <Link href={href}>
    <a>
      {dayjs.unix(date).format('D MMMM')}
      &nbsp;<span className={`badge ms-2 ${presentBadgeBg}`}>{peoplePresent}/{limit}</span>
      &nbsp;{badge}
    </a>
  </Link>
}

export default Home
