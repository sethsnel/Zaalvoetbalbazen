import { onValue, ref } from "firebase/database"
import { useEffect } from "react"

import { db } from "./seasonDBO"
import useLocalStorage from "./useLocalStorage"

type AppSettings = {
    activeSeason: string
    sessionLimit: number
    admins: { [userId: string]: boolean }
}

const useAppSettings = () => {
    const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('appsettings')

    useEffect(() => {
        return onValue(ref(db, `/appSettings`), (snapshot) => {
            setAppSettings({ ...snapshot.val() })
        }, { onlyOnce: true })
    }, [])

    function isAdmin(userId: string): boolean {
        return appSettings?.admins[userId] ?? false
    }

    return { appSettings, isAdmin }
}

export { useAppSettings }