import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { AppSettings } from "./DBOTypes"

import { db } from "./seasonDBO"
import useLocalStorage from "./useLocalStorage"

const useAppSettings = (userId: string) => {
    const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('appsettings')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        return onValue(ref(db, `/appSettings`), (snapshot) => {
            setAppSettings({ ...snapshot.val(), activeSeason: snapshot.val().tempSeason })
            setIsLoading(false)
        }, (error) => { setIsLoading(false) }, { onlyOnce: true })
    }, [])

    function isAdmin(): boolean {
        return appSettings?.admins[userId] ?? false
    }

    function setCurrentSeason(season: string) {
        set(ref(db, `/appSettings/tempSeason`), season)
        setAppSettings({ ...appSettings, activeSeason: season })
    }

    function addSeason(season: string) {
        const urlEncodedSeason = encodeURI(season)
        const newSeasons = { ...appSettings.seasons, [urlEncodedSeason]: urlEncodedSeason }
        set(ref(db, `/appSettings/seasons`), newSeasons)
        console.info(`/seasons/${urlEncodedSeason}/title`)
        set(ref(db, `/seasons/${urlEncodedSeason}/title`), season)
        setAppSettings({ ...appSettings, seasons: newSeasons })
    }

    return { isLoading, appSettings, isAdmin, setCurrentSeason, addSeason }
}

export { useAppSettings }