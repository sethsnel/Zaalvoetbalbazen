import type { NextPage } from "next"
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
  const { historicSessions } = useSessions(activeSeason)
  const { profiles } = useProfiles()

  const fallbackImg =
    "https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"

  type ProfileWithSessionsJoined = Profile & { sessionsJoined: number }
  const activeProfiles = Object
    .entries(profiles)
    .reduce<ProfileWithSessionsJoined[]>((acc, [userId, profile]) => {
      const sessionsJoined = countHistoricSessionsJoined(userId, historicSessions)
      if (sessionsJoined > 0) {
        acc.push({ ...profile, sessionsJoined })
      }

      return acc
    }, [])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{uppercaseFirst(appSettings.title)} ADMIN</h1>

        <p>Deelnemer aanwezigheid:</p>

        <div className={styles.sessions}>
          {Object.values(activeProfiles).map((profile, index) => (
            <div key={index} className={`${styles.participientAdminRow} mb-1`}>
              <Image
                src={profile?.profilePic || fallbackImg}
                alt="Profile picture"
                height={40}
                width={40}
                className={styles.picture}
                objectFit="cover"
              />
              <p className={`${styles.name} ms-3 mb-0`}>
                {profile.name || profile.email}
              </p>
              <p className="mb-0 me-1">
                {" "}
                {profile.sessionsJoined}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export function countHistoricSessionsJoined(
  userId: string,
  sessions: Session[]
): number {
  return sessions.filter((session) => session[userId]?.isPresent === true)
    .length
}

export default SessionManagement
