import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: Number(process.env.PORT) || 3001,
    HOST: process.env.HOST,
    MONGO_URL: process.env.MONGO_URL
};


export {config};
export {Logger} from "./logger";