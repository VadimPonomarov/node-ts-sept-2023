import { EmailTypeEnum } from "../enums";
import { EmailCombinedPayloadType } from "./emailCombinedPayload.type";
import { PickRequired } from "./pickRequired.type";

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.CONFIRM_EMAIL]: PickRequired<EmailCombinedPayloadType, "link">;

  [EmailTypeEnum.RESET_PASSWORD]: PickRequired<
    EmailCombinedPayloadType,
    "frontUrl" | "actionToken"
  >;

  [EmailTypeEnum.DELETE_ACCOUNT]: PickRequired<
    EmailCombinedPayloadType,
    "frontUrl"
  >;

  [EmailTypeEnum.LOGOUT]: PickRequired<EmailCombinedPayloadType, "name">;
};
