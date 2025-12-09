import type { Request, Response } from "express";
import { validateUser, generateToken } from "../services/auth.service.js";
import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await validateUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user.id, role: user.role, email: user.email });
    return res.json({ 
      success: true, 
      token, 
      role: user.role, 
      name: `${user.firstName} ${user.lastName}` 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function changePasswordController(req: any, res: any) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new passwords are required",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password incorrect" });
    }

    const hashedNewPass = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPass },
    });

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function setPasswordController(req: any, res: any) {
  try {
    const { newPassword } = req.body;
    const userId = req.user.userId;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.json({ success: true, message: "Password set successfully" });
  } catch (err) {
    console.error('Set password error:', err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function googleOAuthController(req: any, res: any) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { sub: googleId, email, picture } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(403).json({ 
        success: false, 
        message: "User not found. Contact admin." 
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    if (!user.googleId) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId, lastLoginAt: new Date() },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
    }

    const jwtToken = generateToken({ userId: user.id, role: user.role, email: user.email });

    return res.json({
      success: true,
      token: jwtToken,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      email: user.email,
    });
  } catch (err: any) {
    console.error('Google OAuth error:', err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
