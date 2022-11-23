import { NextPage } from "next"
import { ChangeEvent } from "react"

import { useAppSettings } from "../lib/appSettingsDBO"
import { useNotifications } from "../lib/useNotifications"
import { useUser } from "../lib/useUser"

import styles from '../styles/Home.module.css'

const Voorkeuren: NextPage = () => {
    const { user } = useUser()
    const { appSettings } = useAppSettings()
    const { isDeviceSubscribed, canRegisterDevice, subscribeDevice, unSubscribeDevice } = useNotifications(appSettings.activeSeason, user?.id || '')

    const onToggleNotifications = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            subscribeDevice()
        }
        else {
            unSubscribeDevice()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.container}>

                <main className={styles.main}>
                    <h3 className='mb-3'>
                        Apparaat instellingen
                    </h3>

                    {
                        canRegisterDevice ?
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="notifications" checked={isDeviceSubscribed} onChange={onToggleNotifications} />
                                <label className="form-check-label" htmlFor="notifications">Ontvang herinneringen op dit apparaat</label>
                            </div> :
                            <div className="form-check form-switch">
                                Push berichten zijn niet ondersteund op dit apparaat.
                            </div>
                    }
                </main>
            </div>
        </div>
    )
}

export default Voorkeuren