import { EmailTypeEnum } from "../enums";

export const emailTemplateConstant = {
  [EmailTypeEnum.CONFIRM_EMAIL]: {
    templateId: "d-bcbd644355dd4d90ad4c41332e0c70af",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateId: "d-85371f1cedd346f59e60ad65014f4ade",
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    templateId: "d-425c89d67efb4f63b80524e934967b89",
  },
  [EmailTypeEnum.LOGOUT]: {
    templateId: "d-790ccdeffa164188afd65ecc563fc35d",
  },
};