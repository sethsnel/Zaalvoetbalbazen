import { getToken, isSupported } from "firebase/messaging";

import { messagingInstance } from "./firebaseConfig";
import { useNotificationManagement } from "./seasonDBO";
import useLocalStorage from "./useLocalStorage";

const vapidKey = 'BKNAYYQvHbJ2LRseRkUSVQd-zEPt-K-gbJ8ZF4oMKlCWqvd29EZxScLs-ItiSrfj57FMKQBkvI-_Bbb0FZH17kY'

const useNotifications = (season: string, userId: string) => {
  const [isDeviceSubscribed, setIsDeviceSubscribed] = useLocalStorage<boolean>(`push-notification-registered`, false)
  const { upsertNotification, removeNotification } = useNotificationManagement(season, userId)
  let canRegisterDevice = 'serviceWorker' in navigator
  isSupported().then(deviceSupportsPush => canRegisterDevice &&= deviceSupportsPush )

  const subscribeDevice = () => {
    if (!isDeviceSubscribed) {
      getToken(messagingInstance, { vapidKey }).then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          console.info('we have a token')
          console.info(currentToken)
          upsertNotification(currentToken)
          setIsDeviceSubscribed(true)
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
    }
  }

  const updateDeviceToken = () => {
    if (isDeviceSubscribed) {
      getToken(messagingInstance, { vapidKey }).then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          console.info('we have a token')
          console.info(currentToken)
          upsertNotification(currentToken)
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
    }
  }

  const unSubscribeDevice = () => {
    if (isDeviceSubscribed) {
      setIsDeviceSubscribed(false)

      getToken(messagingInstance, { vapidKey }).then((currentToken) => {
        if (currentToken) {
          removeNotification(currentToken)
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      })
    }
  }

  return { isDeviceSubscribed, canRegisterDevice, subscribeDevice, updateDeviceToken, unSubscribeDevice }
}

export { useNotifications }