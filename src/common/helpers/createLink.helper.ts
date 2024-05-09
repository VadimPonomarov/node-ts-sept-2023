import { config } from "../configs";

interface ICreateLinkDto {
  url: string;
  token?: string;
}

export const createLinkHelper: (dto: ICreateLinkDto) => string = (dto) => {
  const { url, token } = dto;
  return [config.HOST.toString(), config.PORT.toString()]
    .join(":")
    .concat([url, token].join(""));
};
