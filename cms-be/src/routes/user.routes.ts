import { Router } from "express";
import { authenticate, allowRoles } from "../middlewares/auth.middleware.js";
import { 
  createUserController, 
  getAllUsersController,
  toggleUserStatusController,
  updateUserRoleController
} from "../controllers/user.controller.js";

const router = Router();

router.post(
  "/create",
  authenticate,
  allowRoles(["SUPER_ADMIN"]),
  createUserController
);

router.get(
  "/",
  authenticate,
  allowRoles(["SUPER_ADMIN"]),
  getAllUsersController
);

router.post(
  "/toggle-status",
  authenticate,
  allowRoles(["SUPER_ADMIN"]),
  toggleUserStatusController
);

router.post(
  "/update-role",
  authenticate,
  allowRoles(["SUPER_ADMIN"]),
  updateUserRoleController
);

export default router;
