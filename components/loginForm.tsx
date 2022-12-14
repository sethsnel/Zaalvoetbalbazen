import { GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup } from 'firebase/auth'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BsGoogle } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

import { authInstance } from '../lib/firebaseConfig'

import PageLoader from './pageLoader'
import styles from '../styles/Home.module.css'

const provider = new GoogleAuthProvider()
provider.addScope('email')
provider.addScope('openid')
provider.addScope('profile')

const LoginForm = () => {
  const [loginWithEmail, setLoginWithEmail] = useState<boolean>(false)
  const [loggingInState, setLoggingInState] = useState<{ errorMessage?: string, loggingIn: boolean, linkSent?: boolean }>({ loggingIn: false })
  const emailInputRef = useRef<null | HTMLInputElement>(null)

  const actionCodeSettings = useMemo(() => ({
    url: typeof window !== 'undefined' ? window.location.href : '',
    handleCodeInApp: true
  }), [])

  const loginWithCustomAccount = useCallback(() => {
    setLoggingInState({ ...loggingInState, loggingIn: true })
    const sentLinkTo = emailInputRef?.current?.value ?? ''
    sendSignInLinkToEmail(authInstance, sentLinkTo, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', sentLinkTo)
        setLoggingInState({ ...loggingInState, loggingIn: false, linkSent: true })
      })
      .catch((error) => {
        setLoggingInState({ ...loggingInState, loggingIn: false, errorMessage: error.message })
      })
  }, [actionCodeSettings, loggingInState])

  const loginWithGoogle = () => {
    setLoggingInState({ ...loggingInState, loggingIn: true })
    signInWithPopup(authInstance, provider)
      .then(() => {
        setLoggingInState({ ...loggingInState, loggingIn: false })
      })
      .catch((error) => {
        setLoggingInState({ ...loggingInState, loggingIn: false, errorMessage: error.message })
      })
  }

  if (isSignInWithEmailLink(authInstance, typeof window !== 'undefined' ? window.location.href : '')) {
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      email = window.prompt('Met welk mailadres wil je inloggen?')
    }

    signInWithEmailLink(authInstance, email ?? '', window.location.href)
      .then(() => {
        setLoggingInState({ ...loggingInState, loggingIn: true })
      })
      .catch((error) => {
        setLoggingInState({ ...loggingInState, errorMessage: error.message })
      })
  }

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        loginWithCustomAccount()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [loginWithCustomAccount])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 style={{ marginTop: '1em' }}>
          Aanmelden
        </h3>

        {
          loggingInState.errorMessage && (<p>Er is een probleem: {loggingInState.errorMessage}</p>)
        }

        {
          (loggingInState.loggingIn) ?
            <PageLoader /> :
            (loggingInState.linkSent) ?
              <>Login link is verstuurd! Check je mail (ook spam folder).</> :
              (!loginWithEmail) ? (<div style={{ display: 'flex', minHeight: '10em', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                <button className={'btn btn-primary ' + styles.buttonWithIcon} onClick={loginWithGoogle}>Met gmail account<BsGoogle /></button>
                <button className={'btn btn-secondary ' + styles.buttonWithIcon} onClick={() => setLoginWithEmail(!loginWithEmail)}>Met e-mail<MdEmail /></button>
              </div>) : (<div style={{ display: 'flex', minHeight: '10em', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                <button className="btn btn-outline-secondary" onClick={() => setLoginWithEmail(!loginWithEmail)}>Terug naar opties</button>
                <div className="input-group">
                  <span className="input-group-text" id="email">Email</span>
                  <input ref={emailInputRef} type="email" className="form-control" placeholder="jouw@email.com" aria-label="email" aria-describedby="email" defaultValue={window.localStorage.getItem('emailForSignIn') ?? ''} />
                </div>
                <button className="btn btn-primary" onClick={loginWithCustomAccount}>Mail inlog link</button>
              </div>)
        }
      </main>
    </div >
  )
}

export default LoginForm
