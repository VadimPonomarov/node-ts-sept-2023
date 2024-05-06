import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.post("/login", commonMiddleware.isUserDtoValid, authController.login);
router.post("/refresh", authController.refresh);
router.get("/confirm", authController.confirm);

export const authRouter = router;
