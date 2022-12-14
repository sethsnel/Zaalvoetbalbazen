import type { NextPage } from 'next'
import Image from 'next/image'

import { useProfiles } from '../lib/seasonDBO'
import { useAppSettings } from '../lib/appSettingsDBO'

import styles from '../styles/Home.module.css'
import dayjs from 'dayjs'

const SessionManagement: NextPage = () => {
  const { appSettings } = useAppSettings('')
  const activeSeason = appSettings?.activeSeason || ''
  const { profiles } = useProfiles(activeSeason)

  const fallbackImg = 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Zaalvoetbalbazen ADMIN
        </h1>

        <p>
          Deelnemer aanwezigheid:
        </p>

        <div className={styles.sessions}>
          {
            Object.values(profiles).map((profile, index) =>
              <div key={index} className={`${styles.participientAdminRow} mb-1`}>
                <Image src={profile?.profilePic || fallbackImg} height={40} width={40} className={styles.picture} objectFit='cover' />
                <p className={`${styles.name} ms-3 mb-0`}>{profile.name || profile.email}</p>
                <p className='mb-0 me-1'> {countHistoricSessionsJoined(profile.joined)}</p>
              </div>
            )
          }
        </div>
      </main>
    </div>
  )
}

function countHistoricSessionsJoined(joined: { [key: string]: boolean } | undefined): number {
  var sessions = Object.entries(joined ?? {}).filter(([date, joined]) => {
    return joined && parseInt(date) < dayjs().unix()
  })
  return sessions.length
}

export default SessionManagement