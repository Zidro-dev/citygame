import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GameBoard } from "@/components/game/GameBoard";

export const metadata = {
  title: "City Console | Idle City Builder",
  description: "Construct, expand, and govern your futuristic metropolis.",
};

export default async function CityPage() {
  const user = await getAuthenticatedUser();

  if (!user || !user.city) {
    redirect("/login");
  }

  // Fetch accepted bridge connections count
  const bridgesCount = await prisma.bridgeConnection.count({
    where: {
      status: "ACCEPTED",
      OR: [{ user_a_id: user.id }, { user_b_id: user.id }],
    },
  });

  const initialData = {
    id: user.city.id,
    balance: user.city.balance,
    population: user.city.population,
    last_sync_time: user.city.last_sync_time.toISOString(),
    buildings: user.city.buildings.map((b) => ({
      id: b.id,
      type: b.type,
      level: b.level,
      grid_x: b.grid_x,
      grid_y: b.grid_y,
    })),
    bridgesCount,
  };

  return <GameBoard username={user.username} initialData={initialData} />;
}
