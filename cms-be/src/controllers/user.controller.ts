import { createUserService } from "../services/user.service.js";
import prisma from "../prisma/client.js";

export async function createUserController(req: any, res: any) {
  try {
    const { firstName, lastName, email, password, role, specialty, city } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, password, and role are required"
      });
    }

    const result = await createUserService(firstName, lastName, email, password, role, specialty, city);
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
