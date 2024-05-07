import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
  TWILIO_TEL_FROM: process.env.TWILIO_TEL_FROM,
  TWILIO_TEL_TO_DEFAULT: process.env.TWILIO_TEL_TO_DEFAULT,
};

export { config };
export * from "./jwt";
export * from "./morgan";
export * from "./logger";
