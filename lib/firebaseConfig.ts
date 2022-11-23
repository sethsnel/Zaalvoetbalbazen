import { initializeApp } from 'firebase/app'
// the below imports are option - comment out what you don't need
// import 'firebase/auth'
// import 'firebase/firestore'
// import 'firebase/storage'
//import 'firebase/analytics'
//import 'firebase/performance'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getMessaging, Messaging } from 'firebase/messaging'

// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp(clientCredentials)

export let messagingInstance: Messaging
if (typeof window !== 'undefined') {
    if ('serviceWorker' in navigator) {
        messagingInstance = getMessaging(firebaseApp)
    }
    // const analytics = getAnalytics(firebaseApp)
    // const performance = getPerformance(firebaseApp)

    // initializeAppCheck(firebaseApp, {
    //     provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITEKEY as string),
    //     isTokenAutoRefreshEnabled: true
    // })
}

export const firestoreDb = getFirestore(firebaseApp)
export const authInstance = getAuth(firebaseApp)

authInstance.languageCode = 'nl'
export default firebaseApp