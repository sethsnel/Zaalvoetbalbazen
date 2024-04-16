import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useRef, useState } from 'react'

import { useProfileManagement } from '../lib/seasonDBO'
import { UserProfile } from '../lib/useUser'

import styles from '../styles/Home.module.css'

type UpdateProfileProps = {
  user: UserProfile
}

const UpdateProfile = ({ user }: UpdateProfileProps) => {
  const { profile, upsertProfile, uploadFile } = useProfileManagement(user.id)
  const [profileSaved, setProfileSaved] = useState<boolean>(false)
  const [profileError, setProfileError] = useState<boolean>(false)

  const nameInputRef = useRef<null | HTMLInputElement>(null)
  const emailInputRef = useRef<null | HTMLInputElement>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const myProfile = {
    name: user.name,
    email: user.email,
    profilePic: user.profilePic ?? '',
    ...profile
  }

  const onFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const url = await uploadFile(user.id, e.target.files[0])
      setFileUrl(url)
    }
  }

  const submitProfile = () => {
    if (nameInputRef?.current?.value) {
      upsertProfile(user.id, {
        name: nameInputRef?.current?.value || '',
        email: emailInputRef?.current?.value || '',
        profilePic: fileUrl ?? myProfile.profilePic
      })
      setProfileSaved(true)
      setProfileError(false)
    }
    else {
      setProfileSaved(false)
      setProfileError(true)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 className='mb-3'>
          Vul je profiel aan
        </h3>

        <Image src={fileUrl || myProfile.profilePic || 'https://craftsnippets.com/articles_images/placeholder/placeholder.jpg'} height={80} width={80} className={styles.picture} objectFit='cover' alt='profile picture' />

        <div className='mt-3' style={{ display: 'flex', minHeight: '10em', justifyContent: 'space-evenly', flexDirection: 'column' }}>
          <div className="input-group mb-2" key={myProfile.name}>
            <label className="input-group-text" htmlFor="name">Naam</label>
            <input ref={nameInputRef} id="name" type="text" className="form-control" placeholder="naam" aria-label="naam" aria-describedby="naam" defaultValue={myProfile.name || ''} />
          </div>
          <div className="input-group mb-2">
            <label className="input-group-text" htmlFor="email">Email</label>
            <input disabled ref={emailInputRef} id="email" type="email" className="form-control" placeholder="jouw@email.com" aria-label="email" aria-describedby="email" defaultValue={myProfile.email || ''} />
          </div>
          <div className="input-group">
            <input onChange={onFileSelect} id="afbeelding" type="file" className="form-control" aria-label="afbeelding" aria-describedby="afbeelding" />
            <label className="input-group-text" htmlFor="afbeelding">Profielfoto</label>
          </div>
          <button className="btn btn-primary mt-3" onClick={submitProfile}>Profiel bijwerken</button>
          <Link href='/wachtwoord-wijzigen' legacyBehavior><button className="btn btn-secondary mt-3">Wachtwoord wijzigen</button></Link>
        </div>

        {profileSaved && <div className="alert alert-success d-flex align-items-center mt-5" role="alert">
          Profiel bijgewerkt,&nbsp;<Link href="/" style={{textDecoration: 'underline'}}>ga naar home</Link>
        </div>}

        {profileError && <div className="alert alert-danger d-flex align-items-center mt-5" role="alert">
          Profiel niet opgeslagen, geef minimaal een naam op. Bij voorkeur ook een profielfoto.
        </div>}
      </main>
    </div>
  );
}

export default UpdateProfile
