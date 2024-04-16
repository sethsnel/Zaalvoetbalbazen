import type { NextPage } from "next"
import { useRef, useState } from "react"
import Image from "next/image"
import dayjs from "dayjs"

import { useProfiles, useSessions } from "../lib/seasonDBO"
import { useAppSettings } from "../lib/appSettingsDBO"
import uppercaseFirst from "../lib/upperCaseFirst"

import styles from "../styles/Home.module.css"
import { Profile, Session } from "../lib/DBOTypes"

const SessionManagement: NextPage = () => {
  const { appSettings } = useAppSettings("")
  const activeSeason = appSettings?.activeSeason || ""
  const { historicSessions, getHistoricSessions } = useSessions(activeSeason)
  const { profiles } = useProfiles()
  const [isValid, setIsValid] = useState(false)
  const datePickerFromRef = useRef<HTMLInputElement | null>(null)
  const datePickerToRef = useRef<HTMLInputElement | null>(null)

  const verifyExportFormIsValid = () => {
    setIsValid(!isNaN(dayjs(`${datePickerFromRef.current?.value}`).unix()) && !isNaN(dayjs(`${datePickerToRef.current?.value}`).unix()))
  }

  const fallbackImg = "https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"

  type ProfileWithSessionsJoined = Profile & { sessionsJoined: number }
  const activeProfiles = Object.entries(profiles).reduce<ProfileWithSessionsJoined[]>((acc, [userId, profile]) => {
    const sessionsJoined = countHistoricSessionsJoined(userId, historicSessions)
    if (sessionsJoined > 0) {
      acc.push({ ...profile, sessionsJoined })
    }

    return acc
  }, [])

  const exportHistoricSessions = async (dateFrom: number, dateTo: number) => {
    const selectedHistoricSessions = getHistoricSessions(dateFrom, dateTo)
    var profilesWithSessionsData = Object.entries(profiles).reduce<ProfileWithSessionsJoined[]>((acc, [userId, profile]) => {
      const sessionsJoined = countHistoricSessionsJoined(userId, selectedHistoricSessions)
      if (sessionsJoined > 0) {
        acc.push({ ...profile, sessionsJoined })
      }

      return acc
    }, [])

    const csvString = [
      ["Voetballer", "E-mail", "Aanwezigheid"],
      ...profilesWithSessionsData.map((item) => [item.name, item.email, item.sessionsJoined])
    ]
      .map((e) => e.join(","))
      .join("\n")

    let link = document.createElement("a")
    link.id = "aanwezigheid"
    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(csvString))
    link.setAttribute(
      "download",
      `aaanwezigheid-${dayjs.unix(dateFrom).format("DD-MM-YYYY")}-${dayjs.unix(dateTo).format("DD-MM-YYYY")}.csv`
    )
    link.click()
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{uppercaseFirst(appSettings.title)} ADMIN</h1>

        <div className='d-flex flex-column pt-3'>
          <div className='input-group mb-3'>
            <span className='input-group-text' id='datetime-from'>
              van
            </span>
            <input className='form-control' type='date' id='datetime-from' onChange={verifyExportFormIsValid} ref={datePickerFromRef} />
          </div>

          <div className='input-group mb-3'>
            <span className='input-group-text' id='datetime-to'>
              tot
            </span>
            <input className='form-control' type='date' id='datetime-to' onChange={verifyExportFormIsValid} ref={datePickerToRef} />
          </div>
          <button
            className='btn btn-sm btn-outline-primary mt-3'
            onClick={() => {
              exportHistoricSessions(dayjs(`${datePickerFromRef.current?.value}`).unix(), dayjs(`${datePickerToRef.current?.value}`).unix())
            }}
            disabled={!isValid}
          >
            Exporteren
          </button>
        </div>

        <div className={styles.sessions}>
          {Object.values(activeProfiles).map((profile, index) => (
            <div key={index} className={`${styles.participientAdminRow} mb-1`}>
              <Image
                src={profile?.profilePic || fallbackImg}
                alt='Profile picture'
                height={40}
                width={40}
                className={styles.picture}
                objectFit='cover'
              />
              <p className={`${styles.name} ms-3 mb-0`}>{profile.name || profile.email}</p>
              <p className='mb-0 me-1'> {profile.sessionsJoined}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export function countHistoricSessionsJoined(userId: string, sessions: Session[]): number {
  return sessions.filter((session) => session[userId]?.isPresent === true).length
}

export default SessionManagement
