import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST,
  /**/
  MONGO_URL: process.env.MONGO_URL,
  /**/
  JWT_SECRET: process.env.JWT_SECRET,
  /**/
  SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
  /**/
  TWILIO_TEL_FROM: process.env.TWILIO_TEL_FROM,
  TWILIO_TEL_TO_DEFAULT: process.env.TWILIO_TEL_TO_DEFAULT,
  /**/
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_S3_REGION: process.env.AWS_S3_BUCKET_REGION,
  AWS_S3_ENDPOINT: process.env.AWS_S3_BUCKET_ENDPOINT,
};

export { config };
export * from "./jwtConfig";
export * from "./morgan";
export * from "./logger";
export * from "./fileUpload.config";
