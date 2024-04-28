import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { config, Logger } from "./common/configs";
import { ApiError } from "./common/errors/api.error";
import { morganMiddleware } from "./middlewares/morgan.middleware";
import { userRouter } from "./routes/user.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use("/users", userRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    Logger.error(err.stack);
    return res
      .status(err.status || 500)
      .json(err.message || "Something went wrong!");
  },
);

process.on("uncaughtException", (error) => {
  Logger.error("uncaughtException: ", error);
  process.exit(1);
});

app.listen(config.PORT, "0.0.0.0", async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    Logger.debug(`Server is running on port: ${config.PORT}`);
  } catch (e) {
    Logger.error(e);
  }
});
