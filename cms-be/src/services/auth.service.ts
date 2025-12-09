import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "ACTIVE") return null;
  
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });
  
  const { password: _p, ...safe } = user;
  return safe;
}

export function generateToken(payload: object, expiresIn = "4h") {
  return jwt.sign(payload as any, JWT_SECRET as any, { expiresIn } as any) as string;
}
