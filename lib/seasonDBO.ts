import dayjs from "dayjs"
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage"
import { getDatabase, ref, onValue, set, remove, update } from "firebase/database"
import { useEffect, useState } from "react"

import firebaseApp from "./firebaseConfig"
import useLocalStorage from "./useLocalStorage"
import { Notifications, Profile, Profiles, Session, Sessions, DeviceSubscription } from "./DBOTypes"

const db = getDatabase(firebaseApp)

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

    const getPreviousDate = (sessionDate: number): number => {
        return Object.values(seasonDates)
            .filter(s => s < sessionDate && s > dayjs().add(-12, 'hours').unix())
            .sort((d1, d2) => d2 - d1)[0]
    }

    const getNextDate = (sessionDate: number): number => {
        return Object.values(seasonDates)
            .filter(s => s > sessionDate)
            .sort((d1, d2) => d1 - d2)[0]
    }

    return { seasonDates, getPreviousDate, getNextDate }
}

const useSessions = (seasonKey: string) => {
    const [sessions, setSessions] = useLocalStorage<Sessions>(`sessions`, {})

    useEffect(() => {
        return onValue(ref(db, `/seasons/${seasonKey}/sessions`), (snapshot) => {
            setSessions({ ...snapshot.val() })
        })
    }, [seasonKey])

    return { sessions }
}

const useSessionData = (season: string, date: string) => {
    const [sessionData, setSessionData] = useLocalStorage<Session>(`session-${date}`, {})

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
    }

    function leaveSession(userId: string) {
        if (!date) return
        set(ref(db, `/seasons/${season}/sessions/${date}/${userId}`), {
            responded_at: dayjs().unix(),
            isPresent: false
        })
    }

    return { sessionData, joinSession, leaveSession }
}

const useProfiles = () => {
    const initialValue = {}
    const [profiles, setProfiles] = useLocalStorage<Profiles>(`profiles`, initialValue)
    const [isLoading, setIsLoading] = useState<boolean>(profiles === initialValue)

    useEffect(() => {
        return onValue(ref(db, `/profiles`), (snapshot) => {
            const profiles = snapshot.val()
            if (profiles !== null) {
                setProfiles(profiles)
                setIsLoading(false)
            }
        }, { onlyOnce: true })
    }, [])

    return { profiles, isLoading }
}

const useMyProfile = (userId: string) => {
    const initialValue = {}
    const [profile, setProfile] = useLocalStorage<Profile>(`profile`, initialValue)
    const [isLoading, setIsLoading] = useState<boolean>(profile === initialValue)

    useEffect(() => {
        if (userId) {
            return onValue(ref(db, `/profiles/${userId}`), (snapshot) => {
                const profile = snapshot.val()
                if (profile !== null) {
                    setProfile(profile)
                }
                setIsLoading(false)
            }, (error) => {
                if (error.message.includes('permission_denied')) {
                    window.location.reload()
                }
                else {
                    setIsLoading(false)
                }
            })
        }
    }, [userId])

    return { profile, isLoading }
}

const useProfileManagement = (userId: string) => {
    const [profile, setProfile] = useLocalStorage<Profile>(`profileMgt`, {})

    useEffect(() => {
        if (!userId) return
        return onValue(ref(db, `/profiles/${userId}`), (snapshot) => {
            setProfile(snapshot.val() || {})
        })
    }, [userId])

    function upsertProfile(userId: string, updatedProfile: Profile) {
        if (profile) {
            set(ref(db, `/profiles/${userId}`), { ...profile, ...updatedProfile })
        }
        else {
            set(ref(db, `/profiles/${userId}`), profile)
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

const useNotificationManagement = (userId: string) => {
    const [notifications, setNotifications] = useLocalStorage<Notifications>(`notifications`, {})

    useEffect(() => {
        if (!userId) return
        return onValue(ref(db, `/notifications/${userId}`), (snapshot) => {
            setNotifications(snapshot.val() || {})
        })
    }, [userId])

    function upsertNotification(token: string) {
        const newDeviceSubscription: DeviceSubscription = {
            tokenId: token,
            lastSuccesFullSendData: dayjs().unix(),
            hasFailed: false
        }

        set(ref(db, `/notifications/${userId}`), { [token]: newDeviceSubscription, ...notifications })
    }

    function removeNotification(token: string) {
        remove(ref(db, `/notifications/${userId}/${token}`))
    }

    return { notifications, upsertNotification, removeNotification }
}

export { db, useSeasonDates, useSeasonDatesManagement, useSessions, useSessionData, useProfiles, useMyProfile, useProfileManagement, useNotificationManagement }