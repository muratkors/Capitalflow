
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FinancialEducation } from "@/components/info/financial-education";

export const dynamic = "force-dynamic";

export default async function FinancialEducationPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <FinancialEducation />;
}
