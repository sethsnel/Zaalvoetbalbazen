import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'

import { useUser } from '../lib/useUser'
import { useProfiles } from '../lib/seasonDBO'
import { useAppSettings } from '../lib/appSettingsDBO'
import LoginForm from '../components/loginForm'
import UpdateProfile from '../components/updateProfile'
// import dayjs from 'dayjs'

// var localizedFormat = require('dayjs/plugin/localizedFormat')
// dayjs.extend(localizedFormat)

function ZaalvoetbalbazenApp({ Component, pageProps }: AppProps) {
  const { user, isLoading } = useUser()
  const { appSettings } = useAppSettings()
  const activeSeason = appSettings?.activeSeason || ''
  const { profiles, isLoading: isLoadingProfiles } = useProfiles(activeSeason)
  
  return <>
    <Head>
      <title>Zaalvoetbalbazen</title>
      <meta name="description" content="Zaalvoetbalbazen app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {
      (isLoading || isLoadingProfiles) ?
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">App laden...</span>
          </div>
        </div> :
        (user) ?
          (profiles[user?.id || '']) ?
            <Component {...pageProps} />
            : <UpdateProfile user={user} activeSeason={activeSeason} />
          : <LoginForm />
    }
  </>
}

export default ZaalvoetbalbazenApp
