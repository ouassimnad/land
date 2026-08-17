import { redirect } from "next/navigation";
import { isDashboardAuthenticated } from "@/lib/auth";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const authenticated = await isDashboardAuthenticated();
  if (!authenticated) redirect("/dashboard/login");
  return <DashboardClient />;
}
