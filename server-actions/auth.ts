"use server";

import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  signToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import {
  STARTER_BALANCE,
  STARTER_POPULATION,
} from "@/lib/game-constants";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function registerAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || username.length < 3 || username.length > 20) {
    return {
      success: false,
      error: "Username must be between 3 and 20 characters.",
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      success: false,
      error: "Username can only contain letters, numbers, and underscores.",
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters.",
    };
  }

  try {
    // Check if username is already taken
    const existing = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (existing) {
      return {
        success: false,
        error: "A mayor with this username already exists in the region.",
      };
    }

    const passwordHash = hashPassword(password);

    // CRUCIAL GAME LOGIC: Atomically create User + City + Starter Buildings
    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          username: username.toLowerCase(),
          password_hash: passwordHash,
        },
      });

      // 2. Automatically generate the Mayor's City
      const city = await tx.city.create({
        data: {
          user_id: user.id,
          balance: STARTER_BALANCE, // $500 starter capital
          population: STARTER_POPULATION, // 10 starter citizens
          last_sync_time: new Date(),
        },
      });

      // 3. Pre-place starter buildings on the 5x5 grid (Center coordinates)
      // Residential Starter Home at center (2, 2)
      await tx.building.create({
        data: {
          city_id: city.id,
          type: "RESIDENTIAL_SMALL",
          level: 1,
          grid_x: 2,
          grid_y: 2,
        },
      });

      // Commercial Corner Deli at (2, 3)
      await tx.building.create({
        data: {
          city_id: city.id,
          type: "COMMERCIAL_SHOP",
          level: 1,
          grid_x: 2,
          grid_y: 3,
        },
      });

      return user;
    });

    // Establish authenticated session
    const token = signToken({
      userId: newUser.id,
      username: newUser.username,
    });
    await setSessionCookie(token);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during city charter registration.",
    };
  }
}

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return {
      success: false,
      error: "Please enter both username and password.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid username or password.",
      };
    }

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid username or password.",
      };
    }

    // Set session cookie
    const token = signToken({
      userId: user.id,
      username: user.username,
    });
    await setSessionCookie(token);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred while logging in. Please try again.",
    };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
