import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'

import uppercaseFirst from '../lib/upperCaseFirst'
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
  const { profile, isLoading: isLoadingProfile } = useMyProfile(user?.id || '')

  const fallbackImg = 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'

  return <>
    <Head>
      <title>{uppercaseFirst(appSettings?.title)}</title>
      <meta name="description" content={appSettings?.title} />
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>⚽</text></svg>"></link>
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
              : <UpdateProfile user={user} />
          : <LoginForm />
    }
  </>
}

export default ZaalvoetbalbazenApp
