
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductsPage } from "@/components/products/products-page";

export const dynamic = "force-dynamic";

export default async function Products() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <ProductsPage />;
}
