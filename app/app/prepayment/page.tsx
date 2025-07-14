
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrepaymentPage } from "@/components/prepayment/prepayment-page";

export const dynamic = "force-dynamic";

export default async function Prepayment() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <PrepaymentPage />;
}
