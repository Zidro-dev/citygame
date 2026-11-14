import { NextResponse } from "next/server";
import { syncBalanceAction } from "@/server-actions/game";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await syncBalanceAction();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 }
    );
  }
}
