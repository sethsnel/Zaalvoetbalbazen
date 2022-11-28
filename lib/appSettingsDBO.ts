import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { AppSettings } from "./DBOTypes"

import { db } from "./seasonDBO"
import useLocalStorage from "./useLocalStorage"

const useAppSettings = (userId: string) => {
    const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('appsettings')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        return onValue(ref(db, `/appSettings`), (snapshot) => {
            setAppSettings({ ...snapshot.val() })
            setIsLoading(false)
        }, (error) => { setIsLoading(false) }, { onlyOnce: true })
    }, [userId])

    function isAdmin(): boolean {
        return appSettings?.admins[userId] ?? false
    }

    return { appSettings, isAdmin, isLoading }
}

export { useAppSettings }