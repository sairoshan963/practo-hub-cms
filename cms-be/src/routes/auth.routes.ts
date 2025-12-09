import { Router } from "express";
import { loginController, changePasswordController, setPasswordController, googleOAuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginController);
router.post("/oauth/google", googleOAuthController);
router.post("/change-password", authenticate, changePasswordController);
router.post("/set-password", authenticate, setPasswordController);

export default router;
