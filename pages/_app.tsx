import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'

import { useUser } from '../lib/useUser'
import LoginForm from '../components/loginForm'
// import dayjs from 'dayjs'

// var localizedFormat = require('dayjs/plugin/localizedFormat')
// dayjs.extend(localizedFormat)

function ZaalvoetbalbazenApp({ Component, pageProps }: AppProps) {
  const { user } = useUser()

  return <>
    <Head>
      <title>Zaalvoetbalbazen</title>
      <meta name="description" content="Zaalvoetbalbazen app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {
      (user) ?
        <Component {...pageProps} /> : <LoginForm />
    }
  </>
}

export default ZaalvoetbalbazenApp
