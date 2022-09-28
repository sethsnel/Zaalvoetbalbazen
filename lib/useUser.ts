import 'firebase/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ParsedToken, User } from "firebase/auth"

import { authInstance } from './firebaseConfig'
import useLocalStorage from './useLocalStorage'

const useUser = () => {
  const [user, setUser] = useLocalStorage<UserProfile | undefined>('user', undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const logout = async () => {
    return authInstance
      .signOut()
      .then(() => {
        router.push('/')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    if (user !== undefined) setIsLoading(false)
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = authInstance.onIdTokenChanged(async (user) => {
      if (user) {
        const userData = await mapUserData(user)
        //setUserCookie(userData)
        setUser(userData)
      } else {
        //removeUserCookie()
        setUser(undefined)
      }
      setIsLoading(false)
    })

    // const userFromCookie = getUserFromCookie()
    // if (!userFromCookie) {
    //   router.push('/')
    //   return
    // }
    // setUser(userFromCookie)

    return () => {
      cancelAuthListener && cancelAuthListener()
    }
  }, [])

  return { user, logout, isLoading }
}

export { useUser }

export interface UserProfile {
  id: string
  email: string | null
  name: string | null
  profilePic: string | null
  role: UserRole | null
  idToken: string | null
  hasContributeRights: () => boolean
  hasAdminRights: () => boolean
}

export type UserRole = 'admin' | 'contributor' | 'reader'

const mapUserData = async (user: User): Promise<UserProfile> => {
    const { uid, email, displayName, photoURL } = user
    var idToken = await user.getIdTokenResult()

    const role = mapClaimsToUserRole(idToken.claims)

    return {
        id: uid,
        email,
        name: displayName,
        profilePic: photoURL,
        role,
        idToken: idToken.token,
        hasAdminRights: () => ['admin'].includes(role),
        hasContributeRights: () => ['admin', 'contributor'].includes(role)
    }
}

function mapClaimsToUserRole(claims: ParsedToken | { [key: string]: any }): UserRole {
    if (claims.admin) {
        return 'admin'
    }
    else if (claims.contributor) {
        return 'contributor'
    }

    return 'reader'
}