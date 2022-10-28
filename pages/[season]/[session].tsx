import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'

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
  const amountJoined = participients.filter(p => p[1].isPresent).length
  const canJoin = isPresent || amountJoined < sessionLimit
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
        <Link href={`/`}>
          <a className='btn btn-outline-secondary align-self-start d-flex align-items-center gap-1'>
            <AiOutlineArrowLeft /> Overzicht
          </a>
        </Link>

        <h3 className='mt-4 mb-4 d-flex align-items-center fw-bold fs-4'>
          <Link href={`/${appSettings?.activeSeason}/${nextSession}`}>
            <a className='btn btn-link me-3'>
              <AiOutlineArrowLeft />
            </a>
          </Link>
          Sessie {dayjs.unix(router.query.session as unknown as number).format('D MMMM')}
          <Link href={`/${appSettings?.activeSeason}/${nextSession}`}>
            <a className='btn btn-link me-3'>
              <AiOutlineArrowRight />
            </a>
          </Link>
        </h3>

        <div className={styles.participientRow}>
          <Image src={profiles[user?.id || '']?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' />
          {/* <div className={`d-flex align-items-center fs-5 ${styles.participientInfo}`}>
            <label className="form-check-label" htmlFor="my-status" style={{ cursor: 'pointer' }}>deelname:</label>
            <div className="form-check form-switch ms-2 fs-4">
              <input className="form-check-input" type="checkbox" id="my-status" checked={isPresent} onChange={onChangeStatus} style={{ cursor: 'pointer' }} disabled={!canJoin} />
            </div>
          </div> */}
          <div className="btn-group flex-grow-1 ms-4" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={isPresent} />
            <label className="btn btn-outline-primary" htmlFor="btnradio1">Aanwezig</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={!isPresent && !hasntResponded} />
            <label className="btn btn-outline-primary" htmlFor="btnradio2">Afwezig</label>
          </div>
        </div>

        {/* {
          !isPresent && hasntResponded && (
          <div className={styles.sessionButtons}>
            <button className="btn btn-outline-warning" onClick={() => leaveSession(user?.id ?? '')}>Afmelden</button>
          </div>)
        } */}

        <div style={{ marginTop: '1em', width: '100%' }}>
          <p className='fw-bold'>Aanwezig ({amountJoined}/{sessionLimit})</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId]?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' />
                  <div className={styles.participientInfo}>
                    <span className='me-1'>{profiles[userId]?.name || profiles[userId]?.email}</span>
                    <small className='text-muted'>{dayjs.unix(participient.responded_at).format('D MMMM')}</small>
                  </div>
                </div>)
            }
          </div>
        </div>

        <div style={{ marginTop: '1em', width: '100%' }}>
          <p className='fw-bold'>Afwezig ({participients.filter(p => !p[1].isPresent).length})</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => !p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId]?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' />
                  <div className={styles.participientInfo}>
                    <span className='me-1'>{profiles[userId]?.name || profiles[userId]?.email}</span>
                    <small className='text-muted'>{dayjs.unix(participient.responded_at).format('D MMMM')}</small>
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
