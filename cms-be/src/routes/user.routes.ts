import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import { 
  createUserController, 
  getAllUsersController,
  toggleUserStatusController,
  updateUserStatusController,
  updateUserRoleController,
  getCurrentUserController,
  forceWorkflowController,
  unlockContentController
} from "../controllers/user.controller.js";

const router = Router();

// User management routes with RBAC
router.post(
  "/create",
  authenticate,
  checkPermission("create_user"),
  createUserController
);

router.get(
  "/",
  authenticate,
  checkPermission("view_analytics"), // Super admin can view all users
  getAllUsersController
);

router.get(
  "/me",
  authenticate,
  getCurrentUserController
);

router.post(
  "/toggle-status",
  authenticate,
  checkPermission("deactivate_user"),
  toggleUserStatusController
);

router.post(
  "/update-status",
  authenticate,
  checkPermission("deactivate_user"),
  updateUserStatusController
);

router.post(
  "/update-role",
  authenticate,
  checkPermission("assign_role"),
  updateUserRoleController
);

// Super Admin override actions
router.post(
  "/force-move-workflow",
  authenticate,
  checkPermission("force_move_workflow"),
  forceWorkflowController
);

router.post(
  "/unlock-content",
  authenticate,
  checkPermission("unlock_content"),
  unlockContentController
);

export default router;
