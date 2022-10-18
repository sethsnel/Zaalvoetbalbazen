import dayjs from "dayjs"
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage"
import { getDatabase, ref, onValue, set, remove, update } from "firebase/database"
import { useEffect, useState } from "react"

import firebaseApp from "./firebaseConfig"
import useLocalStorage from "./useLocalStorage"

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
    name?: string
    email?: string
    profilePic?: string
    joined?: { [key: string]: boolean }
}

type ParticipantData = { responded_at: number, isPresent: boolean }

const useSeasonDatesManagement = (seasonKey: string) => {
    const [seasonDates, setSeasonDates] = useLocalStorage<{ [key: string]: number }>(`seasonDatesMgt`)

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
    const [seasonDates, setSeasonDates] = useLocalStorage<{ [key: string]: number }>(`seasonDates`)

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}/dates`), (snapshot) => {
            setSeasonDates({ ...snapshot.val() })
        }, { onlyOnce: true })
    }, [seasonKey])

    return { seasonDates }
}

const useSessions = (seasonKey: string) => {
    const [sessions, setSessions] = useLocalStorage<Sessions>(`sessions`, {})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}/sessions`), (snapshot) => {
            setSessions({ ...snapshot.val() })
        })
    }, [seasonKey])

    const getNextSession = (sessionDate: number): string => {
        return Object.keys(sessions)
            .filter(s => parseInt(s) > sessionDate)
            .sort((d1, d2) => parseInt(d1) - parseInt(d2))[0]
    }

    return { sessions, getNextSession }
}

const useSessionData = (season: string, date: string) => {
    const [sessionData, setSessionData] = useLocalStorage<Session>(`session-${date}`,{})

    useEffect(() => {
        if (!date) return
        return onValue(ref(db, `/seasons/${season}/sessions/${date}`), (snapshot) => {
            setSessionData(snapshot.val() || {})
        })
    }, [season, date])

    function joinSession(userId: string) {
        if (!date) return
        set(ref(db, `/seasons/${season}/sessions/${date}/${userId}`), {
            responded_at: dayjs().unix(),
            isPresent: true
        })
        set(ref(db, `/seasons/${season}/profiles/${userId}/joined/${date}`), true)
    }

    function leaveSession(userId: string) {
        if (!date) return
        set(ref(db, `/seasons/${season}/sessions/${date}/${userId}`), {
            responded_at: dayjs().unix(),
            isPresent: false
        })
        remove(ref(db, `/seasons/${season}/profiles/${userId}/joined/${date}`))
    }

    return { sessionData, joinSession, leaveSession }
}

const useProfiles = (season: string) => {
    const initialValue = {}
    const [profiles, setProfiles] = useLocalStorage<Profiles>(`profiles`, initialValue)
    const [isLoading, setIsLoading] = useState<boolean>(profiles === initialValue)

    useEffect(() => {
        return onValue(ref(db, `/seasons/${season}/profiles`), (snapshot) => {
            const profiles = snapshot.val()
            if (profiles !== null) {
                setProfiles(profiles)
                setIsLoading(false)
            }

        }, { onlyOnce: true })
    }, [season])

    return { profiles, isLoading }
}

const useMyProfile = (season: string, userId: string) => {
    const initialValue = {}
    const [profile, setProfile] = useLocalStorage<Profile>(`profile`, initialValue)
    const [isLoading, setIsLoading] = useState<boolean>(profile === initialValue)

    useEffect(() => {
        if (!userId) {
            setIsLoading(false)
        }
        else {
            return onValue(ref(db, `/seasons/${season}/profiles/${userId}`), (snapshot) => {
                const profile = snapshot.val()
                if (profile !== null) {
                    setProfile(profile)
                    setIsLoading(false)
                }
            })
        }
    }, [season, userId])

    return { profile, isLoading }
}

const useProfileManagement = (season: string, userId: string) => {
    const [profile, setProfile] = useLocalStorage<Profile>(`profileMgt`,{})

    useEffect(() => {
        if (!userId) return
        return onValue(ref(db, `/seasons/${season}/profiles/${userId}`), (snapshot) => {
            setProfile(snapshot.val() || {})
        })
    }, [season, userId])

    function upsertProfile(userId: string, updatedProfile: Omit<Profile, 'joined'>) {
        if (profile) {
            set(ref(db, `/seasons/${season}/profiles/${userId}`), { profile, ...updatedProfile })
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

    return { profile, upsertProfile, uploadFile }
}

export { db, useSeasonDates, useSeasonDatesManagement, useSessions, useSessionData, useProfiles, useMyProfile, useProfileManagement }