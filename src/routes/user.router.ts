import { Router } from "express";

import { userController } from "../controllers";
import {
  authMiddleware,
  commonMiddleware,
  fileMiddleware,
} from "../middlewares";

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
router.get("/me", authMiddleware.isAuth, userController.getMe);
router.put(
  "/me",
  authMiddleware.isAuth,
  commonMiddleware.isUserDtoValid,
  userController.updateMe,
);
router.delete("/me", authMiddleware.isAuth, userController.deleteMe);

router.post(
  "/me/avatar",
  authMiddleware.isAuth,
  fileMiddleware.isAvatarValid,
  userController.uploadAvatar,
);
router.delete("/me/avatar", authMiddleware.isAuth, userController.deleteAvatar);
export const userRouter = router;
