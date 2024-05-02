import morgan, { FormatFn, StreamOptions } from "morgan";

import { Logger } from "./index";

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const customFormatFn: FormatFn = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
};

const morganOptions = { stream, skip };

morgan.token("type", function (req, res) {
  return req.headers["content-type"];
});

export { customFormatFn, morganOptions };
