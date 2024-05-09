import { Router } from "express";

import { authController } from "../controllers";
import { commonMiddleware } from "../middlewares";

const router = Router();

router.post("/login", commonMiddleware.isUserDtoValid, authController.login);
router.post("/refresh", authController.refreshJwtPair);
router.get("/confirm", authController.confirmEmail);

export const authRouter = router;
