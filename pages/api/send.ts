// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getMessaging, MessagingPayload } from 'firebase-admin/messaging'
import type { NextApiRequest, NextApiResponse } from 'next'

import { messagingServer } from '../../lib/firebaseServerConfig'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const message: MessagingPayload = {
    notification: {
      title: 'Zaalvoetbal - 8 nov',
      body: 'Er zijn al 10 aanmeldingen, veel plezier!',
      clickAction: 'S22-23/1670872080'
    }
  };
  
  // Send a message to devices subscribed to the provided topic.
  messagingServer.sendToDevice(['eCLLTXAJ8D5JN-IV4I37XR:APA91bGmc-i_J0d5WL8jjQ75DlDr1c21bJ2mMfAEw8fkJx9tbI_aQVCrR5P-r4IGX2VJx0xcIx7FJb42o95cGWIYtx0Jqz3j6ueoe5IlzqlIjhD5LCD-cP1nUScvBaINswLQW8vrCk-M'], message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  
  res.status(200).json({ name: 'John Doe' })
}

