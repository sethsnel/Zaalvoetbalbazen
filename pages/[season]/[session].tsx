import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent } from 'react'
import { FcPrevious, FcNext } from 'react-icons/fc'

import { useProfiles, useSeasonDates, useSessionData, useSessions } from '../../lib/seasonDBO'
import { useAppSettings } from '../../lib/appSettingsDBO'
import { useUser } from '../../lib/useUser'

import styles from '../../styles/Home.module.css'
import RegisterGuest from '../../components/registerGuest'
import { countHistoricSessionsJoined } from '../aanwezigheid'

const SessionPage: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()

  const { appSettings } = useAppSettings(user?.id || '')
  const { sessionData, joinSession, leaveSession, removeGuest } = useSessionData(router.query.season as string, router.query.session as string)
  const { profiles } = useProfiles()
  const { getPreviousDate, getNextDate } = useSeasonDates(appSettings?.activeSeason || '')
  const { historicSessions } = useSessions(appSettings?.activeSeason || '')
  const previousSession = getPreviousDate(parseInt(router.query.session as string))
  const nextSession = getNextDate(parseInt(router.query.session as string))

  const participients = Object.entries(sessionData).sort(function (a, b) { return a[1].responded_at - b[1].responded_at })
  const guests = participients.filter(p => p[1].guests?.length > 0).reduce((acc: string[], [userId, participient]) => {
    return acc.concat(participient.guests)
  }, [])
  const activeProfiles = Object
    .entries(profiles)
    .reduce<string[]>((acc, [userId, profile]) => {
      const sessionsJoined = countHistoricSessionsJoined(userId, historicSessions)
      if (sessionsJoined > 0) {
        acc.push(userId)
      }
      return acc
    }, [])
  const didNotReact = Object.entries(profiles).filter((p) => !(p[0] in sessionData) && activeProfiles.includes(p[0]))

  const sessionLimit = appSettings?.sessionLimit || 0
  const hasntResponded = !Object.keys(sessionData).includes(user?.id ?? '')
  const isPresent = sessionData[user?.id || '']?.isPresent ?? false
  const amountJoined = participients.filter(p => p[1].isPresent).length + guests.length
  const canJoin = isPresent || amountJoined < sessionLimit
  const fallbackImg = 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'
  const canDeleteGuest = (guest: string) => sessionData[user?.id || '']?.guests?.includes(guest) ?? false

  const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'join') {
      joinSession(user?.id ?? '')
    }
    else {
      leaveSession(user?.id ?? '')
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 className='mt-4 mb-4 d-flex position-relative align-items-center fw-bold fs-4 w-100 justify-content-center'>
          {previousSession && ((<Link
            href={`/${appSettings?.activeSeason}/${previousSession}`}
            className='btn btn-link position-absolute start-0'>

            <FcPrevious />

          </Link>))}
          Sessie {dayjs.unix(router.query.session as unknown as number).format('D MMMM')}
          {nextSession && ((<Link
            href={`/${appSettings?.activeSeason}/${nextSession}`}
            className='btn btn-link position-absolute end-0'>

            <FcNext />

          </Link>))}
        </h3>

        <div className={styles.participientRow + ' d-none d-md-flex'}>
          <Image src={profiles[user?.id || '']?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' alt='profile picture' />
          <div className="btn-group flex-grow-1 ms-4" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="btnradio" id="join" autoComplete="off" checked={isPresent} disabled={!canJoin} onChange={onChangeStatus} />
            <label className="btn btn-outline-primary" htmlFor="join">Aanwezig</label>

            <input type="radio" className="btn-check" name="btnradio" id="leave" autoComplete="off" checked={!isPresent && !hasntResponded} onChange={onChangeStatus} />
            <label className="btn btn-outline-primary" htmlFor="leave">Afwezig</label>
          </div>
        </div>

        <div className={styles.participientRow + ' d-sm-flex d-md-none bg-opacity-75 bg-body border-top fixed-bottom sticky-md-top m-0 px-3 py-2 shadow shadow-md-none b-5'} style={{ WebkitBackdropFilter: 'blur(3px)', backdropFilter: 'blur(3px)', bottom: '74px' }}>
          <Image src={profiles[user?.id || '']?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' alt='profile picture' />
          <div className="btn-group flex-grow-1 ms-4" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="btnradio" id="join" autoComplete="off" checked={isPresent} disabled={!canJoin} onChange={onChangeStatus} />
            <label className="btn btn-outline-primary" htmlFor="join">Aanwezig</label>

            <input type="radio" className="btn-check" name="btnradio" id="leave" autoComplete="off" checked={!isPresent && !hasntResponded} onChange={onChangeStatus} />
            <label className="btn btn-outline-primary" htmlFor="leave">Afwezig</label>
          </div>
        </div>

        {/* {
          !isPresent && hasntResponded && (
          <div className={styles.sessionButtons}>
            <button className="btn btn-outline-warning" onClick={() => leaveSession(user?.id ?? '')}>Afmelden</button>
          </div>)
        } */}

        <div className="mt-3 w-100">
          <p className='fw-bold'>Aanwezig ({amountJoined}/{sessionLimit})</p>
          {canJoin && <RegisterGuest hasntResponded={hasntResponded} />}
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId]?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' alt='profile picture' />
                  <div className={styles.participientInfo}>
                    <span className='me-1'>{profiles[userId]?.name || profiles[userId]?.email}</span>
                    <small className='text-muted'>{dayjs.unix(participient.responded_at).format('D MMMM')}</small>
                  </div>
                </div>)
            }
          </div>
        </div>

        {guests.length > 0 && (<div className="mt-3 w-100">
          <p>Gasten</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              guests.map((guest, index) =>
                <div key={index} className={styles.participientRow}>
                  <Image src={fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' alt='profile picture' />
                  <div className={`${styles.guestInfo} justify-content-between`}>
                    <span className='me-1'>{guest}</span>
                    {/* <small className='text-muted'>{dayjs.unix(participient.responded_at).format('D MMMM')}</small> */}
                    {canDeleteGuest(guest) && (<button className="btn btn-outline-danger btn-sm" onClick={() => removeGuest(user?.id ?? '', guest)} >
                      gast afmelden
                    </button>)}
                  </div>
                </div>)
            }
          </div>
        </div>)}

        <div className="mt-3 w-100">
          <p className='fw-bold'>Afwezig ({participients.filter(p => !p[1].isPresent).length})</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.filter(p => !p[1].isPresent).map(([userId, participient], index) =>
                <div key={index} title={dayjs.unix(participient.responded_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={profiles[userId]?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' alt='profile picture' />
                  <div className={styles.participientInfo}>
                    <span className='me-1'>{profiles[userId]?.name || profiles[userId]?.email}</span>
                    <small className='text-muted'>{dayjs.unix(participient.responded_at).format('D MMMM')}</small>
                  </div>
                </div>)
            }
          </div>
        </div>

        <div className="mt-3 w-100">
          <p className='fw-bold'>Nog niet gereageerd ({didNotReact.length})</p>
          <div className={styles.participients}>
            {
              //@ts-ignore
              didNotReact.map(([userId, profile], index) =>
                <div key={index} className={styles.participientRow}>
                  <Image src={profile?.profilePic || fallbackImg} height={60} width={60} className={styles.picture} objectFit='cover' alt='profile picture' />
                  <div className={styles.participientInfo}>
                    <span className='me-1'>{profile?.name || profile?.email}</span>
                    {/* <small className='text-muted'>{dayjs.unix(participient.responded_at).format('D MMMM')}</small> */}
                  </div>
                </div>)
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default SessionPage
