import { Router } from "express";

import { userController } from "../controllers";
import { authMiddleware, commonMiddleware } from "../middlewares";

const router = Router();

router.get("/", authMiddleware.isAuth, userController.getList);
router.post("/", commonMiddleware.isUserDtoValid, userController.create);

router.get("/reset_password", userController.updateUserPassword);
router.post(
  "/reset_request",
  authMiddleware.isAuth,
  commonMiddleware.isUserDtoValid,
  userController.emailResetPassword,
);

export const userRouter = router;
