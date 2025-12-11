import { createUserService } from "../services/user.service.js";
import prisma from "../prisma/client.js";
import { Role } from "../generated/prisma/index.js";
import { checkPermission } from "../middlewares/checkPermission.js";

export async function createUserController(req: any, res: any) {
  try {
    const { firstName, lastName, email, password, role, specialty, city } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, password, and role are required"
      });
    }

    const result = await createUserService(firstName, lastName, email, password, role as Role, specialty, city);
    return res.json({ success: true, message: "User created", user: result });

  } catch (err: any) {
    console.error('Error creating user:', err);
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllUsersController(req: any, res: any) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        specialty: true,
        city: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, users });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function toggleUserStatusController(req: any, res: any) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus }
    });

    return res.json({ success: true, message: "User status updated" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateUserStatusController(req: any, res: any) {
  try {
    const { userId, newStatus } = req.body;

    if (!userId || !newStatus) {
      return res.status(400).json({ success: false, message: "User ID and new status are required" });
    }

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(newStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus }
    });

    return res.json({ success: true, message: "User status updated" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getCurrentUserController(req: any, res: any) {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        specialty: true,
        city: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ 
      success: true, 
      user: {
        ...user,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateUserRoleController(req: any, res: any) {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ success: false, message: "User ID and new role are required" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    return res.json({ success: true, message: "User role updated" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Super Admin Override: Force move content to next workflow stage
 * Emergency action when content is stuck in workflow
 */
export async function forceWorkflowController(req: any, res: any) {
  try {
    const { contentId, contentType, targetStage } = req.body;

    if (!contentId || !contentType || !targetStage) {
      return res.status(400).json({ 
        success: false, 
        message: "Content ID, type, and target stage are required" 
      });
    }

    // Log the override action for audit
    console.log(`SUPER_ADMIN_OVERRIDE: User ${req.user.userId} force moved ${contentType} ${contentId} to ${targetStage}`);

    // TODO: Implement actual workflow force move logic based on content type
    // This would update the content's workflow stage directly

    return res.json({ 
      success: true, 
      message: `${contentType} workflow force moved to ${targetStage}`,
      action: "force_move_workflow",
      performedBy: req.user.userId
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Super Admin Override: Unlock content that is locked
 * Emergency action when content needs to be edited but is locked
 */
export async function unlockContentController(req: any, res: any) {
  try {
    const { contentId, contentType } = req.body;

    if (!contentId || !contentType) {
      return res.status(400).json({ 
        success: false, 
        message: "Content ID and type are required" 
      });
    }

    // Log the override action for audit
    console.log(`SUPER_ADMIN_OVERRIDE: User ${req.user.userId} unlocked ${contentType} ${contentId}`);

    // TODO: Implement actual content unlock logic based on content type
    // This would change the content's status from LOCKED to previous stage

    return res.json({ 
      success: true, 
      message: `${contentType} unlocked successfully`,
      action: "unlock_content",
      performedBy: req.user.userId
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
