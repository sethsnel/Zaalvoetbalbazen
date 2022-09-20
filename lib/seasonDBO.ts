import dayjs from "dayjs"
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage"
import { getDatabase, ref, onValue, set, remove, update } from "firebase/database"
import { useEffect, useState } from "react"

import firebaseApp from "./firebaseConfig"

const db = getDatabase(firebaseApp)

type Season = {
    title: string
    dates: { [key: string]: number }
    isFetched: boolean
    sessions: Sessions
    profiles: Profiles
}

type Sessions = {
    [key: number]: Session
}

type Session = {
    [key: string]: ParticipantData
}

type Profiles = {
    [key: string]: Profile
}

type Profile = {
    name: string | null,
    email: string | null,
    profilePic: string | null
    joined: { [key: string]: boolean }
}

type ParticipantData = { responded_at: number, isPresent: boolean }

const useSeasonDatesManagement = (seasonKey: string) => {
    const [seasonDates, setSeasonDates] = useState<{ [key: string]: number }>()

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}/dates`), (snapshot) => {
            setSeasonDates({ ...snapshot.val() })
        })
    }, [seasonKey])

    function addSessionDate(date: number) {
        update(ref(db, `/seasons/${seasonKey}/dates`), { ...seasonDates, [date]: date })
    }

    function removeSessionDate(date: number) {
        if (Object.values(seasonDates || {}).includes(date)) {
            remove(ref(db, `/seasons/${seasonKey}/sessions/${date}`))
            remove(ref(db, `/seasons/${seasonKey}/dates/${date}`))
        }
    }

    return { seasonDates, addSessionDate, removeSessionDate }
}

const useSeasonDates = (seasonKey: string) => {
    const [seasonDates, setSeasonDates] = useState<{ [key: string]: number }>()

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}/dates`), (snapshot) => {
            setSeasonDates({ ...snapshot.val() })
        }, { onlyOnce: true })
    }, [seasonKey])

    return { seasonDates }
}

const useSessions = (seasonKey: string) => {
    const [sessions, setSessions] = useState<Sessions>({})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}/sessions`), (snapshot) => {
            setSessions({ ...snapshot.val() })
        })
    }, [seasonKey])

    return { sessions }
}

const useSessionData = (season: string, date: string) => {
    const [sessionData, setSessionData] = useState<Session>({})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${season}/sessions/${date}`), (snapshot) => {
            setSessionData(snapshot.val() || {})
        })
    }, [date, season])

    function joinSession(userId: string) {
        set(ref(db, `/seasons/${season}/sessions/${date}/${userId}`), {
            responded_at: dayjs().unix(),
            isPresent: true
        })
        set(ref(db, `/seasons/${season}/profiles/${userId}/joined/${date}`), true)
    }

    function leaveSession(userId: string) {
        set(ref(db, `/seasons/${season}/sessions/${date}/${userId}`), {
            responded_at: dayjs().unix(),
            isPresent: false
        })
        remove(ref(db, `/seasons/${season}/profiles/${userId}/joined/${date}`))
    }

    return { sessionData, joinSession, leaveSession }
}

const useProfiles = (season: string) => {
    const [profiles, setProfiles] = useState<Profiles>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        return onValue(ref(db, `/seasons/${season}/profiles`), (snapshot) => {
            setProfiles(snapshot.val() || {})
            setIsLoading(false)
        }, { onlyOnce: true })
    }, [season])

    return { profiles, isLoading }
}

const useProfilesManagement = (season: string) => {
    const [profiles, setProfiles] = useState<Profiles>({})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${season}/profiles`), (snapshot) => {
            setProfiles(snapshot.val() || {})
        })
    }, [season])

    function upsertProfile(userId: string, profile: Omit<Profile, 'joined'>) {
        if (profiles[userId]) {
            set(ref(db, `/seasons/${season}/profiles/${userId}`), { ...profiles[userId], ...profile })
        }
        else {
            set(ref(db, `/seasons/${season}/profiles/${userId}`), profile)
        }
    }

    const uploadFile = async (userId: string, file: File): Promise<string> => {
        const storageInstance = getStorage(firebaseApp)
        const imagesRef = storageRef(storageInstance, `profilePictures/${userId}/profile.${file.name.split('.').pop()}`)
        const uploadTask = await uploadBytes(imagesRef, file)
        return await getDownloadURL(uploadTask.ref)
    }

    return { profiles, upsertProfile, uploadFile }
}

export { db, useSeasonDates, useSeasonDatesManagement, useSessions, useSessionData, useProfiles, useProfilesManagement }