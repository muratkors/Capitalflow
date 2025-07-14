
import { PrismaClient, ProductType, TransactionType, TransactionStatus, DealStatus, NotificationType, NotificationPriority, PrepaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in correct order (foreign keys)
  await prisma.prepayment.deleteMany({});
  await prisma.statement.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('🧹 Cleared existing data');

  // Create test users
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
      companyName: 'Doe Enterprises LLC',
      industry: 'technology',
      phoneNumber: '+1 (555) 123-4567',
    },
  });

  console.log('✅ Test user created:', testUser.email);

  // Create sample deals (ordered by loan size as requested)
  const deals = [
    {
      dealNumber: 'CF240001',
      productType: ProductType.TERM_LOAN,
      dealName: 'Business Expansion Term Loan',
      principalAmount: 500000,
      interestRate: 6.25,
      termMonths: 60,
      monthlyPayment: 9726.48,
      remainingBalance: 425000,
      nextPaymentDate: new Date('2025-08-15'),
      maturityDate: new Date('2029-07-14'),
      status: DealStatus.ACTIVE,
      collateralType: 'Real Estate',
      collateralValue: 750000,
      originationDate: new Date('2024-07-15'),
      lastPaymentDate: new Date('2025-07-15'),
    },
    {
      dealNumber: 'CF240002',
      productType: ProductType.EQUIPMENT_FINANCE,
      dealName: 'Manufacturing Equipment Finance',
      principalAmount: 350000,
      interestRate: 5.75,
      termMonths: 48,
      monthlyPayment: 8247.85,
      remainingBalance: 287500,
      nextPaymentDate: new Date('2025-08-20'),
      maturityDate: new Date('2028-06-20'),
      status: DealStatus.ACTIVE,
      collateralType: 'Equipment',
      collateralValue: 400000,
      originationDate: new Date('2024-06-21'),
      lastPaymentDate: new Date('2025-07-20'),
    },
    {
      dealNumber: 'CF240003',
      productType: ProductType.LINE_OF_CREDIT,
      dealName: 'Working Capital Line of Credit',
      principalAmount: 250000,
      interestRate: 7.50,
      termMonths: 36,
      monthlyPayment: 2187.50,
      remainingBalance: 180000,
      nextPaymentDate: new Date('2025-08-10'),
      maturityDate: new Date('2027-06-10'),
      status: DealStatus.ACTIVE,
      collateralType: 'Accounts Receivable',
      collateralValue: 300000,
      originationDate: new Date('2024-06-11'),
      lastPaymentDate: new Date('2025-07-10'),
    },
    {
      dealNumber: 'CF240004',
      productType: ProductType.TERM_LOAN,
      dealName: 'Technology Upgrade Loan',
      principalAmount: 150000,
      interestRate: 6.00,
      termMonths: 36,
      monthlyPayment: 4560.45,
      remainingBalance: 98500,
      nextPaymentDate: new Date('2025-08-25'),
      maturityDate: new Date('2027-05-25'),
      status: DealStatus.ACTIVE,
      collateralType: 'Equipment',
      collateralValue: 180000,
      originationDate: new Date('2024-05-26'),
      lastPaymentDate: new Date('2025-07-25'),
    },
    {
      dealNumber: 'CF240005',
      productType: ProductType.EQUIPMENT_FINANCE,
      dealName: 'Vehicle Fleet Finance',
      principalAmount: 120000,
      interestRate: 5.25,
      termMonths: 60,
      monthlyPayment: 2287.42,
      remainingBalance: 89000,
      nextPaymentDate: new Date('2025-08-30'),
      maturityDate: new Date('2029-04-30'),
      status: DealStatus.ACTIVE,
      collateralType: 'Vehicles',
      collateralValue: 140000,
      originationDate: new Date('2024-05-01'),
      lastPaymentDate: new Date('2025-07-30'),
    },
    {
      dealNumber: 'CF230001',
      productType: ProductType.TERM_LOAN,
      dealName: 'Initial Startup Loan',
      principalAmount: 75000,
      interestRate: 8.25,
      termMonths: 24,
      monthlyPayment: 3432.12,
      remainingBalance: 0,
      nextPaymentDate: null,
      maturityDate: new Date('2025-06-15'),
      status: DealStatus.PAID_OFF,
      collateralType: 'Personal Guarantee',
      collateralValue: 75000,
      originationDate: new Date('2023-06-16'),
      lastPaymentDate: new Date('2025-06-15'),
    },
    {
      dealNumber: 'CF230002',
      productType: ProductType.LINE_OF_CREDIT,
      dealName: 'Emergency Credit Line',
      principalAmount: 50000,
      interestRate: 9.75,
      termMonths: 12,
      monthlyPayment: 1531.25,
      remainingBalance: 0,
      nextPaymentDate: null,
      maturityDate: new Date('2024-12-30'),
      status: DealStatus.CLOSED,
      collateralType: 'Cash Deposit',
      collateralValue: 25000,
      originationDate: new Date('2023-12-31'),
      lastPaymentDate: new Date('2024-12-30'),
    },
  ];

  const createdDeals = [];
  for (const dealData of deals) {
    const deal = await prisma.deal.create({
      data: {
        ...dealData,
        userId: testUser.id,
      },
    });
    createdDeals.push(deal);
    console.log(`✅ Deal created: ${deal.dealName}`);
  }

  // Create sample transactions
  const transactionTypes = [TransactionType.PAYMENT, TransactionType.DISBURSEMENT, TransactionType.FEE, TransactionType.INTEREST, TransactionType.PRINCIPAL];
  const transactionStatuses = [TransactionStatus.COMPLETED, TransactionStatus.PENDING, TransactionStatus.FAILED];
  
  const transactions = [];
  
  for (const deal of createdDeals) {
    // Create disbursement transaction
    transactions.push({
      userId: testUser.id,
      dealId: deal.id,
      transactionType: TransactionType.DISBURSEMENT,
      amount: deal.principalAmount,
      description: `Initial disbursement for ${deal.dealName}`,
      merchantName: 'CapitalFlow Financial Services',
      category: 'Disbursement',
      transactionDate: deal.originationDate,
      status: TransactionStatus.COMPLETED,
      referenceNumber: `DIS${deal.dealNumber}001`,
    });

    // Create payment transactions
    const paymentCount = Math.floor(Math.random() * 12) + 3;
    for (let i = 0; i < paymentCount; i++) {
      const paymentDate = new Date(deal.originationDate);
      paymentDate.setMonth(paymentDate.getMonth() + i + 1);
      
      if (paymentDate <= new Date()) {
        transactions.push({
          userId: testUser.id,
          dealId: deal.id,
          transactionType: TransactionType.PAYMENT,
          amount: deal.monthlyPayment || Math.random() * 5000 + 1000,
          description: `Monthly payment for ${deal.dealName}`,
          merchantName: 'Auto-Pay Bank Transfer',
          category: 'Payment',
          transactionDate: paymentDate,
          status: TransactionStatus.COMPLETED,
          referenceNumber: `PAY${deal.dealNumber}${String(i + 1).padStart(3, '0')}`,
        });
      }
    }

    // Create some fee transactions
    if (Math.random() > 0.5) {
      transactions.push({
        userId: testUser.id,
        dealId: deal.id,
        transactionType: TransactionType.FEE,
        amount: Math.random() * 200 + 50,
        description: `Processing fee for ${deal.dealName}`,
        merchantName: 'CapitalFlow Financial Services',
        category: 'Fee',
        transactionDate: deal.originationDate,
        status: TransactionStatus.COMPLETED,
        referenceNumber: `FEE${deal.dealNumber}001`,
      });
    }
  }

  // Create additional standalone transactions
  const additionalTransactions = [
    {
      userId: testUser.id,
      dealId: null,
      transactionType: TransactionType.TRANSFER,
      amount: 25000,
      description: 'Wire transfer to operating account',
      merchantName: 'First National Bank',
      category: 'Transfer',
      transactionDate: new Date('2025-07-10'),
      status: TransactionStatus.COMPLETED,
      referenceNumber: 'WIR2025071001',
    },
    {
      userId: testUser.id,
      dealId: null,
      transactionType: TransactionType.DEPOSIT,
      amount: 15000,
      description: 'Customer payment deposit',
      merchantName: 'ABC Company',
      category: 'Revenue',
      transactionDate: new Date('2025-07-12'),
      status: TransactionStatus.COMPLETED,
      referenceNumber: 'DEP2025071201',
    },
    {
      userId: testUser.id,
      dealId: null,
      transactionType: TransactionType.WITHDRAWAL,
      amount: 8500,
      description: 'Payroll processing',
      merchantName: 'ADP Payroll Services',
      category: 'Payroll',
      transactionDate: new Date('2025-07-14'),
      status: TransactionStatus.COMPLETED,
      referenceNumber: 'PAY2025071401',
    },
  ];

  transactions.push(...additionalTransactions);

  for (const txnData of transactions) {
    await prisma.transaction.create({ data: txnData });
  }

  console.log(`✅ ${transactions.length} transactions created`);

  // Create sample statements
  const statements = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 12; i++) {
    const statementDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = statementDate.getMonth() + 1;
    const year = statementDate.getFullYear();
    
    // Calculate totals for the month
    const monthlyTransactions = transactions.filter(txn => {
      const txnDate = new Date(txn.transactionDate);
      return txnDate.getMonth() + 1 === month && txnDate.getFullYear() === year;
    });
    
    const totalCredits = monthlyTransactions
      .filter(txn => ['DISBURSEMENT', 'DEPOSIT', 'REFUND'].includes(txn.transactionType))
      .reduce((sum, txn) => sum + Number(txn.amount), 0);
    
    const totalDebits = monthlyTransactions
      .filter(txn => ['PAYMENT', 'FEE', 'INTEREST', 'PRINCIPAL', 'WITHDRAWAL'].includes(txn.transactionType))
      .reduce((sum, txn) => sum + Number(txn.amount), 0);
    
    statements.push({
      userId: testUser.id,
      statementDate,
      month,
      year,
      totalCredits,
      totalDebits,
      netAmount: totalCredits - totalDebits,
      fileUrl: null,
    });
  }

  for (const stmtData of statements) {
    await prisma.statement.create({ data: stmtData });
  }

  console.log(`✅ ${statements.length} statements created`);

  // Create sample notifications
  const notifications = [
    {
      userId: testUser.id,
      type: NotificationType.PAYMENT_REMINDER,
      priority: NotificationPriority.HIGH,
      title: 'Payment Due Soon',
      message: 'Your payment for Business Expansion Term Loan is due in 3 days.',
      isRead: false,
      actionUrl: '/transactions',
    },
    {
      userId: testUser.id,
      type: NotificationType.DEAL_OPPORTUNITY,
      priority: NotificationPriority.MEDIUM,
      title: 'New Credit Line Pre-Approved',
      message: 'You have been pre-approved for a $300,000 credit line at 6.5% APR.',
      isRead: false,
      actionUrl: '/products',
    },
    {
      userId: testUser.id,
      type: NotificationType.TRANSACTION_UPDATE,
      priority: NotificationPriority.LOW,
      title: 'Payment Processed',
      message: 'Your payment of $9,726.48 has been successfully processed.',
      isRead: true,
      actionUrl: '/transactions',
    },
    {
      userId: testUser.id,
      type: NotificationType.SECURITY_ALERT,
      priority: NotificationPriority.HIGH,
      title: 'Login from New Device',
      message: 'We detected a login from a new device. If this wasn\'t you, please secure your account.',
      isRead: false,
      actionUrl: '/settings',
    },
    {
      userId: testUser.id,
      type: NotificationType.RENEWAL_ALERT,
      priority: NotificationPriority.MEDIUM,
      title: 'Credit Line Renewal Available',
      message: 'Your Working Capital Line of Credit is eligible for renewal with improved terms.',
      isRead: false,
      actionUrl: '/products',
    },
    {
      userId: testUser.id,
      type: NotificationType.SYSTEM_NOTIFICATION,
      priority: NotificationPriority.LOW,
      title: 'Statement Available',
      message: 'Your July 2025 statement is now available for download.',
      isRead: true,
      actionUrl: '/statements',
    },
  ];

  for (const notificationData of notifications) {
    await prisma.notification.create({ data: notificationData });
  }

  console.log(`✅ ${notifications.length} notifications created`);

  // Create sample prepayments
  const prepayments = [
    {
      userId: testUser.id,
      dealId: createdDeals[0].id, // Business Expansion Term Loan
      requestedAmount: 50000,
      currentBalance: 425000,
      savingsAmount: 12500,
      payoffAmount: 375000,
      status: PrepaymentStatus.APPROVED,
      requestDate: new Date('2025-06-15'),
      approvedDate: new Date('2025-06-17'),
      letterGenerated: true,
      letterUrl: '/letters/prepayment-001.pdf',
    },
    {
      userId: testUser.id,
      dealId: createdDeals[1].id, // Manufacturing Equipment Finance
      requestedAmount: 75000,
      currentBalance: 287500,
      savingsAmount: 8750,
      payoffAmount: 212500,
      status: PrepaymentStatus.PENDING,
      requestDate: new Date('2025-07-10'),
      approvedDate: null,
      letterGenerated: false,
      letterUrl: null,
    },
    {
      userId: testUser.id,
      dealId: createdDeals[3].id, // Technology Upgrade Loan
      requestedAmount: 25000,
      currentBalance: 98500,
      savingsAmount: 3200,
      payoffAmount: 73500,
      status: PrepaymentStatus.COMPLETED,
      requestDate: new Date('2025-05-20'),
      approvedDate: new Date('2025-05-22'),
      letterGenerated: true,
      letterUrl: '/letters/prepayment-002.pdf',
    },
  ];

  for (const prepaymentData of prepayments) {
    await prisma.prepayment.create({ data: prepaymentData });
  }

  console.log(`✅ ${prepayments.length} prepayments created`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
