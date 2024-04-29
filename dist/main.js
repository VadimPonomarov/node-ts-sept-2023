"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("./common/configs");
const morgan_middleware_1 = require("./middlewares/morgan.middleware");
const user_router_1 = require("./routes/user.router");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morgan_middleware_1.morganMiddleware);
app.use("/users", user_router_1.userRouter);
app.use("*", (err, req, res, next) => {
    configs_1.Logger.error(err.stack);
    return res
        .status(err.status || 500)
        .json(err.message || "Something went wrong!");
});
process.on("uncaughtException", (error) => {
    configs_1.Logger.error("uncaughtException: ", error);
    process.exit(1);
});
app.listen(configs_1.config.PORT, "0.0.0.0", async () => {
    try {
        await mongoose_1.default.connect(configs_1.config.MONGO_URL);
        configs_1.Logger.debug(`Server is running on port: ${configs_1.config.PORT}`);
    }
    catch (e) {
        configs_1.Logger.error(e);
    }
});