import type { NextPage } from 'next'
import dayjs from 'dayjs'
import Image from 'next/image'

import { useMyProfile, useSeasonDates, useSessions } from '../lib/seasonDBO'
import { useAppSettings } from '../lib/appSettingsDBO'
import { useUser } from '../lib/useUser'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { user } = useUser()
  const { appSettings } = useAppSettings('')
  const { profile } = useMyProfile(user?.id || '')
  const { seasonDates } = useSeasonDates(appSettings?.activeSeason || '')
  const { sessions } = useSessions(appSettings?.activeSeason || '')
  const oldSessions = Object.values(seasonDates || {}).filter(date => date < dayjs().unix())

  const getMyBadge = (session: { [key: string]: { isPresent: boolean } }) => {
    if (!session || !session[user?.id || '']) return <span className="badge bg-secondary">reageren</span>
    if (session[user?.id || '']?.isPresent) return <span className="badge bg-success">aanwezig</span>
    return <span className="badge bg-warning">afwezig</span>
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Image src={profile?.profilePic || 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'} height={80} width={80} className={styles.picture} objectFit='cover' alt='profile picture' />

        <div className={styles.sessions}>
          <p className='fw-bold'>Verleden:</p>
          {
            oldSessions.map((date, index) =>
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

const SessionLinkComponent = ({ href, date, sessions, limit, badge }: { href: string, date: number, sessions: any, limit?: number, badge: JSX.Element}) => {
  return <a>
      {dayjs.unix(date).format('D MMMM')}
      &nbsp;<span className="badge bg-light text-dark ms-2">{Object.values(sessions[date] || {}).filter((s: any) => s.isPresent).length}/{limit}</span>
      &nbsp;{badge}
    </a>
}

export default Home
