
export type AppSettings = {
    activeSeason: string
    seasons: { [key: string]: string }
    sessionLimit: number
    admins: { [userId: string]: boolean }
}

export type Season = {
    title: string
    dates: { [key: string]: number }
    isFetched: boolean
    sessions: Sessions
    notifications: Notifications
}

export type Sessions = {
    [key: number]: Session
}

export type Session = {
    [key: string]: ParticipantData
}

export type Profiles = {
    [key: string]: Profile
}

export type Profile = {
    name?: string
    email?: string
    profilePic?: string
}

export type Notifications = {
    [userId: string]: NotificationSubscription
}

export type NotificationSubscription = {
    [tokenId: string]: DeviceSubscription
}

export type DeviceSubscription = {
    tokenId: string,
    lastSuccesFullSendData: number
    hasFailed: boolean
}

export type ParticipantData = { responded_at: number, isPresent: boolean }