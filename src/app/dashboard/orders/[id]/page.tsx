import { redirect } from "next/navigation";
import { isDashboardAuthenticated } from "@/lib/auth";
import OrderDetailClient from "./order-detail-client";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const authenticated = await isDashboardAuthenticated();
  if (!authenticated) redirect("/dashboard/login");
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
