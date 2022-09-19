import { NextPage } from "next"
import Link from 'next/link'

import UpdateProfile from "../components/updateProfile"
import { useAppSettings } from "../lib/appSettingsDBO"
import { useUser } from "../lib/useUser"

import styles from '../styles/Home.module.css'

const Profiel: NextPage = () => {
    const { user, logout } = useUser()
    const { appSettings } = useAppSettings()

    return (
        <div className={styles.container}>
            {(user?.id && appSettings?.activeSeason) ?
                <UpdateProfile user={user} activeSeason={appSettings.activeSeason} /> :
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Gegevens laden.</span>
                </div>}
            <footer className={styles.footer}>
                <Link href='/'><button className="btn btn-outline-primary me-2" type="button">Home</button></Link>
                <Link href='/profiel'><button className="btn btn-outline-secondary me-2" type="button">Mijn profiel</button></Link>
                <button className="btn btn-outline-warning" onClick={logout} type="button">Afmelden</button>
            </footer>
        </div>
    )
}

export default Profiel