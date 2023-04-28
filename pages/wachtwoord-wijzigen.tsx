import { NextPage } from "next"

import PageLoader from "../components/pageLoader"
import UpdatePassword from "../components/updatePassword"
import { useUser } from "../lib/useUser"

import styles from '../styles/Home.module.css'

const WachtwoordWijzigen: NextPage = () => {
    const { user } = useUser()

    return (
        <div className={styles.container}>
            {(user?.id) ?
                <UpdatePassword user={user} /> :
                <PageLoader fullscreen={true} />}
        </div>
    )
}

export default WachtwoordWijzigen