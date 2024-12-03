import dayjs from "dayjs"
import Link from "next/link"
import Image from "next/image"
import {
  BsCheckCircleFill,
  BsXCircleFill,
} from "react-icons/bs"

import { Session } from "../lib/DBOTypes"

import styles from "../styles/Home.module.css"

type SessionLinkRowProps = {
  date: number
  session: Session
  limit: number
  activeSeason: string
  presentIndicator: boolean
  user: {
    id: string
    profilePic: string
  }
}

const SessionLinkRow = ({
  date,
  session,
  limit,
  activeSeason,
  presentIndicator,
  user
}: SessionLinkRowProps) => {
  const sessionHref = `/${activeSeason}/${date}`
  const membersPresent = calculateMembersPresent(session)
  const badgeClassName = getBadgeClassName(presentIndicator, membersPresent)

  return <div className={styles.sessionContainer}>
    <Link href={sessionHref}>
      {dayjs.unix(date).format("D MMMM")}
      <MyBadge session={session} limit={limit} userId={user.id} profilePic={user.profilePic} />
      <span className={`badge ms-2 ${badgeClassName}`}>
        {membersPresent}/{limit}
      </span>
    </Link>
  </div>
}

type MyBadgeProps = { session: Session, limit: number, userId?: string, profilePic?: string }
const MyBadge = (props: MyBadgeProps) => {
  const { session, limit, userId, profilePic } = props
  const isFull = isSessionFull(session, limit) // use this to show a full indicator (lock icon)
  var userPresentIndicator = undefined // default: no indicator, user has not responded to session

  if (session && session[userId || ""]) { // has user responded to session?
    if (session && session[userId || ""]?.isPresent) { // user is present
      userPresentIndicator = <span className="text-success fs-5 position-absolute top-0 start-100 translate-middle">
        <BsCheckCircleFill />
      </span>
    }
    else { // user is absent
      userPresentIndicator = <span className="text-danger fs-5 position-absolute top-0 start-100 translate-middle">
        <BsXCircleFill />
      </span>
    }
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
      {userPresentIndicator}
    </div>
  )
}

const getBadgeClassName = (presentIndicator: boolean, membersPresent: number) => {
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

export default SessionLinkRow
