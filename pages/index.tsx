import type { NextPage } from "next"
import dayjs from "dayjs"
import Link from "next/link"
import Image from "next/image"
import {
  BsCheckCircleFill,
  BsXCircleFill,
} from "react-icons/bs"

import { useMyProfile, useSeasonDates, useSessions } from "../lib/seasonDBO"
import { useAppSettings } from "../lib/appSettingsDBO"
import { useUser } from "../lib/useUser"

import styles from "../styles/Home.module.css"
import { Session, Sessions } from "../lib/DBOTypes"

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
  const limit = appSettings?.sessionLimit;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welkom bij {appSettings.title}!</h1>

        {upcommingDate && (
          <div className={`${styles.sessions} card`}>
            <p className="fw-bold w-100 mb-1">Eerstvolgende</p>
            <div className={styles.sessionContainer}>
              <SessionLinkComponent
                href={`/${appSettings?.activeSeason}/${upcommingDate}`}
                date={upcommingDate}
                membersPresent={calculateMembersPresent(sessions[upcommingDate] || {})}
                limit={limit}
                presentIndicator={true}
                badge={getMyBadge(sessions[upcommingDate], limit, user?.id, profile?.profilePic)}
              />
            </div>
          </div>
        )}

        {(commingWeeks.length > 0) &&
          <div className={`${styles.sessions} card`}>
            <p className="fw-bold w-100 mb-1">Komende weken</p>
            {commingWeeks.map((date, index) => (
              <div key={index} className={styles.sessionContainer}>
                <SessionLinkComponent
                  href={`/${appSettings?.activeSeason}/${date}`}
                  date={date}
                  membersPresent={calculateMembersPresent(sessions[date] || {})}
                  limit={limit}
                  presentIndicator={true}
                  badge={getMyBadge(sessions[date], limit, user?.id, profile?.profilePic)}
                />
              </div>
            ))}
          </div>
        }

        {(later.length > 0) &&
          <div className={`${styles.sessions} card`}>
            <p className="fw-bold w-100 mb-1">Toekomst</p>
            {later.map((date, index) => (
              <div key={index} className={styles.sessionContainer}>
                <SessionLinkComponent
                  href={`/${appSettings?.activeSeason}/${date}`}
                  date={date}
                  membersPresent={calculateMembersPresent(sessions[date] || {})}
                  limit={limit}
                  badge={getMyBadge(sessions[date], limit, user?.id, profile?.profilePic)}
                />
              </div>
            ))}
          </div>
        }
      </main>
    </div>
  )
}

const getMyBadge = (session: Session, limit: number, userId?: string, profilePic?: string) => {
  const isFull = isSessionFull(session, limit)
  if (!session || !session[userId || ""]) {
    return (
      <div className="position-absolute end-0 top-50 translate-middle me-5 opacity-25">
        <Image
          src={
            profilePic ||
            "https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"
          }
          height={30}
          width={30}
          className={styles.picture}
          objectFit="cover"
          alt='profile picture'
        />
        {/* <span className="text-primary fs-5 position-absolute top-0 start-100 translate-middle"><BsQuestionCircleFill /></span> */}
      </div>
    )
  }

  if (session && session[userId || ""]?.isPresent) {
    return (
      <div className="position-absolute end-0 top-50 translate-middle me-5">
        <Image
          src={
            profilePic ||
            "https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"
          }
          height={30}
          width={30}
          className={styles.picture}
          objectFit="cover"
          alt='profile picture'
        />
        <span className="text-success fs-5 position-absolute top-0 start-100 translate-middle">
          <BsCheckCircleFill />
        </span>
      </div>
    )
  }

  return (
    <div className="position-absolute end-0 top-50 translate-middle me-5">
      <Image
        src={
          profilePic ||
          "https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"
        }
        height={30}
        width={30}
        className={styles.picture}
        objectFit="cover"
        alt='profile picture'
      />
      <span className="text-danger fs-5 position-absolute top-0 start-100 translate-middle">
        <BsXCircleFill />
      </span>
    </div>
  )
}

const SessionLinkComponent = ({
  href,
  date,
  membersPresent,
  limit,
  presentIndicator,
  badge,
}: {
  href: string
  date: number
  membersPresent: number
  limit?: number
  presentIndicator?: boolean
  badge: JSX.Element
}) => {
  let presentBadgeBg = "bg-light text-dark"
  if (presentIndicator) {
    if (membersPresent < 6) {
      presentBadgeBg = "bg-danger"
    } else if (membersPresent < 10) {
      presentBadgeBg = "bg-warning"
    } else {
      presentBadgeBg = "bg-success"
    }
  }

  return (
    (<Link href={href}>
      {dayjs.unix(date).format("D MMMM")}
      <span className={`badge ms-2 ${presentBadgeBg}`}>
        {membersPresent}/{limit}
      </span>
      {badge}
    </Link>)
  );
}

function calculateMembersPresent(session: Session) {
  const peoplePresent = Object.values(session || {}).filter(
    (s: any) => s.isPresent
  ).length

  const guestsPresent = Object.values(session || {}).filter(
    (s: any) => s.guests?.length > 0
  ).reduce((acc: number, s: any) => acc + s.guests.length, 0)

  return peoplePresent + guestsPresent
}

function isSessionFull(session: Session, limit: number) {	
  const membersPresent = calculateMembersPresent(session)
  return membersPresent == limit
}

export default Home
