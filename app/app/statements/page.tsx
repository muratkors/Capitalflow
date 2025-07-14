
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatementsPage } from "@/components/statements/statements-page";

export const dynamic = "force-dynamic";

export default async function Statements() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <StatementsPage />;
}
