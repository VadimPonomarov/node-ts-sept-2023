import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", authMiddleware.isAuth, userController.getList);
router.post("/", commonMiddleware.isUserDtoValid, userController.create);

router.get(
  "/:userId",
  authMiddleware.isAuth,
  commonMiddleware.isIdValid,
  userController.getById,
);
router.put(
  "/:userId",
  authMiddleware.isAuth,
  commonMiddleware.isIdValid,
  userController.updateById,
);
router.delete(
  "/:userId",
  authMiddleware.isAuth,
  commonMiddleware.isIdValid,
  userController.deleteById,
);

export const userRouter = router;
