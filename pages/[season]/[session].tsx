import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import styles from '../../styles/Home.module.css'

import Link from 'next/link'
import { useSessionData } from '../../lib/data'

const Home: NextPage = () => {
  const router = useRouter()
  const me =  {
    id: "hatseflatse",
    name: "Seth Snel"
  }

  const { sessionData, joinSession, leaveSession } = useSessionData(router.query.season as string, router.query.session as string)

  const canJoin = !Object.keys(sessionData).includes(me.id)

  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/">Terug naar overzicht</Link>
        <h3 style={{ marginTop: '1em'}}>
          Sessie {dayjs.unix(router.query.session as unknown as number).format('D MMMM HH:mm')}
        </h3>

        {
          (canJoin) ?
            <button onClick={() => joinSession(me.id, me.name)}>Deelnemen</button> :
            <button onClick={() => leaveSession(me.id)}>Afmelden</button>
        }

        <div style={{ marginTop: '1em'}}>
          <ul className={styles.participients}>
            {
              //@ts-ignore
              Object.values(sessionData).sort(function (a, b) { return a.joined - b.joined }).map((participient, index) =>
                <li key={index} title={dayjs.unix(participient.joined).format('D MMMM HH:mm')} >{participient.name} ({dayjs.unix(participient.joined).format('D MMMM')})</li>)
            }
          </ul>
        </div>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home
