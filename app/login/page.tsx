import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mayor Login | Idle City Builder",
  description: "Log in to manage your city empire.",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/city");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
