import type TwilioSDK from "twilio";
import twilio from "twilio";

import { config, Logger } from "../common/configs";

class SmsService {
  private client: TwilioSDK.Twilio;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_ID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  public async testSms(body: string): Promise<void> {
    this.client.messages
      .create({
        body,
        from: config.TWILIO_TEL_FROM,
        to: config.TWILIO_TEL_TO_DEFAULT,
      })
      .then((message) => Logger.info("message ID: " + message.sid));
  }
}

export const smsService = new SmsService();
