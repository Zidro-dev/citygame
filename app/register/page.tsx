import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Found a City | Idle City Builder",
  description: "Register your city charter and begin your urban empire.",
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/city");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm />
    </main>
  );
}
