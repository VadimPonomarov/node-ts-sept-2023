import { Router } from "express";

import { authController } from "../controllers";
import { commonMiddleware } from "../middlewares";

const router = Router();

router.post("/login", commonMiddleware.isUserDtoValid, authController.login);
router.post("/refresh", authController.refresh);
router.get("/confirm", authController.confirm);

export const authRouter = router;
