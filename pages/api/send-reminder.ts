// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dayjs from 'dayjs'
import { MessagingPayload } from 'firebase-admin/messaging'
import type { NextApiRequest, NextApiResponse } from 'next'

import { messagingServer } from '../../lib/firebaseServerConfig'
import { getSession, updateDeviceSubscription } from '../../lib/server/realtimeDatabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const session = await getSession(req.query.season as string, req.query.session as any as number)

  const message: MessagingPayload = {
    notification: {
      title: `Zaalvoetbal ${dayjs.unix(req.query.session as unknown as number).format('D MMMM')}`,
      body: `Jouw status is: ${session && session[req.query.userId as string]?.isPresent ? 'aanwezig' : 'afwezig'}. Er zijn ${session ? Object.values(session).filter(s => s?.isPresent).length : 0} deelnemers. Klik om sessie te openen.`,
      clickAction: `${req.query.season}/${req.query.session}`
    }
  };

  // Send a message to devices subscribed to the provided topic.
  messagingServer.sendToDevice([req.query.token as string], message)
    .then(async (response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      await updateDeviceSubscription(req.query.season as string, req.query.userId as string, {
        tokenId: req.query.token as string,
        lastSuccesFullSendData: dayjs().unix(),
        hasFailed: false
      })
    })
    .catch(async (error) => {
      console.log('Error sending message:', error);
      await updateDeviceSubscription(req.query.season as string, req.query.userId as string, {
        tokenId: req.query.token as string,
        lastSuccesFullSendData: dayjs().unix(),
        hasFailed: true
      })
    });

  res.status(202).end()
}

