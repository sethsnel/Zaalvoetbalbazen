import Link from 'next/link'
import { getAuth, updatePassword } from "firebase/auth"
import { useRef, useState } from 'react'

import { UserProfile } from '../lib/useUser'

import styles from '../styles/Home.module.css'

type UpdateProfileProps = {
  user: UserProfile
}

const UpdatePassword = ({ user }: UpdateProfileProps) => {
  const [passwordSaved, setPasswordSaved] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined)

  const passwordInputRef = useRef<null | HTMLInputElement>(null)
  const passwordConfirmInputRef = useRef<null | HTMLInputElement>(null)

  const myProfile = {
    name: user.name,
    email: user.email
  }

  const submitNewPassword = async () => {
    if (!passwordInputRef?.current?.value) {
      setPasswordError('er is geen nieuw wachtwoord opgegeven.')
      return
    }

    if (passwordInputRef?.current?.value !== passwordConfirmInputRef?.current?.value) {
      setPasswordError('opgegeven wachtworden komen niet overeen.')
      return
    }

    const auth = getAuth();

    if (auth.currentUser === null) {
      setPasswordError('sessie is verlopen.')
      return;
    }

    try {
      await updatePassword(auth.currentUser, passwordInputRef?.current?.value)
      setPasswordSaved(true)
    }
    catch (e: any) {
      if (e.code.includes('requires-recent-login')) {
        setPasswordError('je moet opnieuw inloggen om je wachtwoord aan te kunnen passen.')
        return
      }

      if (e.code.includes('weak-password')) {
        setPasswordError('het opgegeven wachtwoord is te zwak. (' + e?.message + ')')
        return
      }

      setPasswordError('er is een technische fout opgetreden: ' + e?.message)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 className='mb-3'>
          Wijzig of maak nieuw wachtwoord aan
        </h3>

        <div className='mt-3' style={{ display: 'flex', minHeight: '10em', justifyContent: 'space-evenly', flexDirection: 'column' }}>
          <div className="input-group mb-2" key={myProfile.name}>
            <label className="input-group-text" htmlFor="password">Nieuw wachtwoord</label>
            <input ref={passwordInputRef} id="password" type="password" className="form-control" placeholder="wachtwoord" aria-label="wachtwoord" aria-describedby="password" defaultValue={''} />
          </div>
          <div className="input-group mb-2">
            <label className="input-group-text" htmlFor="password-repeat">Herhaal wachtwoord</label>
            <input ref={passwordConfirmInputRef} id="password-repeat" type="password" className="form-control" placeholder="herhaal wachtwoord" aria-label="password-repeat" aria-describedby="password-repeat" defaultValue={''} />
          </div>
          <button className="btn btn-primary mt-3" onClick={submitNewPassword}>Wachtwoord opslaan</button>
          <Link href='/profiel'><button className="btn btn-secondary mt-3">Terug naar profiel</button></Link>
        </div>

        {passwordSaved && <div className="alert alert-success d-flex align-items-center mt-5" role="alert">
          Wachtwoord bijgewerkt,&nbsp;<Link href="/"><a style={{textDecoration: 'underline'}}>ga naar home</a></Link>
        </div>}

        {passwordError && <div className="alert alert-danger d-flex align-items-center mt-5" role="alert">
          Wachtwoord niet opgeslagen: {passwordError}
        </div>}
      </main>
    </div>
  )
}

export default UpdatePassword
