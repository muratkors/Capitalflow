
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TransactionsPage } from "@/components/transactions/transactions-page";

export const dynamic = "force-dynamic";

export default async function Transactions() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <TransactionsPage />;
}
