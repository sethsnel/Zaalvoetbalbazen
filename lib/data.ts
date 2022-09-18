import dayjs from "dayjs"
import { getDatabase, ref, onValue, set, remove, update } from "firebase/database"
import { useEffect, useState } from "react"

import firebaseApp from "./firebaseConfig"

const db = getDatabase(firebaseApp)

type Season = {
    dates?: { [key: string]: number }
    isFetched: boolean
    [key: number]: Session
}

type Sessions = {
    [key: number]: Session
}

type Session = {
    [key: string]: ParticipantData
}

type ParticipantData = { name: string, joined_at: number, profilePic: string }

const useSeason = (seasonKey: string) => {
    const [season, setSeason] = useState<Season>({dates: {}, isFetched: false})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}`), (snapshot) => {
            setSeason({ ...snapshot.val(), isFetched: true })
        })
    }, [seasonKey])

    function addSession(date: number) {
        if (season.isFetched) {
            update(ref(db, `/seasons/${seasonKey}/dates`), { ...season.dates, [date]: date })
        }
    }

    function removeSession(date: number) {
        if (season.isFetched && season.dates && date in season.dates) {
            remove(ref(db, `/seasons/${seasonKey}/${date}`))
            remove(ref(db, `/seasons/${seasonKey}/dates/${date}`))
        }
    }

    return { season, addSession, removeSession }
}

const useSessionData = (season: string, date: string) => {
    const [sessionData, setSessionData] = useState<{} | Session>({})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${season}/${date}`), (snapshot) => {
            setSessionData(snapshot.val() || {})
        })
    }, [date, season])

    function joinSession(participant: {userId: string, name: string, profilePic: string}) {
        set(ref(db, `/seasons/${season}/${date}/${participant.userId}`), {
            name: participant.name,
            profilePic: participant.profilePic,
            joined_at: dayjs().unix()
        })
    }

    function leaveSession(userId: string) {
        remove(ref(db, `/seasons/${season}/${date}/${userId}`))
    }

    return { sessionData, joinSession, leaveSession }
}

export { useSeason, useSessionData }