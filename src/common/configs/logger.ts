import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "error";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console({
    silent: ["true", "True", "TRUE", "1"].includes(
      process.env.IS_CONSOLE_LOG_SILENT.toString().trim(),
    ),
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new DailyRotateFile({
    datePattern: "DD-MM-YYYY",
    frequency: "1d",
    zippedArchive: true,
    filename: "logs/all-%DATE%.log",
    maxSize: "20m",
    maxFiles: "14d",
  }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export { Logger };
