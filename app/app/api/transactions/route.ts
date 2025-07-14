
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get transactions with deal information
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        deal: {
          select: {
            id: true,
            dealName: true,
            productType: true,
            dealNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert BigInt to string for JSON serialization
    const serializedTransactions = transactions.map(transaction => ({
      ...transaction,
      amount: transaction.amount.toString(),
    }));

    return NextResponse.json(serializedTransactions);
  } catch (error) {
    console.error("Transactions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
