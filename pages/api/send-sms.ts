import type { NextApiRequest, NextApiResponse } from 'next';
import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { to, body } = JSON.parse(req.body);

    try {
      const message = await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER, // +14695027123
        to,
      });
      res.status(200).json({ success: true, message: message.sid });
    } catch (error: any) {
      console.error("Error sending SMS: ", error.message || error);
      res.status(500).json({ success: false, error: error.message || 'Failed to send SMS' });
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
