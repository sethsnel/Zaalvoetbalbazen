import { onValue, ref } from "firebase/database"
import { useEffect } from "react"
import { AppSettings } from "./DBOTypes"

import { db } from "./seasonDBO"
import useLocalStorage from "./useLocalStorage"

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