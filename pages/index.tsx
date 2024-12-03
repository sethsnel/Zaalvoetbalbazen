import type { NextPage } from "next"
import dayjs from "dayjs"

import { useMyProfile, useSeasonDates, useSessions } from "../lib/seasonDBO"
import { useAppSettings } from "../lib/appSettingsDBO"
import { useUser } from "../lib/useUser"
import SessionLinkRow from "../components/sessionLinkRow"

import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  const { user } = useUser()
  const { appSettings } = useAppSettings("")
  const { seasonDates } = useSeasonDates(appSettings?.activeSeason || "")
  const { sessions } = useSessions(appSettings?.activeSeason || "")
  const [upcommingDate, ...commingWeeks] = Object.values(
    seasonDates || {}
  ).filter(
    (date) =>
      date > dayjs().add(-12, "hours").unix() &&
      date < dayjs().add(4, "weeks").unix()
  )
  const later = Object.values(seasonDates || {}).filter(
    (date) => date > dayjs().add(4, "weeks").unix()
  )
  const { profile, isLoading: isLoadingProfile } = useMyProfile(
    user?.id || ""
  )
  const userInfo = { id: user?.id || "", profilePic: profile?.profilePic || "" }
  const limit = appSettings?.sessionLimit

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welkom bij {appSettings.title}!</h1>

        {/* First-up session */}
        {upcommingDate && (
          <div className={`${styles.sessions} card`}>
            <p className="fw-bold w-100 mb-1">Eerstvolgende</p>
            <SessionLinkRow
              date={upcommingDate}
              session={sessions[upcommingDate] || {}}
              limit={limit}
              activeSeason={appSettings.activeSeason}
              presentIndicator={true}
              user={userInfo}
            />
          </div>
        )}

        {/* Upcomming sessions */}
        {(commingWeeks.length > 0) &&
          <div className={`${styles.sessions} card`}>
            <p className="fw-bold w-100 mb-1">Komende weken</p>
            {commingWeeks.map((date, index) => (
              <SessionLinkRow
                key={index}
                date={date}
                session={sessions[date] || {}}
                limit={limit}
                activeSeason={appSettings.activeSeason}
                presentIndicator={true}
                user={userInfo}
              />
            ))}
          </div>
        }

        {/* All other future sessions */}
        {(later.length > 0) &&
          <div className={`${styles.sessions} card mb-5`}>
            <p className="fw-bold w-100 mb-1">Toekomst</p>
            {later.map((date, index) => (
              <SessionLinkRow
                key={index}
                date={date}
                session={sessions[date] || {}}
                limit={limit}
                activeSeason={appSettings.activeSeason}
                presentIndicator={false}
                user={userInfo}
              />
            ))}
          </div>
        }
      </main>
    </div>
  )
}

export default Home
