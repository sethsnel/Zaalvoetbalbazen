import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent } from 'react'

import { useProfiles, useSessionData, useSessions } from '../../lib/seasonDBO'
import { useAppSettings } from '../../lib/appSettingsDBO'
import { useUser } from '../../lib/useUser'

import styles from '../../styles/Home.module.css'

const SessionPage: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()

  const { appSettings } = useAppSettings()
  const { sessionData, joinSession, leaveSession } = useSessionData(router.query.season as string, router.query.session as string)
  const { profiles } = useProfiles(router.query.season as string)
  const { getNextSession } = useSessions(appSettings?.activeSeason || '')
  const nextSession = getNextSession(parseInt(router.query.session as string))

  const participients = Object.entries(sessionData).sort(function (a, b) { return a[1].responded_at - b[1].responded_at })

  const sessionLimit = appSettings?.sessionLimit || 0
  const hasntResponded = !Object.keys(sessionData).includes(user?.id ?? '')
  const isPresent = sessionData[user?.id || '']?.isPresent ?? false
  const fallbackImg = 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'

  const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      joinSession(user?.id ?? '')
    }
    else {
      leaveSession(user?.id ?? '')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {
          nextSession && (<Link href={`/${appSettings?.activeSeason}/${nextSession}`}>
            <button className='btn btn-outline-secondary'>Volgende sessie</button>
          </Link>)
        }
        <h3 className='mt-4 mb-4'>
          Sessie {dayjs.unix(router.query.session as unknown as number).format('D MMMM')}
        </h3>

        <div className={styles.participientRow}>
          <Image src={profiles[user?.id || '']?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' />
          <div className={`d-flex align-items-center fs-5 ${styles.participientInfo}`}>
            <label className="form-check-label" htmlFor="my-status" style={{ cursor: 'pointer' }}>deelname:</label>
            <div className="form-check form-switch ms-2 fs-4">
              <input className="form-check-input" type="checkbox" id="my-status" checked={isPresent} onChange={onChangeStatus} style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        {
          !isPresent && hasntResponded && (
          <div className={styles.sessionButtons}>
            <button className="btn btn-outline-warning" onClick={() => leaveSession(user?.id ?? '')}>Afmelden</button>
          </div>)
        }

        <div style={{ marginTop: '1em' }}>
          <p className='text-center fw-bold'>Aanwezig ({participients.filter(p => p[1].isPresent).length}/{sessionLimit})</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId]?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' />
                  <div className={styles.participientInfo}>
                    <span className='me-1'>{profiles[userId]?.name || profiles[userId]?.email}</span>
                    <span>({dayjs.unix(participient.responded_at).format('D MMMM')})</span>
                  </div>
                </div>)
            }
          </div>
        </div>

        <div style={{ marginTop: '1em' }}>
          <p className='text-center fw-bold'>Afwezig ({participients.filter(p => !p[1].isPresent).length})</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => !p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId]?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' />
                  <div className={styles.participientInfo}>
                    <span className='me-1'>{profiles[userId]?.name || profiles[userId]?.email}</span>
                    <span>({dayjs.unix(participient.responded_at).format('D MMMM')})</span>
                  </div>
                </div>)
            }
          </div>
        </div>
      </main>
    </div>
  )
}

export default SessionPage
