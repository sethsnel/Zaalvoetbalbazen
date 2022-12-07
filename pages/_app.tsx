import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'

import { useUser } from '../lib/useUser'
import { useMyProfile } from '../lib/seasonDBO'
import { useAppSettings } from '../lib/appSettingsDBO'
import LoginForm from '../components/loginForm'
import UpdateProfile from '../components/updateProfile'
import PageLoader from '../components/pageLoader'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'
import 'dayjs/locale/nl'

const Navbar = dynamic(() => import('../components/navbar').then((mod) => mod.default), {
  ssr: false,
})

dayjs.locale('nl')

function ZaalvoetbalbazenApp({ Component, pageProps }: AppProps) {
  const { user, logout } = useUser()
  const { appSettings, isAdmin, isLoading } = useAppSettings(user?.id || '')
  const activeSeason = appSettings?.activeSeason || ''
  const { profile, isLoading: isLoadingProfile } = useMyProfile(activeSeason, user?.id || '')

  const fallbackImg = 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'

  return <>
    <Head>
      <title>Zaalvoetbalbazen</title>
      <meta name="description" content="Zaalvoetbalbazen app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {
      (isLoading) ?
        <PageLoader fullscreen={true} /> :
        (user) ?
          (isLoadingProfile) ?
            <PageLoader fullscreen={true} /> :
            (profile && profile.name) ?
              <>
                <Navbar isAdmin={isAdmin()} profileUrl={profile.profilePic || fallbackImg} logout={logout} />
                <Component {...pageProps} />
              </>
              : <UpdateProfile user={user} activeSeason={activeSeason} />
          : <LoginForm />
    }
  </>
}

export default ZaalvoetbalbazenApp
