// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getActiveSeason, getDates, getNotifictions } from '../../lib/server/realtimeDatabase'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const activeSeason = await getActiveSeason()
  const upcommingDatesPromise = getDates(activeSeason, dayjs().add(2, 'day').unix(), dayjs().add(3, 'day').unix())
  const notificationsPromise = getNotifictions(activeSeason)

  const [upcommingDates, notifications] = await Promise.all([upcommingDatesPromise, notificationsPromise])

  const sendForUpcommingDates = upcommingDates.map(async date => {
    const sendToUsers = Object.entries(notifications).map(async ([userId, tokens]) => {
      const sendToDevices = Object.entries(tokens).map(async ([token, obj]) => {
        //console.info(`${process.env.BACKEND_URL}/api/send-reminder?season=${activeSeason}&session=${date}&userId=${userId}&token=${token}`)
        var response = await fetch(`${process.env.BACKEND_URL}/api/send-reminder?season=${activeSeason}&session=${date}&userId=${userId}&token=${token}`)
      })

      await Promise.all(sendToDevices)
    })

    await Promise.all(sendToUsers)
  })

  await Promise.all(sendForUpcommingDates)

  res.status(202).end()
}
