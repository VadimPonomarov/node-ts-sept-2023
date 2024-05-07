import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import SendGrid from "@sendgrid/mail";

import { config, Logger } from "../common/configs";
import { emailTemplateConstant, EmailTypeEnum } from "../common/enums";
import { EmailTypeToPayloadType } from "../common/types/emailToPayload";

class SendGridService {
  constructor() {
    SendGrid.setApiKey(config.SEND_GRID_API_KEY);
  }

  public async sendByType<T extends EmailTypeEnum>(
    to: string,
    type: T,
    dynamicTemplateData: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      const templateId = emailTemplateConstant[type].templateId;
      await this.send({
        from: config.SENDGRID_FROM_EMAIL,
        to,
        templateId,
        dynamicTemplateData,
      });
    } catch (error) {
      Logger.error("Error email: ", error);
    }
  }

  public async send(email: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(email);
    } catch (error) {
      Logger.error("Error email: ", error);
    }
  }
}

export const sendGridService = new SendGridService();
