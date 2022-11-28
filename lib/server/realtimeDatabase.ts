import { Reference } from "firebase-admin/database";
import { DeviceSubscription, Notifications, Session } from "../DBOTypes";
import { databaseServer } from "../firebaseServerConfig";

const getValueAsync = <T>(ref: Reference): Promise<T> => {
  return new Promise((resolve, reject) => {
    const onError = (error: any) => reject(error)
    const onData = (snap: any) => resolve(snap.val() as T)

    ref.once("value", onData, onError)
  })
}

const setValueAsync = <T>(ref: Reference, value: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const onComplete = (error: Error | null) => {
      if (error === null) {
        resolve()
      }
      else {
        reject(error)
      }
    }
    ref.set(value, onComplete)
  })
}

export const getActiveSeason = async () => {
  var activeSeasonRef = databaseServer.ref("appSettings/activeSeason")
  return await getValueAsync<string>(activeSeasonRef)
}

export const getNotifications = async (activeSeason: string) => {
  var notificationsRef = databaseServer.ref(`seasons/${activeSeason}/notifications`)
  return await getValueAsync<Notifications>(notificationsRef)
}

export const getDates = async (activeSeason: string, fromDate?: number, tillDate?: number) => {
  var activeSeasonRef = databaseServer.ref(`seasons/${activeSeason}/dates`)
  let sessions = Object.values(await getValueAsync<{ [key: string]: number }>(activeSeasonRef))

  if (fromDate && tillDate) {
    sessions = sessions.filter((s: number) => s > fromDate && s < tillDate)
  }

  return sessions
}

export const getSession = async (activeSeason: string, sessionDate: number) => {
  var activeSeasonRef = databaseServer.ref(`seasons/${activeSeason}/sessions/${sessionDate}`)
  return await getValueAsync<Session>(activeSeasonRef)
}

export const updateDeviceSubscription = async (activeSeason: string, userId: string, deviceSubscription: DeviceSubscription) => {
  var deviceSubscriptionRef = databaseServer.ref(`seasons/${activeSeason}/notifications/${userId}/${deviceSubscription.tokenId}`)
  return await setValueAsync<DeviceSubscription>(deviceSubscriptionRef, deviceSubscription)
}