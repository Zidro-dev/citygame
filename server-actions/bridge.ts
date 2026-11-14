"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { MAX_BRIDGES } from "@/lib/game-constants";
import { revalidatePath } from "next/cache";

export interface BridgeItem {
  id: string;
  partnerUsername: string;
  partnerId: string;
  status: string;
  isRequester: boolean;
  createdAt: string;
}

export async function getBridgesAction(): Promise<{
  success: boolean;
  error?: string;
  data?: {
    activeBridges: BridgeItem[];
    incomingRequests: BridgeItem[];
    outgoingRequests: BridgeItem[];
    acceptedCount: number;
    maxBridges: number;
  };
}> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const bridges = await prisma.bridgeConnection.findMany({
      where: {
        OR: [{ user_a_id: session.userId }, { user_b_id: session.userId }],
      },
      include: {
        user_a: { select: { id: true, username: true } },
        user_b: { select: { id: true, username: true } },
      },
      orderBy: { created_at: "desc" },
    });

    const activeBridges: BridgeItem[] = [];
    const incomingRequests: BridgeItem[] = [];
    const outgoingRequests: BridgeItem[] = [];

    for (const b of bridges) {
      const isRequester = b.user_a_id === session.userId;
      const partner = isRequester ? b.user_b : b.user_a;

      const item: BridgeItem = {
        id: b.id,
        partnerUsername: partner.username,
        partnerId: partner.id,
        status: b.status,
        isRequester,
        createdAt: b.created_at.toISOString(),
      };

      if (b.status === "ACCEPTED") {
        activeBridges.push(item);
      } else if (b.status === "PENDING") {
        if (isRequester) {
          outgoingRequests.push(item);
        } else {
          incomingRequests.push(item);
        }
      }
    }

    return {
      success: true,
      data: {
        activeBridges,
        incomingRequests,
        outgoingRequests,
        acceptedCount: activeBridges.length,
        maxBridges: MAX_BRIDGES,
      },
    };
  } catch (error) {
    console.error("getBridgesAction error:", error);
    return { success: false, error: "Failed to fetch alliances" };
  }
}

export async function sendBridgeRequestAction(targetUsername: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const cleanedName = targetUsername.trim().toLowerCase();
  if (!cleanedName) return { success: false, error: "Please enter a valid mayor username" };

  if (cleanedName === session.username.toLowerCase()) {
    return { success: false, error: "You cannot build a bridge to your own city" };
  }

  try {
    // 1. Check current accepted bridges count
    const currentAccepted = await prisma.bridgeConnection.count({
      where: {
        status: "ACCEPTED",
        OR: [{ user_a_id: session.userId }, { user_b_id: session.userId }],
      },
    });

    if (currentAccepted >= MAX_BRIDGES) {
      return {
        success: false,
        error: `Metropolis boundary reached: Maximum ${MAX_BRIDGES} active bridges allowed.`,
      };
    }

    // 2. Find target user
    const targetUser = await prisma.user.findUnique({
      where: { username: cleanedName },
    });

    if (!targetUser) {
      return { success: false, error: `No mayor named '${targetUsername}' exists in the territory.` };
    }

    // 3. Check target user accepted bridges
    const targetAccepted = await prisma.bridgeConnection.count({
      where: {
        status: "ACCEPTED",
        OR: [{ user_a_id: targetUser.id }, { user_b_id: targetUser.id }],
      },
    });

    if (targetAccepted >= MAX_BRIDGES) {
      return {
        success: false,
        error: `Mayor '${targetUsername}' has reached their maximum capacity of ${MAX_BRIDGES} bridges.`,
      };
    }

    // 4. Check existing connection between these two users
    const existing = await prisma.bridgeConnection.findFirst({
      where: {
        OR: [
          { user_a_id: session.userId, user_b_id: targetUser.id },
          { user_a_id: targetUser.id, user_b_id: session.userId },
        ],
      },
    });

    if (existing) {
      if (existing.status === "ACCEPTED") {
        return { success: false, error: `You are already connected via a Bridge to ${targetUsername}.` };
      }
      if (existing.status === "PENDING") {
        return { success: false, error: `A pending Bridge request already exists with ${targetUsername}.` };
      }
      // If rejected, update to pending
      await prisma.bridgeConnection.update({
        where: { id: existing.id },
        data: {
          user_a_id: session.userId,
          user_b_id: targetUser.id,
          status: "PENDING",
        },
      });
      revalidatePath("/city");
      return { success: true };
    }

    // 5. Create new pending connection
    await prisma.bridgeConnection.create({
      data: {
        user_a_id: session.userId,
        user_b_id: targetUser.id,
        status: "PENDING",
      },
    });

    revalidatePath("/city");
    return { success: true };
  } catch (error) {
    console.error("sendBridgeRequestAction error:", error);
    return { success: false, error: "Failed to dispatch bridge proposal" };
  }
}

export async function acceptBridgeRequestAction(bridgeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const bridge = await prisma.bridgeConnection.findUnique({
      where: { id: bridgeId },
    });

    if (!bridge || bridge.user_b_id !== session.userId) {
      return { success: false, error: "Invalid bridge invitation" };
    }

    // Check capacity for current user
    const currentAccepted = await prisma.bridgeConnection.count({
      where: {
        status: "ACCEPTED",
        OR: [{ user_a_id: session.userId }, { user_b_id: session.userId }],
      },
    });

    if (currentAccepted >= MAX_BRIDGES) {
      return { success: false, error: `You have reached the maximum ${MAX_BRIDGES} bridge connections.` };
    }

    await prisma.bridgeConnection.update({
      where: { id: bridgeId },
      data: { status: "ACCEPTED" },
    });

    revalidatePath("/city");
    return { success: true };
  } catch (error) {
    console.error("acceptBridgeRequestAction error:", error);
    return { success: false, error: "Failed to accept bridge connection" };
  }
}

export async function rejectBridgeRequestAction(bridgeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const bridge = await prisma.bridgeConnection.findUnique({
      where: { id: bridgeId },
    });

    if (
      !bridge ||
      (bridge.user_a_id !== session.userId && bridge.user_b_id !== session.userId)
    ) {
      return { success: false, error: "Unauthorized action on bridge" };
    }

    await prisma.bridgeConnection.delete({
      where: { id: bridgeId },
    });

    revalidatePath("/city");
    return { success: true };
  } catch (error) {
    console.error("rejectBridgeRequestAction error:", error);
    return { success: false, error: "Failed to remove bridge connection" };
  }
}
