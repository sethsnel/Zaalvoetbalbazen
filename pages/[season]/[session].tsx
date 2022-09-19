import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { useProfiles, useSessionData } from '../../lib/seasonDBO'
import { useAppSettings } from '../../lib/appSettingsDBO'
import { useUser } from '../../lib/useUser'

import styles from '../../styles/Home.module.css'

const Home: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()

  const { appSettings } = useAppSettings()
  const { sessionData, joinSession, leaveSession } = useSessionData(router.query.season as string, router.query.session as string)
  const { profiles } = useProfiles(router.query.season as string)
  const participients = Object.entries(sessionData).sort(function (a, b) { return a[1].responded_at - b[1].responded_at })

  const sessionLimit = appSettings?.sessionLimit || 0
  const canJoin = !sessionData[user?.id || '']?.isPresent && participients.length < sessionLimit
  const canLeave = !Object.keys(sessionData).includes(user?.id ?? '') || sessionData[user?.id || ''].isPresent
  const fallbackImg = 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'

  const myStatus = sessionData[user?.id || '']?.isPresent ? <span className="badge bg-success">aanwezig</span> : (sessionData[user?.id || '']?.isPresent === false) ? <span className="badge bg-warning">afwezig</span> : <span className="badge bg-secondary">nog reageren</span>

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/">
          <button className='btn btn-outline-secondary'>Terug naar overzicht</button>
        </Link>
        <h3 className='mt-4 mb-4'>
          Sessie {dayjs.unix(router.query.session as unknown as number).format('D MMMM')} ({participients.length}/{sessionLimit})
        </h3>

        <div className={styles.participientRow}>
          <Image src={profiles[user?.id || '']?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} />
          <div className={styles.participientInfo}>
            <span>mijn status: {myStatus}</span>
          </div>
        </div>

        <div className={styles.sessionButtons}>
          <button className="btn btn-primary" onClick={() => joinSession(user?.id ?? '')} disabled={!canJoin}>Deelnemen</button>
          <button className="btn btn-outline-warning" onClick={() => leaveSession(user?.id ?? '')} disabled={!canLeave}>Afmelden</button>
        </div>

        <div style={{ marginTop: '1em' }}>
          <p className='text-center'>Aanwezig</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId].profilePic || fallbackImg} height={60} width={60} className={styles.picture} />
                  <div className={styles.participientInfo}>
                    <span>{profiles[userId].name || profiles[userId].email}</span>
                    &nbsp;<span>({dayjs.unix(participient.responded_at).format('D MMMM')})</span>
                  </div>
                </div>)
            }
          </div>
        </div>

        <div style={{ marginTop: '1em' }}>
          <p className='text-center'>Afwezig</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => !p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId]?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} />
                  <div className={styles.participientInfo}>
                    <span>{profiles[userId]?.name || profiles[userId]?.email}</span>
                    &nbsp;<span>({dayjs.unix(participient.responded_at).format('D MMMM')})</span>
                  </div>
                </div>)
            }
          </div>
        </div>
      </main>

      {/* <footer className={styles.footer}>

      </footer> */}
    </div>
  )
}

export default Home
