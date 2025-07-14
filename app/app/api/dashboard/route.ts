
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

    // Get user's deals
    const deals = await prisma.deal.findMany({
      where: { userId },
      include: {
        transactions: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { principalAmount: "desc" },
    });

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        deal: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Calculate metrics
    const activeDeals = deals.filter(deal => deal.status === "ACTIVE");
    const totalBalance = activeDeals.reduce((sum, deal) => sum + Number(deal.remainingBalance), 0);
    const totalCredit = activeDeals.reduce((sum, deal) => sum + Number(deal.principalAmount), 0);
    const totalMonthlyPayment = activeDeals.reduce((sum, deal) => sum + Number(deal.monthlyPayment || 0), 0);

    // Get upcoming payments
    const upcomingPayments = activeDeals
      .filter(deal => deal.nextPaymentDate)
      .sort((a, b) => new Date(a.nextPaymentDate!).getTime() - new Date(b.nextPaymentDate!).getTime())
      .slice(0, 3);

    const dashboardData = {
      totalBalance,
      totalCredit,
      totalMonthlyPayment,
      activeDeals: activeDeals.length,
      recentTransactions,
      upcomingPayments,
      notifications,
      deals,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
