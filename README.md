
# CapitalFlow Financial Services Portal

A modern, comprehensive financial services platform built with Next.js 14, TypeScript, and Prisma. This portal provides a complete business banking solution with features for loan management, transaction tracking, financial analytics, and customer service.

## 🚀 Features

### Core Financial Services
- **Product Management**: Line of Credit, Equipment Finance, and Term Loans
- **Transaction Processing**: Real-time payment tracking and transaction history
- **Statement Generation**: Monthly statement downloads and viewing
- **Prepayment Calculator**: Interactive loan payoff calculations with savings analysis
- **Application System**: Multi-step loan application process with validation

### User Experience
- **Dashboard Analytics**: Visual insights with interactive charts and KPIs
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Notifications**: System alerts and payment reminders
- **Financial Education**: Comprehensive credit/debit education resources
- **Dark/Light Theme**: Toggle between themes with next-themes

### Security & Authentication
- **NextAuth.js Integration**: Secure email/password authentication
- **Role-based Access**: User and admin role management
- **Session Management**: Secure JWT-based sessions
- **Protected Routes**: Middleware-based route protection

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Framer Motion** - Animation library for smooth interactions
- **Recharts** - Data visualization and charting
- **React Hook Form** - Form handling with Zod validation

### Backend
- **Prisma ORM** - Database toolkit with PostgreSQL
- **NextAuth.js** - Authentication for Next.js
- **bcryptjs** - Password hashing
- **PostgreSQL** - Primary database

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database visualization

## 🏗️ Architecture

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── products/          # Product management
│   ├── transactions/      # Transaction handling
│   ├── statements/        # Statement management
│   ├── prepayment/        # Prepayment calculator
│   ├── financial-education/ # Educational content
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── auth/             # Authentication components
│   ├── applications/     # Application form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
└── scripts/              # Database seeding scripts
    └── seed.ts           # Database seeding
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/capitalflow-portal.git
   cd capitalflow-portal
   ```

2. **Install dependencies**
   ```bash
   cd app
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/capitalflow"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

The application uses PostgreSQL with the following key entities:

- **User**: Customer accounts with authentication
- **Deal**: Financial products (loans, credit lines)
- **Transaction**: Payment and transaction history
- **Statement**: Monthly financial statements
- **Application**: Loan application submissions
- **Notification**: System alerts and messages
- **Prepayment**: Loan payoff calculations

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NEXTAUTH_URL` | Application URL for NextAuth | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | JWT secret for NextAuth | Required |
| `NODE_ENV` | Environment (development/production) | `development` |

### Database Configuration

Update `prisma/schema.prisma` for your database settings:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Application Management
- `GET /api/applications` - Fetch user applications
- `POST /api/applications` - Submit new application

### Dashboard Data
- `GET /api/dashboard` - Dashboard analytics
- `GET /api/transactions` - Transaction history
- `GET /api/statements` - Account statements
- `GET /api/notifications` - User notifications

### Example API Response
```json
{
  "success": true,
  "data": {
    "totalBalance": 125000.50,
    "activeDeals": 3,
    "monthlyPayment": 2547.89,
    "nextPaymentDate": "2024-02-15"
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

2. **Database setup**
   - Use Vercel Postgres or external PostgreSQL service
   - Update `DATABASE_URL` in Vercel environment variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t capitalflow-portal .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Manual Production Setup

1. **Build the application**
   ```bash
   yarn build
   ```

2. **Start production server**
   ```bash
   yarn start
   ```

## 🧪 Testing

### Test Account
The application includes a pre-seeded test account:
- **Email**: `john@doe.com`
- **Password**: `johndoe123`

### Running Tests
```bash
# Run linting
yarn lint

# Type checking
yarn type-check

# Database validation
npx prisma validate
```

## 📈 Performance Optimizations

- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Dynamic imports for heavy components
- **Database Indexing**: Optimized queries with Prisma
- **Caching**: React Query for API state management
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **CSRF Protection**: Built-in with NextAuth.js
- **XSS Prevention**: Input sanitization and validation
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **Rate Limiting**: API route protection
- **Secure Headers**: Security headers configuration

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add proper error handling
- Include comments for complex logic
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the FAQ section

## 📞 Contact

- **Project Maintainer**: [Your Name]
- **Email**: your-email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)

---

**Built with ❤️ using Next.js and TypeScript**
