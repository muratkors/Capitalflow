
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

    // Get statements
    const statements = await prisma.statement.findMany({
      where: { userId },
      orderBy: [
        { year: "desc" },
        { month: "desc" },
      ],
    });

    // Convert BigInt to string for JSON serialization
    const serializedStatements = statements.map(statement => ({
      ...statement,
      totalCredits: statement.totalCredits.toString(),
      totalDebits: statement.totalDebits.toString(),
      netAmount: statement.netAmount.toString(),
    }));

    return NextResponse.json(serializedStatements);
  } catch (error) {
    console.error("Statements API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
