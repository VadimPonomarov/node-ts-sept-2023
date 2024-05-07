import { Router } from "express";

import { userController } from "../controllers";
import { authMiddleware, commonMiddleware } from "../middlewares";

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
