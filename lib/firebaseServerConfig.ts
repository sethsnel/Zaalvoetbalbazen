import admin from 'firebase-admin'
import { App } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { getMessaging } from 'firebase-admin/messaging'

let firebaseAdmin: App

declare global {
  var __firebaseAdmin: App | undefined
}

try {
  if (process.env.NODE_ENV === 'production') {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    })
  }
  else {
    if (!global.__firebaseAdmin) {
      global.__firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      })
    }

    firebaseAdmin = global.__firebaseAdmin
  }
} catch (error: any) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack)
  }
}

//@ts-ignore
export const databaseServer = getDatabase(firebaseAdmin)

//@ts-ignore
export const messagingServer = getMessaging(firebaseAdmin)

//@ts-ignore
export default firebaseAdmin