
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      companyName?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    companyName?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    companyName?: string | null
  }
}
