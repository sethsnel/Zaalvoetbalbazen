import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'

import styles from '../../styles/Home.module.css'

import Link from 'next/link'
import { useSessionData } from '../../lib/data'
import { useUser } from '../../lib/useUser'

const Home: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()

  const { sessionData, joinSession, leaveSession } = useSessionData(router.query.season as string, router.query.session as string)
  const participients = Object.values(sessionData)

  const canJoin = !Object.keys(sessionData).includes(user?.id ?? '') && participients.length < 15
  const canLeave = Object.keys(sessionData).includes(user?.id ?? '')

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/">Terug naar overzicht</Link>
        <h3 style={{ marginTop: '1em' }}>
          Sessie {dayjs.unix(router.query.session as unknown as number).format('D MMMM HH:mm')} ({participients.length}/15)
        </h3>

        {
          (canJoin) ?
            <button className="btn btn-outline-success" onClick={() => joinSession({ name: user?.name ?? user?.email ?? 'geen naam', profilePic: user?.profilePic ?? 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg', userId: user?.id ?? '' })}>Deelnemen</button> :
            (canLeave) ? <button className="btn btn-outline-danger" onClick={() => leaveSession(user?.id ?? '')}>Afmelden</button> : undefined
        }

        <div style={{ marginTop: '1em' }}>
          <div className={styles.participients}>
            {
              //@ts-ignore
              participients.sort(function (a, b) { return a.joined_at - b.joined_at }).map((participient, index) =>
                <div key={index} title={dayjs.unix(participient.joined_at).format('D MMMM HH:mm')} className={styles.participientRow}>
                  <Image src={participient.profilePic} height={60} width={60} className={styles.picture} />
                  <div>
                    {participient.name} ({dayjs.unix(participient.joined_at).format('D MMMM')})
                  </div>
                </div>)
            }
          </div>
        </div>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home
