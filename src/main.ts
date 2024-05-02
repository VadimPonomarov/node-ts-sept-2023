import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import { config, Logger } from "./common/configs";
import { morganOptions as options } from "./common/configs/morgan";
import { ApiError } from "./common/errors/api.error";
import { authRouter } from "./routes/auth.router";
import { userRouter } from "./routes/user.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", options));
app.use("/users", userRouter);
app.use("/auth", authRouter);

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
