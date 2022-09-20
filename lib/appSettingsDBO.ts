import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"

import { db } from "./seasonDBO"

type AppSettings = {
    activeSeason: string
    sessionLimit: number
}

const useAppSettings = () => {
    const [appSettings, setAppSettings] = useState<AppSettings>()

    useEffect(() => {
        return onValue(ref(db, `/appSettings`), (snapshot) => {
            setAppSettings({ ...snapshot.val() })
        }, { onlyOnce: true })
    }, [])

    return { appSettings }
}

export { useAppSettings }