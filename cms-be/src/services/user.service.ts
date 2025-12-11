import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import { Role } from "../generated/prisma/index.js";

export async function createUserService(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: Role,
  specialty?: string,
  city?: string
) {
  if (role === "DOCTOR_CREATOR" && (!specialty || !city)) {
    throw new Error("Specialty and city are required for DOCTOR_CREATOR role");
  }

  if (role !== "DOCTOR_CREATOR" && (specialty || city)) {
    throw new Error("Specialty and city should only be provided for DOCTOR_CREATOR role");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      specialty: role === "DOCTOR_CREATOR" ? specialty! : null,
      city: role === "DOCTOR_CREATOR" ? city! : null,
    }
  });

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    specialty: user.specialty,
    city: user.city,
    createdAt: user.createdAt
  };
}
