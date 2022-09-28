import { NextPage } from "next"

import PageLoader from "../components/pageLoader"
import UpdateProfile from "../components/updateProfile"
import { useAppSettings } from "../lib/appSettingsDBO"
import { useUser } from "../lib/useUser"

import styles from '../styles/Home.module.css'

const Profiel: NextPage = () => {
    const { user } = useUser()
    const { appSettings } = useAppSettings()

    return (
        <div className={styles.container}>
            {(user?.id && appSettings?.activeSeason) ?
                <UpdateProfile user={user} activeSeason={appSettings.activeSeason} /> :
                <PageLoader fullscreen={true} />}
        </div>
    )
}

export default Profiel