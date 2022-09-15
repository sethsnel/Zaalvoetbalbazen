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
    [key: string]: { name: string, joined: number }
}

const useSeason = (seasonKey: string) => {
    const [season, setSeason] = useState<Season>({dates: {}, isFetched: false})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}`), (snapshot) => {
            setSeason({ ...snapshot.val(), isFetched: true })
        })
    }, [])

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
    }, [])

    function joinSession(userId: string, name: string) {
        set(ref(db, `/seasons/${season}/${date}/${userId}`), {
            name,
            joined: dayjs().unix()
        })
    }

    function leaveSession(userId: string) {
        remove(ref(db, `/seasons/${season}/${date}/${userId}`))
    }

    return { sessionData, joinSession, leaveSession }
}

export { useSeason, useSessionData }