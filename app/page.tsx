import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingClient } from "@/components/landing/LandingClient";

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect("/city");
  }

  return <LandingClient />;
}
