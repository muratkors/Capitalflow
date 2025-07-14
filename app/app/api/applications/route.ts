
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Generate application number
    const applicationNumber = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Create application
    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        applicationNumber,
        productType: data.productType,
        requestedAmount: data.requestedAmount,
        purposeOfLoan: data.purposeOfLoan,
        businessName: data.businessName,
        businessType: data.businessType,
        yearsInBusiness: data.yearsInBusiness,
        annualRevenue: data.annualRevenue,
        monthlyRevenue: data.monthlyRevenue,
        creditScore: data.creditScore,
        collateralType: data.collateralType,
        collateralValue: data.collateralValue,
        collateralDescription: data.collateralDescription,
        preferredTerm: data.preferredTerm,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        businessAddress: data.businessAddress,
        businessCity: data.businessCity,
        businessState: data.businessState,
        businessZip: data.businessZip,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankRoutingNumber: data.bankRoutingNumber,
        additionalInfo: data.additionalInfo,
        status: ApplicationStatus.PENDING,
      },
    });

    // Create notification for successful application submission
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "DEAL_OPPORTUNITY",
        priority: "MEDIUM",
        title: "Application Submitted",
        message: `Your application for ${data.productType.replace('_', ' ')} has been submitted successfully. Application number: ${applicationNumber}`,
        actionUrl: "/dashboard",
      },
    });

    return NextResponse.json({ 
      message: "Application submitted successfully", 
      applicationNumber,
      applicationId: application.id 
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
