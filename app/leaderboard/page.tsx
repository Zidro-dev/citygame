import { getLeaderboardDataAction } from "@/server-actions/leaderboard";
import { getSession } from "@/lib/auth";
import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";

export const metadata = {
  title: "Global Leaderboards | Idle City Builder",
  description: "Rankings of the top-earning and most populous metropolitan empires.",
};

export default async function LeaderboardPage() {
  const session = await getSession();
  const res = await getLeaderboardDataAction();

  const topEarners = res.data?.topEarners || [];
  const topMegapolises = res.data?.topMegapolises || [];

  return (
    <main className="min-h-screen pb-12">
      <LeaderboardClient
        topEarners={topEarners}
        topMegapolises={topMegapolises}
        currentUsername={session?.username}
      />
    </main>
  );
}
