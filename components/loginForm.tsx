import { GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BsGoogle } from 'react-icons/bs'
import { MdEmail, MdPassword } from 'react-icons/md'

import { authInstance } from '../lib/firebaseConfig'

import PageLoader from './pageLoader'
import styles from '../styles/Home.module.css'

const provider = new GoogleAuthProvider()
provider.addScope('email')
provider.addScope('openid')
provider.addScope('profile')

type loggingInState = { errorMessage?: string, loggingIn: boolean, linkSent?: boolean }

const LoginForm = () => {
  const [loginWithEmail, setLoginWithEmail] = useState<boolean>(false)
  const [loginWithPassword, setLoginWithPassword] = useState<boolean>(false)
  const [loggingInState, setLoggingInState] = useState<loggingInState>({ loggingIn: false })

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

  return (
    <div className={`${styles.container} ${styles.bg} ${styles.login}`}>
      <main className={styles.main}>
        <div className='mt-auto mb-auto'>
          <h1 style={{ textAlign: 'center' }}>
            Zaalvoetbal bazen
          </h1>

          {
            loggingInState.errorMessage && (<p>Er is een probleem: {loggingInState.errorMessage}</p>)
          }

          {
            (loggingInState.loggingIn) ?
              <PageLoader /> :
              (loggingInState.linkSent) ?
                <>Login link is verstuurd! Check je mail (ook spam folder).</> :
                <>
                  { loginWithEmail && <EmailLinkForm setLoggingInState={setLoggingInState} setLoginWithEmail={setLoginWithEmail} loggingInState={loggingInState} loginWithEmail={loginWithEmail} /> }
                  { loginWithPassword && <SignInWithPasswordForm setLoggingInState={setLoggingInState} setLoginWithPassword={setLoginWithPassword} loggingInState={loggingInState} loginWithPassword={loginWithPassword} /> }
                  { !loginWithEmail && !loginWithPassword && (
                    <div style={{ display: 'flex', minHeight: '15em', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                      <button className={'btn btn-primary shadow ' + styles.buttonWithIcon} onClick={loginWithGoogle}><BsGoogle /> Login met Google</button>
                      <button className={'btn btn-secondary shadow ' + styles.buttonWithIcon} onClick={() => setLoginWithEmail(!loginWithEmail)}><MdEmail /> Login met e-mail</button>
                      <button className={'btn btn-secondary shadow ' + styles.buttonWithIcon} onClick={() => setLoginWithPassword(!loginWithPassword)}><MdPassword /> Login met wachtwoord</button>
                    </div>
                  )}
                </>
          }
        </div>
      </main>
    </div >
  )
}

function EmailLinkForm({setLoggingInState, setLoginWithEmail, loggingInState, loginWithEmail} : {setLoggingInState: (state: loggingInState) => void, setLoginWithEmail: (loginWithEmail: boolean) => void, loggingInState: loggingInState, loginWithEmail: boolean}) {
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

  return <div style={{ display: 'flex', minHeight: '10em', justifyContent: 'space-evenly', flexDirection: 'column' }}>
    <button className="btn btn-secondary mb-2 shadow" onClick={() => setLoginWithEmail(!loginWithEmail)}>Terug naar opties</button>
    <div className="input-group mb-2">
      <span className="input-group-text" id="email">Email</span>
      <input ref={emailInputRef} type="email" className="form-control" placeholder="jouw@email.com" aria-label="email" aria-describedby="email" defaultValue={window.localStorage.getItem('emailForSignIn') ?? ''} />
    </div>
    <button className="btn btn-primary" onClick={loginWithCustomAccount}>Mail inlog link</button>
  </div>
}

function SignInWithPasswordForm({setLoggingInState, setLoginWithPassword, loginWithPassword, loggingInState} : {setLoggingInState: (state: loggingInState) => void, setLoginWithPassword: (loginWithPassword: boolean) => void, loggingInState: loggingInState, loginWithPassword: boolean}) {
  const emailInputRef = useRef<null | HTMLInputElement>(null)
  const passwordInputRef = useRef<null | HTMLInputElement>(null)

  const loginPasswordFlow = useCallback(() => {
    setLoggingInState({ ...loggingInState, loggingIn: true })
    const email = emailInputRef?.current?.value ?? ''
    const password = passwordInputRef?.current?.value ?? ''
    signInWithEmailAndPassword(authInstance, email, password)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email)
        setLoggingInState({ ...loggingInState, loggingIn: false, linkSent: false })
      })
      .catch((error) => {
        setLoggingInState({ ...loggingInState, loggingIn: false, errorMessage: error.message })
      })
  }, [loggingInState])

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        loginPasswordFlow()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [loginWithPassword])

  return <div style={{ display: 'flex', minHeight: '10em', justifyContent: 'space-evenly', flexDirection: 'column' }}>
    <button className="btn btn-secondary mb-2 shadow" onClick={() => setLoginWithPassword(!loginWithPassword)}>Terug naar opties</button>
    <div className="input-group mb-2">
      <span className="input-group-text" id="email">Email</span>
      <input ref={emailInputRef} type="email" className="form-control" placeholder="jouw@email.com" aria-label="email" aria-describedby="email" defaultValue={window.localStorage.getItem('emailForSignIn') ?? ''} />
    </div>
    <div className="input-group mb-2">
      <span className="input-group-text" id="password">Wachtwoord</span>
      <input ref={passwordInputRef} type="password" className="form-control" aria-label="password" aria-describedby="password" />
    </div>
    <button className="btn btn-primary" onClick={loginPasswordFlow}>Login</button>
  </div>
}

export default LoginForm