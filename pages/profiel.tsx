import { NextPage } from "next"

import PageLoader from "../components/pageLoader"
import UpdateProfile from "../components/updateProfile"
import { useUser } from "../lib/useUser"

import styles from '../styles/Home.module.css'

const Profiel: NextPage = () => {
    const { user } = useUser()

    return (
        <div className={styles.container}>
            {(user?.id) ?
                <UpdateProfile user={user} /> :
                <PageLoader fullscreen={true} />}
        </div>
    )
}

export default Profiel